"""Password hashing, token generation, and encryption utilities.

Uses Argon2id for passwords (via passlib) and HMAC-SHA256 for access keys.
All hashing is intentionally slow to resist brute-force attacks.
"""

import hashlib
import hmac
import secrets
from typing import Optional

from passlib.context import CryptContext

# Argon2id password hashing context
# Time cost: 3 rounds, Memory: 64MB, Parallelism: 4
_pwd_ctx = CryptContext(
    schemes=["argon2"],
    deprecated="auto",
    argon2__time_cost=3,
    argon2__memory_cost=65536,
    argon2__parallelism=4,
)


def hash_password(password: str) -> str:
    """Hash a password using Argon2id."""
    return _pwd_ctx.hash(password)


def verify_password(password: str, password_hash: str) -> bool:
    """Verify a password against its Argon2id hash."""
    return _pwd_ctx.verify(password, password_hash)


# Access keys are high-entropy secrets (like API keys).
# We use HMAC-SHA256 with a pepper (app-level secret) so an attacker
# who steals the DB still needs the pepper to verify keys.

_ACCESS_KEY_PEPPER: Optional[str] = None


def set_access_key_pepper(pepper: str) -> None:
    global _ACCESS_KEY_PEPPER
    _ACCESS_KEY_PEPPER = pepper


def hash_access_key(key: str) -> str:
    """Hash an access key with HMAC-SHA256 + pepper."""
    salt = secrets.token_hex(24)
    pepper = _ACCESS_KEY_PEPPER or ""
    hashed = hmac.new(
        (pepper + salt).encode(), key.encode(), hashlib.sha256
    ).hexdigest()
    return f"hmac-sha256:{salt}:{hashed}"


def verify_access_key(key: str, key_hash: str) -> bool:
    """Verify an access key against its HMAC-SHA256 hash."""
    if not key_hash.startswith("hmac-sha256:"):
        # Legacy: single-round SHA-256 — still verify for migration
        if not key_hash.startswith("sha256:"):
            return False
        _, salt, stored_hash = key_hash.split(":")
        hashed = hashlib.sha256(f"{key}{salt}".encode()).hexdigest()
        return hmac.compare_digest(hashed, stored_hash)
    _, salt, stored_hash = key_hash.split(":")
    pepper = _ACCESS_KEY_PEPPER or ""
    hashed = hmac.new(
        (pepper + salt).encode(), key.encode(), hashlib.sha256
    ).hexdigest()
    return hmac.compare_digest(hashed, stored_hash)


def generate_token(length: int = 32) -> str:
    """Generate a cryptographically secure random token."""
    return secrets.token_urlsafe(length)


def hash_token(token: str) -> str:
    """Hash a session token for storage (SHA-256, fast because the token
    itself is already high-entropy and unguessable)."""
    return hashlib.sha256(token.encode()).hexdigest()


