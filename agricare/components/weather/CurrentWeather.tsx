import { WeatherForecast } from '@/services/weatherService';
import { getWeatherIcon } from '@/services/weatherService';
import { View, Text, Image, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CurrentWeatherProps {
  current: WeatherForecast;
  cityName: string;
  country: string;
}

export default function CurrentWeather({ current, cityName, country }: CurrentWeatherProps) {
  return (
    <View style={styles.container}>
      {/* Location Header */}
      <View style={styles.headerContainer}>
        <View style={styles.locationInfo}>
          <Text style={styles.cityName}>{cityName}</Text>
          <Text style={styles.countryName}>{country}</Text>
        </View>
        <View style={styles.weatherIconContainer}>
          <Image
            source={{ uri: getWeatherIcon(current.weather[0].icon) }}
            style={styles.weatherIcon}
          />
        </View>
      </View>

      {/* Temperature Info */}
      <View style={styles.temperatureContainer}>
        <View style={styles.temperatureRow}>
          <Text style={styles.temperature}>
            {Math.round(current.main.temp)}°
          </Text>
          <View style={styles.temperatureDetails}>
            <Text style={styles.weatherDescription}>
              {current.weather[0].description}
            </Text>
            <Text style={styles.feelsLike}>
              Feels like {Math.round(current.main.feels_like)}°
            </Text>
          </View>
        </View>
      </View>

      {/* Weather Details */}
      <View style={styles.weatherDetailsContainer}>
        <View style={styles.weatherDetailsRow}>
          {/* Humidity */}
          <View style={styles.weatherDetailItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="water-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.detailValue}>
              {current.main.humidity}%
            </Text>
            <Text style={styles.detailLabel}>Humidity</Text>
          </View>

          {/* Wind */}
          <View style={[styles.weatherDetailItem, styles.borderX]}>
            <View style={styles.iconContainer}>
              <Ionicons name="speedometer-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.detailValue}>
              {Math.round(current.wind.speed)}
            </Text>
            <Text style={styles.detailLabel}>Wind (m/s)</Text>
          </View>

          {/* Rain */}
          <View style={styles.weatherDetailItem}>
            <View style={styles.iconContainer}>
              <Ionicons name="rainy-outline" size={28} color="#fff" />
            </View>
            <Text style={styles.detailValue}>
              {Math.round(current.pop * 100)}%
            </Text>
            <Text style={styles.detailLabel}>Rain</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1e40af',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 8,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  locationInfo: {
    flex: 1,
  },
  cityName: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  countryName: {
    color: '#f1f5f9',
    fontSize: 14,
    fontWeight: '500',
  },
  weatherIconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    padding: 8,
  },
  weatherIcon: {
    width: 60,
    height: 60,
  },
  temperatureContainer: {
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
    paddingBottom: 16,
  },
  temperatureRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  temperature: {
    color: 'white',
    fontSize: 56,
    fontWeight: '800',
    marginRight: 12,
  },
  temperatureDetails: {
    marginBottom: 8,
  },
  weatherDescription: {
    color: '#bfdbfe',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
    textTransform: 'capitalize',
  },
  feelsLike: {
    color: '#f1f5f9',
    fontSize: 12,
  },
  weatherDetailsContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    padding: 12,
  },
  weatherDetailsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  weatherDetailItem: {
    alignItems: 'center',
    flex: 1,
  },
  borderX: {
    marginHorizontal: 12,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
  },
  iconContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 40,
    padding: 8,
    marginBottom: 6,
  },
  detailValue: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  detailLabel: {
    color: '#f1f5f9',
    fontSize: 12,
  },
});
