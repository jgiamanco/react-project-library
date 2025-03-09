
export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
  forecast: DailyForecast[];
}

export interface FavoriteLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}

export interface DailyForecast {
  date: string;
  temp: {
    min: number;
    max: number;
  };
  weather: {
    main: string;
    description: string;
    icon: string;
  };
}

export interface LocationSuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

export interface GeocodingResponse {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}
