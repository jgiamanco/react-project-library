
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
  todoApp: {
    app: TodoApp.app,
    code: TodoApp.code as unknown as ComponentType,
    title: TodoApp.title,
    description: TodoApp.description
  },
  weatherDashboard: {
    app: WeatherDashboard.app,
    code: WeatherDashboard.code as unknown as ComponentType,
    title: WeatherDashboard.title,
    description: WeatherDashboard.description
  },
  markdownEditor: {
    app: MarkdownEditor.app,
    code: MarkdownEditor.code as unknown as ComponentType,
    title: MarkdownEditor.title,
    description: MarkdownEditor.description
  },
};

export default projects;
