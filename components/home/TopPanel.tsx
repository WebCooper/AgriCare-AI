import { Text, View } from 'react-native';

export default function TopPanel() {
  return (
    <View className="bg-green-100 p-4 rounded-xl mb-4">
      <Text className="text-lg font-bold">Hello, Farmer 👩‍🌾</Text>
      <Text className="text-sm text-gray-600">Location: Colombo</Text>
      <Text className="text-sm text-gray-600">Weather: 28°C, Sunny ☀️</Text>
    </View>
  );
}