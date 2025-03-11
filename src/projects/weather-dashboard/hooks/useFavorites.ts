
import { useState, useEffect, useCallback, useMemo } from 'react';
import { FavoriteLocation, WeatherData } from '../types';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = useCallback((weatherData: WeatherData | null) => {
    if (!weatherData) return;

    const isFavorite = favorites.some(
      (fav) =>
        fav.lat === weatherData.location.lat &&
        fav.lon === weatherData.location.lon
    );

    if (isFavorite) {
      setFavorites(
        favorites.filter(
          (fav) =>
            fav.lat !== weatherData.location.lat ||
            fav.lon !== weatherData.location.lon
        )
      );
    } else {
      setFavorites([
        ...favorites,
        {
          name: weatherData.location.name,
          country: weatherData.location.country,
          lat: weatherData.location.lat,
          lon: weatherData.location.lon,
        },
      ]);
    }
  }, [favorites]);

  // Check if current location is a favorite
  const checkIsFavorite = useCallback((weatherData: WeatherData | null) => {
    if (!weatherData) return false;
    return favorites.some(
      fav => 
        fav.lat === weatherData.location.lat && 
        fav.lon === weatherData.location.lon
    );
  }, [favorites]);

  return {
    favorites,
    toggleFavorite,
    checkIsFavorite
  };
};
