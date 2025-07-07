"""
Health check endpoint for the API.
Add this to your main.py file to enable health checks.
"""
from fastapi import APIRouter

health_router = APIRouter(tags=["Health"])

@health_router.get("/health-check")
def health_check():
    """Simple health check endpoint to verify API connectivity"""
    return {"status": "ok", "message": "API server is running"}

# Add this to your main FastAPI app
# app.include_router(health_router)
