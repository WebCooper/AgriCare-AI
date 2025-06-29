import ReportDetails from '@/components/report/ReportDetails';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View } from 'react-native';

const mockReports: Record<string, any> = {
  '1': {
    crop: 'Tomato',
    date: '2025-06-25',
    disease: 'Leaf Curl Virus',
    confidence: '92%',
    pest: 'Whitefly detected',
    treatment: 'Apply Imidacloprid spray in the early morning.',
    remedies: 'Neem oil spray every 3 days.',
    prevention: 'Use resistant seeds, control vector population.',
  },
  '2': {
    crop: 'Paddy',
    date: '2025-06-22',
    disease: 'Blast Disease',
    confidence: '89%',
    pest: 'No visible pest',
    treatment: 'Use Tricyclazole fungicide.',
    remedies: 'Use cow dung + neem water mix.',
    prevention: 'Avoid high nitrogen fertilizers.',
  },
  // Add more mock entries if needed
};

export default function ReportDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const report = mockReports[id || ''] || null;

  if (!report) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-bold">Report not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-4 bg-gray-100">
      <Text className="text-2xl font-bold mb-4">📝 Analysis Report</Text>
      <ReportDetails report={report} />
    </ScrollView>
  );
}
