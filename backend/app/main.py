from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from app.auth import router as auth_router
from app.core.config import get_settings
from app.ml import router as ml_router
from app.chatbot import router as chatbot_router
from app.core.health import health_router

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
app.include_router(ml_router.router, prefix="/ml", tags=["ML"])
app.include_router(chatbot_router.router, prefix="/chatbot", tags=["Chatbot"])
app.include_router(health_router)
