import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import chatbotService from '@/services/chatbotService';
import { useRef, useState, useEffect, useCallback } from 'react';
import { 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Text, 
  View, 
  ActivityIndicator, 
  Image, 
  Alert,
  TouchableOpacity,
  RefreshControl
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

interface ChatbotScreenProps {
  route?: {
    params?: {
      predictionChat?: string;
    };
  };
}

export default function ChatbotScreen({ route }: ChatbotScreenProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(undefined);
  const [messageCount, setMessageCount] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [predictionContext, setPredictionContext] = useState<{
    crop: string;
    disease: string;
    conversationId: number;
  } | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  const loadConversation = async (conversationId: number) => {
    try {
      setRefreshing(true);
      const conversation = await chatbotService.getConversation(conversationId);
      
      const formattedMessages: Message[] = conversation.messages.map(msg => ({
        id: `${msg.created_at}-${Math.random()}`,
        text: msg.content,
        sender: msg.role === 'user' ? 'user' : 'bot',
        timestamp: new Date(msg.created_at),
      }));
      
      setMessages(formattedMessages);
      setMessageCount(formattedMessages.length);
    } catch (error) {
      console.error('Failed to load conversation:', error);
      Alert.alert('Error', 'Failed to load conversation. Please try again.');
    } finally {
      setRefreshing(false);
    }
  };

  const loadPreviousConversation = useCallback(async () => {
    try {
      setRefreshing(true);
      const conversations = await chatbotService.getConversations();
      
      if (conversations && conversations.length > 0) {
        const sortedConversations = [...conversations].sort(
          (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
        );
        
        const recentConversation = sortedConversations[0];
        setCurrentConversationId(recentConversation.id);
        
        const formattedMessages: Message[] = recentConversation.messages.map(msg => ({
          id: `${msg.created_at}-${Math.random()}`,
          text: msg.content,
          sender: msg.role === 'user' ? 'user' : 'bot',
          timestamp: new Date(msg.created_at),
        }));
        
        setMessages(formattedMessages);
        setMessageCount(formattedMessages.length);
      }
    } catch (error) {
      console.error('Failed to load previous conversations:', error);
      Alert.alert('Error', 'Failed to load previous conversations. Please try again.');
    } finally {
      setRefreshing(false);
    }
  }, []);
  
  useEffect(() => {
    if (route?.params?.predictionChat) {
      const predictionParams = JSON.parse(route.params.predictionChat);
      setPredictionContext(predictionParams);
      setCurrentConversationId(predictionParams.conversationId);
      loadConversation(predictionParams.conversationId);
    } else {
      loadPreviousConversation();
    }
  }, [route?.params?.predictionChat]);

  const startNewConversation = () => {
    setMessages([]);
    setCurrentConversationId(undefined);
    setMessageCount(0);
  };

  const handleSend = async (userMsg: string) => {
    if (messageCount >= 5) {
      Alert.alert(
        'Message Limit Reached',
        'You have reached the maximum messages for this conversation. Would you like to start a new one?',
        [
          {
            text: 'Start New Chat',
            onPress: startNewConversation,
          },
          {
            text: 'Cancel',
            style: 'cancel',
          },
        ]
      );
      return;
    }

    try {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: userMsg,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setMessageCount(prev => prev + 1);
      setIsLoading(true);
      
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

      let response;
      if (predictionContext) {
        // Send prediction-specific message
        response = await chatbotService.sendPredictionMessage(
          predictionContext.crop,
          predictionContext.disease,
          userMsg,
          currentConversationId
        );
      } else {
        // Send general message
        response = await chatbotService.sendMessage(userMsg, currentConversationId);
      }
      
      setCurrentConversationId(response.conversation_id);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      setMessageCount(prev => prev + 1);
      
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error: any) {
      console.error('Chat error:', error);
      if (error.message?.includes('Message limit reached')) {
        Alert.alert(
          'Message Limit Reached',
          'Would you like to start a new conversation?',
          [
            {
              text: 'Start New Chat',
              onPress: startNewConversation,
            },
            {
              text: 'Cancel',
              style: 'cancel',
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Failed to send message. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 40}
      style={{ flex: 1 }}
    >
      {/* Header */}
      <View className="flex-row justify-between items-center px-4 py-2 bg-white border-b border-gray-200">
        <View>
          <Text className="text-lg font-bold text-gray-800">AgriCare Chat</Text>
          {currentConversationId && (
            <Text className="text-xs text-gray-500">
              Messages: {messageCount}/5
            </Text>
          )}
        </View>
        <View className="flex-row space-x-2">
          <TouchableOpacity
            onPress={startNewConversation}
            className="p-2 rounded-full bg-green-50"
          >
            <Ionicons name="add-outline" size={24} color="#10b981" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={loadPreviousConversation} />
        }
      >
        {/* Welcome message when no messages */}
        {messages.length === 0 && (
          <View className="items-center justify-center py-8">
            <Image 
              source={require('@/assets/images/icon.png')} 
              className="w-32 h-32 mb-6"
              resizeMode="contain"
            />
            <Text className="text-xl font-bold text-center mb-2">
              Welcome to AgriCare Assistant
            </Text>
            <Text className="text-gray-600 text-center px-4 mb-4">
              Ask anything about crop health, pests, remedies in Sinhala, Tamil or English!
            </Text>
            <View className="bg-green-50 p-4 rounded-xl w-full mb-2">
              <Text className="text-gray-700 font-medium mb-2">Try asking:</Text>
              <View className="space-y-2">
                <TouchableOpacity 
                  className="bg-white p-3 rounded-lg border border-green-100"
                  onPress={() => handleSend("What fertilizer is best for tomatoes?")}
                >
                  <Text className="text-gray-600">What fertilizer is best for tomatoes?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-white p-3 rounded-lg border border-green-100"
                  onPress={() => handleSend("How to identify rice blast disease?")}
                >
                  <Text className="text-gray-600">How to identify rice blast disease?</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  className="bg-white p-3 rounded-lg border border-green-100"
                  onPress={() => handleSend("When is the best time to harvest carrots?")}
                >
                  <Text className="text-gray-600">When is the best time to harvest carrots?</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        
        {/* Chat messages */}
        {messages.map(msg => (
          <ChatMessage 
            key={msg.id} 
            message={msg.text} 
            sender={msg.sender}
            timestamp={msg.timestamp}
          />
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
        placeholder={messageCount >= 5 ? "Message limit reached. Start a new chat." : "Type your message..."}
      />
    </KeyboardAvoidingView>
  );
}