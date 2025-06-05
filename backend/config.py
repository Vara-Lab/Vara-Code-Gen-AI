import os
from dotenv import load_dotenv

load_dotenv()


def get_openai_api_key() -> str:
    """
    Get the OpenAI API key from environment variables.
    """
    key = os.getenv("OPENAI_API_KEY")
    if not key:
        raise ValueError("Missing OPENAI_API_KEY in environment.")
    return key


def get_allowed_origins() -> list[str]:
    """
    Get ALLOWED_ORIGINS from environment variable.
    """
    origins = os.getenv("ALLOWED_ORIGINS", "")
    return [origin.strip() for origin in origins.split(",") if origin.strip()]


class Config:
    """Base configuration."""
    DEBUG = False
    TESTING = False

    API_KEY = os.getenv("API_KEY", "default-token")

    RATELIMIT_DEFAULT = "100/hour"
    RATELIMIT_STORAGE_URI = "memory://"

    ALLOWED_ORIGINS = get_allowed_origins()


class DevelopmentConfig(Config):
    DEBUG = True


class ProductionConfig(Config):
    DEBUG = False


class TestingConfig(Config):
    TESTING = True
    DEBUG = True


config = {
    "development": DevelopmentConfig,
    "production": ProductionConfig,
    "testing": TestingConfig,
}
