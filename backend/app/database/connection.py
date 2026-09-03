import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Default to SQLite local database file for out-of-the-box zero-config execution,
# or use PostgreSQL URL from .env if provided.
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./data/careerskill.db")

# Convert postgresql:// to postgresql+psycopg2:// if needed
if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)

connect_args = {"check_same_thread": False} if DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(DATABASE_URL, connect_args=connect_args, echo=False)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    """Dependency for FastAPI session management."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def init_db():
    """Creates all tables in the database."""
    Base.metadata.create_all(bind=engine)
