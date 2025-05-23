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
  // New AI/LLM Projects
  {
    id: "ai-chatbot",
    title: "AI-Powered Conversational Chatbot",
    description:
      "A responsive chatbot that leverages large language models to provide contextual responses, answer questions, and assist users.",
    image:
      "https://images.unsplash.com/photo-1531746790731-6c087fecd65a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "AI/LLM", "API Integration"],
    difficulty: "advanced",
    readme: `# AI-Powered Conversational Chatbot

A sophisticated AI chatbot application built with React and TypeScript. This project demonstrates how to integrate with modern LLM APIs.

## Features

- Natural language understanding and generation
- Context-aware conversations
- Message history management
- Streaming responses for real-time feedback
- Multiple AI model support
- Custom prompt templates
- Responsive chat interface
- Dark/light theme support

## Technical Stack

- React 18 with TypeScript
- OpenAI API or similar LLM integration
- TanStack Query for API handling
- Tailwind CSS for styling
- React Hook Form for user input
- Local storage for conversation history

## Project Structure

\`\`\`
src/
├── components/
│   ├── ChatInterface.tsx
│   ├── MessageList.tsx
│   ├── MessageItem.tsx
│   ├── InputForm.tsx
│   └── ModelSelector.tsx
├── hooks/
│   ├── useChat.ts
│   └── useStreamingResponse.ts
├── services/
│   └── aiService.ts
└── utils/
    └── formatMessages.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/ai-chatbot.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/ai-chatbot/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/ai-chatbot/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "ai-image-generator",
    title: "AI Image Generator",
    description:
      "A creative tool that utilizes generative AI to transform text prompts into unique images with various style options.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80", // Updated to a digital art related image
    tags: ["React", "TypeScript", "Generative AI", "Stable Diffusion"],
    difficulty: "advanced",
    readme: `# AI Image Generator

A powerful image generation application built with React and TypeScript. This project demonstrates integration with state-of-the-art AI image generation models.

## Features

- Text-to-image generation
- Style customization options
- Prompt history management
- Gallery of generated images
- Image download and sharing
- Advanced prompt engineering interface
- Response time optimization
- Authentication and user galleries

## Technical Stack

- React 18 with TypeScript
- OpenAI DALL-E or Stable Diffusion API integration
- TanStack Query for API handling
- Tailwind CSS for styling
- React Hook Form for prompts
- Local storage for history

## Project Structure

\`\`\`
src/
├── components/
│   ├── PromptInput.tsx
│   ├── StyleOptions.tsx
│   ├── ImageGallery.tsx
│   ├── ImageCard.tsx
│   └── PromptHistory.tsx
├── hooks/
│   ├── useImageGeneration.ts
│   └── usePromptHistory.ts
├── services/
│   └── imageGenerationService.ts
└── utils/
    └── formatPrompts.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/ai-image-generator.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/ai-image-generator/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/ai-image-generator/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "ai-content-summarizer",
    title: "AI Content Summarizer",
    description:
      "A tool that uses AI to analyze and summarize articles, documents, and web pages into concise, readable summaries.",
    image:
      "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "NLP", "Document Processing"],
    difficulty: "intermediate",
    readme: `# AI Content Summarizer

A content summarization application built with React and TypeScript. This project demonstrates how to process and condense long-form content using AI.

## Features

- URL content extraction
- Document upload and processing
- Adjustable summary length
- Key points extraction
- Multiple summary styles (bullet points, paragraphs)
- Reading time estimation
- History of summarized content
- Content sharing options

## Technical Stack

- React 18 with TypeScript
- OpenAI API or similar AI summarization integration
- TanStack Query for API handling
- Tailwind CSS for styling
- React Hook Form for input
- File handling for document uploads

## Project Structure

\`\`\`
src/
├── components/
│   ├── InputForm.tsx
│   ├── SummarySettings.tsx
│   ├── SummaryOutput.tsx
│   ├── DocumentUploader.tsx
│   └── SummaryHistory.tsx
├── hooks/
│   ├── useSummarizer.ts
│   └── useContentExtractor.ts
├── services/
│   └── summarizerService.ts
└── utils/
    ├── extractContent.ts
    └── formatSummary.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/ai-summarizer.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/ai-content-summarizer/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/ai-content-summarizer/demo/code",
        internal: true,
      },
    ],
  },
  // Interactive API Projects
  {
    id: "crypto-dashboard",
    title: "Cryptocurrency Dashboard",
    description:
      "A real-time cryptocurrency tracking dashboard that visualizes price movements, trends, and portfolio performance.",
    image:
      "https://images.unsplash.com/photo-1621761191319-c6fb62004040?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "WebSockets", "Financial API"],
    difficulty: "advanced",
    readme: `# Cryptocurrency Dashboard

A comprehensive cryptocurrency tracking dashboard built with React and TypeScript. This project demonstrates real-time data handling using WebSockets.

## Features

- Real-time price tracking for cryptocurrencies
- Interactive price charts with time frame options
- Portfolio tracker for assets
- Market overview with key metrics
- Price alerts and notifications
- News feed for crypto-related updates
- Watchlist functionality
- Market depth visualization

## Technical Stack

- React 18 with TypeScript
- CoinGecko API or similar crypto data API
- WebSockets for real-time updates
- Recharts for data visualization
- TanStack Query for data handling
- Tailwind CSS for styling
- Local storage for saved preferences

## Project Structure

\`\`\`
src/
├── components/
│   ├── Dashboard.tsx
│   ├── PriceChart.tsx
│   ├── AssetList.tsx
│   ├── Portfolio.tsx
│   └── MarketStats.tsx
├── hooks/
│   ├── useCryptoData.ts
│   └── useWebSocket.ts
├── services/
│   └── cryptoService.ts
└── utils/
    └── formatCurrency.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/crypto-dashboard.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/crypto-dashboard/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/crypto-dashboard/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "real-time-collab",
    title: "Real-Time Collaborative Editor",
    description:
      "A collaborative document editor that enables multiple users to edit text, code, or diagrams simultaneously.",
    image:
      "https://images.unsplash.com/photo-1531403009284-440f080d1e12?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "WebRTC", "CRDT"],
    difficulty: "advanced",
    readme: `# Real-Time Collaborative Editor

A real-time collaborative document editing application built with React and TypeScript. This project demonstrates how to implement concurrent document editing.

## Features

- Real-time collaborative text editing
- Cursor presence indicators
- User authentication and permissions
- Document version history
- Chat functionality for collaborators
- Export to multiple formats
- Offline editing with synchronization
- Rich text formatting options

## Technical Stack

- React 18 with TypeScript
- WebSockets or WebRTC for real-time communication
- Yjs for conflict-free document merging
- CodeMirror or Slate.js for the editor
- TanStack Query for state management
- Tailwind CSS for styling
- Secure authentication

## Project Structure

\`\`\`
src/
├── components/
│   ├── Editor.tsx
│   ├── Toolbar.tsx
│   ├── CollaboratorsList.tsx
│   ├── CursorOverlay.tsx
│   └── ChatSidebar.tsx
├── hooks/
│   ├── useCollaboration.ts
│   └── useDocumentState.ts
├── services/
│   └── collaborationService.ts
└── utils/
    └── syncDocument.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/real-time-collab.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/real-time-collab/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/real-time-collab/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "map-explorer",
    title: "Interactive Map Explorer",
    description:
      "An interactive map application that showcases custom data visualizations, geolocation services, and point-of-interest discovery.",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Maps API", "Geolocation"],
    difficulty: "intermediate",
    readme: `# Interactive Map Explorer

An interactive map exploration application built with React and TypeScript. This project demonstrates integration with mapping APIs and geospatial data.

## Features

- Interactive map navigation
- Custom data layer visualization
- Location search functionality
- Points of interest discovery
- Geolocation tracking
- Route planning and directions
- Custom map markers and overlays
- Offline map caching

## Technical Stack

- React 18 with TypeScript
- Mapbox GL or Google Maps API
- TanStack Query for data handling
- Tailwind CSS for styling
- React Hook Form for search
- Geolocation API integration
- Local storage for saved locations

## Project Structure

\`\`\`
src/
├── components/
│   ├── Map.tsx
│   ├── SearchBar.tsx
│   ├── LocationMarker.tsx
│   ├── DataLayer.tsx
│   └── InfoPanel.tsx
├── hooks/
│   ├── useMapData.ts
│   └── useGeolocation.ts
├── services/
│   └── mapService.ts
└── utils/
    └── formatGeoData.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/map-explorer.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/map-explorer/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/map-explorer/demo/code",
        internal: true,
      },
    ],
  },
  // Advanced Web Technologies
  {
    id: "3d-product-viewer",
    title: "3D Product Viewer",
    description:
      "An interactive 3D product visualization tool that allows users to view, rotate, and explore products in three dimensions.",
    image:
      "https://images.unsplash.com/photo-1582845512747-e42001c95638?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Three.js", "WebGL"],
    difficulty: "advanced",
    readme: `# 3D Product Viewer

An interactive 3D product visualization application built with React and TypeScript. This project demonstrates how to create immersive 3D experiences on the web.

## Features

- Interactive 3D model viewing
- Product rotation and zoom
- Material and color customization
- Product feature annotations
- Exploded view for complex products
- AR view on compatible devices
- Model measurement tools
- Cross-section viewing

## Technical Stack

- React 18 with TypeScript
- Three.js or React Three Fiber for 3D rendering
- GLTF/GLB model loading
- Framer Motion for animations
- TanStack Query for data handling
- Tailwind CSS for UI components
- WebGL and WebXR support

## Project Structure

\`\`\`
src/
├── components/
│   ├── Viewer3D.tsx
│   ├── ControlPanel.tsx
│   ├── ModelLoader.tsx
│   ├── ColorPicker.tsx
│   └── AnnotationLayer.tsx
├── hooks/
│   ├── useThreeJS.ts
│   └── useModelControls.ts
├── services/
│   └── modelService.ts
└── utils/
    └── optimizeModel.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/3d-product-viewer.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/3d-product-viewer/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/3d-product-viewer/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "voice-assistant",
    title: "Voice Assistant Web App",
    description:
      "A voice-controlled web assistant that can perform tasks, answer questions, and provide information using speech recognition and synthesis.",
    image:
      "https://images.unsplash.com/photo-1589254065878-42c9da997008?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Speech API", "AI"],
    difficulty: "advanced",
    readme: `# Voice Assistant Web App

A voice-controlled assistant application built with React and TypeScript. This project demonstrates speech recognition and synthesis technologies.

## Features

- Voice command recognition
- Natural language understanding
- Voice response synthesis
- Task automation (timers, reminders, etc.)
- Web search integration
- Hands-free operation
- Multi-language support
- Visual feedback for voice interactions

## Technical Stack

- React 18 with TypeScript
- Web Speech API (SpeechRecognition and SpeechSynthesis)
- Natural language processing with AI models
- TanStack Query for data handling
- Tailwind CSS for UI components
- Browser APIs for device control
- Local storage for preferences

## Project Structure

\`\`\`
src/
├── components/
│   ├── VoiceInterface.tsx
│   ├── CommandVisualizer.tsx
│   ├── ResponseDisplay.tsx
│   ├── WakeWordDetector.tsx
│   └── SettingsPanel.tsx
├── hooks/
│   ├── useSpeechRecognition.ts
│   └── useSpeechSynthesis.ts
├── services/
│   └── commandProcessor.ts
└── utils/
    └── naturalLanguage.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/voice-assistant.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/voice-assistant/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/voice-assistant/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "ar-business-card",
    title: "AR Business Card",
    description:
      "An augmented reality business card application that transforms a physical card into an interactive digital experience.",
    image:
      "https://images.unsplash.com/photo-1596558450255-7c0b7be9d56a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "WebXR", "Augmented Reality"],
    difficulty: "advanced",
    readme: `# AR Business Card

An augmented reality business card application built with React and TypeScript. This project demonstrates how to create AR experiences for the web.

## Features

- Marker-based AR recognition
- Interactive 3D elements
- Social media profile links
- Portfolio showcase in AR
- Contact information integration
- Video playback in AR space
- QR code generation for sharing
- Custom AR business card builder

## Technical Stack

- React 18 with TypeScript
- WebXR API for AR capabilities
- AR.js or 8th Wall for marker recognition
- Three.js for 3D rendering
- TanStack Query for data handling
- Tailwind CSS for UI components
- Device camera access

## Project Structure

\`\`\`
src/
├── components/
│   ├── ARViewer.tsx
│   ├── BusinessCardDesigner.tsx
│   ├── MarkerDetector.tsx
│   ├── ARControls.tsx
│   └── ProfileContent.tsx
├── hooks/
│   ├── useARSession.ts
│   └── useMarkerTracking.ts
├── services/
│   └── arService.ts
└── utils/
    └── createARContent.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/ar-business-card.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/ar-business-card/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/ar-business-card/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "web-audio-visualizer",
    title: "Web Audio Visualizer",
    description:
      "A dynamic audio visualization application that creates stunning visual representations of music and sound in real-time.",
    image:
      "https://images.unsplash.com/photo-1557672172-298e090bd0f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Web Audio API", "Canvas"],
    difficulty: "intermediate",
    readme: `# Web Audio Visualizer

A dynamic audio visualization application built with React and TypeScript. This project demonstrates creative uses of the Web Audio API and canvas rendering.

## Features

- Audio file playback
- Microphone input visualization
- Multiple visualization styles
- Real-time frequency analysis
- Color theme customization
- Responsive design for all screen sizes
- Audio controls (play, pause, volume)
- Audio effects processing

## Technical Stack

- React 18 with TypeScript
- Web Audio API for audio processing
- Canvas API for visualization rendering
- File API for audio uploads
- MediaStream API for microphone access
- Tailwind CSS for UI components
- Local storage for preferences

## Project Structure

\`\`\`
src/
├── components/
│   ├── AudioPlayer.tsx
│   ├── Visualizer.tsx
│   ├── VisualizerControls.tsx
│   ├── FileUploader.tsx
│   └── MicrophoneInput.tsx
├── hooks/
│   ├── useAudioProcessor.ts
│   └── useVisualization.ts
├── services/
│   └── audioService.ts
└── utils/
    └── drawWaveform.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/audio-visualizer.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/web-audio-visualizer/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/web-audio-visualizer/demo/code",
        internal: true,
      },
    ],
  },
  {
    id: "web-game",
    title: "Browser-Based Game",
    description:
      "A fully-featured browser game with physics, animations, and multiplayer capabilities, showcasing modern web gaming technologies.",
    image:
      "https://images.unsplash.com/photo-1579373903781-fd5c0c30c4cd?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Canvas", "Game Development"],
    difficulty: "advanced",
    readme: `# Browser-Based Game

A modern browser-based game built with React and TypeScript. This project demonstrates game development concepts using web technologies.

## Features

- Interactive gameplay
- Physics-based mechanics
- Score tracking and leaderboards
- Sound effects and background music
- Level progression system
- Responsive controls for desktop and mobile
- Local multiplayer support
- Game state persistence

## Technical Stack

- React 18 with TypeScript
- Canvas API or WebGL for rendering
- Matter.js for physics
- Howler.js for audio
- TanStack Query for data handling
- Tailwind CSS for UI components
- Local storage for game saves

## Project Structure

\`\`\`
src/
├── components/
│   ├── Game.tsx
│   ├── GameCanvas.tsx
│   ├── Controls.tsx
│   ├── ScoreBoard.tsx
│   └── GameMenu.tsx
├── hooks/
│   ├── useGameLoop.ts
│   └── useGameState.ts
├── services/
│   └── gameService.ts
└── utils/
    └── physics.ts
\`\`\`

## Getting Started

To run the project locally:

\`\`\`bash
# Clone the repository
git clone https://github.com/your-username/web-game.git

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\``,
    resources: [
      {
        title: "View Demo",
        url: "/projects/web-game/demo",
        internal: true,
      },
      {
        title: "View Code",
        url: "/projects/web-game/demo/code",
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