from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.db.models import User, RefreshToken
from .schemas import (
    UserCreate, UserLogin, Token, RefreshTokenRequest, 
    TokenResponse, UserResponse, LogoutResponse
)
from .utils import hash_password, verify_password
from .jwt import (
    create_access_token, create_refresh_token, verify_refresh_token,
    revoke_refresh_token, revoke_all_user_tokens
)
from .middleware import get_db, get_current_user_dependency
from app.core.config import get_settings

settings = get_settings()
router = APIRouter()

@router.post("/register", response_model=TokenResponse)
def register(user: UserCreate, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if user already exists
    if db.query(User).filter(User.email == user.email).first():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        email=user.email,
        hashed_password=hash_password(user.password)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Create tokens
    access_token = create_access_token({"sub": new_user.email})
    refresh_token = create_refresh_token(new_user.id, db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/login", response_model=TokenResponse)
def login(user: UserLogin, db: Session = Depends(get_db)):
    """Login user and return tokens"""
    # Find user
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user or not verify_password(user.password, db_user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    if not db_user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Account is deactivated"
        )
    
    # Create tokens
    access_token = create_access_token({"sub": db_user.email})
    refresh_token = create_refresh_token(db_user.id, db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/refresh", response_model=TokenResponse)
def refresh_token(refresh_request: RefreshTokenRequest, db: Session = Depends(get_db)):
    """Refresh access token using refresh token"""
    # Verify refresh token
    refresh_token_obj = verify_refresh_token(refresh_request.refresh_token, db)
    
    # Get user
    user = db.query(User).filter(User.id == refresh_token_obj.user_id).first()
    if not user or not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or inactive"
        )
    
    # Revoke old refresh token
    revoke_refresh_token(refresh_request.refresh_token, db)
    
    # Create new tokens
    access_token = create_access_token({"sub": user.email})
    new_refresh_token = create_refresh_token(user.id, db)
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=new_refresh_token,
        expires_in=settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    )

@router.post("/logout", response_model=LogoutResponse)
def logout(
    refresh_request: RefreshTokenRequest,
    db: Session = Depends(get_db)
):
    """Logout user by revoking refresh token"""
    revoke_refresh_token(refresh_request.refresh_token, db)
    return LogoutResponse()

@router.post("/logout-all", response_model=LogoutResponse)
def logout_all_devices(
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Logout user from all devices by revoking all refresh tokens"""
    revoke_all_user_tokens(current_user.id, db)
    return LogoutResponse(message="Successfully logged out from all devices")

@router.get("/me", response_model=UserResponse)
def get_current_user_info(
    current_user: User = Depends(get_current_user_dependency)
):
    """Get current user information"""
    return UserResponse.from_orm(current_user)

@router.post("/revoke-token")
def revoke_specific_token(
    refresh_request: RefreshTokenRequest,
    current_user: User = Depends(get_current_user_dependency),
    db: Session = Depends(get_db)
):
    """Revoke a specific refresh token (for security)"""
    # Verify the token belongs to the current user
    refresh_token_obj = db.query(RefreshToken).filter(
        RefreshToken.token == refresh_request.refresh_token,
        RefreshToken.user_id == current_user.id
    ).first()
    
    if not refresh_token_obj:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Token not found"
        )
    
    revoke_refresh_token(refresh_request.refresh_token, db)
    return {"message": "Token revoked successfully"}
