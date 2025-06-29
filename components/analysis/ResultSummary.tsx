import { Text, View } from 'react-native';

interface Props {
  disease: string;
  confidence: number;
  pest?: string;
}

export default function ResultSummary({ disease, confidence, pest }: Props) {
  return (
    <View className="bg-white p-4 rounded-xl shadow mb-4">
      <Text className="text-xl font-bold text-red-600 mb-2">🦠 {disease}</Text>
      <Text className="text-gray-700 mb-1">Confidence: {confidence}%</Text>
      {pest && <Text className="text-gray-700">Pest Detected: {pest}</Text>}
    </View>
  );
}
