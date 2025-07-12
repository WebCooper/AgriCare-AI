import { useState } from 'react';
import { ActivityIndicator, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';

interface ChatInputProps {
  onSend: (msg: string) => void;
  isLoading?: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export default function ChatInput({ 
  onSend, 
  isLoading = false, 
  disabled = false,
  placeholder = "Ask about farming, crops, diseases..." 
}: ChatInputProps) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim() && !isLoading) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View className="px-4 py-3 bg-white border-t border-gray-200">
      <View className="flex-row items-center relative">
        <TextInput
          className={`flex-1 min-h-[44px] px-4 pr-12 py-2 rounded-full ${
            disabled ? 'bg-gray-200' : 'bg-gray-100'
          }`}
          placeholder={placeholder}
          value={text}
          onChangeText={setText}
          multiline
          maxLength={500}
          editable={!isLoading && !disabled}
          style={{ maxHeight: 100 }} // Limit height growth
        />
        <TouchableOpacity 
          onPress={handleSend} 
          disabled={isLoading || !text.trim() || disabled}
          className={`absolute right-1 p-2 rounded-full ${
            isLoading || !text.trim() || disabled ? 'bg-gray-300' : 'bg-green-600'
          }`}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Feather name="send" size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
