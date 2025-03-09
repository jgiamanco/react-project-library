
// Export all project implementations for easy importing
import type { ComponentType } from "react";
import TodoApp from "./todo-app";
import WeatherDashboard from "./weather-dashboard";
import MarkdownEditor from "./markdown-note-editor";
import PomodoroTimer from "./pomodoro-timer";
import Calculator from "./calculator";

export interface ProjectImplementation {
  app: ComponentType;
  code: ComponentType;
  title: string;
  description: string;
}

const projects: Record<string, ProjectImplementation> = {
  todoApp: {
    app: TodoApp.app,
    code: TodoApp.code,
    title: TodoApp.title,
    description: TodoApp.description
  },
  weatherDashboard: {
    app: WeatherDashboard.app,
    code: WeatherDashboard.code,
    title: WeatherDashboard.title,
    description: WeatherDashboard.description
  },
  markdownEditor: {
    app: MarkdownEditor.app,
    code: MarkdownEditor.code,
    title: MarkdownEditor.title,
    description: MarkdownEditor.description
  },
  pomodoroTimer: {
    app: PomodoroTimer.app,
    code: PomodoroTimer.code,
    title: PomodoroTimer.title,
    description: PomodoroTimer.description
  },
  calculator: {
    app: Calculator.app,
    code: Calculator.code,
    title: Calculator.title,
    description: Calculator.description
  },
};

export default projects;
