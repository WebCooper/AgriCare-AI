import { Picker } from '@react-native-picker/picker';
import { Text, View } from 'react-native';

export default function UserTypeSelector({
  selected,
  onChange,
}: {
  selected: string;
  onChange: (val: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold">Select User Type</Text>
      <View className="border rounded-xl overflow-hidden bg-white">
        <Picker selectedValue={selected} onValueChange={onChange}>
          <Picker.Item label="Farmer" value="farmer" />
          <Picker.Item label="Agri-officer" value="officer" />
          <Picker.Item label="Researcher" value="researcher" />
        </Picker>
      </View>
    </View>
  );
}
