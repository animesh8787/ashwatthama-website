from enum import Enum, auto


class DeviceType(str, Enum):
    DESKTOP = "desktop"
    ANDROID = "android"
    WEB = "web"
    UNKNOWN = "unknown"


class DeviceStatus(str, Enum):
    PENDING = "pending"
    TRUSTED = "trusted"
    REVOKED = "revoked"
    EXPIRED = "expired"


class PermissionLevel(str, Enum):
    NONE = "none"
    STATUS = "status"
    READ = "read"
    CONTROL = "control"
    ADMIN = "admin"


class AuditAction(str, Enum):
    LOGIN = "login"
    LOGOUT = "logout"
    COMMAND = "command"
    FILE_ACCESS = "file_access"
    STREAM_START = "stream_start"
    STREAM_STOP = "stream_stop"
    DEVICE_PAIR = "device_pair"
    DEVICE_REVOKE = "device_revoke"
    DEVICE_TRUST = "device_trust"
    SESSION_CREATE = "session_create"
    SESSION_REVOKE = "session_revoke"
    PASSWORD_CHANGE = "password_change"
    ACCESS_KEY_CREATE = "access_key_create"
    ACCESS_KEY_REVOKE = "access_key_revoke"
    NOTIFICATION_SEND = "notification_send"
    AUTOMATION_TRIGGER = "automation_trigger"
    SETTINGS_CHANGE = "settings_change"


class SessionType(str, Enum):
    WS_DESKTOP = "ws_desktop"
    REST_API = "rest_api"
    REMOTE_CLIENT = "remote_client"
