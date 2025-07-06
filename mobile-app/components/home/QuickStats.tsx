import { Text, View } from 'react-native';

export default function QuickStats() {
  return (
    <View className="bg-white shadow p-4 rounded-xl mt-4">
      <Text className="text-lg font-bold mb-2">Quick Stats</Text>
      <Text>🌾 Disease trends: Leaf blight ↑</Text>
      <Text>🐛 Pest outbreaks: Armyworm detected</Text>
    </View>
  );
}