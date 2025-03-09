import { Project } from "@/types/Project";

export const projects: Project[] = [
  // Implemented projects first
  {
    id: "todo-app",
    title: "Todo App with Drag & Drop",
    description:
      "A sleek todo application with drag and drop functionality to reorder tasks. Includes local storage persistence and theme switching.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "DnD", "Tailwind CSS"],
    difficulty: "beginner",
    readme: `# Todo App with Drag & Drop

A modern, feature-rich todo application built with React and TypeScript, featuring drag and drop functionality, local storage persistence, and theme customization.

## Features

- Create, edit, and delete tasks
- Drag and drop to reorder tasks
- Mark tasks as complete
- Filter tasks by status
- Dark/light theme switching
- Local storage persistence
- Keyboard accessibility
- Responsive design

## Technical Stack

- React 18 with TypeScript
- React Beautiful DnD for drag and drop
- Tailwind CSS for styling
- Zustand for state management
- React Hook Form for form handling
- Zod for form validation

## Project Structure

\`\`\`
src/
├── components/
│   ├── TaskList.tsx
│   ├── TaskItem.tsx
│   ├── TaskForm.tsx
│   └── TaskFilter.tsx
├── stores/
│   └── taskStore.ts
├── types/
│   └── Task.ts
└── utils/
    └── localStorage.ts
\`\`\`

## Key Components

### TaskList
The main component that renders the list of tasks and handles the drag and drop functionality. It uses react-beautiful-dnd to enable smooth reordering of tasks.

### TaskItem
Individual task component that displays the task details and provides actions like edit, delete, and toggle completion status.

### TaskForm
Form component for creating and editing tasks. Uses React Hook Form with Zod validation to ensure data integrity.

## State Management

The application uses Zustand for state management, providing a simple and efficient way to handle the task list state and persistence.

\`\`\`typescript
interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  deleteTask: (id: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
}
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/todo-app.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

## Learn More

- [React Beautiful DnD Documentation](https://react-beautiful-dnd.netlify.app/)
- [Zustand Documentation](https://zustand-demo.pmnd.rs/)
- [React Hook Form Documentation](https://react-hook-form.com/)`,
    resources: [
      {
        title: "Documentation",
        url: "/docs/todo-app",
        internal: true,
      },
      {
        title: "Live Demo",
        url: "/projects/todo-app/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/todo-app/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "weather-dashboard",
    title: "Weather Dashboard",
    description:
      "A real-time weather dashboard with location search, 5-day forecast, and weather animations.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API Integration", "Animations"],
    difficulty: "intermediate",
    readme: `# Weather Dashboard

A comprehensive weather dashboard application built with React and TypeScript, providing real-time weather information with beautiful visualizations and animations.

## Features

- Real-time weather data from OpenWeatherMap API
- Location search with autocomplete
- 5-day weather forecast
- Detailed weather information (temperature, humidity, wind, etc.)
- Weather condition animations
- Responsive design for all devices
- Save favorite locations
- Temperature unit conversion (°C/°F)

## Technical Stack

- React 18 with TypeScript
- TanStack Query for data fetching
- Framer Motion for animations
- Chart.js for weather graphs
- Tailwind CSS for styling
- OpenWeatherMap API integration

## Project Structure

\`\`\`
src/
├── components/
│   ├── CurrentWeather.tsx
│   ├── WeatherForecast.tsx
│   ├── LocationSearch.tsx
│   ├── WeatherChart.tsx
│   └── WeatherAnimation.tsx
├── hooks/
│   ├── useWeather.ts
│   └── useGeolocation.ts
├── services/
│   └── weatherApi.ts
└── utils/
    ├── formatWeatherData.ts
    └── weatherIcons.ts
\`\`\`

## Key Components

### CurrentWeather
Displays current weather conditions including temperature, weather description, humidity, wind speed, and pressure. Features smooth animations for weather condition changes.

### WeatherForecast
Shows a 5-day weather forecast with daily high and low temperatures, precipitation probability, and weather conditions.

### LocationSearch
Autocomplete search component for finding locations, with recent searches and favorite locations functionality.

## API Integration

The application uses TanStack Query to manage API requests and caching, providing a smooth user experience with optimistic updates and error handling.

\`\`\`typescript
interface WeatherData {
  current: {
    temp: number;
    humidity: number;
    windSpeed: number;
    condition: string;
  };
  forecast: Array<{
    date: string;
    temp: { min: number; max: number };
    condition: string;
  }>;
}
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/weather-dashboard.git

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your OpenWeatherMap API key to .env

# Start the development server
npm run dev
\`\`\`

## Learn More

- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Framer Motion Documentation](https://www.framer.com/motion/)`,
    resources: [
      {
        title: "Documentation",
        url: "/docs/weather-dashboard",
        internal: true,
      },
      {
        title: "Live Demo",
        url: "/projects/weather-dashboard/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/weather-dashboard/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "markdown-editor",
    title: "Markdown Note Editor",
    description:
      "A beautiful markdown note-taking app with real-time preview, organization features, and local storage persistence.",
    image:
      "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Markdown", "LocalStorage"],
    difficulty: "intermediate",
    readme: `# Markdown Note Editor

A powerful markdown editor built with React and TypeScript, featuring real-time preview, file organization, and extensive markdown support with syntax highlighting.

## Features

- Real-time markdown preview
- File system-like organization
- Syntax highlighting for code blocks
- Support for GitHub Flavored Markdown
- Auto-save functionality
- Dark/light theme support
- File import/export (MD, PDF)
- Keyboard shortcuts
- Search across notes

## Technical Stack

- React 18 with TypeScript
- CodeMirror 6 for the editor
- Marked for markdown parsing
- PrismJS for syntax highlighting
- Zustand for state management
- Tailwind CSS for styling

## Project Structure

\`\`\`
src/
├── components/
│   ├── Editor/
│   │   ├── CodeMirror.tsx
│   │   └── ToolBar.tsx
│   ├── Preview/
│   │   ├── MarkdownPreview.tsx
│   │   └── CodeBlock.tsx
│   └── FileSystem/
│       ├── FileTree.tsx
│       └── FileActions.tsx
├── hooks/
│   ├── useMarkdown.ts
│   └── useFileSystem.ts
├── stores/
│   └── editorStore.ts
└── utils/
    ├── markdownParser.ts
    └── fileSystem.ts
\`\`\`

## Key Components

### Editor
Built on CodeMirror 6, providing a powerful editing experience with markdown syntax highlighting, auto-completion, and keyboard shortcuts.

### Preview
Real-time markdown preview with support for GitHub Flavored Markdown, math equations, diagrams, and code syntax highlighting.

### FileSystem
Hierarchical file organization with folders, drag-and-drop support, and file operations (create, rename, delete).

## Markdown Features

The editor supports various markdown extensions and features:

\`\`\`markdown
# Headers
## Subheaders
**Bold** and *Italic*
- Lists
  - Nested Lists
1. Numbered Lists

\`\`\`javascript
// Code blocks with syntax highlighting
function hello() {
  console.log("Hello, World!");
}
\`\`\`

| Tables | Are | Supported |
|--------|-----|-----------|
| Data   | In  | Tables    |

> Blockquotes
> With multiple lines

Math equations: $E = mc^2$

And much more...
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/markdown-editor.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

## Learn More

- [CodeMirror Documentation](https://codemirror.net/)
- [Marked Documentation](https://marked.js.org/)
- [PrismJS Documentation](https://prismjs.com/)`,
    resources: [
      {
        title: "Documentation",
        url: "/docs/markdown-editor",
        internal: true,
      },
      {
        title: "Live Demo",
        url: "/projects/markdown-editor/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/markdown-editor/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "pomodoro-timer",
    title: "Pomodoro Timer",
    description:
      "A customizable pomodoro timer application with task tracking, statistics, and sound notifications.",
    image:
      "https://images.unsplash.com/photo-1516031190212-da133013de50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Timer", "Productivity"],
    difficulty: "beginner",
    readme: `# Pomodoro Timer

A customizable pomodoro timer application built with React and TypeScript. This project helps users implement the pomodoro technique for productivity.

## Features

- Customizable work and break intervals
- Task tracking for each pomodoro session
- Sound notifications
- Session statistics
- Dark/light theme support
- Progress tracking

## Technical Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Howler.js for audio
- Chart.js for statistics
- Local storage for data persistence

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/pomodoro-timer.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/pomodoro-timer/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/pomodoro-timer/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "calculator",
    title: "Calculator",
    description:
      "A sleek calculator app with basic and advanced mathematical operations and a responsive design.",
    image:
      "https://images.unsplash.com/photo-1587145820266-a5951ee6f620?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Math", "UI"],
    difficulty: "beginner",
    readme: `# Calculator

A sleek calculator application built with React and TypeScript. This project demonstrates state management and mathematical operations.

## Features

- Basic arithmetic operations
- Memory functions
- History log
- Responsive design
- Keyboard support
- Scientific mode

## Technical Stack

- React 18 with TypeScript
- Custom hooks for calculator logic
- Tailwind CSS for styling

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/calculator.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/calculator/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/calculator/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "recipe-finder",
    title: "Recipe Finder App",
    description:
      "A recipe search application that pulls from a culinary API. Includes filters, favorites, and detailed cooking instructions.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Filters"],
    difficulty: "intermediate",
    readme: `# Recipe Finder App

A recipe search application built with React and TypeScript. This project allows users to search and filter recipes from a culinary API.

## Features

- Search recipes by ingredients or name
- Filter by dietary restrictions
- Save favorite recipes
- Detailed cooking instructions
- Nutritional information
- Shopping list generation

## Technical Stack

- React 18 with TypeScript
- TanStack Query for API calls
- Tailwind CSS for styling
- Zustand for state management
- React Hook Form for search
- Local storage for favorites

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/recipe-finder.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/recipe-finder/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/recipe-finder/demo/code",
        internal: true,
      },
    ],
  },
  // Non-implemented projects below
  {
    id: "ecommerce-product",
    title: "E-Commerce Product Page",
    description:
      "A fully functional e-commerce product page with image gallery, product options, reviews, and add-to-cart functionality.",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "E-commerce", "Animations"],
    difficulty: "intermediate",
    readme: `# E-Commerce Product Page

A modern, fully functional e-commerce product page built with React and TypeScript. This project demonstrates key e-commerce UI components and interactions.

## Features

- Image gallery with zoom functionality
- Product options selection (size, color, etc.)
- Customer reviews and ratings
- Add to cart functionality
- Related products carousel
- Responsive product layouts

## Technical Stack

- React 18 with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Query for data management
- React Hook Form for forms
- Zod for validation

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/ecommerce-product.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/ecommerce-product/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/ecommerce-product/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "job-tracker",
    title: "Job Application Tracker",
    description:
      "A comprehensive job application tracking system with kanban board, statistics dashboard, and reminder notifications.",
    image:
      "https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Kanban", "Dashboard"],
    difficulty: "advanced",
    readme: `# Job Application Tracker

A comprehensive job application tracking system built with React and TypeScript. This project helps users organize and track their job search process.

## Features

- Kanban board for application status
- Job application form with validation
- Dashboard with statistics
- Calendar for interview scheduling
- Reminder notifications
- Data visualization

## Technical Stack

- React 18 with TypeScript
- TanStack Query for data management
- Chart.js for statistics
- Tailwind CSS for styling
- React DnD for kanban
- React Hook Form

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/job-tracker.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/job-tracker/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/job-tracker/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "budget-tracker",
    title: "Budget Tracker",
    description:
      "A personal finance application to track income, expenses, and savings goals. Includes visualizations and category management.",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Chart.js", "Finance"],
    difficulty: "intermediate",
    readme: `# Budget Tracker

A personal finance application built with React and TypeScript. This project helps users track their income, expenses, and savings goals.

## Features

- Income and expense tracking
- Category management
- Recurring transactions
- Budget goals and limits
- Visualization of spending patterns
- Export data to CSV
- Monthly reports

## Technical Stack

- React 18 with TypeScript
- Chart.js for visualizations
- Tailwind CSS for styling
- React Hook Form for inputs
- Local storage for data
- CSV export functionality

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/budget-tracker.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/budget-tracker/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/budget-tracker/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "movie-database",
    title: "Movie Database App",
    description:
      "A movie database application that uses a film API to display information about movies, including cast, ratings, and trailers.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Carousel"],
    difficulty: "intermediate",
    readme: `# Movie Database App

A comprehensive movie database application built with React and TypeScript. This project fetches and displays information about movies from a film API.

## Features

- Search for movies by title
- Browse movies by genre, year, etc.
- View detailed movie information
- Watch trailers
- See cast and crew information
- Save favorites and create watchlists
- User ratings and reviews

## Technical Stack

- React 18 with TypeScript
- TMDB API integration
- TanStack Query for data
- Tailwind CSS for styling
- React Player for trailers
- Local storage for watchlists

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/movie-database.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/movie-database/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/movie-database/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "github-profile",
    title: "GitHub Profile Viewer",
    description:
      "An application that uses the GitHub API to display user profiles, repositories, and contribution statistics.",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "GitHub"],
    difficulty: "intermediate",
    readme: `# GitHub Profile Viewer

A GitHub profile viewing application built with React and TypeScript. This project uses the GitHub API to display user information and repositories.

## Features

- Search for GitHub users
- Display user profile information
- List repositories with details
- Visualize contribution statistics
- Show follower/following networks
- Repository filtering and sorting

## Technical Stack

- React 18 with TypeScript
- GitHub REST API
- TanStack Query for data
- Chart.js for statistics
- Tailwind CSS for styling
- React Router for navigation

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/github-profile.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/github-profile/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/github-profile/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "drawing-app",
    title: "Drawing App",
    description:
      "A digital drawing application with various brush types, color selection, and the ability to save and share creations.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Canvas", "Drawing"],
    difficulty: "advanced",
    readme: `# Drawing App

A digital drawing application built with React, TypeScript, and HTML Canvas. This project allows users to create digital artwork with various tools.

## Features

- Multiple brush types and sizes
- Color picker and palette
- Layers system
- Undo/redo functionality
- Save drawings as images
- Import images as backgrounds
- Export to various formats

## Technical Stack

- React 18 with TypeScript
- HTML Canvas API
- Fabric.js for canvas
- Tailwind CSS for styling
- File system access API
- Local storage for saves

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/drawing-app.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/drawing-app/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/drawing-app/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "chat-app",
    title: "Chat Application",
    description:
      "A real-time chat application with private messaging, group channels, and message reactions.",
    image:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Firebase", "Real-time"],
    difficulty: "advanced",
    readme: `# Chat Application

A real-time chat application built with React, TypeScript, and Firebase. This project demonstrates real-time data synchronization and chat functionality.

## Features

- Real-time messaging
- User authentication
- Group channels
- Private messaging
- Message reactions and replies
- Online status indicators
- Message search
- File sharing

## Technical Stack

- React 18 with TypeScript
- Firebase Realtime Database
- Firebase Authentication
- Tailwind CSS for styling
- React Router for navigation
- Emoji picker integration

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/chat-app.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/chat-app/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/chat-app/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "music-player",
    title: "Music Player",
    description:
      "A feature-rich music player with playlist management, audio visualization, and media controls.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Audio API", "Visualization"],
    difficulty: "advanced",
    readme: `# Music Player

A feature-rich music player built with React, TypeScript, and the Web Audio API. This project demonstrates audio handling and visualization.

## Features

- Audio playback controls
- Playlist management
- Audio visualization
- Equalizer settings
- Shuffle and repeat modes
- Import audio files
- Keyboard shortcuts

## Technical Stack

- React 18 with TypeScript
- Web Audio API
- Canvas for visualization
- Tailwind CSS for styling
- Howler.js for audio
- File system access API

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/music-player.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/music-player/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/music-player/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "calendar-planner",
    title: "Calendar & Event Planner",
    description:
      "A comprehensive calendar application with event management, reminders, and multiple view options.",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Calendar", "Events"],
    difficulty: "advanced",
    readme: `# Calendar & Event Planner

A comprehensive calendar and event planning application built with React and TypeScript. This project helps users manage their schedule and events.

## Features

- Monthly, weekly, and daily calendar views
- Event creation and management
- Recurring events
- Reminders and notifications
- Event categories and color coding
- Calendar sharing
- Import/export calendar data

## Technical Stack

- React 18 with TypeScript
- FullCalendar for views
- TanStack Query for data
- Tailwind CSS for styling
- React Hook Form for events
- Local storage sync

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/calendar-planner.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/calendar-planner/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/calendar-planner/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "fitness-tracker",
    title: "Fitness Tracker",
    description:
      "A fitness tracking application to record workouts, track progress, and set fitness goals.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Chart.js", "Fitness"],
    difficulty: "intermediate",
    readme: `# Fitness Tracker

A fitness tracking application built with React and TypeScript. This project helps users record workouts and track their fitness progress.

## Features

- Workout logging
- Exercise library
- Progress tracking and visualization
- Fitness goal setting
- Body measurement tracking
- Workout routines and plans
- Progress photos
- Nutrition tracking

## Technical Stack

- React 18 with TypeScript
- Chart.js for progress
- Tailwind CSS for styling
- React Hook Form for input
- IndexedDB for storage
- PWA support

## Getting Started

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/fitness-tracker.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/fitness-tracker/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/fitness-tracker/demo/code",
        internal: true,
      },
    ],
  },
];
