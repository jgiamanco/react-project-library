# AI Rules and Guidelines

This document outlines the technical stack and guidelines for developing this React application. These rules are intended to ensure consistency, maintainability, and adherence to best practices.

## Tech Stack Overview

*   **React:** The core JavaScript library for building user interfaces.
*   **TypeScript:** Adds static typing to JavaScript, improving code quality and developer productivity.
*   **Vite:** A fast build tool for modern web projects.
*   **Tailwind CSS:** A utility-first CSS framework for rapid styling.
*   **shadcn/ui:** A collection of re-usable components built with Radix UI and Tailwind CSS. Prefer these components for UI elements.
*   **React Router:** Used for declarative routing in the application.
*   **Lucide React:** Provides a set of beautiful, open-source icons.
*   **Supabase:** Used for authentication, database, and potentially other backend services (if integrated).
*   **React Beautiful DnD:** For implementing drag-and-drop interfaces (used in the Todo app).
*   **Chart.js / React Chart.js 2:** For creating charts and data visualizations (used in the Weather Dashboard).
*   **React Markdown / SyntaxHighlighter:** For rendering and highlighting markdown content (used in the Markdown Editor).

## Library and Component Usage Rules

*   **UI Components:** Always use components from `shadcn/ui` (`src/components/ui`) when available (e.g., Button, Input, Card, Tabs, Dialog, etc.). If a required component is not available in `shadcn/ui`, you may create a new custom component following the project's styling conventions (Tailwind CSS).
*   **Styling:** Use Tailwind CSS classes for all styling. Avoid writing custom CSS unless absolutely necessary for complex animations or specific overrides not possible with Tailwind.
*   **Icons:** Use icons from the `lucide-react` library. Import them directly into your components.
*   **Routing:** Use `react-router-dom` for all navigation and routing within the application. Define routes in `src/App.tsx`.
*   **State Management:** For simple component-level state, use React's `useState` and `useReducer`. For more complex or global state, consider using a dedicated library if necessary (e.g., Zustand, TanStack Query for data fetching state).
*   **Data Fetching:** Use `@tanstack/react-query` for managing server state and data fetching, especially for API integrations like the Weather Dashboard.
*   **Authentication & Database:** Interact with Supabase for authentication and database operations using the `@supabase/supabase-js` library and the service functions provided in `src/services`.
*   **Forms:** Use `react-hook-form` with `zod` for form handling and validation.
*   **Drag and Drop:** Use `react-beautiful-dnd` for implementing drag-and-drop features.
*   **Markdown:** Use `react-markdown` for rendering markdown content and `react-syntax-highlighter` for code block highlighting.
*   **Utility Functions:** Place general utility functions (like `cn` from `clsx` and `tailwind-merge`, or performance helpers) in the `src/lib` or `src/utils` folders.
*   **Hooks:** Custom hooks should be placed in the `src/hooks` folder.
*   **Project-Specific Code:** Code specific to a particular project demo (like the Calculator logic or Weather API calls) should reside within that project's folder (`src/projects/[project-name]`).

Following these guidelines will help maintain a consistent and understandable codebase.