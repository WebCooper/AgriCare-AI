import { router } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

const ActionButton = ({ title, screen }: { title: string; screen: string }) => {
  const handlePress = () => {
    switch (screen) {
      case "scan":
        router.push("/(tabs)/scan");
        break;
      case "history":
        router.push("/(tabs)/history");
        break;
      case "analysis":
        router.push("/analysis");
        break;
      case "chatbot":
        router.push("/(tabs)/chatbot");
        break;
      default:
        break;
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      className="bg-white shadow rounded-xl p-4 w-[48%] mb-4"
    >
      <Text className="text-center font-semibold">{title}</Text>
    </TouchableOpacity>
  );
};

export default function MainActions() {
  return (
    <View className="flex-row flex-wrap justify-between">
      <ActionButton title="📸 Scan Crop" screen="scan" />
      <ActionButton title="📊 Disease History" screen="history" />
      <ActionButton title="🌱 Prevention Tips" screen="analysis" />
      <ActionButton title="💬 Ask the AI" screen="chatbot" />
    </View>
  );
}