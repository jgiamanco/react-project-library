
import React from 'react';
import { WeatherData } from '../types';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';

interface FavoritesListProps {
  favorites: WeatherData[];
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
            key={`${favorite.name}-${index}`}
            variant="outline"
            className="w-full justify-start"
            onClick={() => fetchWeatherData(favorite.coord.lat, favorite.coord.lon)}
          >
            {favorite.name}, {favorite.sys.country}
            <span className="ml-auto">{Math.round(favorite.main.temp)}°</span>
          </Button>
        ))}
      </div>
    </ScrollArea>
  );
};

export default FavoritesList;
