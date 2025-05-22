
import { useState, useEffect, useCallback } from 'react';
import { LocationSuggestion } from '../types';

export const useWeatherSearch = (searchLocations: (query: string) => Promise<LocationSuggestion[]>) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setSuggestions([]);
      return;
    }

    const timer = setTimeout(async () => {
      const results = await searchLocations(searchQuery);
      setSuggestions(results);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, searchLocations]);

  const handleLocationSelect = useCallback((location: LocationSuggestion, onSelect: (lat: number, lon: number) => void) => {
    setSearchQuery(
      `${location.name}${location.state ? `, ${location.state}` : ""}, ${
        location.country
      }`
    );
    setIsSearchOpen(false);
    onSelect(location.lat, location.lon);
  }, []);

  return {
    searchQuery,
    setSearchQuery,
    suggestions,
    isSearchOpen,
    setIsSearchOpen,
    handleLocationSelect
  };
};
