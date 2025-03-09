import type { Project } from "@/types/Project";
import type { ProjectImplementation } from "../index";
import TodoApp from "./TodoApp";
import { TodoAppCode } from "./components/TodoAppCode";

const implementation: ProjectImplementation = {
  app: TodoApp,
  code: TodoAppCode,
  title: "Todo App with Drag & Drop",
  description:
    "A sleek todo application with drag and drop functionality to reorder tasks. Includes local storage persistence and theme switching.",
};

const project: Project = {
  id: 1,
  title: implementation.title,
  description: implementation.description,
  image:
    "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
  tags: ["React", "TypeScript", "DnD", "Tailwind CSS"],
  difficulty: "beginner",
  timeEstimate: "2-3 hours",
  githubUrl: "https://github.com/react-projects/todo-app-dnd",
  demoUrl: "https://todo-app-dnd-react.vercel.app",
  readme:
    "# Todo App with Drag & Drop\n\nA simple yet powerful todo application built with React, TypeScript, and Tailwind CSS. This project demonstrates basic state management, drag and drop functionality, and local storage persistence.\n\n## Features\n\n- Create, edit, and delete tasks\n- Mark tasks as complete\n- Drag and drop to reorder tasks\n- Filter tasks by status\n- Dark/light theme switching\n- Local storage persistence\n\n## Learning Objectives\n\n- React state management with useState and useContext\n- TypeScript interfaces and type safety\n- Implementing drag and drop functionality\n- Working with local storage\n- CSS styling with Tailwind CSS",
};

export default { ...project, ...implementation };
