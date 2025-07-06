import HistoryCard from '@/components/history/HistoryCard';
import { useRouter } from 'expo-router';
import { ScrollView, Text } from 'react-native';

const mockHistory = [
  {
    id: '1',
    crop: 'Tomato',
    date: '2025-06-25',
    disease: 'Leaf Curl Virus',
  },
  {
    id: '2',
    crop: 'Paddy',
    date: '2025-06-22',
    disease: 'Blast Disease',
  },
  {
    id: '3',
    crop: 'Chili',
    date: '2025-06-20',
    disease: 'Powdery Mildew',
  },
];

export default function DiseaseHistoryScreen() {
  const router = useRouter();

  const viewReport = (id: string) => {
    router.push({ pathname: "/report/[id]", params: { id } }); // For future detailed report screen
  };

  return (
    <ScrollView className="flex-1 bg-gray-100 p-4">
      <Text className="text-2xl font-bold mb-4">🗂️ Disease History</Text>

      {mockHistory.map((item) => (
        <HistoryCard
          key={item.id}
          crop={item.crop}
          date={item.date}
          disease={item.disease}
          onPress={() => viewReport(item.id)}
        />
      ))}
    </ScrollView>
  );
}
