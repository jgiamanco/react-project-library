import type { Project } from "@/types/Project";
import type { ProjectImplementation } from "../index";
import WeatherDashboard from "./WeatherDashboard";
import { CodeViewer } from "./components/CodeViewer";

const implementation: ProjectImplementation = {
  app: WeatherDashboard,
  code: CodeViewer,
  title: "Weather Dashboard",
  description:
    "A beautiful weather dashboard that fetches data from a weather API. Features include searching for locations, displaying forecasts, and animated weather icons.",
};

const project: Project = {
  id: 2,
  title: implementation.title,
  description: implementation.description,
  image:
    "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
  tags: ["React", "TypeScript", "API", "Chart.js"],
  difficulty: "intermediate",
  timeEstimate: "3-4 hours",
  githubUrl: "#",
  demoUrl: "#",
  readme:
    "# Weather Dashboard\n\nA beautiful weather dashboard built with React and TypeScript. This project fetches data from a weather API and presents it in a visually appealing way.\n\n## Features\n\n- Search for locations worldwide\n- Display current weather conditions\n- Show 7-day forecast\n- Animated weather icons\n- Temperature graphs using Chart.js\n- Save favorite locations\n\n## Learning Objectives\n\n- Working with external APIs\n- TypeScript interfaces for API responses\n- Async/await and error handling\n- Data visualization with Chart.js\n- Responsive design principles",
};

export default { ...project, ...implementation };
