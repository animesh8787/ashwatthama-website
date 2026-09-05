"""Installer (.exe) storage abstraction.

Two implementations of the same interface, auto-selected based on config:
  - LocalInstallerStorageService: local disk (used when
    AZURE_STORAGE_CONNECTION_STRING is not set — e.g. local dev)
  - BlobInstallerStorageService: Azure Blob Storage (used when
    AZURE_STORAGE_CONNECTION_STRING IS set — e.g. production)

This mirrors the same DATABASE_URL-driven pattern already used in
database.py. Callers (installer.py) never need to know or care which
implementation is active.
"""

import hashlib
import json
import os
import re
from datetime import datetime, timezone
from pathlib import Path
from typing import Callable, Iterator, Optional, Tuple

from config import settings

_STREAM_CHUNK_SIZE = 1024 * 1024  # 1 MiB


def _sanitize_version(version_name: str) -> str:
    if not version_name:
        raise ValueError("version_name cannot be empty")
    safe = re.sub(r'[^a-zA-Z0-9._-]', '_', version_name)
    if safe.startswith('.') or safe.startswith('-'):
        safe = '_' + safe
    return safe


def _installer_filename(version_name: str) -> str:
    return f"ashwatthama-{_sanitize_version(version_name)}.exe"


def _compute_sha256_bytes(data: bytes) -> str:
    h = hashlib.sha256()
    h.update(data)
    return h.hexdigest()


class LocalInstallerStorageService:
    """Local-disk implementation of installer storage. Used for local dev."""

    def __init__(self):
        self.root = Path(settings.INSTALLER_STORAGE_PATH)
        self.root.mkdir(parents=True, exist_ok=True)
        self._metadata_file = self.root / "installer_metadata.json"

    def _load_metadata(self) -> dict:
        if self._metadata_file.exists():
            with open(self._metadata_file, "r") as f:
                return json.load(f)
        return {}

    def _save_metadata(self, meta: dict):
        with open(self._metadata_file, "w") as f:
            json.dump(meta, f, indent=2)

    def _path_for(self, version_name: str) -> Path:
        return self.root / _installer_filename(version_name)

    def save_installer(self, file_bytes: bytes, version_name: str, version_code: int) -> dict:
        installer_path = self._path_for(version_name)

        meta = self._load_metadata()
        existing = meta.get("latest")
        if existing and version_code < existing.get("version_code", 0):
            raise ValueError(f"Downgrade rejected: {version_code} < {existing['version_code']}")

        temp_path = self.root / f".tmp.{installer_path.name}"
        with open(temp_path, "wb") as f:
            f.write(file_bytes)

        sha256 = _compute_sha256_bytes(file_bytes)
        size = temp_path.stat().st_size
        os.replace(temp_path, installer_path)

        meta["latest"] = {
            "version_name": version_name,
            "version_code": version_code,
            "sha256": sha256,
            "size": size,
            "filename": installer_path.name,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        self._save_metadata(meta)

        for old in self.root.glob("ashwatthama-*.exe"):
            if old.name != installer_path.name:
                old.unlink()

        return meta["latest"]

    def get_latest_installer_meta(self) -> Optional[dict]:
        """Return metadata for the latest installer without touching the file body."""
        meta = self._load_metadata()
        latest = meta.get("latest")
        if not latest:
            return None
        if not self._path_for(latest["version_name"]).exists():
            return None
        return latest

    def get_latest_installer_stream(self) -> Tuple[Optional[Callable[[], Iterator[bytes]]], Optional[dict]]:
        """Return a zero-arg callable producing a chunk iterator, plus metadata.

        Never loads the whole file into memory — the caller streams the
        chunks directly to the client (installers can be up to 2 GB).
        """
        latest = self.get_latest_installer_meta()
        if not latest:
            return None, None
        installer_path = self._path_for(latest["version_name"])

        def _iterfile() -> Iterator[bytes]:
            with open(installer_path, "rb") as f:
                while True:
                    chunk = f.read(_STREAM_CHUNK_SIZE)
                    if not chunk:
                        break
                    yield chunk

        return _iterfile, latest

    def delete_installer(self, version_name: str) -> bool:
        installer_path = self._path_for(version_name)
        if installer_path.exists():
            installer_path.unlink()
        meta = self._load_metadata()
        if meta.get("latest", {}).get("version_name") == version_name:
            meta.pop("latest", None)
            self._save_metadata(meta)
        return not installer_path.exists()


class BlobInstallerStorageService:
    """Azure Blob Storage implementation of installer storage. Used in production."""

    def __init__(self):
        from azure.storage.blob import BlobServiceClient
        client = BlobServiceClient.from_connection_string(
            settings.AZURE_STORAGE_CONNECTION_STRING
        )
        self._container = client.get_container_client(settings.AZURE_INSTALLER_CONTAINER)
        self._metadata_blob_name = "installer_metadata.json"

    def _load_metadata(self) -> dict:
        blob_client = self._container.get_blob_client(self._metadata_blob_name)
        try:
            data = blob_client.download_blob().readall()
            return json.loads(data)
        except Exception:
            return {}

    def _save_metadata(self, meta: dict):
        blob_client = self._container.get_blob_client(self._metadata_blob_name)
        blob_client.upload_blob(json.dumps(meta, indent=2), overwrite=True)

    def save_installer(self, file_bytes: bytes, version_name: str, version_code: int) -> dict:
        filename = _installer_filename(version_name)

        meta = self._load_metadata()
        existing = meta.get("latest")
        if existing and version_code < existing.get("version_code", 0):
            raise ValueError(f"Downgrade rejected: {version_code} < {existing['version_code']}")

        blob_client = self._container.get_blob_client(filename)
        blob_client.upload_blob(file_bytes, overwrite=True)

        sha256 = _compute_sha256_bytes(file_bytes)
        size = len(file_bytes)

        meta["latest"] = {
            "version_name": version_name,
            "version_code": version_code,
            "sha256": sha256,
            "size": size,
            "filename": filename,
            "updated_at": datetime.now(timezone.utc).isoformat(),
        }
        self._save_metadata(meta)

        for blob in self._container.list_blobs(name_starts_with="ashwatthama-"):
            if blob.name != filename and blob.name.endswith(".exe"):
                self._container.delete_blob(blob.name)

        return meta["latest"]

    def get_latest_installer_meta(self) -> Optional[dict]:
        """Return metadata for the latest installer without downloading the blob."""
        meta = self._load_metadata()
        return meta.get("latest")

    def get_latest_installer_stream(self) -> Tuple[Optional[Callable[[], Iterator[bytes]]], Optional[dict]]:
        """Return a zero-arg callable producing a chunk iterator, plus metadata.

        Uses the Azure SDK's chunked downloader so the full installer
        (up to 2 GB) is never buffered in process memory at once.
        """
        latest = self.get_latest_installer_meta()
        if not latest:
            return None, None
        blob_client = self._container.get_blob_client(latest["filename"])
        try:
            downloader = blob_client.download_blob()
        except Exception:
            return None, None

        def _iterfile() -> Iterator[bytes]:
            yield from downloader.chunks()

        return _iterfile, latest

    def delete_installer(self, version_name: str) -> bool:
        filename = _installer_filename(version_name)
        blob_client = self._container.get_blob_client(filename)
        try:
            blob_client.delete_blob()
        except Exception:
            pass
        meta = self._load_metadata()
        if meta.get("latest", {}).get("version_name") == version_name:
            meta.pop("latest", None)
            self._save_metadata(meta)
        return True


_installer_storage = None


def get_installer_storage():
    global _installer_storage
    if _installer_storage is None:
        if settings.AZURE_STORAGE_CONNECTION_STRING:
            _installer_storage = BlobInstallerStorageService()
        else:
            _installer_storage = LocalInstallerStorageService()
    return _installer_storage
