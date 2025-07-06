import { Text, View } from 'react-native';

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainChance: number;
}

export default function WeatherCard({ data }: { data: WeatherData }) {
  return (
    <View className="bg-blue-100 p-4 rounded-xl mb-4">
      <Text className="text-xl font-bold">{data.location}</Text>
      <Text className="text-lg mt-2">🌡️ Temp: {data.temperature}°C</Text>
      <Text>💧 Humidity: {data.humidity}%</Text>
      <Text>🌧️ Rain Chance: {data.rainChance}%</Text>
    </View>
  );
}
