import React from "react";
import CodeViewer from "@/components/CodeViewer";

export const WeatherDashboardCode = () => {
  const files = [
    {
      name: "WeatherDashboard.tsx",
      content: `import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { WeatherDisplay } from './components/WeatherDisplay';
import { ForecastList } from './components/ForecastList';
import { WeatherData, Forecast } from './types';
// ... Rest of WeatherDashboard.tsx code ...`,
      language: "typescript",
    },
    {
      name: "components/WeatherDisplay.tsx",
      content: `import React from 'react';
import { Card } from '@/components/ui';
import { WeatherData } from '../types';
// ... Rest of WeatherDisplay.tsx code ...`,
      language: "typescript",
    },
    {
      name: "components/ForecastList.tsx",
      content: `import React from 'react';
import { Card } from '@/components/ui';
import { Forecast } from '../types';
// ... Rest of ForecastList.tsx code ...`,
      language: "typescript",
    },
    {
      name: "types.ts",
      content: `export interface WeatherData {
  temperature: number;
  condition: string;
  humidity: number;
  windSpeed: number;
  location: string;
}

export interface Forecast {
  date: string;
  temperature: number;
  condition: string;
}`,
      language: "typescript",
    },
    {
      name: "styles/weather-animations.css",
      content: `/* Weather condition animations */
.sunny {
  background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
}

.rainy {
  background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}

.cloudy {
  background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}`,
      language: "css",
    },
  ];

  return <CodeViewer files={files} title="Weather Dashboard Code" />;
};

export default WeatherDashboardCode;
