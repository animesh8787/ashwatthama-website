from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import ConfigDict
from pathlib import Path

BASE_DIR = Path(__file__).parent

class Settings(BaseSettings):
    model_config = ConfigDict(env_file=".env", extra="ignore")

    # App
    APP_NAME: str = "Ashwatthama"
    VERSION: str = "1.0.0"
    DEBUG: bool = True

    # Server
    HOST: str = "127.0.0.1"
    PORT: int = 8765

    # Database
    DB_PATH: str = str(BASE_DIR / "data" / "ashwatthama.db")

    # ChromaDB
    CHROMA_PATH: str = str(BASE_DIR / "data" / "chroma")

    # Security (session secrets loaded from env — never hardcode)
    SESSION_SECRET_L1: str = ""
    SESSION_SECRET_L2: str = ""
    SESSION_SECRET_REFRESH: str = ""
    COOKIE_DOMAIN: str = ".ashwatthama.dev"
    CORS_ORIGINS: str = "http://ashwatthama.local:3000,http://dashboard.ashwatthama.local:5173,https://ashwatthama.dev,https://dashboard.ashwatthama.dev"

    # Cookie security: Secure flag requires HTTPS.
    # Set to False ONLY for local HTTP testing (e.g. with hosts file).
    # Production MUST be True.
    SECURE_COOKIES: bool = True

    # Desktop mode: ONLY true for local desktop app builds.
    # When False (production, always behind a proxy), WebSocket auth NEVER exempts by IP.
    DESKTOP_MODE: bool = False

    # APK storage
    APK_STORAGE_PATH: str = str(BASE_DIR / "apk_storage")
    INSTALLER_STORAGE_PATH: str = str(BASE_DIR / "installer_storage")
    AZURE_STORAGE_CONNECTION_STRING: str = ""
    AZURE_INSTALLER_CONTAINER: str = "installers"
    MAX_APK_SIZE: int = 100 * 1024 * 1024  # 100 MB default
    MAX_INSTALLER_SIZE: int = 2 * 1024 * 1024 * 1024  # 2 GB default

    # Remote Access — global kill switch for pairing, devices, and remote control
    REMOTE_ACCESS_ENABLED: bool = False

    # Deprecated: kept for backward compat with existing .env files
    SECRET_KEY: Optional[str] = None

    # JWT (kept for backward compat if any code references it, but unused)
    JWT_ALGORITHM: str = "HS256"

    # Telegram
    TELEGRAM_API_ID: int = 0
    TELEGRAM_API_HASH: str = ""
    TELEGRAM_BOT_TOKEN: str = ""
    TELEGRAM_SESSION_PATH: str = str(BASE_DIR / "data" / "telegram_session")

    # Gmail OAuth2
    GMAIL_CLIENT_ID: str = ""
    GMAIL_CLIENT_SECRET: str = ""
    GMAIL_REDIRECT_URI: str = "http://localhost:8765/gmail/oauth/callback"
    
    # Spotify
    SPOTIFY_CLIENT_ID: str = ""
    SPOTIFY_CLIENT_SECRET: str = ""
    SPOTIFY_REDIRECT_URI: str = "http://127.0.0.1:8765/spotify/callback"
    SPOTIFY_SESSION_PATH: str = str(BASE_DIR / "data" / "spotify_token.json")

    # WhatsApp
    WHATSAPP_SESSION_PATH: str = str(BASE_DIR / "data" / "whatsapp_session")

    # Email (Resend)
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "noreply@ashwatthama.dev"
    FRONTEND_BASE_URL: str = "https://ashwatthama.dev"  # Used in email links (verification, password reset)

settings = Settings()
