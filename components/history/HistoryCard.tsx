import { Text, TouchableOpacity } from 'react-native';

interface HistoryCardProps {
  crop: string;
  date: string;
  disease: string;
  onPress: () => void;
}

export default function HistoryCard({ crop, date, disease, onPress }: HistoryCardProps) {
  return (
    <TouchableOpacity
      className="bg-white rounded-xl p-4 mb-3 shadow"
      onPress={onPress}
    >
      <Text className="text-lg font-semibold">{crop}</Text>
      <Text className="text-gray-500">{date}</Text>
      <Text className="mt-1 text-green-700">🦠 {disease}</Text>
    </TouchableOpacity>
  );
}
