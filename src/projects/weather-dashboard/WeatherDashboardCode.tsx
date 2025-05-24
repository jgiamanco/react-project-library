import React from "react";
import CodeViewer from "@/components/CodeViewer";

export const WeatherDashboardCode = () => {
  const files = {
    "WeatherDashboard.tsx": `import { useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useWeatherData from "./hooks/useWeatherData";
import LocationSearch from "./components/LocationSearch";
import WeatherCard from "./components/WeatherCard";
import ForecastCard from "./components/ForecastCard";
import WeatherChart from "./components/WeatherChart";
import FavoritesList from "./components/FavoritesList";
import "./weather-animations.css";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;

const getWeatherBackground = (weatherMain, iconCode) => {
  const isNight = iconCode.endsWith("n");
  const timeOfDay = isNight ? "night" : "day";

  const conditions = {
    Clear: \`weather-clear-\${timeOfDay}\`,
    Clouds: \`weather-cloudy-\${timeOfDay}\`,
    Rain: \`weather-rainy-\${timeOfDay}\`,
    Snow: \`weather-snowy-\${timeOfDay}\`,
    Thunderstorm: \`weather-storm-\${timeOfDay}\`,
    Drizzle: \`weather-rainy-\${timeOfDay}\`,
    Mist: \`weather-misty-\${timeOfDay}\`,
    Fog: \`weather-misty-\${timeOfDay}\`,
    Haze: \`weather-misty-\${timeOfDay}\`,
  };

  return conditions[weatherMain] || \`weather-default-\${timeOfDay}\`;
};

const WeatherDashboard = () => {
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    isSearchOpen,
    setIsSearchOpen,
    weatherData,
    favorites,
    loading,
    error,
    useMetric,
    setUseMetric,
    fetchWeatherData,
    handleLocationSelect,
    toggleFavorite,
    formatTemp,
    celsiusToFahrenheit,
  } = useWeatherData(API_KEY || "");

  if (!API_KEY || API_KEY === "your_api_key_here") {
    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>Weather Dashboard</CardTitle>
            <CardDescription className="text-red-500">
              API Key Not Configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="mb-4">To use the Weather Dashboard, you need to:</p>
              <ol className="list-decimal list-inside text-left space-y-2">
                <li>
                  Sign up for a free API key at{" "}
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    OpenWeatherMap
                  </a>
                </li>
                <li>
                  Create a{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">.env</code>{" "}
                  file in the project root
                </li>
                <li>
                  Add your API key:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    VITE_OPENWEATHERMAP_API_KEY=your_api_key_here
                  </code>
                </li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div
        className={\`min-h-screen p-4 relative overflow-hidden \${
          weatherData
            ? getWeatherBackground(
                weatherData.current.weather.main,
                weatherData.current.weather.icon
              )
            : ""
        }\`}
      >
        <div className="weather-overlay absolute inset-0" />
        <Card className="mx-auto max-w-4xl relative z-10 bg-background/95 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>Weather Dashboard</CardTitle>
            <CardDescription>
              Search for a location to view current weather and forecast
            </CardDescription>
          </CardHeader>
          <CardContent>
            <LocationSearch
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              suggestions={suggestions}
              isSearchOpen={isSearchOpen}
              setIsSearchOpen={setIsSearchOpen}
              handleLocationSelect={handleLocationSelect}
              loading={loading}
            />

            {error && <div className="text-red-500 mb-4">{error}</div>}

            {loading && <div className="text-center py-8">Loading...</div>}

            {weatherData && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <WeatherCard
                    weatherData={weatherData}
                    useMetric={useMetric}
                    setUseMetric={setUseMetric}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    formatTemp={formatTemp}
                  />

                  <ForecastCard
                    forecast={weatherData.forecast}
                    formatTemp={formatTemp}
                  />
                </div>

                <WeatherChart
                  forecast={weatherData.forecast}
                  useMetric={useMetric}
                  celsiusToFahrenheit={celsiusToFahrenheit}
                />
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Saved Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <FavoritesList
                  favorites={favorites}
                  fetchWeatherData={fetchWeatherData}
                />
              </CardContent>
              <CardFooter className="text-sm text-gray-500">
                Click on a location to load its weather data.
              </CardFooter>
            </Card>
          </CardContent>
          <CardFooter className="text-sm text-gray-500">
            Data provided by OpenWeatherMap
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default WeatherDashboard;`,
    "hooks/useWeatherData.ts": `import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { WeatherData, LocationSuggestion } from '../types';
import { useWeatherApi } from './useWeatherApi';
import { useTemperatureUtils } from './useTemperatureUtils';
import { useFavorites } from './useFavorites';
import { useWeatherSearch } from './useWeatherSearch';

interface WeatherCache {
  [key: string]: {
    data: WeatherData;
    timestamp: number;
  };
}

export const useWeatherData = (API_KEY: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const weatherCacheRef = useRef<WeatherCache>({});
  const CACHE_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds
  
  const {
    loading,
    error,
    useMetric,
    setUseMetric,
    fetchWeatherData: fetchWeather,
    searchLocations
  } = useWeatherApi(API_KEY);
  
  const { celsiusToFahrenheit, formatTemp } = useTemperatureUtils(useMetric);
  
  const { favorites, toggleFavorite, checkIsFavorite } = useFavorites();
  
  const {
    searchQuery,
    setSearchQuery,
    suggestions,
    isSearchOpen,
    setIsSearchOpen,
    handleLocationSelect: selectLocation
  } = useWeatherSearch(searchLocations);

  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      Object.keys(weatherCacheRef.current).forEach(key => {
        if (now - weatherCacheRef.current[key].timestamp > CACHE_DURATION) {
          delete weatherCacheRef.current[key];
        }
      });
    }, 60000);
    
    return () => clearInterval(cleanupInterval);
  }, []);

  const fetchWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    const cacheKey = \`\${lat.toFixed(4)},\${lon.toFixed(4)}\`;
    const now = Date.now();
    
    if (weatherCacheRef.current[cacheKey] && 
        (now - weatherCacheRef.current[cacheKey].timestamp < CACHE_DURATION)) {
      const cachedData = weatherCacheRef.current[cacheKey].data;
      setWeatherData(cachedData);
      return cachedData;
    }
    
    const data = await fetchWeather(lat, lon);
    if (data) {
      weatherCacheRef.current[cacheKey] = {
        data,
        timestamp: now
      };
      setWeatherData(data);
    }
    return data;
  }, [fetchWeather]);

  const handleLocationSelect = useCallback((location: LocationSuggestion) => {
    selectLocation(location, fetchWeatherData);
  }, [selectLocation, fetchWeatherData]);

  const isFavorite = useMemo(() => checkIsFavorite(weatherData), [checkIsFavorite, weatherData]);

  const handleToggleFavorite = useCallback(() => toggleFavorite(weatherData), [toggleFavorite, weatherData]);

  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    isSearchOpen,
    setIsSearchOpen,
    weatherData,
    favorites,
    loading,
    error,
    useMetric,
    setUseMetric,
    fetchWeatherData,
    handleLocationSelect,
    toggleFavorite: handleToggleFavorite,
    formatTemp,
    celsiusToFahrenheit,
    isFavorite
  };
};

export default useWeatherData;`,
    "components/LocationSearch.tsx": `import React from 'react';
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import { LocationSuggestion } from "../types";

interface LocationSearchProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  suggestions: LocationSuggestion[];
  isSearchOpen: boolean;
  setIsSearchOpen: (isOpen: boolean) => void;
  handleLocationSelect: (location: LocationSuggestion) => void;
  loading: boolean;
}

const LocationSearch: React.FC<LocationSearchProps> = ({
  searchQuery,
  setSearchQuery,
  suggestions,
  isSearchOpen,
  setIsSearchOpen,
  handleLocationSelect,
  loading
}) => {
  return (
    <div className="flex space-x-2 mb-6">
      <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <PopoverTrigger asChild>
          <div className="flex-1">
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by city name or zip code (e.g., London, 10001, Paris, FR)..."
              className="w-full"
            />
          </div>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandList>
              {suggestions.map((suggestion) => (
                <CommandItem
                  key={\`\${suggestion.lat}-\${suggestion.lon}\`}
                  onSelect={() => handleLocationSelect(suggestion)}
                  className="flex items-center gap-2 p-2 cursor-pointer"
                >
                  <MapPin className="h-4 w-4" />
                  <span>
                    {suggestion.name}
                    {suggestion.state && \`, \${suggestion.state}\`}
                    {suggestion.country && \`, \${suggestion.country}\`}
                  </span>
                </CommandItem>
              ))}
              {suggestions.length === 0 && searchQuery.trim() !== "" && (
                <div className="p-2 text-sm text-muted-foreground">
                  No locations found
                </div>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      <Button
        onClick={() => handleLocationSelect(suggestions[0])}
        disabled={loading || suggestions.length === 0}
      >
        <Search className="h-4 w-4 mr-2" />
        Search
      </Button>
    </div>
  );
};

export default LocationSearch;`,
    "components/WeatherCard.tsx": `import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MapPin, Star, ThermometerSun, Wind, Droplets } from "lucide-react";
import { WeatherData, FavoriteLocation } from "../types";

interface WeatherCardProps {
  weatherData: WeatherData;
  useMetric: boolean;
  setUseMetric: (useMetric: boolean) => void;
  favorites: FavoriteLocation[];
  toggleFavorite: () => void;
  formatTemp: (temp: number) => string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  useMetric,
  setUseMetric,
  favorites,
  toggleFavorite,
  formatTemp
}) => {
  const isFavorite = favorites.some(
    (fav) =>
      fav.lat === weatherData.location.lat &&
      fav.lon === weatherData.location.lon
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <CardTitle className="text-xl">
              {weatherData.location.name}, {weatherData.location.country}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={useMetric ? "C" : "F"}
              onValueChange={(value) => value && setUseMetric(value === "C")}
            >
              <ToggleGroupItem value="C" size="sm">
                °C
              </ToggleGroupItem>
              <ToggleGroupItem value="F" size="sm">
                °F
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite ? "text-yellow-500" : ""}
            >
              <Star className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold">
            {formatTemp(weatherData.current.temp)}
          </div>
          <img
            src={\`http://openweathermap.org/img/wn/\${weatherData.current.weather.icon}@2x.png\`}
            alt={weatherData.current.weather.description}
            className="w-16 h-16"
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <ThermometerSun className="h-5 w-5 mr-2" />
            Feels like: {formatTemp(weatherData.current.feels_like)}
          </div>
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2" />
            Wind: {weatherData.current.wind_speed} m/s
          </div>
          <div className="flex items-center">
            <Droplets className="h-5 w-5 mr-2" />
            Humidity: {weatherData.current.humidity}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;`,
    "components/ForecastCard.tsx": `import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { DailyForecast } from "../types";

interface ForecastCardProps {
  forecast: DailyForecast[];
  formatTemp: (temp: number) => string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, formatTemp }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center">
                <img
                  src={\`http://openweathermap.org/img/wn/\${day.weather.icon}.png\`}
                  alt={day.weather.description}
                  className="w-8 h-8"
                />
                <span className="ml-2">{day.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">
                  {formatTemp(day.temp.min).replace("°C", "").replace("°F", "")}°
                </span>
                <span>-</span>
                <span className="text-red-500">
                  {formatTemp(day.temp.max).replace("°C", "").replace("°F", "")}°
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;`,
    "components/WeatherChart.tsx": `import React, { useMemo } from 'react';
import { Line } from "react-chartjs-2";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { DailyForecast } from "../types";

interface WeatherChartProps {
  forecast: DailyForecast[];
  useMetric: boolean;
  celsiusToFahrenheit: (celsius: number) => number;
}

const WeatherChart: React.FC<WeatherChartProps> = React.memo(({ 
  forecast, 
  useMetric,
  celsiusToFahrenheit
}) => {
  const chartData = useMemo(() => ({
    labels: forecast.map((day) => day.date) || [],
    datasets: [
      {
        label: \`Max Temperature (°\${useMetric ? "C" : "F"})\`,
        data:
          forecast.map((day) =>
            useMetric ? day.temp.max : celsiusToFahrenheit(day.temp.max)
          ) || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: \`Min Temperature (°\${useMetric ? "C" : "F"})\`,
        data:
          forecast.map((day) =>
            useMetric ? day.temp.min : celsiusToFahrenheit(day.temp.min)
          ) || [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  }), [forecast, useMetric, celsiusToFahrenheit]);

  const chartOptions = useMemo(() => ({
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "7-Day Temperature Forecast",
      },
    },
    maintainAspectRatio: false,
  }), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
        <Line options={chartOptions} data={chartData} />
      </CardContent>
    </Card>
  );
});

WeatherChart.displayName = "WeatherChart";

export default WeatherChart;`,
    "components/FavoritesList.tsx": `import React from 'react';
import { FavoriteLocation, WeatherData } from '../types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  fetchWeatherData: (lat: number, lon: number) => Promise<WeatherData | null | void>;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, fetchWeatherData }) => {
  if (favorites.length === 0) {
    return (
      <div className="text-center p-4 text-muted-foreground">
        No favorites saved yet. Click the star icon to save locations.
      </div>
    );
  }

  return (
    <ScrollArea className="h-[200px] pr-3">
      <div className="space-y-2">
        {favorites.map((favorite, index) => (
          <Button
            key={\`\${favorite.name}-\${index}\`}
            variant="outline"
            className="w-full justify-start"
            onClick={() => fetchWeatherData(favorite.lat, favorite.lon)}
          >
            {favorite.name}, {favorite.country}
            <span className="ml-auto">Saved</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FavoritesList;`,
    "hooks/useWeatherApi.ts": `import { useState, useCallback } from 'react';
import { WeatherData, LocationSuggestion, DailyForecast } from '../types';

const FAHRENHEIT_COUNTRIES = ["US", "KY", "LR", "FM", "MH", "PW"];

export const useWeatherApi = (API_KEY: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMetric, setUseMetric] = useState(true);

  const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
  const GEO_API_URL = "https://api.openweathermap.org/geo/1.0";

  const isZipCode = useCallback((query: string) => {
    const zipRegex = /^\\d{5}(-\\d{4})?$|^\\d{4,6}$/;
    return zipRegex.test(query.trim());
  }, []);

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      const currentResponse = await fetch(
        \`\${API_BASE_URL}/weather?lat=\${lat}&lon=\${lon}&units=metric&appid=\${API_KEY}\`
      );

      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather data");
      }

      const currentData = await currentResponse.json();

      const shouldUseImperial = FAHRENHEIT_COUNTRIES.includes(currentData.sys.country);
      setUseMetric(!shouldUseImperial);

      const forecastResponse = await fetch(
        \`\${API_BASE_URL}/forecast?lat=\${lat}&lon=\${lon}&units=metric&appid=\${API_KEY}\`
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data");
      }

      const forecastData = await forecastResponse.json();

      const dailyForecasts = forecastData.list
        .reduce((acc: DailyForecast[], item: any) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          const existing = acc.find((f) => f.date === date);

          if (!existing) {
            acc.push({
              date,
              temp: {
                min: item.main.temp_min,
                max: item.main.temp_max,
              },
              weather: item.weather[0],
            });
          } else {
            existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
            existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
          }

          return acc;
        }, [])
        .slice(0, 7);

      const transformedData: WeatherData = {
        location: {
          name: currentData.name,
          country: currentData.sys.country,
          lat: currentData.coord.lat,
          lon: currentData.coord.lon,
        },
        current: {
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          humidity: currentData.main.humidity,
          wind_speed: currentData.wind.speed,
          weather: {
            main: currentData.weather[0].main,
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
          },
        },
        forecast: dailyForecasts,
      };

      return transformedData;
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Error fetching weather data:", err);
      return null;
    } finally {
      setLoading(false);
    }
  }, [API_KEY, API_BASE_URL]);

  const searchLocations = useCallback(async (query: string) => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    try {
      let response;
      if (isZipCode(query)) {
        response = await fetch(
          \`\${GEO_API_URL}/zip?zip=\${encodeURIComponent(query)}&appid=\${API_KEY}\`
        );
      } else {
        response = await fetch(
          \`\${GEO_API_URL}/direct?q=\${encodeURIComponent(
            query
          )}&limit=5&appid=\${API_KEY}\`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch location suggestions");
      }

      const data = await response.json();

      if (isZipCode(query)) {
        if ("name" in data) {
          return [{
            name: data.name,
            country: data.country,
            lat: data.lat,
            lon: data.lon,
            state: undefined,
          }];
        } else {
          return [];
        }
      } else {
        return (Array.isArray(data) ? data : []).map((item: any) => ({
          name: item.name,
          state: item.state,
          country: item.country,
          lat: item.lat,
          lon: item.lon,
        }));
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      return [];
    }
  }, [API_KEY, GEO_API_URL, isZipCode]);

  return {
    loading,
    error,
    useMetric,
    setUseMetric,
    fetchWeatherData,
    searchLocations
  };
};`,
    "hooks/useTemperatureUtils.ts": `import { useCallback } from 'react';

export const useTemperatureUtils = (useMetric: boolean) => {
  const celsiusToFahrenheit = useCallback((celsius: number) => {
    return (celsius * 9) / 5 + 32;
  }, []);

  const formatTemp = useCallback((celsius: number) => {
    const temp = useMetric ? celsius : celsiusToFahrenheit(celsius);
    return \`\${Math.round(temp)}°\${useMetric ? "C" : "F"}\`;
  }, [useMetric, celsiusToFahrenheit]);

  return {
    celsiusToFahrenheit,
    formatTemp
  };
};`,
  };

  return <CodeViewer files={files} />;
};

export default WeatherDashboardCode;