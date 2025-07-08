import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading?: boolean;
}

export default function ChatInput({ onSend, isLoading = false }: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View className="flex-row items-center px-4 py-3 bg-white border-t border-gray-200 shadow-sm">
      <TextInput
        className="flex-1 bg-gray-100 px-4 py-3 rounded-2xl mr-2"
        placeholder="Ask about farming, crops, diseases..."
        value={text}
        onChangeText={setText}
        multiline
        maxLength={500}
        editable={!isLoading}
        style={{ maxHeight: 100 }} // Limit height growth
      />
      <TouchableOpacity 
        onPress={handleSend} 
        disabled={isLoading || !text.trim()}
        className={`p-3 rounded-full ${
          isLoading || !text.trim() ? 'bg-gray-300' : 'bg-green-600'
        }`}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Feather name="send" size={20} color="white" />
        )}
      </TouchableOpacity>
    </View>
  );
}
