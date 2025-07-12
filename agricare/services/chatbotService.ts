import api from '../config/axios';

// Types for the chat service
import AsyncStorage from '@react-native-async-storage/async-storage';

const CHATS_STORAGE_KEY = 'agricare_chats';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ChatRequest {
  message: string;
  conversation_id?: number;
}

interface PredictionChatRequest {
  crop: string;
  disease: string;
  conversation_id?: number;
  follow_up_message?: string;
}

interface ChatResponse {
  response: string;
  conversation_id: number;
}

interface Conversation {
  id: number;
  conversation_type: 'general' | 'prediction';
  crop?: string;
  disease?: string;
  created_at: string;
  updated_at: string;
  messages: ChatMessage[];
}

// Local storage functions
const saveConversationToStorage = async (conversation: Conversation) => {
  try {
    const existingChats = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
    const chats: Conversation[] = existingChats ? JSON.parse(existingChats) : [];
    
    // Update if exists, otherwise add new
    const index = chats.findIndex(c => c.id === conversation.id);
    if (index !== -1) {
      chats[index] = conversation;
    } else {
      chats.unshift(conversation); // Add to beginning
    }
    
    // Keep only last 20 conversations
    const limitedChats = chats.slice(0, 20);
    await AsyncStorage.setItem(CHATS_STORAGE_KEY, JSON.stringify(limitedChats));
  } catch (error) {
    console.error('Error saving chat to storage:', error);
  }
};

const getConversationsFromStorage = async (): Promise<Conversation[]> => {
  try {
    const chats = await AsyncStorage.getItem(CHATS_STORAGE_KEY);
    return chats ? JSON.parse(chats) : [];
  } catch (error) {
    console.error('Error getting chats from storage:', error);
    return [];
  }
};

/**
 * ChatbotService provides methods to interact with the chatbot API
 * Currently implements the general chat functionality
 */
const chatbotService = {
  /**
   * Send a general chat message to the AI assistant
   * Each conversation is limited to 5 messages (user+assistant combined)
   * Each response is limited to a single paragraph (max 3 sentences)
   */
  sendMessage: async (message: string, conversationId?: number): Promise<ChatResponse> => {
    try {
      const payload: ChatRequest = {
        message,
        ...(conversationId && { conversation_id: conversationId }),
      };

      const response = await api.post<ChatResponse>('/chatbot/chat', payload);
      
      // Create or update conversation in storage
      const newMessage: ChatMessage = {
        role: 'user',
        content: message,
        created_at: new Date().toISOString(),
      };
      
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString(),
      };

      const conversation: Conversation = {
        id: response.data.conversation_id,
        conversation_type: 'general',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: conversationId 
          ? [...(await chatbotService.getConversation(conversationId)).messages, newMessage, botMessage]
          : [newMessage, botMessage],
      };

      await saveConversationToStorage(conversation);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.detail?.includes('Maximum number of messages')) {
        throw new Error('Message limit reached for this conversation (max 5 messages). Please start a new conversation.');
      }
      console.error('Chat error:', error);
      throw error;
    }
  },

  /**
   * Send a prediction-specific message
   */
  sendPredictionMessage: async (
    crop: string,
    disease: string,
    followUpMessage?: string,
    conversationId?: number
  ): Promise<ChatResponse> => {
    try {
      const payload: PredictionChatRequest = {
        crop,
        disease,
        ...(followUpMessage && { follow_up_message: followUpMessage }),
        ...(conversationId && { conversation_id: conversationId }),
      };

      const response = await api.post<ChatResponse>('/chatbot/chat/prediction', payload);
      
      // Create or update conversation in storage
      const newMessage: ChatMessage = {
        role: 'user',
        content: followUpMessage || `What can you tell me about ${disease} in ${crop}?`,
        created_at: new Date().toISOString(),
      };
      
      const botMessage: ChatMessage = {
        role: 'assistant',
        content: response.data.response,
        created_at: new Date().toISOString(),
      };

      const conversation: Conversation = {
        id: response.data.conversation_id,
        conversation_type: 'prediction',
        crop,
        disease,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: conversationId 
          ? [...(await chatbotService.getConversation(conversationId)).messages, newMessage, botMessage]
          : [newMessage, botMessage],
      };

      await saveConversationToStorage(conversation);
      return response.data;
    } catch (error) {
      console.error('Prediction chat error:', error);
      throw error;
    }
  },

  /**
   * Get all conversations from local storage
   */
  getConversations: async (): Promise<Conversation[]> => {
    return getConversationsFromStorage();
  },

  /**
   * Get a specific conversation from local storage
   */
  getConversation: async (conversationId: number): Promise<Conversation> => {
    const conversations = await getConversationsFromStorage();
    const conversation = conversations.find(c => c.id === conversationId);
    if (!conversation) {
      throw new Error('Conversation not found');
    }
    return conversation;
  },
};

export default chatbotService;
