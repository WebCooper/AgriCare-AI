import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string | Date;
  imageUri?: string;
}

export interface LocalSavedPredictionConversation {
  id: number;
  crop: string;
  disease: string;
  messages: ChatMessage[];
  lastUpdated: string;
  imageUri?: string;
}

export interface LocalSavedGeneralConversation {
  id: number;
  messages: ChatMessage[];
  lastUpdated: string;
}

const CHATS_STORAGE_KEY = 'agricare_chats';
const PREDICTION_STORAGE_KEY = 'prediction_conversations';

export const getAllConversations = async () => {
  try {
    // Get both prediction and general conversations from local storage
    const [predictionData, generalChatData] = await Promise.all([
      AsyncStorage.getItem(PREDICTION_STORAGE_KEY),
      AsyncStorage.getItem(CHATS_STORAGE_KEY)
    ]);

    const predictionConversations: LocalSavedPredictionConversation[] = predictionData ? JSON.parse(predictionData) : [];
    const generalConversations = generalChatData ? JSON.parse(generalChatData) : [];

    // Helper function to format dates safely
    const formatDate = (date: string | Date | undefined) => {
      if (!date) return new Date().toISOString();
      try {
        return new Date(date).toISOString();
      } catch {
        return new Date().toISOString();
      }
    };

    // Convert prediction conversations to display format
    const formattedPredictionConversations = predictionConversations.map(conv => ({
      id: conv.id,
      conversation_type: 'prediction' as const,
      crop: conv.crop,
      disease: conv.disease,
      created_at: formatDate(conv.messages[0]?.timestamp || conv.lastUpdated),
      updated_at: formatDate(conv.lastUpdated),
      imageUrl: conv.imageUri,
      messages: conv.messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.text,
        created_at: formatDate(msg.timestamp)
      }))
    }));

    // General conversations are already in the correct format
    const formattedGeneralConversations = (generalConversations as any[])
      .filter(conv => conv.conversation_type === 'general')
      .map(conv => ({
        id: conv.id,
        conversation_type: 'general' as const,
        crop: null,
        disease: null,
        created_at: conv.created_at,
        updated_at: conv.updated_at,
        messages: conv.messages
      }));

    return [...formattedPredictionConversations, ...formattedGeneralConversations];
  } catch (error) {
    console.error('Error getting all conversations:', error);
    throw error;
  }
};
