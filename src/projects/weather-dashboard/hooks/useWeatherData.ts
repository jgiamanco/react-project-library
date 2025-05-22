
import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
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

  // Clear old cache entries periodically
  useEffect(() => {
    const cleanupInterval = setInterval(() => {
      const now = Date.now();
      Object.keys(weatherCacheRef.current).forEach(key => {
        if (now - weatherCacheRef.current[key].timestamp > CACHE_DURATION) {
          delete weatherCacheRef.current[key];
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(cleanupInterval);
  }, []);

  // Fetch weather data with caching
  const fetchWeatherData = useCallback(async (lat: number, lon: number): Promise<WeatherData | null> => {
    const cacheKey = `${lat.toFixed(4)},${lon.toFixed(4)}`;
    const now = Date.now();
    
    // Check if we have a valid cached response
    if (weatherCacheRef.current[cacheKey] && 
        (now - weatherCacheRef.current[cacheKey].timestamp < CACHE_DURATION)) {
      const cachedData = weatherCacheRef.current[cacheKey].data;
      setWeatherData(cachedData);
      return cachedData;
    }
    
    // No valid cache, fetch from API
    const data = await fetchWeather(lat, lon);
    if (data) {
      // Update cache
      weatherCacheRef.current[cacheKey] = {
        data,
        timestamp: now
      };
      setWeatherData(data);
    }
    return data;
  }, [fetchWeather]);

  // Handle location selection with better error handling
  const handleLocationSelect = useCallback((location: LocationSuggestion) => {
    selectLocation(location, fetchWeatherData);
  }, [selectLocation, fetchWeatherData]);

  // Check if current location is a favorite
  const isFavorite = useMemo(() => checkIsFavorite(weatherData), [checkIsFavorite, weatherData]);

  // Toggle current location as favorite
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

export default useWeatherData;
