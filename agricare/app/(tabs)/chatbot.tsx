import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import chatbotService from '@/services/chatbotService';
import { useRef, useState, useEffect } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View, ActivityIndicator, Image, Alert } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentConversationId, setCurrentConversationId] = useState<number | undefined>(undefined);
  const scrollViewRef = useRef<ScrollView>(null);
  
  // Load previous conversations on component mount
  useEffect(() => {
    const loadPreviousConversation = async () => {
      try {
        // Get the most recent conversation
        const conversations = await chatbotService.getConversations();
        
        if (conversations && conversations.length > 0) {
          // Sort by most recent
          const sortedConversations = [...conversations].sort(
            (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          );
          
          const recentConversation = sortedConversations[0];
          
          // Set the conversation ID
          setCurrentConversationId(recentConversation.id);
          
          // Convert the messages to our format
          const formattedMessages: Message[] = recentConversation.messages.map(msg => ({
            id: `${msg.created_at}-${Math.random()}`,
            text: msg.content,
            sender: msg.role === 'user' ? 'user' : 'bot',
            timestamp: new Date(msg.created_at),
          }));
          
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Failed to load previous conversations:', error);
        // If we can't load previous conversations, just start fresh
      }
    };
    
    loadPreviousConversation();
  }, []);

  const handleSend = async (userMsg: string) => {
    try {
      // Add user message to UI
      const userMessage: Message = {
        id: Date.now().toString(),
        text: userMsg,
        sender: 'user',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, userMessage]);
      setIsLoading(true);
      
      // Scroll to bottom
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);

      // Send message to API
      const response = await chatbotService.sendMessage(userMsg, currentConversationId);
      
      // Store the conversation ID for future messages
      setCurrentConversationId(response.conversation_id);

      // Add bot response to UI
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response.response,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Scroll to bottom again after response
      setTimeout(() => scrollViewRef.current?.scrollToEnd({ animated: true }), 100);
    } catch (error) {
      console.error('Chat error:', error);
      Alert.alert('Error', 'Failed to send message. Please check your connection and try again.');
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
      <ScrollView 
        ref={scrollViewRef}
        className="flex-1 px-4 pt-4" 
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
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
              <Text className="text-gray-700 font-medium">Try asking:</Text>
              <Text className="text-gray-600 my-1">• What fertilizer is best for tomatoes?</Text>
              <Text className="text-gray-600 my-1">• How to identify rice blast disease?</Text>
              <Text className="text-gray-600 my-1">• When is the best time to harvest carrots?</Text>
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
        
        {/* Loading indicator for when bot is "typing" */}
        {isLoading && (
          <View className="flex-row items-center mt-2 ml-2 mb-4">
            <View className="bg-gray-200 p-3 rounded-2xl">
              <ActivityIndicator size="small" color="#10b981" />
            </View>
            <Text className="text-gray-400 text-sm ml-2">AgriCare is thinking...</Text>
          </View>
        )}
      </ScrollView>
      
      <ChatInput onSend={handleSend} isLoading={isLoading} />
    </KeyboardAvoidingView>
  );
}