import { useState } from "react";
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

const getWeatherBackground = (weatherMain: string, iconCode: string) => {
  const isNight = iconCode.endsWith("n");
  const timeOfDay = isNight ? "night" : "day";

  const conditions = {
    Clear: `weather-clear-${timeOfDay}`,
    Clouds: `weather-cloudy-${timeOfDay}`,
    Rain: `weather-rainy-${timeOfDay}`,
    Snow: `weather-snowy-${timeOfDay}`,
    Thunderstorm: `weather-storm-${timeOfDay}`,
    Drizzle: `weather-rainy-${timeOfDay}`,
    Mist: `weather-misty-${timeOfDay}`,
    Fog: `weather-misty-${timeOfDay}`,
    Haze: `weather-misty-${timeOfDay}`,
  } as const;

  return (
    conditions[weatherMain as keyof typeof conditions] ||
    `weather-default-${timeOfDay}`
  );
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
    celsiusToFahrenheit
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
        className={`min-h-screen p-4 relative overflow-hidden ${
          weatherData
            ? getWeatherBackground(
                weatherData.current.weather.main,
                weatherData.current.weather.icon
              )
            : ""
        }`}
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

export default WeatherDashboard;
