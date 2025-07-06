from pydantic_settings import BaseSettings
from functools import lru_cache

class Settings(BaseSettings):
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # JWT Settings
    JWT_SECRET_KEY: str = None  # Will use SECRET_KEY if not set
    JWT_ALGORITHM: str = "HS256"
    
    # Security settings
    ALLOWED_HOSTS: list = ["*"]
    CORS_ORIGINS: list = ["*"]
    
    # Mobile app specific settings
    MAX_REFRESH_TOKENS_PER_USER: int = 5  # Limit active refresh tokens per user

    GENAI_API_KEY: str
    
    class Config:
        env_file = ".env"

@lru_cache()
def get_settings():
    settings = Settings()
    # Use SECRET_KEY for JWT if JWT_SECRET_KEY is not set
    if settings.JWT_SECRET_KEY is None:
        settings.JWT_SECRET_KEY = settings.SECRET_KEY
    return settings
