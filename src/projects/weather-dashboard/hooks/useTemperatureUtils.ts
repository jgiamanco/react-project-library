
import { useCallback } from 'react';

export const useTemperatureUtils = (useMetric: boolean) => {
  const celsiusToFahrenheit = useCallback((celsius: number) => {
    return (celsius * 9) / 5 + 32;
  }, []);

  const formatTemp = useCallback((celsius: number) => {
    const temp = useMetric ? celsius : celsiusToFahrenheit(celsius);
    return `${Math.round(temp)}°${useMetric ? "C" : "F"}`;
  }, [useMetric, celsiusToFahrenheit]);

  return {
    celsiusToFahrenheit,
    formatTemp
  };
};
