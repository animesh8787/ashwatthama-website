"""APK download and admin upload router.

Public endpoints:
  GET /api/v1/apk/latest     — version metadata + SHA-256 (no auth)
  GET /api/v1/apk/download   — stream the APK file (no auth, rate-limited)

Admin-only:
  POST /api/v1/admin/apk     — upload new APK (require_admin)
"""

from fastapi import APIRouter, Request, UploadFile, File as FastAPIFile, Depends, HTTPException, Form
from fastapi.responses import FileResponse, StreamingResponse

from dependencies import require_admin, require_safe_origin
from apk_storage_service import get_apk_storage
from rate_limiter import RateLimiter
from responses import ApiResponse
from config import settings

router = APIRouter(prefix="/api/v1/apk", tags=["APK"])
admin_router = APIRouter(prefix="/api/v1/admin/apk", tags=["APK Admin"])

rate_limiter = RateLimiter()


# ──────────────────────────────────────────────────────────────────────────────
# Admin upload
# ──────────────────────────────────────────────────────────────────────────────

@admin_router.post("/upload")
async def upload_apk(
    request: Request,
    file: UploadFile = FastAPIFile(...),
    version_name: str = Form(...),
    version_code: int = Form(...),
    session: dict = Depends(require_admin),
):
    """Upload a new APK build. Requires admin.

    SHA-256 is computed server-side — never trusted from client input.
    """
    require_safe_origin(request)
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"apk_upload:{ip}", 10, 3600)
    if not allowed:
        raise HTTPException(429, "Too many upload attempts. Please try again later.")

    if not file.filename or not file.filename.endswith(".apk"):
        raise HTTPException(400, "File must be an .apk")

    content = await file.read()
    if len(content) == 0:
        raise HTTPException(400, "Empty file")
    if len(content) > settings.MAX_APK_SIZE:
        raise HTTPException(413, f"APK exceeds {settings.MAX_APK_SIZE} bytes")

    storage = get_apk_storage()
    try:
        meta = storage.save_apk(
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
        "filename": meta["filename"],
        "message": "APK uploaded successfully",
    })


# ──────────────────────────────────────────────────────────────────────────────
# Public metadata
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/latest")
async def get_latest_apk_info(request: Request):
    """Return current APK version metadata and SHA-256. No auth required."""
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"apk_latest:{ip}", 30, 60)
    if not allowed:
        raise HTTPException(429, "Too many requests. Please try again later.")

    storage = get_apk_storage()
    path, meta = storage.get_latest_apk()
    if not path or not meta:
        raise HTTPException(404, "No APK available")

    return ApiResponse(data={
        "version_name": meta["version_name"],
        "version_code": meta["version_code"],
        "sha256": meta["sha256"],
        "size": meta["size"],
        "filename": meta["filename"],
    })


# ──────────────────────────────────────────────────────────────────────────────
# Public download
# ──────────────────────────────────────────────────────────────────────────────

@router.get("/download")
async def download_apk(request: Request):
    """Stream the latest APK. No auth required, but rate-limited."""
    ip = request.headers.get("X-Forwarded-For", request.client.host)
    allowed, _, _ = rate_limiter.check_limit(f"apk_download:{ip}", 10, 60)
    if not allowed:
        raise HTTPException(429, "Too many download requests. Please try again later.")

    storage = get_apk_storage()
    path, meta = storage.get_latest_apk()
    if not path or not path.exists():
        raise HTTPException(404, "No APK available")

    return FileResponse(
        path=path,
        media_type="application/vnd.android.package-archive",
        filename=meta["filename"],
    )
