import { Text, TextInput, View } from 'react-native';

export default function RegionSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  return (
    <View className="mb-4">
      <Text className="mb-2 font-semibold">Region</Text>
      <TextInput
        className="border rounded-xl px-4 py-2 bg-white"
        placeholder="Enter your region"
        value={value}
        onChangeText={onChange}
      />
    </View>
  );
}
