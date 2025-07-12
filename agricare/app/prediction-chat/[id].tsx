import { useLocalSearchParams, useRouter } from 'expo-router';
import { useRef, useState, useEffect } from 'react';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Text, 
  View, 
  ActivityIndicator, 
  Alert,
  TouchableOpacity,
  Image,
} from 'react-native';
import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import { startPredictionChat, sendPredictionChatFollowUp } from '@/services/predictionService';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUri?: string;
}

interface SavedConversation {
  id: number;
  crop: string;
  disease: string;
  messages: Message[];
  lastUpdated: string;
  imageUri?: string;
}

export default function PredictionChatScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    crop: string;
    disease: string;
    id: string;
    imageUri?: string;
  }>();
  const { crop, disease, imageUri } = params;
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(undefined);
  const [messageCount, setMessageCount] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  // Save conversation whenever messages change
  useEffect(() => {
    if (currentConversationId && messages.length > 0) {
      saveConversation();
    }
  }, [messages, currentConversationId]);

  // Start prediction chat when screen loads
  useEffect(() => {
    if (crop && disease) {
      startInitialChat();
    }
  }, [crop, disease]);

  const saveConversation = async () => {
    try {
      if (!currentConversationId) return;

      const conversation: SavedConversation = {
        id: currentConversationId,
        crop: crop as string,
        disease: disease as string,
        messages,
        lastUpdated: new Date().toISOString(),
        imageUri
      };

      // Get existing conversations
      const existingData = await AsyncStorage.getItem('prediction_conversations');
      let conversations: SavedConversation[] = existingData ? JSON.parse(existingData) : [];

      // Update or add new conversation
      const existingIndex = conversations.findIndex(c => c.id === currentConversationId);
      if (existingIndex !== -1) {
        conversations[existingIndex] = conversation;
      } else {
        conversations.push(conversation);
      }

      // Keep only the last 10 conversations
      conversations = conversations
        .sort((a, b) => new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime())
        .slice(0, 10);

      await AsyncStorage.setItem('prediction_conversations', JSON.stringify(conversations));
    } catch (error) {
      console.error('Error saving conversation:', error);
    }
  };

  const startInitialChat = async () => {
    try {
      setIsLoading(true);
      
      // Add user's initial question
      const formattedDisease = disease.replace(/_/g, ' ').toLowerCase();
      const initialUserMessage: Message = {
        id: Date.now().toString(),
        text: `I found signs of ${formattedDisease} in my ${crop} plant. Can you help me understand more about this disease and how to treat it?`,
        sender: 'user',
        timestamp: new Date(),
        imageUri: imageUri,
      };
      
      // Format message for storage compatibility
      const formattedMessage = {
        ...initialUserMessage,
        timestamp: new Date()
      };
      
      setMessages([formattedMessage]);
      setMessageCount(1);

      // Get initial response from AI
      const response = await startPredictionChat(crop as string, disease as string);
      setCurrentConversationId(response.conversation_id);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setMessageCount(2);
      
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Error starting prediction chat:', error);
      Alert.alert('Error', 'Failed to start chat about this disease. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSend = async (message: string) => {
    if (messageCount >= 5) {
      Alert.alert(
        'Message Limit Reached',
        'You have reached the maximum messages for this conversation.'
      );
      return;
    }

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: message,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setMessageCount(prev => prev + 1);
      setIsLoading(true);
      
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

      // Send follow-up question
      const response = await sendPredictionChatFollowUp(
        crop as string,
        disease as string,
        message,
        currentConversationId!
      );

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setMessageCount(prev => prev + 1);
      
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View className="bg-white border-b border-gray-200">
        {/* Back button and title */}
        <View className="flex-row items-center px-4 py-2">
          <TouchableOpacity 
            onPress={() => router.back()}
            className="mr-3"
          >
            <Ionicons name="arrow-back" size={24} color="#4b5563" />
          </TouchableOpacity>
          <View>
            <Text className="text-lg font-bold text-gray-800">Disease Analysis</Text>
            <Text className="text-sm text-gray-600 capitalize">
              {crop} - {disease?.replace(/_/g, ' ').toLowerCase()}
            </Text>
          </View>
        </View>
        
        {/* Message counter */}
        {currentConversationId && (
          <View className="px-4 pb-2">
            <Text className="text-xs text-gray-500">
              Messages: {messageCount}/5
            </Text>
          </View>
        )}
      </View>

      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Chat messages */}
        {messages.map(msg => (
          <View key={msg.id} className="mb-4">
            {msg.imageUri && msg.sender === 'user' && (
              <View className="ml-auto mb-2 mr-2">
                <Image 
                  source={{ uri: msg.imageUri }} 
                  className="w-48 h-48 rounded-lg"
                  resizeMode="cover"
                />
              </View>
            )}
            <ChatMessage 
              message={msg.text} 
              sender={msg.sender}
              timestamp={msg.timestamp}
            />
          </View>
        ))}
        
        {/* Loading indicator */}
        {isLoading && (
          <View className="flex-row items-center mt-2 ml-2 mb-4">
            <View className="bg-green-50 p-3 rounded-2xl">
              <ActivityIndicator size="small" color="#10b981" />
            </View>
            <Text className="text-gray-600 text-sm ml-2 font-medium">
              AgriCare is thinking...
            </Text>
          </View>
        )}
      </ScrollView>
      
      <ChatInput 
        onSend={handleSend} 
        isLoading={isLoading} 
        disabled={messageCount >= 5} 
        placeholder={messageCount >= 5 ? "Message limit reached" : "Ask follow-up questions..."}
      />
    </KeyboardAvoidingView>
  );
}
