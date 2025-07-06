import { Share, Text, TouchableOpacity, View } from 'react-native';

export default function ResultActions({ onSave }: { onSave: () => void }) {
  const handleShare = async () => {
    try {
      await Share.share({
        message: 'Disease detected: Tomato Leaf Curl\nConfidence: 92%\nUse neem oil and pruning immediately.',
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <View className="flex-row justify-between mt-4">
      <TouchableOpacity onPress={handleShare} className="bg-blue-100 py-3 px-4 rounded-xl flex-1 mr-2">
        <Text className="text-center text-blue-600 font-semibold">📤 Share</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={onSave} className="bg-green-100 py-3 px-4 rounded-xl flex-1 ml-2">
        <Text className="text-center text-green-600 font-semibold">💾 Save</Text>
      </TouchableOpacity>
    </View>
  );
}
