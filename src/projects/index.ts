// Export all project implementations for easy importing
import type { ComponentType } from "react";
import TodoApp from "./todo-app";
import WeatherDashboard from "./weather-dashboard";
import MarkdownEditor from "./markdown-note-editor";

export interface ProjectImplementation {
  app: ComponentType;
  code: ComponentType;
  title: string;
  description: string;
}

const projects: Record<string, ProjectImplementation> = {
  todoApp: TodoApp,
  weatherDashboard: WeatherDashboard,
  markdownEditor: MarkdownEditor,
};

export default projects;
