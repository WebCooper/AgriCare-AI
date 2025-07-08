import ReportDetails from '@/components/report/ReportDetails';
import ConversationThread from '@/components/history/ConversationThread';
import { useLocalSearchParams } from 'expo-router';
import { ScrollView, Text, View, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import chatbotService from '@/services/chatbotService';
import { format } from 'date-fns';

// Type definitions
type Conversation = {
  id: number;
  conversation_type: 'general' | 'prediction';
  crop: string | null;
  disease: string | null;
  created_at: string;
  updated_at: string;
  messages: {
    role: 'user' | 'assistant';
    content: string;
    created_at: string;
  }[];
};

type Report = {
  crop: string;
  date: string;
  disease: string;
  confidence: string;
  pest: string;
  treatment: string;
  remedies: string;
  prevention: string;
};

// Mock data for prediction reports (will be replaced by API data in future)
const mockReportDetails: Record<string, Partial<Report>> = {
  // This is a fallback in case we don't have actual report data from the API
  prediction: {
    confidence: '90%',
    pest: 'Various pests may be present',
    treatment: 'Based on the specific disease, appropriate treatments will be recommended.',
    remedies: 'Natural remedies depend on the specific disease and crop.',
    prevention: 'Practice crop rotation and proper field sanitation.',
  }
};

export default function ReportDetailScreen() {
  const { id, type } = useLocalSearchParams<{ id: string, type: 'conversation' | 'prediction' }>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [report, setReport] = useState<Report | null>(null);

  useEffect(() => {
    if (!id) {
      setError('Invalid report ID');
      setLoading(false);
      return;
    }

    fetchData();
  }, [id, type]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const conversationId = parseInt(id as string);
      
      // Fetch the conversation data
      const conversationData = await chatbotService.getConversation(conversationId);
      setConversation(conversationData);
      
      // If it's a prediction type, create a report from the conversation data
      if (conversationData.conversation_type === 'prediction' && conversationData.crop && conversationData.disease) {
        const reportData: Report = {
          crop: conversationData.crop,
          disease: conversationData.disease,
          date: format(new Date(conversationData.created_at), 'yyyy-MM-dd'),
          // Use mock data for these fields for now
          // In a real app, you would get these from an API endpoint
          ...mockReportDetails.prediction as any
        };
        setReport(reportData);
      }
      
      setError('');
    } catch (err) {
      console.error('Failed to fetch report data:', err);
      setError('Failed to load report. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#10b981" />
        <Text className="mt-2 text-gray-600">Loading report...</Text>
      </View>
    );
  }

  if (error || !conversation) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-red-500 font-bold">{error || 'Report not found.'}</Text>
      </View>
    );
  }

  // For general conversations, display chat history
  if (conversation.conversation_type === 'general' || type === 'conversation') {
    return (
      <ScrollView className="flex-1 p-4 bg-gray-100">
        <Text className="text-2xl font-bold mb-4">💬 Conversation History</Text>
        <View className="bg-white rounded-xl p-4 mb-4 shadow">
          <Text className="text-gray-500">
            {format(new Date(conversation.created_at), 'MMMM dd, yyyy')}
          </Text>
        </View>
        
        <ConversationThread messages={conversation.messages} />
      </ScrollView>
    );
  }

  // For disease predictions, display the report
  if (report) {
    return (
      <ScrollView className="flex-1 p-4 bg-gray-100">
        <Text className="text-2xl font-bold mb-4">📝 Disease Analysis</Text>
        <ReportDetails report={report} />
      </ScrollView>
    );
  }

  return (
    <View className="flex-1 items-center justify-center bg-white">
      <Text className="text-red-500 font-bold">Invalid report data.</Text>
    </View>
  );
}
