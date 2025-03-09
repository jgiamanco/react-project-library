
import React from 'react';
import { Line } from "react-chartjs-2";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { DailyForecast } from "../types";

interface WeatherChartProps {
  forecast: DailyForecast[];
  useMetric: boolean;
  celsiusToFahrenheit: (celsius: number) => number;
}

const WeatherChart: React.FC<WeatherChartProps> = ({ 
  forecast, 
  useMetric,
  celsiusToFahrenheit
}) => {
  const chartData = {
    labels: forecast.map((day) => day.date) || [],
    datasets: [
      {
        label: `Max Temperature (°${useMetric ? "C" : "F"})`,
        data:
          forecast.map((day) =>
            useMetric ? day.temp.max : celsiusToFahrenheit(day.temp.max)
          ) || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: `Min Temperature (°${useMetric ? "C" : "F"})`,
        data:
          forecast.map((day) =>
            useMetric ? day.temp.min : celsiusToFahrenheit(day.temp.min)
          ) || [],
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "7-Day Temperature Forecast",
      },
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Temperature Trend</CardTitle>
      </CardHeader>
      <CardContent>
        <Line options={chartOptions} data={chartData} />
      </CardContent>
    </Card>
  );
};

export default WeatherChart;
