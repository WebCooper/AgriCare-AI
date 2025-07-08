import { Text, TouchableOpacity } from 'react-native';
import { format } from 'date-fns';

interface ChatHistoryCardProps {
  title: string;
  date: string;
  snippet: string;
  conversationType: 'general' | 'prediction';
  onPress: () => void;
}

export default function ChatHistoryCard({ title, date, snippet, conversationType, onPress }: ChatHistoryCardProps) {
  // Parse the date and format it nicely
  const formattedDate = format(new Date(date), 'MMM dd, yyyy');
  
  // Show a different icon based on the conversation type
  const icon = conversationType === 'general' ? '💬' : '🔍';

  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow"
      onPress={onPress}
    >
      <Text className="text-lg font-semibold">{icon} {title}</Text>
      <Text className="text-gray-500">{formattedDate}</Text>
      <Text className="mt-1 text-gray-700 line-clamp-2">{snippet}</Text>
    </TouchableOpacity>
  );
}
