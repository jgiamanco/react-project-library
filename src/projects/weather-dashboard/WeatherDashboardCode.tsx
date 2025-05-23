
import CodeViewer from "@/components/CodeViewer";

export const WeatherDashboardCode = () => {
  const files = {
    "WeatherDashboard.tsx": `import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Search, Star, MapPin, Wind, Droplets, ThermometerSun } from "lucide-react";
import { WeatherData, FavoriteLocation } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Command, CommandInput, CommandList, CommandItem } from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import "./weather-animations.css";

// Component implementation...`,
    "types.ts": `export interface WeatherData {
  location: {
    name: string;
    country: string;
    lat: number;
    lon: number;
  };
  current: {
    temp: number;
    feels_like: number;
    humidity: number;
    wind_speed: number;
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  };
  forecast: Array<{
    date: string;
    temp: {
      min: number;
      max: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    };
  }>;
}

export interface FavoriteLocation {
  name: string;
  country: string;
  lat: number;
  lon: number;
}`,
    "weather-animations.css": `.weather-overlay {
  background: linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2));
  pointer-events: none;
}

.weather-clear-day {
  background: linear-gradient(to bottom right, #87ceeb, #4a90e2);
}

.weather-clear-night {
  background: linear-gradient(to bottom right, #1a1a2e, #16213e);
}

/* Additional weather animations... */`,
  };

  return <CodeViewer files={files} />;
};

export default WeatherDashboardCode;
