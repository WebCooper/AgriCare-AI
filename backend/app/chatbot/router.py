import google.generativeai as genai
from app.core.config import get_settings
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.auth.middleware import get_db
from app.auth.middleware import get_current_user_dependency as get_current_user
from app.db.models import User, Conversation, Message
from .utils import (
    generate_crop_disease_response, 
    generate_general_chat_response,
    get_conversation_history,
    create_conversation,
    add_message_to_conversation
)
from . import schemas

settings = get_settings()

GENAI_API_KEY = settings.GENAI_API_KEY
genai.configure(api_key=GENAI_API_KEY)
model = genai.GenerativeModel("gemini-1.5-flash")

router = APIRouter()

@router.post("/chat", response_model=schemas.ChatResponse)
async def chat_with_bot(
    request: schemas.ChatRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """General chat endpoint with conversation memory"""
    
    # Get conversation history if conversation_id is provided
    conversation_history = []
    conversation_id = request.conversation_id
    
    if conversation_id:
        # Verify conversation belongs to user
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
            Conversation.conversation_type == "general"
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        conversation_history = get_conversation_history(db, conversation_id)
        # Enforce max 5 messages per conversation
        if len(conversation_history) >= 5:
            raise HTTPException(status_code=400, detail="Maximum number of messages (5) reached for this conversation.")
    else:
        # Create new conversation
        conversation = create_conversation(db, current_user.id, "general")
        conversation_id = conversation.id
    
    # Generate response
    response = generate_general_chat_response(request.message, model, conversation_history)
    
    # Save user message and bot response
    add_message_to_conversation(db, conversation_id, "user", request.message)
    add_message_to_conversation(db, conversation_id, "assistant", response)
    
    return schemas.ChatResponse(response=response, conversation_id=conversation_id)

@router.post("/chat/prediction", response_model=schemas.PredictionResponse)
async def chat_prediction(
    request: schemas.PredictionRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Prediction chat endpoint with conversation memory"""
    
    conversation_history = []
    conversation_id = request.conversation_id
    
    if conversation_id:
        # Verify conversation belongs to user and is a prediction conversation
        conversation = db.query(Conversation).filter(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
            Conversation.conversation_type == "prediction",
            Conversation.crop == request.crop,
            Conversation.disease == request.disease
        ).first()
        
        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")
        
        conversation_history = get_conversation_history(db, conversation_id)
        # Enforce max 5 messages per conversation
        if len(conversation_history) >= 5:
            raise HTTPException(status_code=400, detail="Maximum number of messages (5) reached for this conversation.")
    else:
        # Create new prediction conversation
        conversation = create_conversation(
            db, 
            current_user.id, 
            "prediction", 
            crop=request.crop, 
            disease=request.disease
        )
        conversation_id = conversation.id
    
    # Generate response
    if request.follow_up_message:
        # This is a follow-up question
        response = generate_crop_disease_response(
            request.disease, 
            request.crop, 
            model, 
            conversation_history
        )
        # Save the follow-up message
        add_message_to_conversation(db, conversation_id, "user", request.follow_up_message)
    else:
        # This is the initial prediction
        response = generate_crop_disease_response(request.disease, request.crop, model)
        # Save the initial query
        add_message_to_conversation(db, conversation_id, "user", f"Detected {request.disease} in {request.crop}")
    
    # Save bot response
    add_message_to_conversation(db, conversation_id, "assistant", response)
    
    return schemas.PredictionResponse(response=response, conversation_id=conversation_id)

@router.get("/conversations", response_model=list[schemas.ConversationResponse])
async def get_user_conversations(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get all conversations for the current user"""
    conversations = db.query(Conversation).filter(
        Conversation.user_id == current_user.id
    ).order_by(Conversation.updated_at.desc()).all()
    
    result = []
    for conv in conversations:
        messages = db.query(Message).filter(Message.conversation_id == conv.id).order_by(Message.created_at).all()
        chat_messages = [
            schemas.ChatMessage(
                role=msg.role,
                content=msg.content,
                created_at=msg.created_at
            ) for msg in messages
        ]
        
        result.append(schemas.ConversationResponse(
            id=conv.id,
            conversation_type=conv.conversation_type,
            crop=conv.crop,
            disease=conv.disease,
            created_at=conv.created_at,
            updated_at=conv.updated_at,
            messages=chat_messages
        ))
    
    return result

@router.get("/conversations/{conversation_id}", response_model=schemas.ConversationResponse)
async def get_conversation(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get a specific conversation with all its messages"""
    conversation = db.query(Conversation).filter(
        Conversation.id == conversation_id,
        Conversation.user_id == current_user.id
    ).first()
    
    if not conversation:
        raise HTTPException(status_code=404, detail="Conversation not found")
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    chat_messages = [
        schemas.ChatMessage(
            role=msg.role,
            content=msg.content,
            created_at=msg.created_at
        ) for msg in messages
    ]
    
    return schemas.ConversationResponse(
        id=conversation.id,
        conversation_type=conversation.conversation_type,
        crop=conversation.crop,
        disease=conversation.disease,
        created_at=conversation.created_at,
        updated_at=conversation.updated_at,
        messages=chat_messages
    )