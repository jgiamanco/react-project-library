
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { MapPin, Star, ThermometerSun, Wind, Droplets } from "lucide-react";
import { WeatherData, FavoriteLocation } from "../types";

interface WeatherCardProps {
  weatherData: WeatherData;
  useMetric: boolean;
  setUseMetric: (useMetric: boolean) => void;
  favorites: FavoriteLocation[];
  toggleFavorite: () => void;
  formatTemp: (temp: number) => string;
}

const WeatherCard: React.FC<WeatherCardProps> = ({
  weatherData,
  useMetric,
  setUseMetric,
  favorites,
  toggleFavorite,
  formatTemp
}) => {
  const isFavorite = favorites.some(
    (fav) =>
      fav.lat === weatherData.location.lat &&
      fav.lon === weatherData.location.lon
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="h-5 w-5 mr-2" />
            <CardTitle className="text-xl">
              {weatherData.location.name}, {weatherData.location.country}
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <ToggleGroup
              type="single"
              value={useMetric ? "C" : "F"}
              onValueChange={(value) => value && setUseMetric(value === "C")}
            >
              <ToggleGroupItem value="C" size="sm">
                °C
              </ToggleGroupItem>
              <ToggleGroupItem value="F" size="sm">
                °F
              </ToggleGroupItem>
            </ToggleGroup>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleFavorite}
              className={isFavorite ? "text-yellow-500" : ""}
            >
              <Star className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="text-4xl font-bold">
            {formatTemp(weatherData.current.temp)}
          </div>
          <img
            src={`http://openweathermap.org/img/wn/${weatherData.current.weather.icon}@2x.png`}
            alt={weatherData.current.weather.description}
            className="w-16 h-16"
          />
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center">
            <ThermometerSun className="h-5 w-5 mr-2" />
            Feels like: {formatTemp(weatherData.current.feels_like)}
          </div>
          <div className="flex items-center">
            <Wind className="h-5 w-5 mr-2" />
            Wind: {weatherData.current.wind_speed} m/s
          </div>
          <div className="flex items-center">
            <Droplets className="h-5 w-5 mr-2" />
            Humidity: {weatherData.current.humidity}%
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
