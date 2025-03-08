import { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  Search,
  Star,
  MapPin,
  Wind,
  Droplets,
  ThermometerSun,
} from "lucide-react";
import { WeatherData, FavoriteLocation } from "./types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import "./weather-animations.css";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const API_KEY = import.meta.env.VITE_OPENWEATHERMAP_API_KEY;
const API_BASE_URL = "https://api.openweathermap.org/data/2.5";
const GEO_API_URL = "https://api.openweathermap.org/geo/1.0";

// Add fahrenheit-using countries
const FAHRENHEIT_COUNTRIES = ["US", "KY", "LR", "FM", "MH", "PW"];

const celsiusToFahrenheit = (celsius: number) => (celsius * 9) / 5 + 32;

interface ForecastItem {
  dt: number;
  main: {
    temp_min: number;
    temp_max: number;
  };
  weather: Array<{
    main: string;
    description: string;
    icon: string;
  }>;
}

interface DailyForecast {
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
}

interface LocationSuggestion {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

interface GeocodingResponse {
  name: string;
  state?: string;
  country: string;
  lat: number;
  lon: number;
}

const isZipCode = (query: string) => {
  // Match common zip code formats (US, UK, etc.)
  const zipRegex = /^\d{5}(-\d{4})?$|^\d{4,6}$/;
  return zipRegex.test(query.trim());
};

// Update weather condition mapping
const getWeatherBackground = (weatherMain: string, iconCode: string) => {
  const isNight = iconCode.endsWith("n");
  const timeOfDay = isNight ? "night" : "day";

  const conditions = {
    Clear: `weather-clear-${timeOfDay}`,
    Clouds: `weather-cloudy-${timeOfDay}`,
    Rain: `weather-rainy-${timeOfDay}`,
    Snow: `weather-snowy-${timeOfDay}`,
    Thunderstorm: `weather-storm-${timeOfDay}`,
    Drizzle: `weather-rainy-${timeOfDay}`,
    Mist: `weather-misty-${timeOfDay}`,
    Fog: `weather-misty-${timeOfDay}`,
    Haze: `weather-misty-${timeOfDay}`,
  } as const;

  return (
    conditions[weatherMain as keyof typeof conditions] ||
    `weather-default-${timeOfDay}`
  );
};

const WeatherDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [favorites, setFavorites] = useState<FavoriteLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [useMetric, setUseMetric] = useState(true);

  // Load favorites from localStorage on mount
  useEffect(() => {
    const savedFavorites = localStorage.getItem("weatherFavorites");
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites));
    }
  }, []);

  // Save favorites to localStorage when they change
  useEffect(() => {
    localStorage.setItem("weatherFavorites", JSON.stringify(favorites));
  }, [favorites]);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      setLoading(true);
      setError(null);

      // Fetch current weather
      const currentResponse = await fetch(
        `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!currentResponse.ok) {
        throw new Error("Failed to fetch current weather data");
      }

      const currentData = await currentResponse.json();

      // Set temperature unit based on country
      setUseMetric(!FAHRENHEIT_COUNTRIES.includes(currentData.sys.country));

      // Fetch 5-day forecast with 3-hour intervals
      const forecastResponse = await fetch(
        `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${API_KEY}`
      );

      if (!forecastResponse.ok) {
        throw new Error("Failed to fetch forecast data");
      }

      const forecastData = await forecastResponse.json();

      // Process forecast data to get daily values
      const dailyForecasts = forecastData.list
        .reduce((acc: DailyForecast[], item: ForecastItem) => {
          const date = new Date(item.dt * 1000).toLocaleDateString();
          const existing = acc.find((f) => f.date === date);

          if (!existing) {
            acc.push({
              date,
              temp: {
                min: item.main.temp_min,
                max: item.main.temp_max,
              },
              weather: item.weather[0],
            });
          } else {
            existing.temp.min = Math.min(existing.temp.min, item.main.temp_min);
            existing.temp.max = Math.max(existing.temp.max, item.main.temp_max);
          }

          return acc;
        }, [])
        .slice(0, 7); // Get first 7 days

      // Transform the data to match our WeatherData interface
      const transformedData: WeatherData = {
        location: {
          name: currentData.name,
          country: currentData.sys.country,
          lat: currentData.coord.lat,
          lon: currentData.coord.lon,
        },
        current: {
          temp: currentData.main.temp,
          feels_like: currentData.main.feels_like,
          humidity: currentData.main.humidity,
          wind_speed: currentData.wind.speed,
          weather: {
            main: currentData.weather[0].main,
            description: currentData.weather[0].description,
            icon: currentData.weather[0].icon,
          },
        },
        forecast: dailyForecasts,
      };

      setWeatherData(transformedData);
    } catch (err) {
      setError("Failed to fetch weather data. Please try again.");
      console.error("Error fetching weather data:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchLocations = async (query: string) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    try {
      let response;
      if (isZipCode(query)) {
        // Use zip code endpoint
        response = await fetch(
          `${GEO_API_URL}/zip?zip=${encodeURIComponent(query)}&appid=${API_KEY}`
        );
      } else {
        // Use direct geocoding endpoint
        response = await fetch(
          `${GEO_API_URL}/direct?q=${encodeURIComponent(
            query
          )}&limit=5&appid=${API_KEY}`
        );
      }

      if (!response.ok) {
        throw new Error("Failed to fetch location suggestions");
      }

      const data = await response.json();

      if (isZipCode(query)) {
        // Handle single zip code response
        if ("name" in data) {
          setSuggestions([
            {
              name: data.name,
              country: data.country,
              lat: data.lat,
              lon: data.lon,
              state: undefined,
            },
          ]);
        } else {
          setSuggestions([]);
        }
      } else {
        // Handle multiple location responses
        setSuggestions(
          (data as GeocodingResponse[]).map((item) => ({
            name: item.name,
            state: item.state,
            country: item.country,
            lat: item.lat,
            lon: item.lon,
          }))
        );
      }
    } catch (err) {
      console.error("Error fetching suggestions:", err);
      setSuggestions([]);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      searchLocations(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLocationSelect = async (location: LocationSuggestion) => {
    setSearchQuery(
      `${location.name}${location.state ? `, ${location.state}` : ""}, ${
        location.country
      }`
    );
    setIsSearchOpen(false);
    await fetchWeatherData(location.lat, location.lon);
  };

  const toggleFavorite = () => {
    if (!weatherData) return;

    const isFavorite = favorites.some(
      (fav) =>
        fav.lat === weatherData.location.lat &&
        fav.lon === weatherData.location.lon
    );

    if (isFavorite) {
      setFavorites(
        favorites.filter(
          (fav) =>
            fav.lat !== weatherData.location.lat ||
            fav.lon !== weatherData.location.lon
        )
      );
    } else {
      setFavorites([
        ...favorites,
        {
          name: weatherData.location.name,
          country: weatherData.location.country,
          lat: weatherData.location.lat,
          lon: weatherData.location.lon,
        },
      ]);
    }
  };

  // Function to format temperature based on unit
  const formatTemp = (celsius: number) => {
    const temp = useMetric ? celsius : celsiusToFahrenheit(celsius);
    return `${Math.round(temp)}°${useMetric ? "C" : "F"}`;
  };

  // Update chart data to include unit conversion
  const chartData = {
    labels: weatherData?.forecast.map((day) => day.date) || [],
    datasets: [
      {
        label: `Max Temperature (°${useMetric ? "C" : "F"})`,
        data:
          weatherData?.forecast.map((day) =>
            useMetric ? day.temp.max : celsiusToFahrenheit(day.temp.max)
          ) || [],
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
      {
        label: `Min Temperature (°${useMetric ? "C" : "F"})`,
        data:
          weatherData?.forecast.map((day) =>
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

  if (!API_KEY || API_KEY === "your_api_key_here") {
    return (
      <div className="min-h-screen p-4 bg-gray-100">
        <Card className="mx-auto max-w-4xl">
          <CardHeader>
            <CardTitle>Weather Dashboard</CardTitle>
            <CardDescription className="text-red-500">
              API Key Not Configured
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="mb-4">To use the Weather Dashboard, you need to:</p>
              <ol className="list-decimal list-inside text-left space-y-2">
                <li>
                  Sign up for a free API key at{" "}
                  <a
                    href="https://openweathermap.org/api"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:underline"
                  >
                    OpenWeatherMap
                  </a>
                </li>
                <li>
                  Create a{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">.env</code>{" "}
                  file in the project root
                </li>
                <li>
                  Add your API key:{" "}
                  <code className="bg-gray-200 px-2 py-1 rounded">
                    VITE_OPENWEATHERMAP_API_KEY=your_api_key_here
                  </code>
                </li>
                <li>Restart the development server</li>
              </ol>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen p-4 relative overflow-hidden ${
        weatherData
          ? getWeatherBackground(
              weatherData.current.weather.main,
              weatherData.current.weather.icon
            )
          : ""
      }`}
    >
      <div className="weather-overlay absolute inset-0" />
      <Card className="mx-auto max-w-4xl relative z-10 bg-background/95 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Weather Dashboard</CardTitle>
          <CardDescription>
            Search for a location to view current weather and forecast
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-6">
            <Popover open={isSearchOpen} onOpenChange={setIsSearchOpen}>
              <PopoverTrigger asChild>
                <div className="flex-1">
                  <Input
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by city name or zip code (e.g., London, 10001, Paris, FR)..."
                    className="w-full"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="p-0" align="start">
                <Command>
                  <CommandList>
                    {suggestions.map((suggestion) => (
                      <CommandItem
                        key={`${suggestion.lat}-${suggestion.lon}`}
                        onSelect={() => handleLocationSelect(suggestion)}
                        className="flex items-center gap-2 p-2 cursor-pointer"
                      >
                        <MapPin className="h-4 w-4" />
                        <span>
                          {suggestion.name}
                          {suggestion.state && `, ${suggestion.state}`}
                          {suggestion.country && `, ${suggestion.country}`}
                        </span>
                      </CommandItem>
                    ))}
                    {suggestions.length === 0 && searchQuery.trim() !== "" && (
                      <div className="p-2 text-sm text-muted-foreground">
                        No locations found
                      </div>
                    )}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={() => handleLocationSelect(suggestions[0])}
              disabled={loading || suggestions.length === 0}
            >
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>

          {error && <div className="text-red-500 mb-4">{error}</div>}

          {loading && <div className="text-center py-8">Loading...</div>}

          {weatherData && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <Card>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-2" />
                        <CardTitle className="text-xl">
                          {weatherData.location.name},{" "}
                          {weatherData.location.country}
                        </CardTitle>
                      </div>
                      <div className="flex items-center gap-2">
                        <ToggleGroup
                          type="single"
                          value={useMetric ? "C" : "F"}
                          onValueChange={(value) =>
                            value && setUseMetric(value === "C")
                          }
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
                          className={
                            favorites.some(
                              (fav) =>
                                fav.lat === weatherData.location.lat &&
                                fav.lon === weatherData.location.lon
                            )
                              ? "text-yellow-500"
                              : ""
                          }
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

                <Card>
                  <CardHeader>
                    <CardTitle>7-Day Forecast</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {weatherData.forecast.map((day) => (
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
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Temperature Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <Line options={chartOptions} data={chartData} />
                </CardContent>
              </Card>
            </>
          )}

          {favorites.length > 0 && (
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
                      onClick={() =>
                        fetchWeatherData(location.lat, location.lon)
                      }
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {location.name}, {location.country}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
        <CardFooter className="text-sm text-gray-500">
          Data provided by OpenWeatherMap
        </CardFooter>
      </Card>
    </div>
  );
};

export default WeatherDashboard;
