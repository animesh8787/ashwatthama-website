import os

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, DeclarativeBase
from loguru import logger
from config import settings
from dotenv import load_dotenv
load_dotenv()

# Cloud database override — for public backend deployment only.
# If DATABASE_URL is set (e.g. to a Postgres URL), use it directly.
# Otherwise, fall back to local SQLite exactly as before.
_DATABASE_URL = os.environ.get("DATABASE_URL")
_IS_SQLITE = _DATABASE_URL is None

if _IS_SQLITE:
    # Create data directory if not exists
    os.makedirs(os.path.dirname(settings.DB_PATH), exist_ok=True)
    _engine_url = f"sqlite:///{settings.DB_PATH}"
    _engine_kwargs = {"connect_args": {"check_same_thread": False}}
else:
    _engine_url = _DATABASE_URL
    _engine_kwargs = {}

engine = create_engine(_engine_url, **_engine_kwargs)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


class Base(DeclarativeBase):
    pass


def init_db():
    """Initialize database with WAL mode for better concurrency"""
    if _IS_SQLITE:
        with engine.connect() as conn:
            conn.execute(text("PRAGMA journal_mode=WAL"))
            conn.execute(text("PRAGMA foreign_keys=ON"))
            conn.commit()
    Base.metadata.create_all(bind=engine)
    if _IS_SQLITE:
        logger.info(f"Database initialized at {settings.DB_PATH}")
    else:
        logger.info("Database initialized (cloud)")


def get_db():
    """Dependency for FastAPI routes"""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


if __name__ == "__main__":
    init_db()
    logger.info("Database ready")
