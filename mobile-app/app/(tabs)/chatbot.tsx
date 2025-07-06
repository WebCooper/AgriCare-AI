import ChatInput from '@/components/chat/ChatInput';
import ChatMessage from '@/components/chat/ChatMessage';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
}

export default function ChatbotScreen() {
  const [messages, setMessages] = useState<Message[]>([]);

  const handleSend = async (userMsg: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      text: userMsg,
      sender: 'user',
    };

    setMessages(prev => [...prev, userMessage]);

    // Simulate bot typing + LLM response
    const responseMessage: Message = {
      id: (Date.now() + 1).toString(),
      text: getBotResponse(userMsg), // Replace with real API call
      sender: 'bot',
    };

    setTimeout(() => {
      setMessages(prev => [...prev, responseMessage]);
    }, 500); // Simulate delay
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-gray-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={90}
    >
      <ScrollView className="flex-1 px-4 pt-4" contentContainerStyle={{ paddingBottom: 80 }}>
        {messages.map(msg => (
          <ChatMessage key={msg.id} message={msg.text} sender={msg.sender} />
        ))}
        {messages.length === 0 && (
          <View className="items-center mt-10">
            <Text className="text-gray-500 text-center">
              Ask anything about crop health, pests, remedies in Sinhala, Tamil or English!
            </Text>
          </View>
        )}
      </ScrollView>
      <ChatInput onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

// 🔁 Placeholder logic for bot response – replace with API call to OpenAI or backend
function getBotResponse(prompt: string): string {
  if (prompt.toLowerCase().includes('tomato')) {
    return 'To treat tomato leaf curl, remove infected leaves and apply neem oil every 3 days.';
  }
  return 'Let me look into that... (Simulated response)';
}