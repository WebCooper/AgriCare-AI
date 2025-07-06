import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native';

export default function LanguageSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold">Language</Text>
      <View className="border rounded-xl overflow-hidden">
        <Picker selectedValue={selected} onValueChange={onChange}>
          <Picker.Item label="English" value="en" />
          <Picker.Item label="Sinhala" value="si" />
          <Picker.Item label="Tamil" value="ta" />
        </Picker>
      </View>
    </View>
  );
}
