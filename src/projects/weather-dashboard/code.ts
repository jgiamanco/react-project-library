import WeatherDashboard from "./WeatherDashboard";

const weatherDashboardCode = [
  {
    name: "index.tsx",
    language: "typescript",
    content: `import WeatherDashboard from './WeatherDashboard';

export default function App() {
  return <WeatherDashboard />;
}`,
  },
  {
    name: "types.ts",
    language: "typescript",
    content: `export interface WeatherData {
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
  forecast: {
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
  }[];
}

export interface FavoriteLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}`,
  },
];

export default weatherDashboardCode;
