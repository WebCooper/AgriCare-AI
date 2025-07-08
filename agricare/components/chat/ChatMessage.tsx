import { Text, View } from 'react-native';
import { format } from 'date-fns';

interface Props {
  message: string;
  sender: 'user' | 'bot';
  timestamp?: Date;
}

export default function ChatMessage({ message, sender, timestamp = new Date() }: Props) {
  const isUser = sender === 'user';
  const formattedTime = format(timestamp, 'h:mm a');

  return (
    <View className={`mb-4 ${isUser ? 'items-end' : 'items-start'} animate-in fade-in`}>
      <View 
        className={`px-4 py-3 rounded-2xl max-w-[85%] ${
          isUser 
            ? 'bg-green-600 rounded-tr-sm' 
            : 'bg-gray-100 rounded-tl-sm'
        }`}
      >
        <Text 
          className={`text-base ${isUser ? 'text-white' : 'text-gray-800'}`}
          style={{ lineHeight: 24 }}
        >
          {message}
        </Text>
      </View>
      <Text className="text-xs text-gray-500 mt-1 mx-2">{formattedTime}</Text>
    </View>
  );
}
