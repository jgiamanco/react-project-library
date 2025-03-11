
import { useState, useMemo } from 'react';
import { WeatherData, LocationSuggestion } from '../types';
import { useWeatherApi } from './useWeatherApi';
import { useTemperatureUtils } from './useTemperatureUtils';
import { useFavorites } from './useFavorites';
import { useWeatherSearch } from './useWeatherSearch';

export const useWeatherData = (API_KEY: string) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  
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

  // Fetch weather data for a location
  const fetchWeatherData = async (lat: number, lon: number): Promise<WeatherData | null> => {
    const data = await fetchWeather(lat, lon);
    if (data) {
      setWeatherData(data);
    }
    return data;
  };

  // Handle location selection
  const handleLocationSelect = (location: LocationSuggestion) => {
    selectLocation(location, fetchWeatherData);
  };

  // Check if current location is a favorite
  const isFavorite = useMemo(() => checkIsFavorite(weatherData), [checkIsFavorite, weatherData]);

  // Toggle current location as favorite
  const handleToggleFavorite = () => toggleFavorite(weatherData);

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
