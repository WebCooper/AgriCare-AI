import { Alert, Text, TouchableOpacity } from 'react-native';

export default function SyncButton() {
  const handleSync = () => {
    Alert.alert('Sync Complete', 'Your data has been synced.');
    // TODO: implement actual sync logic
  };

  return (
    <TouchableOpacity
      onPress={handleSync}
      className="bg-green-100 py-3 rounded-xl mt-2"
    >
      <Text className="text-center text-green-600 font-semibold">🔄 Sync Data</Text>
    </TouchableOpacity>
  );
}
