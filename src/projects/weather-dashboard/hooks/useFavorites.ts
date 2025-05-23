import { useState, useEffect, useCallback } from "react";
import { FavoriteLocation, WeatherData } from "../types";
import { WeatherFavorites } from "@/services/types";
import { useAuth } from "@/contexts/auth-hooks";
import { supabase } from "@/services/supabase-client";

export const useFavorites = () => {
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const { user } = useAuth();

  // Load favorites from Supabase if user is logged in, otherwise from localStorage
  useEffect(() => {
    const loadFavorites = async () => {
      try {
        if (user) {
          try {
            const { data, error } = await supabase
              .from("project_sessions")
              .select("settings")
              .eq("user_id", user.email)
              .eq("project_id", "weather-dashboard")
              .single();

            if (error) {
              console.warn("Could not load favorites from Supabase:", error);
              loadFromLocalStorage();
            } else if (data?.settings?.favorites) {
              setFavorites(data.settings.favorites);
            } else {
              loadFromLocalStorage();
            }
          } catch (error) {
            console.error("Error loading favorites:", error);
            loadFromLocalStorage();
          }
        } else {
          // Not logged in, use localStorage
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Unexpected error loading favorites:", error);
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedFavorites = localStorage.getItem("weatherFavorites");
        if (savedFavorites) {
          setFavorites(JSON.parse(savedFavorites));
        }
      } catch (e) {
        console.error("Error loading from localStorage:", e);
      }
    };

    loadFavorites();
  }, [user]);

  // Save favorites to localStorage always, attempt Supabase if logged in
  useEffect(() => {
    const saveFavorites = async () => {
      try {
        // Always save to localStorage as fallback
        localStorage.setItem("weatherFavorites", JSON.stringify(favorites));

        // If logged in, try to save to Supabase
        if (user) {
          try {
            const { error } = await supabase.from("project_sessions").upsert(
              {
                user_id: user.email,
                project_id: "weather-dashboard",
                last_accessed: new Date().toISOString(),
                settings: { favorites: favorites },
              },
              {
                onConflict: "user_id,project_id",
              }
            );

            if (error) {
              console.warn("Could not save favorites to Supabase:", error);
              // Silent failure - data is already in localStorage
            }
          } catch (error) {
            console.error("Error saving favorites to Supabase:", error);
          }
        }
      } catch (error) {
        console.error("Unexpected error saving favorites:", error);
      }
    };

    // Only save if there are favorites to save or if we're clearing the list
    if (favorites.length > 0 || localStorage.getItem("weatherFavorites")) {
      saveFavorites();
    }
  }, [favorites, user]);

  const toggleFavorite = useCallback(
    (weatherData: WeatherData | null) => {
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
    },
    [favorites]
  );

  // Check if current location is a favorite
  const checkIsFavorite = useCallback(
    (weatherData: WeatherData | null) => {
      if (!weatherData) return false;
      return favorites.some(
        (fav) =>
          fav.lat === weatherData.location.lat &&
          fav.lon === weatherData.location.lon
      );
    },
    [favorites]
  );

  return {
    favorites,
    toggleFavorite,
    checkIsFavorite,
  };
};
