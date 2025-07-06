from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from app.auth import router as auth_router
from app.core.config import get_settings

settings = get_settings()

app = FastAPI(
    title="AgriCare AI API",
    description="Backend API for AgriCare AI mobile application",
    version="1.0.0"
)

# Global exception handler
@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail}
    )

@app.get("/")
async def root():
    return {"message": "AgriCare AI API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "API is operational"}

app.include_router(auth_router.router, prefix="/auth", tags=["Auth"])
