import { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function ChatInput({ onSend }: { onSend: (msg: string) => void }) {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (text.trim()) {
      onSend(text.trim());
      setText('');
    }
  };

  return (
    <View className="flex-row items-center px-4 py-2 bg-white border-t border-gray-200">
      <TextInput
        className="flex-1 bg-gray-100 px-4 py-2 rounded-xl mr-2"
        placeholder="Ask about crop issues..."
        value={text}
        onChangeText={setText}
        multiline
      />
      <TouchableOpacity onPress={handleSend} className="bg-green-500 px-4 py-2 rounded-xl">
        <Text className="text-white font-semibold">Send</Text>
      </TouchableOpacity>
    </View>
  );
}
