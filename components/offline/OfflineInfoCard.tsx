import { Text, View } from 'react-native';

export default function OfflineInfoCard() {
  return (
    <View className="bg-yellow-100 p-4 rounded-xl mb-4">
      <Text className="text-lg font-bold mb-2">You're in Offline Mode</Text>
      <Text className="text-gray-700">
        Some features are limited. You can still:
        {'\n'}- Browse common diseases
        {'\n'}- Save photos for later
        {'\n'}- Use basic offline diagnosis (coming soon)
      </Text>
    </View>
  );
}
