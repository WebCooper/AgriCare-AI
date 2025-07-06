from typing import List, Optional
from app.db.models import Conversation, Message
from sqlalchemy.orm import Session

def generate_crop_disease_response(disease, crop, model, conversation_history: Optional[List[dict]] = None):
    if conversation_history:
        # Build conversation context from history
        context = f"Previous conversation about {disease} in {crop}:\n"
        for msg in conversation_history:
            context += f"{msg['role']}: {msg['content']}\n"
        
        prompt = f"""
{context}

Continue the conversation about {disease} in {crop}. The user is asking a follow-up question.
Please provide a helpful, supportive response that builds on the previous conversation.
Keep the tone clear, supportive, and practical for a rural farmer.
"""
    else:
        prompt = f"""
You are an agriculture expert chatbot helping a rural farmer.
The AI system has detected "{disease}" in their "{crop}" plant.

Please give a detailed but simple response in 5 parts:
1. What the disease is (simple explanation)
2. How to recognize symptoms (visually)
3. Organic and chemical treatments
4. Preventive actions for future
5. Friendly message in local context (short)

Keep the tone clear, supportive, and practical.
"""
    
    response = model.generate_content(prompt)
    return response.text

def generate_general_chat_response(message: str, model, conversation_history: Optional[List[dict]] = None):
    if conversation_history:
        # Build conversation context from history
        context = "Previous conversation:\n"
        for msg in conversation_history:
            context += f"{msg['role']}: {msg['content']}\n"
        
        prompt = f"""
{context}

User: {message}

You are an agriculture expert chatbot helping rural farmers. Continue the conversation naturally and helpfully.
Provide practical, supportive advice related to farming, crops, weather, or any agricultural concerns.
Keep responses clear, friendly, and actionable for rural farmers.
"""
    else:
        prompt = f"""
You are an agriculture expert chatbot helping rural farmers.

User: {message}

Provide practical, supportive advice related to farming, crops, weather, or any agricultural concerns.
Keep responses clear, friendly, and actionable for rural farmers.
"""
    
    response = model.generate_content(prompt)
    return response.text

def get_conversation_history(db: Session, conversation_id: int) -> List[dict]:
    """Get conversation history as a list of message dictionaries"""
    conversation = db.query(Conversation).filter(Conversation.id == conversation_id).first()
    if not conversation:
        return []
    
    messages = db.query(Message).filter(Message.conversation_id == conversation_id).order_by(Message.created_at).all()
    return [{"role": msg.role, "content": msg.content} for msg in messages]

def create_conversation(db: Session, user_id: int, conversation_type: str, crop: Optional[str] = None, disease: Optional[str] = None) -> Conversation:
    """Create a new conversation"""
    conversation = Conversation(
        user_id=user_id,
        conversation_type=conversation_type,
        crop=crop,
        disease=disease
    )
    db.add(conversation)
    db.commit()
    db.refresh(conversation)
    return conversation

def add_message_to_conversation(db: Session, conversation_id: int, role: str, content: str) -> Message:
    """Add a message to a conversation"""
    message = Message(
        conversation_id=conversation_id,
        role=role,
        content=content
    )
    db.add(message)
    db.commit()
    db.refresh(message)
    return message