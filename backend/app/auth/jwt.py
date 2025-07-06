import secrets
from jose import jwt, JWTError
from datetime import datetime, timedelta
from typing import Optional, Union
from fastapi import HTTPException, status
from sqlalchemy.orm import Session
from app.core.config import get_settings
from app.db.models import User, RefreshToken

settings = get_settings()

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create an access token with the given data"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    return jwt.encode(to_encode, settings.JWT_SECRET_KEY, algorithm=settings.JWT_ALGORITHM)

def create_refresh_token(user_id: int, db: Session) -> str:
    """Create a refresh token and store it in the database"""
    # Generate a unique refresh token
    token = secrets.token_urlsafe(32)
    expires_at = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    # Clean up old refresh tokens for this user
    cleanup_old_refresh_tokens(user_id, db)
    
    # Create new refresh token
    refresh_token = RefreshToken(
        token=token,
        user_id=user_id,
        expires_at=expires_at
    )
    db.add(refresh_token)
    db.commit()
    
    return token

def verify_token(token: str, token_type: str = "access") -> dict:
    """Verify a JWT token and return the payload"""
    try:
        payload = jwt.decode(token, settings.JWT_SECRET_KEY, algorithms=[settings.JWT_ALGORITHM])
        if payload.get("type") != token_type:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type"
            )
        return payload
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

def verify_refresh_token(token: str, db: Session) -> RefreshToken:
    """Verify a refresh token from the database"""
    # Check if token exists and is not revoked
    refresh_token = db.query(RefreshToken).filter(
        RefreshToken.token == token,
        RefreshToken.is_revoked == False,
        RefreshToken.expires_at > datetime.utcnow()
    ).first()
    
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token"
        )
    
    return refresh_token

def revoke_refresh_token(token: str, db: Session) -> bool:
    """Revoke a refresh token"""
    refresh_token = db.query(RefreshToken).filter(RefreshToken.token == token).first()
    if refresh_token:
        refresh_token.is_revoked = True
        db.commit()
        return True
    return False

def revoke_all_user_tokens(user_id: int, db: Session) -> None:
    """Revoke all refresh tokens for a user"""
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.is_revoked == False
    ).update({"is_revoked": True})
    db.commit()

def cleanup_old_refresh_tokens(user_id: int, db: Session) -> None:
    """Clean up expired and old refresh tokens for a user"""
    # Remove expired tokens
    db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.expires_at < datetime.utcnow()
    ).delete()
    
    # If user has too many active tokens, remove the oldest ones
    active_tokens = db.query(RefreshToken).filter(
        RefreshToken.user_id == user_id,
        RefreshToken.is_revoked == False,
        RefreshToken.expires_at > datetime.utcnow()
    ).order_by(RefreshToken.created_at.desc()).all()
    
    if len(active_tokens) >= settings.MAX_REFRESH_TOKENS_PER_USER:
        tokens_to_remove = active_tokens[settings.MAX_REFRESH_TOKENS_PER_USER - 1:]
        for token in tokens_to_remove:
            db.delete(token)
    
    db.commit()

def get_current_user(token: str, db: Session) -> User:
    """Get the current user from the access token"""
    payload = verify_token(token, "access")
    email: str = payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )
    
    user = db.query(User).filter(User.email == email).first()
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Inactive user"
        )
    
    return user
