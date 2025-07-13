import CurrentWeather from "@/components/weather/CurrentWeather";
import DayForecast from "@/components/weather/DayForecast";
import { getWeatherForecast, groupForecastByDay } from "@/services/weatherService";
import { useEffect, useState } from "react";
import { 
  ScrollView, 
  Text, 
  RefreshControl, 
  View, 
  ActivityIndicator,
  TouchableOpacity 
} from "react-native";
import { WeatherData } from "@/services/weatherService";
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';

export default function WeatherInsightsScreen() {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchWeather = async () => {
    try {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      // Get current location
      let location = await Location.getCurrentPositionAsync({});
      
      // Fetch weather data using current location
      const data = await getWeatherForecast(
        location.coords.latitude,
        location.coords.longitude
      );
      setWeather(data);
      setErrorMsg(null);
    } catch (error) {
      console.error('Error:', error);
      setErrorMsg('Error fetching weather data');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchWeather();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchWeather();
  };

  const groupedForecasts = weather ? groupForecastByDay(weather.list) : {};

  return (
    <ScrollView 
      className="flex-1 bg-gradient-to-b from-blue-50 to-white" 
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />
      }
      contentContainerClassName="pb-8"
    >
      {isLoading ? (
        <View className="flex-1 justify-center items-center p-8">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-gray-600 mt-4 text-center">
            Fetching weather information...
          </Text>
        </View>
      ) : errorMsg ? (
        <View className="m-4">
          <View className="bg-red-100 rounded-2xl p-6 shadow-sm">
            <Text className="text-red-500 text-center font-medium mb-2">
              {errorMsg}
            </Text>
            <TouchableOpacity 
              onPress={fetchWeather}
              className="bg-red-500 py-2 px-4 rounded-full self-center mt-2"
            >
              <Text className="text-white font-medium">Try Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      ) : weather ? (
        <>
          <View className="px-4 pt-4 pb-2">
            <View className="flex-row justify-between items-center mb-2">
              <Text className="text-2xl font-bold text-gray-800">Weather Forecast</Text>
              <TouchableOpacity 
                onPress={onRefresh}
                className="bg-blue-100 p-2 rounded-full"
              >
                <Ionicons name="refresh" size={20} color="#3b82f6" />
              </TouchableOpacity>
            </View>
            <Text className="text-sm text-gray-500">
              Pull down to refresh weather data
            </Text>
          </View>

          <View className="px-4">
            <CurrentWeather 
              current={weather.list[0]}
              cityName={weather.city.name}
              country={weather.city.country}
            />
          </View>
          
          <View className="mt-6">
            <View className="flex-row justify-between items-center px-4 mb-4">
              <Text className="text-xl font-semibold text-gray-800">5-Day Forecast</Text>
              <Text className="text-sm text-gray-500">Scroll horizontally for more</Text>
            </View>
            <View className="px-4">
              {Object.entries(groupedForecasts).map(([date, forecasts]) => (
                <DayForecast key={date} date={date} forecasts={forecasts} />
              ))}
            </View>
          </View>
        </>
      ) : null}
    </ScrollView>
  );
}