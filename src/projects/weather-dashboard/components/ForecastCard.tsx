
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { DailyForecast } from "../types";

interface ForecastCardProps {
  forecast: DailyForecast[];
  formatTemp: (temp: number) => string;
}

const ForecastCard: React.FC<ForecastCardProps> = ({ forecast, formatTemp }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>7-Day Forecast</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {forecast.map((day) => (
            <div
              key={day.date}
              className="flex items-center justify-between p-2 hover:bg-gray-50 rounded"
            >
              <div className="flex items-center">
                <img
                  src={`http://openweathermap.org/img/wn/${day.weather.icon}.png`}
                  alt={day.weather.description}
                  className="w-8 h-8"
                />
                <span className="ml-2">{day.date}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-blue-500">
                  {formatTemp(day.temp.min)
                    .replace("°C", "")
                    .replace("°F", "")}
                  °
                </span>
                <span>-</span>
                <span className="text-red-500">
                  {formatTemp(day.temp.max)
                    .replace("°C", "")
                    .replace("°F", "")}
                  °
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default ForecastCard;
