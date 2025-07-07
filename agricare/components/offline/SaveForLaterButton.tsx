import { Text, TouchableOpacity } from 'react-native';

export default function SaveForLaterButton({ onSave }: { onSave: () => void }) {
  return (
    <TouchableOpacity
      className="bg-gray-200 rounded-xl p-4 mt-4"
      onPress={onSave}
    >
      <Text className="text-center font-semibold text-gray-800">
        📸 Save Photo for Later Sync
      </Text>
    </TouchableOpacity>
  );
}
