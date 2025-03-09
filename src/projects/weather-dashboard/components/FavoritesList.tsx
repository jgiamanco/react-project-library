
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin } from "lucide-react";
import { FavoriteLocation } from "../types";

interface FavoritesListProps {
  favorites: FavoriteLocation[];
  fetchWeatherData: (lat: number, lon: number) => Promise<void>;
}

const FavoritesList: React.FC<FavoritesListProps> = ({ favorites, fetchWeatherData }) => {
  if (favorites.length === 0) {
    return null;
  }
  
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Favorite Locations</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {favorites.map((location) => (
            <Badge
              key={`${location.lat}-${location.lon}`}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => fetchWeatherData(location.lat, location.lon)}
            >
              <MapPin className="h-3 w-3 mr-1" />
              {location.name}, {location.country}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default FavoritesList;
