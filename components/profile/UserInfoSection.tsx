import { Picker } from '@react-native-picker/picker';
import { Text, TextInput, View } from 'react-native';

export default function UserInfoSection({
  name,
  onNameChange,
  phone,
  onPhoneChange,
  userType,
  onUserTypeChange,
}: {
  name: string;
  onNameChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  userType: string;
  onUserTypeChange: (val: string) => void;
}) {
  return (
    <View className="mb-6">
      <Text className="text-lg font-bold mb-2">👤 My Info</Text>

      <Text className="mb-1 font-semibold">Full Name</Text>
      <TextInput
        className="border rounded-xl px-4 py-2 mb-3 bg-white"
        placeholder="Your name"
        value={name}
        onChangeText={onNameChange}
      />

      <Text className="mb-1 font-semibold">Mobile Number</Text>
      <TextInput
        className="border rounded-xl px-4 py-2 mb-3 bg-white"
        placeholder="07XXXXXXXX"
        keyboardType="phone-pad"
        value={phone}
        onChangeText={onPhoneChange}
      />

      <Text className="mb-1 font-semibold">User Type</Text>
      <View className="border rounded-xl overflow-hidden">
        <Picker selectedValue={userType} onValueChange={onUserTypeChange}>
          <Picker.Item label="Farmer" value="farmer" />
          <Picker.Item label="Agri-officer" value="officer" />
          <Picker.Item label="Researcher" value="researcher" />
        </Picker>
      </View>
    </View>
  );
}
