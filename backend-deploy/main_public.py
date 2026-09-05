"""Public backend for Ashwatthama — auth + APK only.

This is the scoped-down deployment entry point for public-facing
services (user authentication and APK distribution). It does NOT
import, start, or reference any JARVIS-only local services
(voice, vision, camera, Ollama, WhatsApp, Telegram, Spotify, etc.).
"""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from loguru import logger

from config import settings
from database import init_db

# Side-effect import: registers auth tables with Base
import auth_models  # noqa: F401

from auth import router as auth_router
from apk import router as apk_router
from installer import router as installer_router, admin_router as installer_admin_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    logger.info(f"{settings.APP_NAME} (public) v{settings.VERSION} starting...")
    yield
    logger.info("Public backend shutting down...")


app = FastAPI(
    title=settings.APP_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS.split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Layer2-Token"],
)

app.include_router(auth_router)
app.include_router(apk_router)
app.include_router(installer_router)
app.include_router(installer_admin_router)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main_public:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=False,
    )
