import requests
import json

# Base URL for the API
BASE_URL = "http://localhost:8000"

# You'll need to get a valid token by logging in first
# This is a placeholder - replace with actual token from login
TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwiZXhwIjoxNzUxODA5MDEzLCJ0eXBlIjoiYWNjZXNzIn0.xNsCSk2iWk8oS_euR9Je61dI31Rqy5As_oxQwbBJGq0"

headers = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json"
}

def test_general_chat():
    """Test the general chat endpoint with conversation memory"""
    print("=== Testing General Chat Endpoint ===")
    
    # First message - starts new conversation
    print("\n1. First message (new conversation):")
    response = requests.post(
        f"{BASE_URL}/chatbot/chat",
        headers=headers,
        json={
            "message": "Hello! I'm a farmer and I need help with my crops."
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        conversation_id = data["conversation_id"]
        print(f"Response: {data['response']}")
        print(f"Conversation ID: {conversation_id}")
        
        # Second message - continues the same conversation
        print("\n2. Second message (continuing conversation):")
        response2 = requests.post(
            f"{BASE_URL}/chatbot/chat",
            headers=headers,
            json={
                "message": "What are the best practices for organic farming?",
                "conversation_id": conversation_id
            }
        )
        
        if response2.status_code == 200:
            data2 = response2.json()
            print(f"Response: {data2['response']}")
            print(f"Conversation ID: {data2['conversation_id']}")
            
            # Third message - still continuing the same conversation
            print("\n3. Third message (continuing conversation):")
            response3 = requests.post(
                f"{BASE_URL}/chatbot/chat",
                headers=headers,
                json={
                    "message": "How can I improve soil fertility naturally?",
                    "conversation_id": conversation_id
                }
            )
            
            if response3.status_code == 200:
                data3 = response3.json()
                print(f"Response: {data3['response']}")
                print(f"Conversation ID: {data3['conversation_id']}")
            else:
                print(f"Error: {response3.status_code} - {response3.text}")
        else:
            print(f"Error: {response2.status_code} - {response2.text}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def test_prediction_chat():
    """Test the prediction chat endpoint with conversation memory"""
    print("\n=== Testing Prediction Chat Endpoint ===")
    
    # Initial prediction
    print("\n1. Initial prediction (new conversation):")
    response = requests.post(
        f"{BASE_URL}/chatbot/chat/prediction",
        headers=headers,
        json={
            "crop": "tomato",
            "disease": "blight"
        }
    )
    
    if response.status_code == 200:
        data = response.json()
        conversation_id = data["conversation_id"]
        print(f"Response: {data['response']}")
        print(f"Conversation ID: {conversation_id}")
        
        # Follow-up question about the same disease
        print("\n2. Follow-up question (continuing conversation):")
        response2 = requests.post(
            f"{BASE_URL}/chatbot/chat/prediction",
            headers=headers,
            json={
                "crop": "tomato",
                "disease": "blight",
                "conversation_id": conversation_id,
                "follow_up_message": "What are the early symptoms I should look for?"
            }
        )
        
        if response2.status_code == 200:
            data2 = response2.json()
            print(f"Response: {data2['response']}")
            print(f"Conversation ID: {data2['conversation_id']}")
            
            # Another follow-up question
            print("\n3. Another follow-up question (continuing conversation):")
            response3 = requests.post(
                f"{BASE_URL}/chatbot/chat/prediction",
                headers=headers,
                json={
                    "crop": "tomato",
                    "disease": "blight",
                    "conversation_id": conversation_id,
                    "follow_up_message": "Can you recommend some organic treatments?"
                }
            )
            
            if response3.status_code == 200:
                data3 = response3.json()
                print(f"Response: {data3['response']}")
                print(f"Conversation ID: {data3['conversation_id']}")
            else:
                print(f"Error: {response3.status_code} - {response3.text}")
        else:
            print(f"Error: {response2.status_code} - {response2.text}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

def get_conversations():
    """Get all conversations for the user"""
    print("\n=== Getting All Conversations ===")
    response = requests.get(f"{BASE_URL}/chatbot/conversations", headers=headers)
    
    if response.status_code == 200:
        conversations = response.json()
        print(f"Found {len(conversations)} conversations:")
        for conv in conversations:
            print(f"- ID: {conv['id']}, Type: {conv['conversation_type']}, Messages: {len(conv['messages'])}")
            if conv['crop'] and conv['disease']:
                print(f"  Crop: {conv['crop']}, Disease: {conv['disease']}")
    else:
        print(f"Error: {response.status_code} - {response.text}")

if __name__ == "__main__":
    print("Chat Endpoint Testing Guide")
    print("=" * 50)
    print("Before running this script:")
    print("1. Start your FastAPI server: uvicorn app.main:app --reload")
    print("2. Register/login to get a JWT token")
    print("3. Replace 'your_jwt_token_here' with your actual token")
    print("4. Make sure your database is running and migrations are applied")
    print("\n" + "=" * 50)
    
    # Uncomment the functions you want to test
    test_general_chat()
    test_prediction_chat()
    get_conversations() 