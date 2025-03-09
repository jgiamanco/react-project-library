
import WeatherDashboard from "./WeatherDashboard";

// Define the project metadata
const WeatherDashboardProject = {
  app: WeatherDashboard,
  code: () => import("./WeatherDashboardCode"),
  title: "Weather Dashboard",
  description: "Check weather forecasts for locations around the world"
};

export default WeatherDashboardProject;
