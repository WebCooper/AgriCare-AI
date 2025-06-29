import { Text, View } from 'react-native';

interface Props {
  message: string;
  sender: 'user' | 'bot';
}

export default function ChatMessage({ message, sender }: Props) {
  const isUser = sender === 'user';

  return (
    <View className={`mb-2 ${isUser ? 'items-end' : 'items-start'}`}>
      <View className={`px-4 py-2 rounded-xl max-w-[80%] ${isUser ? 'bg-green-200' : 'bg-gray-200'}`}>
        <Text className="text-sm">{message}</Text>
      </View>
    </View>
  );
}
