"""SQLAlchemy models for authentication and remote client management."""
from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, Index
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(128), unique=True, nullable=False, index=True)
    email = Column(String(128), unique=True, nullable=True, index=True)
    display_name = Column(String(128), nullable=True)
    password_hash = Column(String(256), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    email_verified = Column(Boolean, default=False)
    email_verified_at = Column(DateTime, nullable=True)

    # Relationships
    access_keys = relationship("AccessKey", back_populates="user", cascade="all, delete-orphan")
    devices = relationship("TrustedDevice", back_populates="user", cascade="all, delete-orphan")
    sessions = relationship("UserSession", back_populates="user", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_users_username_active", "username", "is_active"),
    )


class AccessKey(Base):
    __tablename__ = "access_keys"

    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(256), unique=True, nullable=False, index=True)
    label = Column(String(128), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)
    revoked = Column(Boolean, default=False)
    last_used = Column(DateTime, nullable=True)

    user = relationship("User", back_populates="access_keys")

    __table_args__ = (
        Index("ix_access_keys_user_revoked", "user_id", "revoked"),
    )


class TrustedDevice(Base):
    __tablename__ = "trusted_devices"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    name = Column(String(128), nullable=False)
    fingerprint = Column(String(256), nullable=False, index=True)
    device_type = Column(String(32), default="unknown")
    status = Column(String(32), default="pending")  # pending, trusted, revoked, expired
    paired_at = Column(DateTime, default=datetime.utcnow)
    last_seen = Column(DateTime, nullable=True)
    ip_address = Column(String(64), nullable=True)

    user = relationship("User", back_populates="devices")
    sessions = relationship("UserSession", back_populates="device", cascade="all, delete-orphan")

    __table_args__ = (
        Index("ix_trusted_devices_user_status", "user_id", "status"),
    )


class UserSession(Base):
    __tablename__ = "user_sessions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("trusted_devices.id"), nullable=True)
    token_hash = Column(String(256), unique=True, nullable=False, index=True)
    session_type = Column(String(32), default="rest_api")  # ws_desktop, rest_api, remote_client
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    revoked = Column(Boolean, default=False)

    user = relationship("User", back_populates="sessions")
    device = relationship("TrustedDevice", back_populates="sessions")

    __table_args__ = (
        Index("ix_user_sessions_token", "token_hash", "revoked"),
        Index("ix_user_sessions_user_expires", "user_id", "expires_at"),
    )


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    device_id = Column(Integer, ForeignKey("trusted_devices.id"), nullable=True)
    action = Column(String(64), nullable=False, index=True)
    resource = Column(String(256), nullable=False)
    result = Column(String(32), nullable=False)
    ip_address = Column(String(64), nullable=True)
    details = Column(Text, nullable=True)

    __table_args__ = (
        Index("ix_audit_logs_user_time", "user_id", "timestamp"),
        Index("ix_audit_logs_action_time", "action", "timestamp"),
        Index("ix_audit_logs_device_time", "device_id", "timestamp"),
    )


class EmailVerificationToken(Base):
    __tablename__ = "email_verification_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(256), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PasswordResetToken(Base):
    __tablename__ = "password_reset_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(256), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class DownloadToken(Base):
    """Single-use, short-lived token authorizing one installer download.

    Tied to a specific user_id. Marked used=True immediately after the
    file has started streaming, so a forwarded link cannot be reused.
    """
    __tablename__ = "download_tokens"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    token_hash = Column(String(256), unique=True, nullable=False, index=True)
    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)


class PairingKey(Base):
    """Single-use, short-lived pairing key generated by the desktop app.

    The backend stores ONLY the hash of the plaintext key. The plaintext key
    is generated locally on the desktop and displayed to the user. It is never
    persisted to disk or database in plaintext form.
    """
    __tablename__ = "pairing_keys"

    id = Column(Integer, primary_key=True, index=True)
    key_hash = Column(String(256), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    desktop_device_id = Column(Integer, ForeignKey("trusted_devices.id"), nullable=True)

    attempt_id = Column(String(64), unique=True, nullable=True, index=True)
    dashboard_device_name = Column(String(128), nullable=True)
    dashboard_device_type = Column(String(32), nullable=True)
    dashboard_ip = Column(String(64), nullable=True)
    dashboard_user_agent = Column(String(512), nullable=True)

    expires_at = Column(DateTime, nullable=False)
    used = Column(Boolean, default=False)
    revoked = Column(Boolean, default=False)
    approved = Column(Boolean, nullable=True)  # null=pending, True=approved, False=denied
    attempts_count = Column(Integer, default=0)
    l2_issued = Column(Boolean, default=False)  # tracks whether L2 token was already returned

    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    __table_args__ = (
        Index("ix_pairing_keys_user_expires", "user_id", "expires_at"),
    )
