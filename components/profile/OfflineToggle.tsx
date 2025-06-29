import { Switch, Text, View } from 'react-native';

export default function OfflineToggle({
  enabled,
  onToggle,
}: {
  enabled: boolean;
  onToggle: () => void;
}) {
  return (
    <View className="flex-row justify-between items-center mb-4">
      <Text className="font-semibold">Offline Mode</Text>
      <Switch value={enabled} onValueChange={onToggle} />
    </View>
  );
}
