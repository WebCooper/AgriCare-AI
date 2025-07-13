import { WeatherForecast } from '@/services/weatherService';
import { formatDateTime, getWeatherIcon } from '@/services/weatherService';
import { View, Text, Image, ScrollView } from 'react-native';

interface DayForecastProps {
  forecasts: WeatherForecast[];
  date: string;
}

export default function DayForecast({ forecasts, date }: DayForecastProps) {
  const formattedDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  return (
    <View className="mb-4">
      <Text className="text-lg font-semibold mb-2">{formattedDate}</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {forecasts.map((forecast, index) => (
          <View 
            key={forecast.dt} 
            className="mr-4 bg-white rounded-lg p-3 shadow-sm border border-gray-100"
            style={{ minWidth: 120 }}
          >
            <Text className="text-sm text-gray-600">
              {new Date(forecast.dt_txt).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit'
              })}
            </Text>
            <Image
              source={{ uri: getWeatherIcon(forecast.weather[0].icon) }}
              className="w-16 h-16 self-center"
            />
            <Text className="text-xl font-bold">{Math.round(forecast.main.temp)}°C</Text>
            <Text className="text-xs text-gray-600 capitalize">
              {forecast.weather[0].description}
            </Text>
            <View className="mt-2">
              <Text className="text-xs text-gray-600">
                Humidity: {forecast.main.humidity}%
              </Text>
              <Text className="text-xs text-gray-600">
                Wind: {Math.round(forecast.wind.speed)} m/s
              </Text>
              <Text className="text-xs text-gray-600">
                Rain: {Math.round(forecast.pop * 100)}%
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
