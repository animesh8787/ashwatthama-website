"""FastAPI dependencies for authentication and authorization.

Enforces the two-layer security model:
  Layer 1: User login (session cookie / Bearer token) → identifies the user
  Layer 2: Device access key (X-Layer2-Token header) → authorizes remote control

Every device-affecting route MUST use both dependencies.
"""

import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Request, HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials

from database import SessionLocal
from auth_models import UserSession, TrustedDevice
from crypto import hash_token

from config import settings

security = HTTPBearer(auto_error=False)


# ──────────────────────────────────────────────────────────────────────────────
# CSRF guard
# ──────────────────────────────────────────────────────────────────────────────

def require_safe_origin(request: Request) -> None:
    """Extra CSRF guard for state-changing, cookie-authenticated endpoints.

    Browsers attach the layer1/refresh cookies automatically on cross-site
    requests (SameSite=None in production, since the frontend and API sit
    on different subdomains). Any route that trusts those cookies for a
    state change MUST call this to reject requests forged from other origins.
    Requests with no Origin header (same-origin navigations, curl, native
    apps) are allowed through — they can't be triggered by a malicious page.
    """
    origin = request.headers.get("origin")
    if origin is None:
        return
    allowed_origins = [o.strip() for o in settings.CORS_ORIGINS.split(",")]
    if origin not in allowed_origins:
        raise HTTPException(status.HTTP_403_FORBIDDEN, "Origin not allowed")


# ──────────────────────────────────────────────────────────────────────────────
# Helpers
# ──────────────────────────────────────────────────────────────────────────────

def _get_db():
    """Open a new SQLAlchemy session for a manual `try/finally: db.close()` block.

    Callers are responsible for closing it — do not close here, since that
    would hand back an already-closed session before the caller uses it.
    """
    return SessionLocal()


def _validate_session(token_hash: str, expected_type: str, require_device: bool = False):
    """Validate a session token against the database.

    Returns the UserSession row if valid, otherwise raises HTTPException.
    """
    db = _get_db()
    try:
        session = (
            db.query(UserSession)
            .filter(
                UserSession.token_hash == token_hash,
                UserSession.session_type == expected_type,
                UserSession.revoked == False,
                UserSession.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not session:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired session",
            )
        if require_device and not session.device_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Session not bound to a device",
            )
        return session
    finally:
        db.close()


# ──────────────────────────────────────────────────────────────────────────────
# Layer 1 — User identity
# ──────────────────────────────────────────────────────────────────────────────

async def get_current_session(
    request: Request,
    credentials: HTTPAuthorizationCredentials = Depends(security),
) -> dict:
    """Extract and validate Layer 1 session from cookie or Authorization header.

    Priority:
      1. 'layer1' HttpOnly cookie
      2. Authorization: Bearer <token> header
    """
    token = None

    # 1. Try cookie first (preferred for web)
    cookie_token = request.cookies.get("layer1")
    if cookie_token and cookie_token.startswith("l1_"):
        token = cookie_token

    # 2. Fallback to Authorization header
    if not token and credentials and credentials.credentials:
        hdr = credentials.credentials
        if hdr.startswith("l1_"):
            token = hdr

    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Layer 1 authentication required",
        )

    token_hash = hash_token(token)
    session = _validate_session(token_hash, expected_type="layer1")

    return {
        "user_id": session.user_id,
        "session_id": session.id,
        "token": token,
        "scopes": ["read", "write"],
    }


async def require_layer1(session: dict = Depends(get_current_session)) -> dict:
    """Require a valid Layer 1 session."""
    return session


# ──────────────────────────────────────────────────────────────────────────────
# Layer 2 — Device authorization
# ──────────────────────────────────────────────────────────────────────────────

async def get_layer2_session(request: Request) -> dict:
    """Extract and validate Layer 2 session from X-Layer2-Token header."""
    token = request.headers.get("X-Layer2-Token")
    if not token or not token.startswith("l2_"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Layer 2 access key required (X-Layer2-Token header)",
        )

    token_hash = hash_token(token)
    session = _validate_session(token_hash, expected_type="layer2", require_device=True)

    return {
        "user_id": session.user_id,
        "session_id": session.id,
        "device_id": session.device_id,
        "token": token,
        "scopes": ["remote_control"],
    }


async def require_layer2(l2: dict = Depends(get_layer2_session)) -> dict:
    """Require a valid Layer 2 session."""
    return l2


# ──────────────────────────────────────────────────────────────────────────────
# Combined — Layer 1 + Layer 2 + device match check
# ──────────────────────────────────────────────────────────────────────────────

async def require_both_layers(
    l1: dict = Depends(require_layer1),
    l2: dict = Depends(require_layer2),
) -> dict:
    """Require both Layer 1 and Layer 2, and verify they belong to the same user.

    Returns a combined session dict with user_id, device_id, and both tokens.
    Callers must still verify the device_id in the request matches l2['device_id'].
    """
    if l1["user_id"] != l2["user_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Layer 2 token does not match Layer 1 user",
        )
    return {
        "user_id": l1["user_id"],
        "layer1_session_id": l1["session_id"],
        "layer2_session_id": l2["session_id"],
        "device_id": l2["device_id"],
        "layer1_token": l1["token"],
        "layer2_token": l2["token"],
    }


def require_layer2_for_device(device_id: int, l2: dict):
    """Check that the Layer 2 token's device matches the request's device.

    Raises HTTPException(403) on mismatch.
    """
    if l2["device_id"] != device_id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Layer 2 token not authorized for this device",
        )


# ──────────────────────────────────────────────────────────────────────────────
# Remote Access — global kill switch
# ──────────────────────────────────────────────────────────────────────────────

async def require_remote_access() -> None:
    """Hard global kill switch for all remote-access endpoints.

    Returns 403 Forbidden when REMOTE_ACCESS_ENABLED is False,
    regardless of authentication state. This applies to pairing,
    device management, remote control, and the pairing WebSocket.
    """
    if not settings.REMOTE_ACCESS_ENABLED:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Remote access is not enabled in this version. Coming in Version 2.",
        )


# ──────────────────────────────────────────────────────────────────────────────
# Admin
# ──────────────────────────────────────────────────────────────────────────────

async def require_admin(l1: dict = Depends(require_layer1)) -> dict:
    """Require a valid Layer 1 session AND admin privileges."""
    db = _get_db()
    try:
        from auth_models import User
        user = db.query(User).filter(User.id == l1["user_id"]).first()
        if not user or not user.is_admin:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Admin access required",
            )
        return l1
    finally:
        db.close()


async def require_verified_user(l1: dict = Depends(require_layer1)) -> dict:
    """Require a valid Layer 1 session AND a verified email address."""
    db = _get_db()
    try:
        from auth_models import User
        user = db.query(User).filter(User.id == l1["user_id"]).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="User not found",
            )
        if not user.email_verified:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Email verification required",
            )
        return l1
    finally:
        db.close()
