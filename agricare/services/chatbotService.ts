import api from '../config/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for chat requests and responses
interface ChatRequest {
  message: string;
  conversation_id?: number;
}

interface ChatResponse {
  response: string;
  conversation_id: number;
}

interface PredictionChatRequest {
  crop: string;
  disease: string;
  conversation_id?: number;
  follow_up_message?: string;
}

interface Conversation {
  id: number;
  conversation_type: 'general' | 'prediction';
  crop: string | null;
  disease: string | null;
  created_at: string;
  updated_at: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }[];
}

// Chatbot service functions
const chatbotService = {
  /**
   * Send a general chat message to the AI assistant
   * @param message The user message to send
   * @param conversationId Optional conversation ID for continuing conversations
   * @returns Promise with chat response data
   */
  sendMessage: async (message: string, conversationId?: number): Promise<ChatResponse> => {
    try {
      const payload: ChatRequest = {
        message,
        ...(conversationId && { conversation_id: conversationId }),
      };

      const response = await api.post<ChatResponse>('/chatbot/chat', payload);
      return response.data;
    } catch (error) {
      console.error('Chat error:', error);
      throw error;
    }
  },

  /**
   * Send a prediction-specific message with crop and disease information
   * @param crop The crop type
   * @param disease The disease name
   * @param followUpMessage Optional follow-up question
   * @param conversationId Optional conversation ID for continuing conversations
   * @returns Promise with chat response data
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
      return response.data;
    } catch (error) {
      console.error('Prediction chat error:', error);
      throw error;
    }
  },

  /**
   * Get all conversations for the current user
   * @returns Promise with array of conversations
   */
  getConversations: async (): Promise<Conversation[]> => {
    try {
      const response = await api.get<Conversation[]>('/chatbot/conversations');
      return response.data;
    } catch (error) {
      console.error('Get conversations error:', error);
      throw error;
    }
  },

  /**
   * Get a specific conversation by ID
   * @param conversationId The conversation ID
   * @returns Promise with conversation data
   */
  getConversation: async (conversationId: number): Promise<Conversation> => {
    try {
      const response = await api.get<Conversation>(`/chatbot/conversations/${conversationId}`);
      return response.data;
    } catch (error) {
      console.error('Get conversation error:', error);
      throw error;
    }
  },
};

export default chatbotService;
