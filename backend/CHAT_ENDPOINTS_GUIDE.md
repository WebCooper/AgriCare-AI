# Chat Endpoints Guide - Conversation Memory System

This guide explains how to use the new chat endpoints that support conversation memory for continuous interactions.

## Overview

The system now supports two types of conversations:
1. **General Chat** (`/chatbot/chat`) - For general farming questions and advice
2. **Prediction Chat** (`/chatbot/chat/prediction`) - For disease-specific conversations

**Limits:**
- Each chatbot response is limited to a single paragraph (max 3 sentences).
- Each conversation can have a maximum of 5 messages (user+assistant combined). Once this limit is reached, no further messages can be sent in that conversation.

Both endpoints maintain conversation history and allow users to continue conversations naturally, within these limits.

## Authentication

All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer your_jwt_token_here
```

## 1. General Chat Endpoint

**URL:** `POST /chatbot/chat`

### Starting a New Conversation

```json
{
  "message": "Hello! I'm a farmer and I need help with my crops."
}
```

**Response:**
```json
{
  "response": "Hello! I'm here to help you with your farming needs...",
  "conversation_id": 123
}
```

### Continuing a Conversation

```json
{
  "message": "What are the best practices for organic farming?",
  "conversation_id": 123
}
```

**Response:**
```json
{
  "response": "Great question! For organic farming, here are some key practices...",
  "conversation_id": 123
}
```

**Limits:**
- Each conversation can have a maximum of 5 messages (user+assistant combined). If you try to send a message after this limit, you will receive a 400 error.
- Each response will be a single paragraph (max 3 sentences).

### Example Conversation Flow

1. **First message** (no conversation_id) → Creates new conversation
2. **Second message** (with conversation_id) → Continues same conversation
3. **Third message** (with same conversation_id) → Continues conversation with context

## 2. Prediction Chat Endpoint

**URL:** `POST /chatbot/chat/prediction`

### Initial Disease Prediction

```json
{
  "crop": "tomato",
  "disease": "blight"
}
```

**Response:**
```json
{
  "response": "I've detected blight in your tomato plants. Here's what you need to know...",
  "conversation_id": 124
}
```

### Follow-up Questions

```json
{
  "crop": "tomato",
  "disease": "blight",
  "conversation_id": 124,
  "follow_up_message": "What are the early symptoms I should look for?"
}
```

**Response:**
```json
{
  "response": "Early symptoms of tomato blight include...",
  "conversation_id": 124
}
```

**Limits:**
- Each conversation can have a maximum of 5 messages (user+assistant combined). If you try to send a message after this limit, you will receive a 400 error.
- Each response will be a single paragraph (max 3 sentences).

### Example Prediction Conversation Flow

1. **Initial prediction** (crop + disease) → Creates new prediction conversation
2. **Follow-up question** (with conversation_id + follow_up_message) → Continues disease-specific conversation
3. **More questions** (same conversation_id) → Maintains context about the specific disease (up to 5 messages total)

## 3. Conversation Management Endpoints

### Get All Conversations

**URL:** `GET /chatbot/conversations`

**Response:**
```json
[
  {
    "id": 123,
    "conversation_type": "general",
    "crop": null,
    "disease": null,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:35:00Z",
    "messages": [
      {
        "role": "user",
        "content": "Hello! I'm a farmer...",
        "created_at": "2024-01-15T10:30:00Z"
      },
      {
        "role": "assistant",
        "content": "Hello! I'm here to help...",
        "created_at": "2024-01-15T10:30:01Z"
      }
    ]
  },
  {
    "id": 124,
    "conversation_type": "prediction",
    "crop": "tomato",
    "disease": "blight",
    "created_at": "2024-01-15T11:00:00Z",
    "updated_at": "2024-01-15T11:05:00Z",
    "messages": [...]
  }
]
```

### Get Specific Conversation

**URL:** `GET /chatbot/conversations/{conversation_id}`

**Response:** Same format as above, but for a specific conversation.

## Key Features

### 1. Conversation Memory
- Each conversation maintains a complete history of all messages (up to 5 messages per conversation)
- The AI remembers previous context and can refer back to earlier parts of the conversation
- Conversations are tied to specific users

### 2. Two Conversation Types
- **General**: For farming advice, weather questions, crop management, etc.
- **Prediction**: Specifically for disease-related conversations with crop and disease context

### 3. Automatic Context Building
- The AI automatically includes relevant conversation history in its responses (up to the 5-message limit)
- No need to manually manage context - the system handles it automatically

### 4. User-Specific Conversations
- Each user can have multiple conversations
- Conversations are isolated per user
- Users can only access their own conversations

### 5. Response and Message Limits
- Each chatbot response is limited to a single paragraph (max 3 sentences)
- Each conversation can have a maximum of 5 messages (user+assistant combined)

## Usage Examples

### Example 1: General Farming Advice

```bash
# Start conversation
curl -X POST "http://localhost:8000/chatbot/chat" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"message": "I want to start organic farming"}'

# Continue conversation
curl -X POST "http://localhost:8000/chatbot/chat" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"message": "What crops are best for beginners?", "conversation_id": 123}'
```

### Example 2: Disease-Specific Help

```bash
# Initial disease detection
curl -X POST "http://localhost:8000/chatbot/chat/prediction" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"crop": "tomato", "disease": "blight"}'

# Follow-up question
curl -X POST "http://localhost:8000/chatbot/chat/prediction" \
  -H "Authorization: Bearer your_token" \
  -H "Content-Type: application/json" \
  -d '{"crop": "tomato", "disease": "blight", "conversation_id": 124, "follow_up_message": "How quickly does this spread?"}'
```

## Error Handling

### Common Error Responses

**401 Unauthorized:**
```json
{"detail": "Not authenticated"}
```

**404 Not Found:**
```json
{"detail": "Conversation not found"}
```

**400 Bad Request (Message Limit Exceeded):**
```json
{"detail": "Maximum number of messages (5) reached for this conversation."}
```

**422 Validation Error:**
```json
{"detail": "Validation error - missing required fields"}
```

## Best Practices

1. **Always store the conversation_id** returned from the first response
2. **Use the same conversation_id** for follow-up questions in the same conversation
3. **Don't mix conversation types** - use prediction endpoint for disease-specific questions
4. **Handle errors gracefully** - check for 404 when conversation_id is invalid
5. **Keep conversations focused** - start new conversations for different topics
6. **Be aware of the 5-message limit per conversation and the single-paragraph response limit**

## Testing

Use the provided `test_chat_endpoints.py` script to test the endpoints:

1. Start your server: `uvicorn app.main:app --reload`
2. Get a JWT token by logging in
3. Update the TOKEN variable in the test script
4. Run the test functions to see conversation memory in action 