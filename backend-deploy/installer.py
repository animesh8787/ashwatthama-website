"""Installer download router — authenticated, single-use, token-based.

Flow:
  1. POST /api/v1/installer/request-download (requires verified session)
     → creates a short-lived, single-use DownloadToken, returns it.
  2. GET /api/v1/installer/download?token=xxx
     → validates the token, marks it used, streams the file.

This differs deliberately from apk.py's public/open download pattern:
the installer is gated behind login + email verification, and each
download link works exactly once.

Admin-only:
  POST /api/v1/admin/installer/upload — upload new installer build
"""

from datetime import datetime, timedelta

from fastapi import APIRouter, Request, UploadFile, File as FastAPIFile, Depends, HTTPException, Form
from fastapi.responses import StreamingResponse

from dependencies import require_verified_user, require_admin, require_safe_origin, _get_db
from installer_storage_service import get_installer_storage
from auth_models import DownloadToken
from crypto import generate_token, hash_token
from rate_limiter import RateLimiter
from responses import ApiResponse
from config import settings

router = APIRouter(prefix="/api/v1/installer", tags=["Installer"])
admin_router = APIRouter(prefix="/api/v1/admin/installer", tags=["Installer Admin"])

rate_limiter = RateLimiter()

_DOWNLOAD_TOKEN_MAX_AGE_MINUTES = 10


@router.get("/latest")
async def get_latest_installer_info(request: Request):
    """Return current installer version metadata. No auth required."""
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"installer_latest:{ip}", 30, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests. Please try again later.")

    storage = get_installer_storage()
    meta = storage.get_latest_installer_meta()
    if not meta:
        raise HTTPException(404, "No installer available")

    return ApiResponse(data={
        "version_name": meta["version_name"],
        "version_code": meta["version_code"],
        "sha256": meta["sha256"],
        "size": meta["size"],
    })


@router.post("/request-download")
async def request_download(
    request: Request,
    session: dict = Depends(require_verified_user),
):
    """Create a short-lived, single-use download token for the current user."""
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"installer_request:{ip}", 10, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests. Please try again later.")

    storage = get_installer_storage()
    meta = storage.get_latest_installer_meta()
    if not meta:
        raise HTTPException(404, "No installer available")

    raw_token = generate_token(32)
    token_hash = hash_token(raw_token)

    db = _get_db()
    try:
        record = DownloadToken(
            user_id=session["user_id"],
            token_hash=token_hash,
            expires_at=datetime.utcnow() + timedelta(minutes=_DOWNLOAD_TOKEN_MAX_AGE_MINUTES),
            used=False,
        )
        db.add(record)
        db.commit()
    finally:
        db.close()

    return ApiResponse(data={
        "token": raw_token,
        "expires_in_seconds": _DOWNLOAD_TOKEN_MAX_AGE_MINUTES * 60,
    })


@router.get("/download")
async def download_installer(token: str, request: Request):
    """Stream the installer file. Requires a valid, unused, unexpired token."""
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"installer_download:{ip}", 20, 60)
    if not allowed:
        raise HTTPException(429, "Too many download requests. Please try again later.")

    if not token:
        raise HTTPException(400, "Missing token")

    token_hash = hash_token(token)

    db = _get_db()
    try:
        record = (
            db.query(DownloadToken)
            .filter(
                DownloadToken.token_hash == token_hash,
                DownloadToken.used == False,
                DownloadToken.expires_at > datetime.utcnow(),
            )
            .first()
        )
        if not record:
            raise HTTPException(400, "Invalid or expired download link")

        record.used = True
        db.commit()
    finally:
        db.close()

    storage = get_installer_storage()
    stream_factory, meta = storage.get_latest_installer_stream()
    if not stream_factory or not meta:
        raise HTTPException(404, "No installer available")

    return StreamingResponse(
        stream_factory(),
        media_type="application/octet-stream",
        headers={
            "Content-Disposition": f'attachment; filename="{meta["filename"]}"',
            "Content-Length": str(meta["size"]),
        },
    )


@admin_router.post("/upload")
async def upload_installer(
    request: Request,
    file: UploadFile = FastAPIFile(...),
    version_name: str = Form(...),
    version_code: int = Form(...),
    session: dict = Depends(require_admin),
):
    """Upload a new installer build. Requires admin."""
    require_safe_origin(request)
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"installer_upload:{ip}", 10, 3600)
    if not allowed:
        raise HTTPException(429, "Too many upload attempts. Please try again later.")

    if not file.filename or not file.filename.endswith(".exe"):
        raise HTTPException(400, "File must be an .exe")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(400, "Empty file")
    if len(content) > settings.MAX_INSTALLER_SIZE:
        raise HTTPException(413, f"Installer exceeds {settings.MAX_INSTALLER_SIZE} bytes")

    storage = get_installer_storage()
    try:
        meta = storage.save_installer(
            file_bytes=content,
            version_name=version_name,
            version_code=version_code,
        )
    except ValueError as e:
        raise HTTPException(400, str(e))

    return ApiResponse(data={
        "version_name": meta["version_name"],
        "version_code": version_code,
        "sha256": meta["sha256"],
        "size": meta["size"],
        "message": "Installer uploaded successfully",
    })
