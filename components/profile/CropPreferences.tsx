import { Text, TouchableOpacity, View } from 'react-native';

const cropOptions = ['Tomato', 'Chili', 'Paddy', 'Potato', 'Banana'];

export default function CropPreferences({
  selected,
  onToggle,
}: {
  selected: string[];
  onToggle: (crop: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold">Preferred Crops</Text>
      <View className="flex-row flex-wrap gap-2">
        {cropOptions.map((crop) => {
          const isSelected = selected.includes(crop);
          return (
            <TouchableOpacity
              key={crop}
              onPress={() => onToggle(crop)}
              className={`px-3 py-1 rounded-full border ${
                isSelected ? 'bg-green-200 border-green-600' : 'bg-white'
              }`}
            >
              <Text className="text-sm">{crop}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}
