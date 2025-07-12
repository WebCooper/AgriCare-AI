import HistoryCard from '@/components/history/HistoryCard';
import ChatHistoryCard from '@/components/history/ChatHistoryCard';
import { useRouter } from 'expo-router';
import { ActivityIndicator, RefreshControl, ScrollView, Text, View, TouchableOpacity } from 'react-native';
import { useState, useEffect, useCallback } from 'react';
import { getAllConversations } from '@/services/chatHistoryService';
import { format } from 'date-fns';

// Define our types
type Message = {
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
};

type Conversation = {
  id: number;
  conversation_type: 'general' | 'prediction';
  crop: string | undefined | null;
  disease: string | undefined | null;
  created_at: string;
  updated_at: string;
  imageUrl?: string;
  messages: Message[];
};

export default function HistoryScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'chats' | 'diseases'>('chats');
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  // Fetch conversation history on component mount
  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      // Get all conversations from local storage
      const localData = await getAllConversations();
      
      // Sort conversations by date
      const allConversations = localData.sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
      ) as Conversation[];

      setConversations(allConversations);
      setError('');
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
      setError('Failed to load history. Please try again later.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Pull-to-refresh handler
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchConversations();
  }, []);

  // Filter conversations by type
  const generalChats = conversations.filter(conv => conv.conversation_type === 'general');
  const predictionChats = conversations.filter(conv => conv.conversation_type === 'prediction');

  // Navigate to conversation detail
  const viewConversation = (chat: Conversation) => {
    // For general chats, navigate to chatbot tab with history param
    router.push({
      pathname: "/(tabs)/chatbot",
      params: {
        chatId: chat.id.toString(),
        type: 'history'
      }
    });
  };

  // Navigate to disease prediction report
  const viewReport = (report: Conversation) => {
    router.push({
      pathname: "/prediction-chat/[id]",
      params: {
        id: report.id.toString(),
        crop: report.crop || '',
        disease: report.disease || '',
        imageUri: report.imageUrl
      }
    });
  };

  // Format the first message to use as a preview
  const getMessageSnippet = (messages: any[]) => {
    if (!messages || messages.length === 0) return "No messages";
    // Try to find the first user message for the preview
    const userMessage = messages.find(m => m.role === 'user');
    return userMessage ? userMessage.content.substring(0, 80) + (userMessage.content.length > 80 ? '...' : '') : "No messages";
  };

  // Get an appropriate title for the conversation
  const getConversationTitle = (conversation: Conversation) => {
    if (conversation.conversation_type === 'prediction' && conversation.crop && conversation.disease) {
      return `${conversation.crop} - ${conversation.disease}`;
    }
    
    // For general chats, use the first few words of the first message
    if (conversation.messages && conversation.messages.length > 0) {
      const firstMsg = conversation.messages[0].content;
      const words = firstMsg.split(' ').slice(0, 4).join(' ');
      return words + (firstMsg.split(' ').length > 4 ? '...' : '');
    }
    
    return 'Conversation';
  };

  return (
    <ScrollView 
      className="flex-1 bg-gray-100"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#10b981']} // green color for Android
          tintColor="#10b981" // green color for iOS
        />
      }
    >
      {/* Tab Navigation */}
      <View className="flex-row bg-white pt-2 px-2">
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'chats' ? 'border-b-2 border-green-600' : ''}`}
          onPress={() => setActiveTab('chats')}
        >
          <Text className={`text-center font-semibold ${activeTab === 'chats' ? 'text-green-600' : 'text-gray-500'}`}>
            💬 Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          className={`flex-1 py-3 ${activeTab === 'diseases' ? 'border-b-2 border-green-600' : ''}`}
          onPress={() => setActiveTab('diseases')}
        >
          <Text className={`text-center font-semibold ${activeTab === 'diseases' ? 'text-green-600' : 'text-gray-500'}`}>
            🦠 Disease Reports
          </Text>
        </TouchableOpacity>
      </View>

      <View className="p-4">
        {loading && !refreshing ? (
          <View className="items-center justify-center py-10">
            <ActivityIndicator size="large" color="#10b981" />
            <Text className="mt-2 text-gray-600">Loading history...</Text>
          </View>
        ) : error ? (
          <View className="items-center justify-center py-10">
            <Text className="text-red-500">{error}</Text>
            <TouchableOpacity 
              className="mt-4 bg-green-100 px-4 py-2 rounded-lg"
              onPress={fetchConversations}
            >
              <Text className="text-green-700 font-semibold">Try Again</Text>
            </TouchableOpacity>
          </View>
        ) : activeTab === 'chats' ? (
          // General Chat History Section
          <>
            <Text className="text-2xl font-bold mb-4">Chat History</Text>
            {generalChats.length === 0 ? (
              <Text className="text-gray-500 italic text-center py-8">No chat history found.</Text>
            ) : (
              generalChats.map((chat) => (
                <ChatHistoryCard
                  key={chat.id}
                  title={getConversationTitle(chat)}
                  date={chat.created_at}
                  snippet={getMessageSnippet(chat.messages)}
                  conversationType="general"
                  onPress={() => viewConversation(chat)}
                />
              ))
            )}
          </>
        ) : (
          // Disease Prediction History Section
          <>
            <Text className="text-2xl font-bold mb-4">Disease Reports</Text>
            {predictionChats.length === 0 ? (
              <Text className="text-gray-500 italic text-center py-8">No disease reports found.</Text>
            ) : (
              predictionChats.map((report) => (
                <HistoryCard
                  key={report.id}
                  crop={report.crop || 'Unknown crop'}
                  date={format(new Date(report.created_at), 'yyyy-MM-dd')}
                  disease={report.disease || 'Unknown disease'}

                  onPress={() => viewReport(report)}
                />
              ))
            )}
          </>
        )}
      </View>
    </ScrollView>
  );
}
