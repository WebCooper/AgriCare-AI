import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native';

export default function CropSelector({ selected, onChange }: { selected: string; onChange: (val: string) => void }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold">Select Crop:</Text>
      <View className="border rounded-xl overflow-hidden">
        <Picker
          selectedValue={selected}
          onValueChange={onChange}
          style={{ height: 50 }}
        >
          <Picker.Item label="Tomato" value="tomato" />
          <Picker.Item label="Chili" value="chili" />
          <Picker.Item label="Paddy" value="paddy" />
        </Picker>
      </View>
    </View>
  );
}
