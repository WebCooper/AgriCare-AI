import SoilInfoSection from "@/components/weather/SoilInfoSection";
import WeatherCard from "@/components/weather/WeatherCard";
import { ScrollView, Text } from "react-native";


export default function WeatherInsightsScreen() {
   // Dummy weather data — replace with live API later
   const weather = {
    location: 'Kandy, Sri Lanka',
    temperature: 29,
    humidity: 78,
    rainChance: 40,
  };

  return (
    <ScrollView className="flex-1 bg-white p-4">
      <Text className="text-2xl font-bold mb-4">Weather & Soil Insights</Text>
      <WeatherCard data={weather} />
      <SoilInfoSection />
    </ScrollView>
  );
}