import { useState } from 'react';
import { Text, TextInput, View } from 'react-native';

export default function SoilInfoSection() {
  const [moisture, setMoisture] = useState('');
  const [ph, setPH] = useState('');

  return (
    <View className="bg-green-50 p-4 rounded-xl">
      <Text className="text-lg font-bold mb-2">Soil Info</Text>
      <Text>🌱 Moisture Level (%)</Text>
      <TextInput
        className="border p-2 rounded-md mb-3"
        keyboardType="numeric"
        placeholder="e.g., 45"
        value={moisture}
        onChangeText={setMoisture}
      />
      <Text>🧪 pH Level</Text>
      <TextInput
        className="border p-2 rounded-md"
        keyboardType="decimal-pad"
        placeholder="e.g., 6.5"
        value={ph}
        onChangeText={setPH}
      />
    </View>
  );
}
