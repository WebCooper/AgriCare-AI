import os
from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

# ✅ Load .env before anything else
from dotenv import load_dotenv
load_dotenv()

# Import your Base
from app.db.models import Base

# Access Alembic config
config = context.config

# Manually set the sqlalchemy.url here using the loaded .env value
config.set_main_option("sqlalchemy.url", os.getenv("DATABASE_URL"))

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata
