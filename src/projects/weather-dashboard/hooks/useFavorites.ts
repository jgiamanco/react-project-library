
import { useState, useEffect, useCallback } from 'react';
import { FavoriteLocation, WeatherData, WeatherFavorites } from '../types';
import { useAuth } from '@/contexts/auth-hooks';
import { supabase } from '@/services/supabase-client';

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const { user } = useAuth();

  // Load favorites from Supabase if user is logged in, otherwise from localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('project_sessions')
            .select('settings')
            .eq('user_id', user.email)
            .eq('project_id', 'weather-dashboard')
            .single();

          if (error) {
            if (error.code !== 'PGRST116') { // PGRST116 means no rows returned
              console.error('Error loading favorites from Supabase:', error);
            }
            // Fall back to localStorage if no data in Supabase
            const savedFavorites = localStorage.getItem("weatherFavorites");
            if (savedFavorites) {
              const parsedFavorites = JSON.parse(savedFavorites);
              setFavorites(parsedFavorites);
            }
          } else if (data?.settings?.favorites) {
            setFavorites(data.settings.favorites);
          }
        } catch (error) {
          console.error('Error loading favorites:', error);
          const savedFavorites = localStorage.getItem("weatherFavorites");
          if (savedFavorites) {
            setFavorites(JSON.parse(savedFavorites));
          }
        }
      } else {
        // Not logged in, use localStorage
        const savedFavorites = localStorage.getItem("weatherFavorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      }
    };

    loadFavorites();
  }, [user]);

  // Save favorites to Supabase when they change
  useEffect(() => {
    const saveFavorites = async () => {
      // Always save to localStorage as fallback
      localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
      
      // If logged in, save to Supabase
      if (user) {
        try {
          const weatherFavorites: WeatherFavorites = { favorites };
          
          const { data, error } = await supabase
            .from('project_sessions')
            .upsert({
              user_id: user.email,
              project_id: 'weather-dashboard',
              last_accessed: new Date().toISOString(),
              settings: { favorites: favorites },
            }, {
              onConflict: 'user_id,project_id'
            });

          if (error) {
            console.error('Error saving favorites to Supabase:', error);
          }
        } catch (error) {
          console.error('Error saving favorites:', error);
        }
      }
    };

    // Only save if there are favorites to save or if we're clearing the list
    if (favorites.length > 0 || localStorage.getItem("weatherFavorites")) {
      saveFavorites();
    }
  }, [favorites, user]);

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
