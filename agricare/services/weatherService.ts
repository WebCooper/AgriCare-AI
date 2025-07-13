import axios from 'axios';

const API_KEY = 'f177a2df07c412f3d457732ad27396e1';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

export interface WeatherForecast {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  rain?: {
    "3h": number;
  };
  sys: {
    pod: string;
  };
  dt_txt: string;
}

export interface WeatherData {
  city: {
    name: string;
    country: string;
    sunrise: number;
    sunset: number;
  };
  list: WeatherForecast[];
}

export const getWeatherForecast = async (lat: number, lon: number): Promise<WeatherData> => {
  try {
    const response = await axios.get(
      `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    return {
      city: {
        name: response.data.city.name,
        country: response.data.city.country,
        sunrise: response.data.city.sunrise,
        sunset: response.data.city.sunset
      },
      list: response.data.list
    };
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

export const getWeatherIcon = (iconCode: string): string => {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
};

export const formatDateTime = (dt_txt: string): string => {
  const date = new Date(dt_txt);
  return date.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit'
  });
};

export const groupForecastByDay = (list: WeatherForecast[]): Record<string, WeatherForecast[]> => {
  return list.reduce((acc, forecast) => {
    const date = forecast.dt_txt.split(' ')[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(forecast);
    return acc;
  }, {} as Record<string, WeatherForecast[]>);
};