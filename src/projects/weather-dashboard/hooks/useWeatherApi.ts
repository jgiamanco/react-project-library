
import { useState, useCallback } from 'react';
import { WeatherData, LocationSuggestion, DailyForecast } from '../types';

// Add fahrenheit-using countries
const FAHRENHEIT_COUNTRIES = ["US", "KY", "LR", "FM", "MH", "PW"];

export const useWeatherApi = (API_KEY: string) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMetric, setUseMetric] = useState(true);

  const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
  const GEO_API_URL = "https://api.openweathermap.org/geo/1.0";

  const isZipCode = useCallback((query: string) => {
    // Match common zip code formats (US, UK, etc.)
    const zipRegex = /^\d{5}(-\d{4})?$|^\d{4,6}$/;
    return zipRegex.test(query.trim());
  }, []);

  const fetchWeatherData = useCallback(async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current weather
      const currentResponse = await fetch(
        `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather data");
      }

      const currentData = await currentResponse.json();

      // Set temperature unit based on country
      const shouldUseImperial = FAHRENHEIT_COUNTRIES.includes(currentData.sys.country);
      setUseMetric(!shouldUseImperial);

      // Fetch 5-day forecast with 3-hour intervals
      const forecastResponse = await fetch(
        `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data");
      }

      const forecastData = await forecastResponse.json();

      // Process forecast data to get daily values
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
        .slice(0, 7); // Get first 7 days

      // Transform the data to match our WeatherData interface
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
        // Use zip code endpoint
        response = await fetch(
          `${GEO_API_URL}/zip?zip=${encodeURIComponent(query)}&appid=${API_KEY}`
        );
      } else {
        // Use direct geocoding endpoint
        response = await fetch(
          `${GEO_API_URL}/direct?q=${encodeURIComponent(
            query
          )}&limit=5&appid=${API_KEY}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch location suggestions");
      }

      const data = await response.json();

      if (isZipCode(query)) {
        // Handle single zip code response
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
        // Handle multiple location responses
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
};
