"""Authentication router — Layer 1 (User) + Layer 2 (Access Key).

All sessions are DB-backed opaque tokens (not JWTs), with explicit
revocation support. Layer 1 tokens are delivered as HttpOnly cookies
scoped to the configured domain. Layer 2 tokens are returned in JSON
and must be sent as X-Layer2-Token header.
"""

import logging
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Request, HTTPException, Response, Depends
from pydantic import BaseModel

from auth_models import User, UserSession, TrustedDevice, AccessKey, EmailVerificationToken, PasswordResetToken
from responses import ApiResponse, LoginResponse
from crypto import hash_password, verify_password, generate_token, hash_token, hash_access_key, verify_access_key as crypto_verify_access_key
from rate_limiter import RateLimiter
from dependencies import require_safe_origin, require_layer1, _get_db
from config import settings
from email_service import send_verification_email, send_password_reset_email

router = APIRouter(prefix="/api/v1/auth", tags=["Authentication"])
rate_limiter = RateLimiter()
logger = logging.getLogger(__name__)

# Configurable via env; production must set these
_COOKIE_DOMAIN = settings.COOKIE_DOMAIN or None
_SAMESITE = "None" if settings.SECURE_COOKIES else "Lax"
_L1_MAX_AGE_DAYS = 7
_REFRESH_MAX_AGE_DAYS = 30
_L2_MAX_AGE_MINUTES = 15


async def get_client_ip(request: Request) -> str:
    forwarded = request.headers.get("X-Forwarded-For")
    return forwarded.split(",")[0].strip() if forwarded else request.client.host


def _create_session(
    user_id: int,
    session_type: str,
    expires_delta: timedelta,
    device_id: Optional[int] = None,
) -> str:
    """Create a new session in the DB and return the raw token."""
    db = _get_db()
    try:
        prefix = {"layer1": "l1_", "layer2": "l2_", "refresh": "rt_"}.get(session_type, "")
        token = prefix + generate_token(32)
        token_hash = hash_token(token)
        session = UserSession(
            user_id=user_id,
            device_id=device_id,
            token_hash=token_hash,
            session_type=session_type,
            expires_at=datetime.utcnow() + expires_delta,
            revoked=False,
        )
        db.add(session)
        db.commit()
        return token
    finally:
        db.close()


def _revoke_session(token_hash: str) -> None:
    db = _get_db()
    try:
        db.query(UserSession).filter(
            UserSession.token_hash == token_hash
        ).update({"revoked": True})
        db.commit()
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Registration
# ──────────────────────────────────────────────────────────────────────────────

class RegisterIn(BaseModel):
    username: str
    password: str
    display_name: Optional[str] = None


@router.post("/register", response_model=ApiResponse[dict])
async def register(payload: RegisterIn, request: Request, response: Response):
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"register:{ip}", 5, 3600)
    if not allowed:
        raise HTTPException(429, "Too many registration attempts")

    # Password strength: min 8 chars
    if len(payload.password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")

    db = _get_db()
    try:
        # Check if username already exists — generic error to avoid enumeration
        existing = db.query(User).filter(User.username == payload.username).first()
        if existing:
            raise HTTPException(400, "Registration failed")

        user = User(
            username=payload.username,
            email=payload.username,
            display_name=payload.display_name,
            password_hash=hash_password(payload.password),
            is_active=True,
            is_admin=False,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

        # Generate email verification token
        raw_verification_token = generate_token(32)
        token_hash = hash_token(raw_verification_token)
        ver_token = EmailVerificationToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
        db.add(ver_token)
        db.commit()

        # Send verification email
        try:
            resend_response = send_verification_email(user.email, raw_verification_token)
            logger.info(f"Verification email sent to {user.email}, Resend ID: {resend_response.get('id', 'unknown')}")
        except Exception as e:
            logger.error(f"Failed to send verification email to {user.email}: {e}", exc_info=True)

        # Auto-login: create L1 + refresh sessions immediately
        l1_token = _create_session(
            user_id=user.id,
            session_type="layer1",
            expires_delta=timedelta(days=_L1_MAX_AGE_DAYS),
        )
        refresh_token = _create_session(
            user_id=user.id,
            session_type="refresh",
            expires_delta=timedelta(days=_REFRESH_MAX_AGE_DAYS),
        )

        response.set_cookie(
            key="layer1",
            value=l1_token,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite=_SAMESITE,
            domain=_COOKIE_DOMAIN,
            max_age=int(timedelta(days=_L1_MAX_AGE_DAYS).total_seconds()),
        )
        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite=_SAMESITE,
            domain=_COOKIE_DOMAIN,
            max_age=int(timedelta(days=_REFRESH_MAX_AGE_DAYS).total_seconds()),
        )

        return ApiResponse(data={
            "user_id": user.id,
            "username": user.username,
            "message": "Account created successfully",
        })
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Login
# ──────────────────────────────────────────────────────────────────────────────

class LoginIn(BaseModel):
    username: str
    password: str


@router.post("/login", response_model=ApiResponse[LoginResponse])
async def login(payload: LoginIn, request: Request, response: Response):
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"login:{ip}", 10, 60)
    if not allowed:
        raise HTTPException(429, "Too many login attempts")

    db = _get_db()
    try:
        user = db.query(User).filter(User.username == payload.username).first()

        # Generic error — never reveal whether email exists
        if not user or not verify_password(payload.password, user.password_hash):
            raise HTTPException(401, "Invalid username or password")

        if not user.is_active:
            raise HTTPException(401, "Invalid username or password")

        # Create Layer 1 session + refresh token
        l1_token = _create_session(
            user_id=user.id,
            session_type="layer1",
            expires_delta=timedelta(days=_L1_MAX_AGE_DAYS),
        )
        refresh_token = _create_session(
            user_id=user.id,
            session_type="refresh",
            expires_delta=timedelta(days=_REFRESH_MAX_AGE_DAYS),
        )

        # Set HttpOnly cookie
        response.set_cookie(
            key="layer1",
            value=l1_token,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite=_SAMESITE,
            domain=_COOKIE_DOMAIN,
            max_age=int(timedelta(days=_L1_MAX_AGE_DAYS).total_seconds()),
        )

        # Set refresh cookie too
        response.set_cookie(
            key="refresh",
            value=refresh_token,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite=_SAMESITE,
            domain=_COOKIE_DOMAIN,
            max_age=int(timedelta(days=_REFRESH_MAX_AGE_DAYS).total_seconds()),
        )

        return ApiResponse(data=LoginResponse(
            user={"id": user.id, "email": user.email, "name": user.display_name or user.username, "is_admin": user.is_admin, "email_verified": user.email_verified},
        ))
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Logout
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/logout")
async def logout(request: Request, response: Response):
    """Invalidate Layer 1 and refresh sessions server-side."""
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"logout:{ip}", 30, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    l1_token = request.cookies.get("layer1")
    refresh_token = request.cookies.get("refresh")

    auth = request.headers.get("Authorization", "")
    if not l1_token and auth.startswith("Bearer "):
        l1_token = auth[7:]

    if l1_token:
        _revoke_session(hash_token(l1_token))
    if refresh_token:
        _revoke_session(hash_token(refresh_token))

    # Clear cookies
    response.delete_cookie(key="layer1", domain=_COOKIE_DOMAIN)
    response.delete_cookie(key="refresh", domain=_COOKIE_DOMAIN)

    return ApiResponse(data={"message": "Logged out"})


# ──────────────────────────────────────────────────────────────────────────────
# Refresh
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/refresh")
async def refresh_token(request: Request, response: Response):
    """Refresh Layer 1 token using a valid refresh token."""
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"refresh:{ip}", 20, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    refresh_token = request.cookies.get("refresh")
    auth = request.headers.get("Authorization", "")
    if not refresh_token and auth.startswith("Bearer "):
        refresh_token = auth[7:]

    if not refresh_token:
        raise HTTPException(401, "Refresh token required")

    db = _get_db()
    try:
        token_hash = hash_token(refresh_token)
        session = (
            db.query(UserSession)
            .filter(
                UserSession.token_hash == token_hash,
                UserSession.session_type == "refresh",
                UserSession.revoked == False,
                UserSession.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not session:
            raise HTTPException(401, "Invalid refresh token")

        # Revoke old refresh token (single-use rotation)
        session.revoked = True
        db.commit()

        # Create new Layer 1 + refresh
        new_l1 = _create_session(
            user_id=session.user_id,
            session_type="layer1",
            expires_delta=timedelta(days=_L1_MAX_AGE_DAYS),
        )
        new_refresh = _create_session(
            user_id=session.user_id,
            session_type="refresh",
            expires_delta=timedelta(days=_REFRESH_MAX_AGE_DAYS),
        )

        response.set_cookie(
            key="layer1",
            value=new_l1,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite=_SAMESITE,
            domain=_COOKIE_DOMAIN,
            max_age=int(timedelta(days=_L1_MAX_AGE_DAYS).total_seconds()),
        )
        response.set_cookie(
            key="refresh",
            value=new_refresh,
            httponly=True,
            secure=settings.SECURE_COOKIES,
            samesite=_SAMESITE,
            domain=_COOKIE_DOMAIN,
            max_age=int(timedelta(days=_REFRESH_MAX_AGE_DAYS).total_seconds()),
        )

        return ApiResponse(data={
            "user": {"id": session.user_id},
        })
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Verify Access Key (Layer 2)
# ──────────────────────────────────────────────────────────────────────────────

class AccessKeyVerifyIn(BaseModel):
    access_key: str
    device_name: str
    device_type: str


@router.post("/verify-access-key", response_model=ApiResponse[dict])
async def verify_access_key_endpoint(
    payload: AccessKeyVerifyIn,
    request: Request,
    session: dict = Depends(require_layer1),
):
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"access_key:{ip}", 10, 60)
    if not allowed:
        raise HTTPException(429, "Too many attempts")

    user_id = session["user_id"]

    db = _get_db()
    try:
        # Find and verify access key — a user may have multiple active keys,
        # so every non-revoked key must be checked, not just an arbitrary one.
        candidate_keys = db.query(AccessKey).filter(
            AccessKey.user_id == user_id,
            AccessKey.revoked == False,
        ).all()

        key_row = next(
            (k for k in candidate_keys if crypto_verify_access_key(payload.access_key, k.key_hash)),
            None,
        )
        if not key_row:
            raise HTTPException(401, "Invalid access key")

        # Check expiry
        if key_row.expires_at and key_row.expires_at < datetime.utcnow():
            raise HTTPException(401, "Access key expired")

        # Find or create trusted device
        fingerprint = f"{request.headers.get('user-agent', '')}:{ip}"
        device = (
            db.query(TrustedDevice)
            .filter(
                TrustedDevice.user_id == user_id,
                TrustedDevice.fingerprint == fingerprint,
            )
            .first()
        )
        if not device:
            device = TrustedDevice(
                user_id=user_id,
                name=payload.device_name,
                fingerprint=fingerprint,
                device_type=payload.device_type,
                status="pending",
                ip_address=ip,
            )
            db.add(device)
            db.commit()
            db.refresh(device)

        # Create Layer 2 session bound to this device
        l2_token = _create_session(
            user_id=user_id,
            session_type="layer2",
            expires_delta=timedelta(minutes=_L2_MAX_AGE_MINUTES),
            device_id=device.id,
        )

        return ApiResponse(data={
            "verified": True,
            "layer2_token": l2_token,
            "device_id": device.id,
            "device_status": device.status,
            "expires_in_minutes": _L2_MAX_AGE_MINUTES,
        })
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Lock Layer 2
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/layer2/lock")
async def lock_layer2(request: Request):
    """Invalidate the current Layer 2 session."""
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"layer2_lock:{ip}", 30, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    l2_token = request.headers.get("X-Layer2-Token")
    if l2_token:
        _revoke_session(hash_token(l2_token))
    return ApiResponse(data={"success": True, "message": "Layer 2 locked"})


# ──────────────────────────────────────────────────────────────────────────────
# Me
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/me")
async def get_me(request: Request, session: dict = Depends(require_layer1)):
    """Get current user info from Layer 1 session."""
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"me:{ip}", 60, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    db = _get_db()
    try:
        user = db.query(User).filter(User.id == session["user_id"]).first()
        if not user:
            raise HTTPException(401, "User not found")

        return ApiResponse(data={
            "user_id": user.id,
            "username": user.username,
            "email": user.email,
            "display_name": user.display_name,
            "is_admin": user.is_admin,
            "email_verified": user.email_verified,
        })
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Devices
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/devices")
async def list_devices(request: Request, session: dict = Depends(require_layer1)):
    """List paired devices for the authenticated user."""
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"devices_list:{ip}", 60, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    db = _get_db()
    try:
        devices = db.query(TrustedDevice).filter(
            TrustedDevice.user_id == session["user_id"]
        ).all()

        return ApiResponse(data=[
            {
                "id": d.id,
                "name": d.name,
                "device_type": d.device_type,
                "status": d.status,
                "paired_at": d.paired_at.isoformat() if d.paired_at else None,
                "last_seen": d.last_seen.isoformat() if d.last_seen else None,
            }
            for d in devices
        ])
    finally:
        db.close()


@router.post("/devices/{device_id}/trust")
async def trust_device(
    device_id: int,
    request: Request,
    session: dict = Depends(require_layer1),
):
    """Trust a pending device (requires Layer 1)."""
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"trust_device:{ip}", 20, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    db = _get_db()
    try:
        device = db.query(TrustedDevice).filter(
            TrustedDevice.id == device_id,
            TrustedDevice.user_id == session["user_id"],
        ).first()
        if not device:
            raise HTTPException(404, "Device not found")

        device.status = "trusted"
        db.commit()
        return ApiResponse(data={"trusted": True})
    finally:
        db.close()


@router.post("/devices/{device_id}/revoke")
async def revoke_device(
    device_id: int,
    request: Request,
    session: dict = Depends(require_layer1),
):
    """Revoke a trusted device (requires Layer 1)."""
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"revoke_device:{ip}", 20, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests")

    db = _get_db()
    try:
        device = db.query(TrustedDevice).filter(
            TrustedDevice.id == device_id,
            TrustedDevice.user_id == session["user_id"],
        ).first()
        if not device:
            raise HTTPException(404, "Device not found")

        device.status = "revoked"
        db.commit()

        # Also revoke all Layer 2 sessions for this device
        db.query(UserSession).filter(
            UserSession.device_id == device_id,
            UserSession.session_type == "layer2",
        ).update({"revoked": True})
        db.commit()

        return ApiResponse(data={"revoked": True})
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Access Key Management (admin / self-service)
# ──────────────────────────────────────────────────────────────────────────────

@router.post("/access-keys")
async def create_access_key(request: Request, session: dict = Depends(require_layer1)):
    """Generate a new access key for the authenticated user."""
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"create_access_key:{ip}", 10, 3600)
    if not allowed:
        raise HTTPException(429, "Too many requests. Try again later.")

    db = _get_db()
    try:
        # Generate a human-readable key: JARVIS-XXXX-XXXX
        raw_key = f"JARVIS-{generate_token(4).upper()}-{generate_token(4).upper()}"
        key_hash = hash_access_key(raw_key)

        key_row = AccessKey(
            user_id=session["user_id"],
            key_hash=key_hash,
            label="Generated Key",
        )
        db.add(key_row)
        db.commit()

        return ApiResponse(data={
            "access_key": raw_key,  # Show ONCE — never again
            "message": "Save this key — it will not be shown again",
        })
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Email Verification
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/verify-email")
async def verify_email(request: Request):
    """Verify email via token (clicked from email link)."""
    token = request.query_params.get("token")
    if not token:
        raise HTTPException(400, "Token required")

    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"verify_email:{token}", 5, 3600)
    if not allowed:
        raise HTTPException(429, "Too many attempts with this token")

    db = _get_db()
    try:
        token_hash = hash_token(token)
        record = (
            db.query(EmailVerificationToken)
            .filter(
                EmailVerificationToken.token_hash == token_hash,
                EmailVerificationToken.used == False,
                EmailVerificationToken.expires_at > datetime.utcnow(),
            )
            .first()
        )

        if record:
            # Normal verification flow — token is valid and unused
            record.used = True
            user = db.query(User).filter(User.id == record.user_id).first()
            if user:
                user.email_verified = True
                user.email_verified_at = datetime.utcnow()
            db.commit()
            return ApiResponse(data={"message": "Email verified successfully"})

        # Token not valid/available — check if it was already used for an already-verified user
        used_record = (
            db.query(EmailVerificationToken)
            .filter(EmailVerificationToken.token_hash == token_hash)
            .first()
        )
        if used_record:
            user = db.query(User).filter(User.id == used_record.user_id).first()
            if user and user.email_verified:
                return ApiResponse(data={"message": "Email already verified"})

        raise HTTPException(400, "Invalid or expired token")
    finally:
        db.close()


@router.post("/resend-verification")
async def resend_verification(request: Request, session: dict = Depends(require_layer1)):
    """Resend email verification link. Requires L1 auth."""
    require_safe_origin(request)
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"resend_verification:{ip}", 3, 3600)
    if not allowed:
        raise HTTPException(429, "Too many resend attempts. Try again later.")

    db = _get_db()
    try:
        user = db.query(User).filter(User.id == session["user_id"]).first()
        if not user:
            raise HTTPException(404, "User not found")

        if user.email_verified:
            return ApiResponse(data={"message": "Email already verified"})

        # Generate verification token
        raw_token = generate_token(32)
        token_hash = hash_token(raw_token)
        ver_token = EmailVerificationToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=24),
        )
        db.add(ver_token)
        db.commit()

        # Send email via Resend
        try:
            resend_response = send_verification_email(user.email, raw_token)
            logger.info(f"Verification email sent to {user.email}, Resend ID: {resend_response.get('id', 'unknown')}")
        except Exception as e:
            # Always log server-side — never expose to client
            logger.error(f"Failed to send verification email to {user.email}: {e}", exc_info=True)

        return ApiResponse(data={
            "message": "If your email is registered, a verification link has been sent.",
        })
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Password Reset
# ──────────────────────────────────────────────────────────────────────────────

class ForgotPasswordIn(BaseModel):
    email: str


@router.post("/forgot-password")
async def forgot_password(payload: ForgotPasswordIn, request: Request):
    """Request password reset email."""
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"forgot_password:{ip}", 3, 3600)
    if not allowed:
        raise HTTPException(429, "Too many requests. Try again later.")

    db = _get_db()
    try:
        user = db.query(User).filter(User.email == payload.email).first()
        if not user:
            # Return same message to avoid email enumeration
            return ApiResponse(data={"message": "If an account exists, a reset email has been sent."})

        # Invalidate any existing reset tokens for this user
        db.query(PasswordResetToken).filter(
            PasswordResetToken.user_id == user.id,
            PasswordResetToken.used == False,
        ).update({"used": True})

        raw_token = generate_token(32)
        token_hash = hash_token(raw_token)
        reset_token = PasswordResetToken(
            user_id=user.id,
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(hours=1),
        )
        db.add(reset_token)
        db.commit()

        # Send email via Resend
        try:
            resend_response = send_password_reset_email(user.email, raw_token)
            logger.info(f"Password reset email sent to {user.email}, Resend ID: {resend_response.get('id', 'unknown')}")
        except Exception as e:
            # Always log server-side — never expose to client
            logger.error(f"Failed to send password reset email to {user.email}: {e}", exc_info=True)

        return ApiResponse(data={
            "message": "If an account exists, a reset email has been sent.",
        })
    finally:
        db.close()


class ResetPasswordIn(BaseModel):
    token: str
    new_password: str


@router.post("/reset-password")
async def reset_password(payload: ResetPasswordIn, request: Request):
    """Reset password using a valid reset token."""
    ip = await get_client_ip(request)
    allowed, _, _ = rate_limiter.check_limit(f"reset_password:{payload.token}", 5, 3600)
    if not allowed:
        raise HTTPException(429, "Too many attempts with this token")

    if len(payload.new_password) < 8:
        raise HTTPException(400, "Password must be at least 8 characters")

    db = _get_db()
    try:
        token_hash = hash_token(payload.token)
        record = (
            db.query(PasswordResetToken)
            .filter(
                PasswordResetToken.token_hash == token_hash,
                PasswordResetToken.used == False,
                PasswordResetToken.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not record:
            raise HTTPException(400, "Invalid or expired token")

        record.used = True
        user = db.query(User).filter(User.id == record.user_id).first()
        if not user:
            raise HTTPException(404, "User not found")

        user.password_hash = hash_password(payload.new_password)
        db.commit()

        return ApiResponse(data={"message": "Password reset successfully"})
    finally:
        db.close()
