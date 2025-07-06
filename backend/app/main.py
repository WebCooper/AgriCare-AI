from fastapi import FastAPI
from app.auth import router as auth_router

# temporary import for creating tables
from app.db.database import Base, engine
from app.db.models import User

# create tables (first time only)
Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
