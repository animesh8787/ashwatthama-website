"""APK storage abstraction.

Supports local disk storage by default. The interface is intentionally
small (save_apk / get_apk_path_and_meta) so swapping to cloud storage
later only requires replacing this file.
"""

import hashlib
import json
import os
import re
import tempfile
from datetime import datetime, timezone
from pathlib import Path
from typing import Optional, Tuple

from config import settings


# Storage root — outside any public static directory
_STORAGE_ROOT = Path(settings.APK_STORAGE_PATH)
_METADATA_FILE = _STORAGE_ROOT / "apk_metadata.json"


def _ensure_storage():
    _STORAGE_ROOT.mkdir(parents=True, exist_ok=True)


def _load_metadata() -> dict:
    if _METADATA_FILE.exists():
        with open(_METADATA_FILE, "r") as f:
            return json.load(f)
    return {}


def _save_metadata(meta: dict):
    _ensure_storage()
    with open(_METADATA_FILE, "w") as f:
        json.dump(meta, f, indent=2)


def _compute_sha256(file_path: Path) -> str:
    h = hashlib.sha256()
    with open(file_path, "rb") as f:
        for chunk in iter(lambda: f.read(8192), b""):
            h.update(chunk)
    return h.hexdigest()


def _apk_path(version_name: str) -> Path:
    """Sanitized filename — no path traversal."""
    if not version_name:
        raise ValueError("version_name cannot be empty")
    safe = re.sub(r'[^a-zA-Z0-9._-]', '_', version_name)
    if safe.startswith('.') or safe.startswith('-'):
        safe = '_' + safe
    return _STORAGE_ROOT / f"ashwatthama-{safe}.apk"


class ApkStorageService:
    """Local-disk implementation of APK storage.

    Uses explicit metadata JSON as the source of truth for "latest"
    (highest version_code), never filesystem mtime. Old builds are
    cleaned up on upload so only one APK remains.
    """

    def __init__(self, root: Path = None):
        self.root = root or _STORAGE_ROOT
        self._ensure_root()

    def _ensure_root(self):
        self.root.mkdir(parents=True, exist_ok=True)

    def save_apk(
        self,
        file_bytes: bytes,
        version_name: str,
        version_code: int,
    ) -> dict:
        """Store an APK file, compute SHA-256, and update metadata.

        Replaces any previous build — only one APK is kept in storage.
        Writes to a temp file first, then renames atomically, so an
        interrupted upload never leaves a corrupted or missing APK.
        """
        self._ensure_root()
        apk_path = _apk_path(version_name)

        # Downgrade protection: reject uploads with lower version_code
        meta = _load_metadata()
        existing = meta.get("latest")
        if existing and version_code < existing.get("version_code", 0):
            raise ValueError(
                f"Downgrade rejected: {version_code} < {existing['version_code']}"
            )

        # Atomic write: temp file → rename
        temp_path = self.root / f".tmp.{apk_path.name}"
        with open(temp_path, "wb") as f:
            f.write(file_bytes)

        sha256 = _compute_sha256(temp_path)
        size = temp_path.stat().st_size

        # Commit: rename temp to final, update metadata
        os.replace(temp_path, apk_path)

        meta["latest"] = {
            "version_name": version_name,
            "version_code": version_code,
            "sha256": sha256,
            "size": size,
            "filename": apk_path.name,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        _save_metadata(meta)

        # Clean up old APK files (only the current one stays)
        for old in self.root.glob("ashwatthama-*.apk"):
            if old.name != apk_path.name:
                old.unlink()

        return meta["latest"]

    def get_apk_path_and_meta(self, version_name: str) -> Tuple[Optional[Path], Optional[dict]]:
        """Return the path and metadata for a specific version, or None if not found."""
        apk_path = _apk_path(version_name)
        if not apk_path.exists():
            return None, None
        meta = _load_metadata()
        latest = meta.get("latest", {})
        if latest.get("version_name") != version_name:
            return None, None
        return apk_path, latest

    def get_latest_apk(self) -> Tuple[Optional[Path], Optional[dict]]:
        """Return the latest APK file and its metadata.

        Source of truth is the explicit metadata JSON (highest version_code),
        never filesystem mtime.
        """
        self._ensure_root()
        meta = _load_metadata()
        latest = meta.get("latest")
        if not latest:
            return None, None
        apk_path = _apk_path(latest["version_name"])
        if not apk_path.exists():
            return None, None
        return apk_path, latest

    def delete_apk(self, version_name: str) -> bool:
        """Remove an APK file and clear metadata. Returns True if deleted."""
        apk_path = _apk_path(version_name)
        if apk_path.exists():
            apk_path.unlink()
        meta = _load_metadata()
        if meta.get("latest", {}).get("version_name") == version_name:
            meta.pop("latest", None)
            _save_metadata(meta)
        return apk_path.exists() is False


# Singleton instance
_apk_storage: Optional[ApkStorageService] = None


def get_apk_storage() -> ApkStorageService:
    global _apk_storage
    if _apk_storage is None:
        _apk_storage = ApkStorageService()
    return _apk_storage
