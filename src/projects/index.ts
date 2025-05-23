import type { ComponentType } from "react";
import TodoApp from "./todo-app";
import WeatherDashboard from "./weather-dashboard";
import MarkdownEditor from "./markdown-note-editor";
import PomodoroTimer from "./pomodoro-timer";
import Calculator from "./calculator";
import RecipeFinder from "./recipe-finder";
import AIChatbot from "./ai-chatbot";
import EcommerceProductPage from "./ecommerce-product";
import JobTracker from "./job-tracker";

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
    description: TodoApp.description,
  },
  weatherDashboard: {
    app: WeatherDashboard.app,
    code: WeatherDashboard.code,
    title: WeatherDashboard.title,
    description: WeatherDashboard.description,
  },
  markdownEditor: {
    app: MarkdownEditor.app,
    code: MarkdownEditor.code,
    title: MarkdownEditor.title,
    description: MarkdownEditor.description,
  },
  pomodoroTimer: {
    app: PomodoroTimer.app,
    code: PomodoroTimer.code,
    title: PomodoroTimer.title,
    description: PomodoroTimer.description,
  },
  calculator: {
    app: Calculator.app,
    code: Calculator.code,
    title: Calculator.title,
    description: Calculator.description,
  },
  recipeFinder: {
    app: RecipeFinder.app,
    code: RecipeFinder.code,
    title: RecipeFinder.title,
    description: RecipeFinder.description,
  },
  aiChatbot: {
    app: AIChatbot.app,
    code: AIChatbot.code,
    title: AIChatbot.title,
    description: AIChatbot.description,
  },
  ecommerceProductPage: {
    app: EcommerceProductPage.app,
    code: EcommerceProductPage.code,
    title: EcommerceProductPage.title,
    description: EcommerceProductPage.description,
  },
  jobTracker: {
    app: JobTracker.app,
    code: JobTracker.code,
    title: JobTracker.title,
    description: JobTracker.description,
  },
};

export default projects;