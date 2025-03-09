import type { Project } from "@/types/Project";
import type { ProjectImplementation } from "../index";
import WeatherDashboard from "./WeatherDashboard";
import { WeatherDashboardCode } from "./components/WeatherDashboardCode";

const implementation: ProjectImplementation = {
  app: WeatherDashboard,
  code: WeatherDashboardCode,
  title: "Weather Dashboard",
  description:
    "A beautiful weather dashboard with real-time weather data, forecasts, and animated weather conditions.",
};

const project: Project = {
  id: 2,
  title: implementation.title,
  description: implementation.description,
  image:
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
  tags: ["React", "TypeScript", "Weather API", "CSS Animations"],
  difficulty: "intermediate",
  timeEstimate: "3-4 hours",
  githubUrl: "https://github.com/react-projects/weather-dashboard",
  demoUrl: "https://weather-dashboard-react.vercel.app",
  readme:
    "# Weather Dashboard\n\nA modern weather dashboard built with React and TypeScript. This project demonstrates working with external APIs, dynamic styling, and responsive design.\n\n## Features\n\n- Real-time weather data\n- 5-day weather forecast\n- Dynamic weather animations\n- Location search\n- Responsive design\n- Unit conversion (°C/°F)\n\n## Learning Objectives\n\n- Working with external APIs\n- React hooks (useState, useEffect)\n- Dynamic CSS animations\n- Error handling\n- Responsive design with CSS Grid",
};

export default { ...project, ...implementation };
