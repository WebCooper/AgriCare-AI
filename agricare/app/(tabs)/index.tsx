import { router } from "expo-router";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-green-600 pt-12 pb-8 px-6 rounded-b-3xl">
        <Text className="text-white text-2xl font-bold mb-2">AgriCare</Text>
        <Text className="text-green-100 text-base">Smart plant disease detection & care</Text>
      </View>

      <View className="px-6">
        {/* Main Action Cards */}
        <View className="mt-6">
          <Text className="text-xl font-bold text-gray-800 mb-4">What would you like to do?</Text>
          
          {/* Scan Plant - Primary Action */}
          <TouchableOpacity
            className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-green-100"
            onPress={() => router.push("/(tabs)/scan")}
          >
            <View className="flex-row items-center">
              <View className="bg-green-100 p-4 rounded-full mr-4">
                <Ionicons name="camera" size={32} color="#059669" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">Scan Plant</Text>
                <Text className="text-gray-600">Detect diseases and get instant diagnosis</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {/* Chat with AI */}
          <TouchableOpacity
            className="bg-white rounded-2xl p-6 mb-4 shadow-lg border border-blue-100"
            onPress={() => router.push("/(tabs)/chatbot")}
          >
            <View className="flex-row items-center">
              <View className="bg-blue-100 p-4 rounded-full mr-4">
                <Ionicons name="chatbubble-ellipses" size={32} color="#2563eb" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">Ask AI Expert</Text>
                <Text className="text-gray-600">Get personalized farming advice</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>

          {/* Prediction History */}
          <TouchableOpacity
            className="bg-white rounded-2xl p-6 mb-6 shadow-lg border border-orange-100"
            onPress={() => router.push("/(tabs)/history")}
          >
            <View className="flex-row items-center">
              <View className="bg-orange-100 p-4 rounded-full mr-4">
                <Ionicons name="time" size={32} color="#ea580c" />
              </View>
              <View className="flex-1">
                <Text className="text-lg font-bold text-gray-800 mb-1">View History</Text>
                <Text className="text-gray-600">Check your past diagnoses</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Quick Access Section */}
        <View className="mt-2">
          <Text className="text-lg font-bold text-gray-800 mb-4">Quick Access</Text>
          
          <View className="flex-row justify-between mb-6">
            {/* Weather */}
            <TouchableOpacity
              className="bg-white rounded-xl p-4 shadow-sm flex-1 mr-2 items-center"
              onPress={() => router.push("/weather")}
            >
              <View className="bg-sky-100 p-3 rounded-full mb-2">
                <Ionicons name="partly-sunny" size={24} color="#0284c7" />
              </View>
              <Text className="text-sm font-semibold text-gray-800 text-center">Weather</Text>
            </TouchableOpacity>

            {/* Profile */}
            <TouchableOpacity
              className="bg-white rounded-xl p-4 shadow-sm flex-1 ml-2 items-center"
              onPress={() => router.push("/(tabs)/profile")}
            >
              <View className="bg-purple-100 p-3 rounded-full mb-2">
                <Ionicons name="person" size={24} color="#7c3aed" />
              </View>
              <Text className="text-sm font-semibold text-gray-800 text-center">Profile</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Tips Section */}
        <View className="bg-green-50 rounded-2xl p-5 mb-8">
          <View className="flex-row items-center mb-3">
            <Ionicons name="bulb" size={20} color="#059669" />
            <Text className="text-lg font-bold text-green-800 ml-2">Pro Tip</Text>
          </View>
          <Text className="text-green-700 leading-6">
            Take clear, well-lit photos of affected plant parts for the most accurate disease detection results.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
