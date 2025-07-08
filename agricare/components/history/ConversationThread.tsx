import React from 'react';
import { View, Text } from 'react-native';
import { format } from 'date-fns';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
}

interface ConversationThreadProps {
  messages: Message[];
}

export default function ConversationThread({ messages }: ConversationThreadProps) {
  return (
    <View className="bg-white rounded-xl p-4 shadow">
      {messages.map((message, index) => (
        <View 
          key={index} 
          className={`mb-4 p-3 rounded-lg ${
            message.role === 'user' ? 'bg-green-50 ml-8' : 'bg-gray-50 mr-8'
          }`}
        >
          <Text className="text-xs text-gray-500 mb-1">
            {message.role === 'user' ? 'You' : 'Assistant'}
          </Text>
          <Text className="text-gray-800">{message.content}</Text>
          <Text className="text-xs text-gray-400 mt-1 text-right">
            {format(new Date(message.created_at), 'h:mm a')}
          </Text>
        </View>
      ))}
    </View>
  );
}
