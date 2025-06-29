import { Text, View } from 'react-native';

interface Props {
  treatment: string;
  naturalRemedy: string;
  prevention: string;
}

export default function Recommendations({ treatment, naturalRemedy, prevention }: Props) {
  return (
    <View className="bg-white p-4 rounded-xl shadow mb-4">
      <Text className="text-lg font-semibold mb-2">🧪 Immediate Treatment</Text>
      <Text className="text-gray-700 mb-3">{treatment}</Text>

      <Text className="text-lg font-semibold mb-2">🌿 Natural Remedies / IPM</Text>
      <Text className="text-gray-700 mb-3">{naturalRemedy}</Text>

      <Text className="text-lg font-semibold mb-2">🛡️ Prevention Steps</Text>
      <Text className="text-gray-700">{prevention}</Text>
    </View>
  );
}
