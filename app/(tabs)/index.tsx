import MainActions from "@/components/home/MainActions";
import QuickStats from "@/components/home/QuickStats";
import TopPanel from "@/components/home/TopPanel";
import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50 px-4 py-6">
      {/* Top greeting / profile summary */}
      <TopPanel />

      {/* Main Actions (Scan, Ask AI, etc.) */}
      <View className="mt-6 mb-4">
        <MainActions />
      </View>

      {/* Quick Stats */}
      <QuickStats />

      {/* Section Title */}
      <Text className="text-xl font-bold mt-6 mb-4 text-gray-800">
        📊 Insights & Shortcuts
      </Text>

      {/* Weather Summary Card */}
      <TouchableOpacity
        className="bg-blue-100 rounded-2xl p-5 mb-4 shadow-sm"
        onPress={() => router.push("/weather")}
      >
        <Text className="text-lg font-semibold mb-1">🌦️ Weather & Soil Insights</Text>
        <Text className="text-gray-700 text-base">See today’s weather and soil info for your region.</Text>
      </TouchableOpacity>

      {/* Latest Analysis */}
      <TouchableOpacity
        className="bg-yellow-100 rounded-2xl p-5 mb-4 shadow-sm"
        onPress={() => router.push("/analysis")}
      >
        <Text className="text-lg font-semibold mb-1">🧪 Latest Analysis</Text>
        <Text className="text-gray-700 text-base">View your most recent crop analysis results.</Text>
      </TouchableOpacity>

      {/* Offline Mode Info */}
      <TouchableOpacity
        className="bg-gray-200 rounded-2xl p-5 mb-4 shadow-sm"
        onPress={() => router.push("/offline")}
      >
        <Text className="text-lg font-semibold mb-1">📴 Offline Mode</Text>
        <Text className="text-gray-700 text-base">Access offline tips and saved scans.</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
