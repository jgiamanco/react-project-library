
import React from "react";
import CodeViewer from "@/components/CodeViewer";

export const WeatherDashboardCode = () => {
  const files = {
    "WeatherDashboard.tsx": `import React, { useState, useEffect } from 'react';
import { Input, Button, Card } from '@/components/ui';
import { WeatherDisplay } from './components/WeatherDisplay';
import { ForecastList } from './components/ForecastList';
import { WeatherData, Forecast } from './types';
// ... Rest of WeatherDashboard.tsx code ...`,
    "components/WeatherDisplay.tsx": `import React from 'react';
import { Card } from '@/components/ui';
import { WeatherData } from '../types';
// ... Rest of WeatherDisplay.tsx code ...`,
    "components/ForecastList.tsx": `import React from 'react';
import { Card } from '@/components/ui';
import { Forecast } from '../types';
// ... Rest of ForecastList.tsx code ...`,
    "types.ts": `export interface WeatherData {
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
    "styles/weather-animations.css": `/* Weather condition animations */
.sunny {
  background: linear-gradient(120deg, #f6d365 0%, #fda085 100%);
}

.rainy {
  background: linear-gradient(120deg, #89f7fe 0%, #66a6ff 100%);
}

.cloudy {
  background: linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%);
}`
  };

  return <CodeViewer files={files} />;
};

export default WeatherDashboardCode;
