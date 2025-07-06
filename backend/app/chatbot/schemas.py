from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class ChatMessage(BaseModel):
    role: str
    content: str
    created_at: datetime

class ConversationResponse(BaseModel):
    id: int
    conversation_type: str
    crop: Optional[str] = None
    disease: Optional[str] = None
    created_at: datetime
    updated_at: datetime
    messages: List[ChatMessage]

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    conversation_id: int

class PredictionRequest(BaseModel):
    crop: str
    disease: str
    conversation_id: Optional[int] = None
    follow_up_message: Optional[str] = None

class PredictionResponse(BaseModel):
    response: str
    conversation_id: int 