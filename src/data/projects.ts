import { Project } from "@/types/Project";

export const projects: Project[] = [
  {
    id: 1,
    title: "Todo App with Drag & Drop",
    description:
      "A sleek todo application with drag and drop functionality to reorder tasks. Includes local storage persistence and theme switching.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "DnD", "Tailwind CSS"],
    difficulty: "beginner",
    timeEstimate: "2-3 hours",
    githubUrl: "https://github.com/react-projects/todo-app-dnd",
    demoUrl: "https://todo-app-dnd-react.vercel.app",
    readme:
      "# Todo App with Drag & Drop\n\nA simple yet powerful todo application built with React, TypeScript, and Tailwind CSS. This project demonstrates basic state management, drag and drop functionality, and local storage persistence.\n\n## Features\n\n- Create, edit, and delete tasks\n- Mark tasks as complete\n- Drag and drop to reorder tasks\n- Filter tasks by status\n- Dark/light theme switching\n- Local storage persistence\n\n## Learning Objectives\n\n- React state management with useState and useContext\n- TypeScript interfaces and type safety\n- Implementing drag and drop functionality\n- Working with local storage\n- CSS styling with Tailwind CSS",
  },
  {
    id: 2,
    title: "Weather Dashboard",
    description:
      "A beautiful weather dashboard that fetches data from a weather API. Features include searching for locations, displaying forecasts, and animated weather icons.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Chart.js"],
    difficulty: "intermediate",
    timeEstimate: "3-4 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Weather Dashboard\n\nA beautiful weather dashboard built with React and TypeScript. This project fetches data from a weather API and presents it in a visually appealing way.\n\n## Features\n\n- Search for locations worldwide\n- Display current weather conditions\n- Show 7-day forecast\n- Animated weather icons\n- Temperature graphs using Chart.js\n- Save favorite locations\n\n## Learning Objectives\n\n- Working with external APIs\n- TypeScript interfaces for API responses\n- Async/await and error handling\n- Data visualization with Chart.js\n- Responsive design principles",
  },
  {
    id: 3,
    title: "Markdown Note Editor",
    description:
      "A beautiful markdown note-taking app with real-time preview, organization features, and local storage persistence.",
    image:
      "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Markdown", "LocalStorage"],
    difficulty: "intermediate",
    timeEstimate: "4-6 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Markdown Note Editor\n\nA sleek, minimalist markdown note-taking application built with React and TypeScript. This project offers a distraction-free writing experience with real-time preview.\n\n## Features\n\n- Real-time markdown preview\n- Note organization with folders\n- Syntax highlighting\n- Search functionality\n- Export notes to various formats\n- Local storage persistence\n\n## Learning Objectives\n\n- Working with markdown parsers\n- Text editor implementation\n- File system-like structure in frontend\n- Search and filter algorithms\n- Local storage strategies for larger data",
  },
  {
    id: 4,
    title: "E-Commerce Product Page",
    description:
      "A fully functional e-commerce product page with image gallery, product options, reviews, and add-to-cart functionality.",
    image:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "E-commerce", "Animations"],
    difficulty: "intermediate",
    timeEstimate: "3-5 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# E-Commerce Product Page\n\nA modern, fully functional e-commerce product page built with React and TypeScript. This project demonstrates key e-commerce UI components and interactions.\n\n## Features\n\n- Image gallery with zoom functionality\n- Product options selection (size, color, etc.)\n- Customer reviews and ratings\n- Add to cart functionality\n- Related products carousel\n\n## Learning Objectives\n\n- Complex state management\n- Image handling and gallery implementation\n- Form validation\n- Shopping cart logic\n- Responsive product layouts",
  },
  {
    id: 5,
    title: "Job Application Tracker",
    description:
      "A comprehensive job application tracking system with kanban board, statistics dashboard, and reminder notifications.",
    image:
      "https://images.unsplash.com/photo-1484981138541-3d074aa97716?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Kanban", "Dashboard"],
    difficulty: "advanced",
    timeEstimate: "6-8 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Job Application Tracker\n\nA comprehensive job application tracking system built with React and TypeScript. This project helps users organize and track their job search process.\n\n## Features\n\n- Kanban board for application status\n- Job application form with validation\n- Dashboard with statistics\n- Calendar for interview scheduling\n- Reminder notifications\n\n## Learning Objectives\n\n- Complex state management (Redux or Context)\n- Drag and drop kanban implementation\n- Data visualization for statistics\n- Form handling and validation\n- Calendar and date handling",
  },
  {
    id: 6,
    title: "Pomodoro Timer",
    description:
      "A customizable pomodoro timer application with task tracking, statistics, and sound notifications.",
    image:
      "https://images.unsplash.com/photo-1516031190212-da133013de50?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Timer", "Productivity"],
    difficulty: "beginner",
    timeEstimate: "2-3 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Pomodoro Timer\n\nA customizable pomodoro timer application built with React and TypeScript. This project helps users implement the pomodoro technique for productivity.\n\n## Features\n\n- Customizable work and break intervals\n- Task tracking for each pomodoro session\n- Sound notifications\n- Session statistics\n- Dark/light theme support\n\n## Learning Objectives\n\n- Timer implementation in JavaScript\n- Audio handling in web applications\n- User preferences and settings\n- Basic data visualization for statistics\n- Accessibility considerations for timers",
  },
  {
    id: 7,
    title: "Recipe Finder App",
    description:
      "A recipe search application that pulls from a culinary API. Includes filters, favorites, and detailed cooking instructions.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Filters"],
    difficulty: "intermediate",
    timeEstimate: "4-5 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Recipe Finder App\n\nA recipe search application built with React and TypeScript. This project allows users to search and filter recipes from a culinary API.\n\n## Features\n\n- Search recipes by ingredients or name\n- Filter by dietary restrictions\n- Save favorite recipes\n- Detailed cooking instructions\n- Nutritional information\n\n## Learning Objectives\n\n- Working with complex API responses\n- Search and filter functionality\n- Responsive image galleries\n- Local storage for favorites\n- Complex form handling for filters",
  },
  {
    id: 8,
    title: "Budget Tracker",
    description:
      "A personal finance application to track income, expenses, and savings goals. Includes visualizations and category management.",
    image:
      "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Chart.js", "Finance"],
    difficulty: "intermediate",
    timeEstimate: "5-6 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Budget Tracker\n\nA personal finance application built with React and TypeScript. This project helps users track their income, expenses, and savings goals.\n\n## Features\n\n- Income and expense tracking\n- Category management\n- Recurring transactions\n- Budget goals and limits\n- Visualization of spending patterns\n- Export data to CSV\n\n## Learning Objectives\n\n- Complex form handling\n- Data storage strategies\n- Chart implementation with Chart.js\n- Date handling for recurring transactions\n- Data export functionality",
  },
  {
    id: 9,
    title: "Movie Database App",
    description:
      "A movie database application that uses a film API to display information about movies, including cast, ratings, and trailers.",
    image:
      "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Carousel"],
    difficulty: "intermediate",
    timeEstimate: "4-5 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Movie Database App\n\nA comprehensive movie database application built with React and TypeScript. This project fetches and displays information about movies from a film API.\n\n## Features\n\n- Search for movies by title\n- Browse movies by genre, year, etc.\n- View detailed movie information\n- Watch trailers\n- See cast and crew information\n- Save favorites and create watchlists\n\n## Learning Objectives\n\n- Working with complex API responses\n- Video embedding\n- Infinite scroll or pagination\n- Search functionality with autocomplete\n- Responsive image handling",
  },
  {
    id: 10,
    title: "GitHub Profile Viewer",
    description:
      "An application that uses the GitHub API to display user profiles, repositories, and contribution statistics.",
    image:
      "https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "GitHub"],
    difficulty: "intermediate",
    timeEstimate: "3-4 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# GitHub Profile Viewer\n\nA GitHub profile viewing application built with React and TypeScript. This project uses the GitHub API to display user information and repositories.\n\n## Features\n\n- Search for GitHub users\n- Display user profile information\n- List repositories with details\n- Visualize contribution statistics\n- Show follower/following networks\n\n## Learning Objectives\n\n- Authentication with GitHub API\n- Pagination for large data sets\n- Chart visualization for statistics\n- Error handling for API requests\n- Responsive design for different screen sizes",
  },
  {
    id: 11,
    title: "Drawing App",
    description:
      "A digital drawing application with various brush types, color selection, and the ability to save and share creations.",
    image:
      "https://images.unsplash.com/photo-1515378791036-0648a3ef77b2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Canvas", "Drawing"],
    difficulty: "advanced",
    timeEstimate: "6-8 hours",
    githubUrl: "https://github.com/react-projects/drawing-app",
    demoUrl: "https://drawing-app-react.vercel.app",
    readme:
      "# Drawing App\n\nA digital drawing application built with React, TypeScript, and HTML Canvas. This project allows users to create digital artwork with various tools.\n\n## Features\n\n- Multiple brush types and sizes\n- Color picker and palette\n- Layers system\n- Undo/redo functionality\n- Save drawings as images\n- Import images as backgrounds\n\n## Learning Objectives\n\n- HTML Canvas manipulation\n- Drawing algorithms\n- Touch and mouse event handling\n- Image processing and export\n- Undo/redo stack implementation",
  },
  {
    id: 12,
    title: "Chat Application",
    description:
      "A real-time chat application with private messaging, group channels, and message reactions.",
    image:
      "https://images.unsplash.com/photo-1611606063065-ee7946f0787a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Firebase", "Real-time"],
    difficulty: "advanced",
    timeEstimate: "7-9 hours",
    githubUrl: "https://github.com/react-projects/chat-application",
    demoUrl: "https://chat-application-react.vercel.app",
    readme:
      "# Chat Application\n\nA real-time chat application built with React, TypeScript, and Firebase. This project demonstrates real-time data synchronization and chat functionality.\n\n## Features\n\n- Real-time messaging\n- User authentication\n- Group channels\n- Private messaging\n- Message reactions and replies\n- Online status indicators\n- Message search\n\n## Learning Objectives\n\n- Real-time database integration\n- Authentication and authorization\n- Complex data structures for chat\n- Optimistic UI updates\n- Performance optimization for real-time apps",
  },
  {
    id: 13,
    title: "Music Player",
    description:
      "A feature-rich music player with playlist management, audio visualization, and media controls.",
    image:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Audio API", "Visualization"],
    difficulty: "advanced",
    timeEstimate: "6-8 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Music Player\n\nA feature-rich music player built with React, TypeScript, and the Web Audio API. This project demonstrates audio handling and visualization.\n\n## Features\n\n- Audio playback controls\n- Playlist management\n- Audio visualization\n- Equalizer settings\n- Shuffle and repeat modes\n- Import audio files\n\n## Learning Objectives\n\n- Working with the Web Audio API\n- Audio visualization techniques\n- Media controls integration\n- Playlist management algorithms\n- File system access for audio import",
  },
  {
    id: 14,
    title: "Calendar & Event Planner",
    description:
      "A comprehensive calendar application with event management, reminders, and multiple view options.",
    image:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Calendar", "Events"],
    difficulty: "advanced",
    timeEstimate: "6-7 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Calendar & Event Planner\n\nA comprehensive calendar and event planning application built with React and TypeScript. This project helps users manage their schedule and events.\n\n## Features\n\n- Monthly, weekly, and daily calendar views\n- Event creation and management\n- Recurring events\n- Reminders and notifications\n- Event categories and color coding\n- Calendar sharing\n\n## Learning Objectives\n\n- Complex date handling\n- Calendar UI implementation\n- Recurring event algorithms\n- Drag and drop for event management\n- Notification systems",
  },
  {
    id: 15,
    title: "Fitness Tracker",
    description:
      "A fitness tracking application to record workouts, track progress, and set fitness goals.",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Chart.js", "Fitness"],
    difficulty: "intermediate",
    timeEstimate: "5-6 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Fitness Tracker\n\nA fitness tracking application built with React and TypeScript. This project helps users record workouts and track their fitness progress.\n\n## Features\n\n- Workout logging\n- Exercise library\n- Progress tracking and visualization\n- Fitness goal setting\n- Body measurement tracking\n- Workout routines and plans\n\n## Learning Objectives\n\n- Complex form handling for workouts\n- Data visualization for progress\n- Date-based data organization\n- Local storage strategies\n- Performance optimization for larger datasets",
  },
  {
    id: 16,
    title: "Quiz Application",
    description:
      "An interactive quiz application with various question types, scoring, and timed quizzes.",
    image:
      "https://images.unsplash.com/photo-1605711285791-0219e80e43a3?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Quiz", "Education"],
    difficulty: "beginner",
    timeEstimate: "3-4 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Quiz Application\n\nAn interactive quiz application built with React and TypeScript. This project allows users to create and take quizzes on various topics.\n\n## Features\n\n- Multiple question types (multiple choice, true/false, etc.)\n- Timed quizzes\n- Scoring and results\n- Quiz categories and difficulty levels\n- Progress saving\n- Results analysis\n\n## Learning Objectives\n\n- Form handling for different question types\n- Timer implementation\n- Score calculation algorithms\n- Progress tracking\n- Data structuring for quiz questions",
  },
  {
    id: 17,
    title: "Language Learning Flashcards",
    description:
      "A flashcard application for language learning with spaced repetition, pronunciation, and progress tracking.",
    image:
      "https://images.unsplash.com/photo-1546521343-4eb2c9845a3b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Education", "Flashcards"],
    difficulty: "intermediate",
    timeEstimate: "4-5 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Language Learning Flashcards\n\nA flashcard application for language learning built with React and TypeScript. This project implements spaced repetition for effective memorization.\n\n## Features\n\n- Flashcard creation and management\n- Spaced repetition system\n- Text-to-speech pronunciation\n- Progress tracking\n- Category organization\n- Import/export vocabulary lists\n\n## Learning Objectives\n\n- Spaced repetition algorithm implementation\n- Text-to-speech integration\n- Flip card animations\n- Progress tracking and storage\n- Performance optimization for larger card sets",
  },
  {
    id: 18,
    title: "Expense Splitting App",
    description:
      "An application for splitting expenses among friends, with features like group management, expense tracking, and settlement calculation.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Finance", "Groups"],
    difficulty: "advanced",
    timeEstimate: "7-8 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Expense Splitting App\n\nAn expense splitting application built with React and TypeScript. This project helps users track and split expenses among friends or groups.\n\n## Features\n\n- Group creation and management\n- Expense entry and categorization\n- Split options (equal, percentage, exact)\n- Settlement calculation\n- Transaction history\n- Balance visualization\n\n## Learning Objectives\n\n- Complex expense splitting algorithms\n- Group and user management\n- Financial calculations\n- Data visualization for balances\n- Multi-user state management",
  },
  {
    id: 19,
    title: "Portfolio Website Template",
    description:
      "A customizable portfolio website template for showcasing projects, skills, and experience.",
    image:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Portfolio", "Animation"],
    difficulty: "beginner",
    timeEstimate: "3-4 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Portfolio Website Template\n\nA customizable portfolio website template built with React and TypeScript. This project provides a professional platform for showcasing work and skills.\n\n## Features\n\n- Responsive design\n- Project showcase with filtering\n- Skills and experience sections\n- Contact form\n- Customizable themes\n- SEO optimization\n\n## Learning Objectives\n\n- Responsive design principles\n- Form handling for contact\n- Animation and transitions\n- Theme customization\n- Project organization and filtering",
  },
  {
    id: 20,
    title: "Virtual Keyboard",
    description:
      "A customizable on-screen keyboard with multiple layouts, themes, and typing sound effects.",
    image:
      "https://images.unsplash.com/photo-1563770660941-10a1b434c473?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Keyboard", "Accessibility"],
    difficulty: "intermediate",
    timeEstimate: "4-5 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Virtual Keyboard\n\nA customizable virtual keyboard built with React and TypeScript. This project provides an on-screen keyboard with various features.\n\n## Features\n\n- Multiple keyboard layouts\n- Theme customization\n- Typing sound effects\n- Key press animations\n- Autocorrect and word suggestions\n- Special character support\n\n## Learning Objectives\n\n- Keyboard event handling\n- Layout switching logic\n- Audio integration for key sounds\n- Autocorrect algorithms\n- Accessibility considerations",
  },
  {
    id: 21,
    title: "Cryptocurrency Dashboard",
    description:
      "A real-time cryptocurrency tracking dashboard with price charts, portfolio management, and news feed.",
    image:
      "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Finance"],
    difficulty: "advanced",
    timeEstimate: "7-8 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Cryptocurrency Dashboard\n\nA real-time cryptocurrency tracking dashboard built with React and TypeScript. This project provides comprehensive information about various cryptocurrencies.\n\n## Features\n\n- Real-time price tracking\n- Interactive price charts\n- Portfolio management\n- Cryptocurrency news feed\n- Market analysis tools\n- Alert system for price changes\n\n## Learning Objectives\n\n- Real-time data fetching\n- Advanced chart implementation\n- Financial data processing\n- News API integration\n- Websocket implementation for live updates",
  },
  {
    id: 22,
    title: "Habit Tracker",
    description:
      "A habit tracking application to help users build and maintain positive habits with streaks, reminders, and statistics.",
    image:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Habits", "Calendar"],
    difficulty: "intermediate",
    timeEstimate: "4-6 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Habit Tracker\n\nA habit tracking application built with React and TypeScript. This project helps users build and maintain positive habits through consistent tracking.\n\n## Features\n\n- Habit creation and tracking\n- Daily, weekly, and monthly views\n- Streak counting\n- Reminder notifications\n- Statistics and trends\n- Habit categories and tags\n\n## Learning Objectives\n\n- Calendar implementation\n- Streak calculation algorithms\n- Statistics and data visualization\n- Local notification systems\n- Data persistence strategies",
  },
  {
    id: 23,
    title: "Image Gallery",
    description:
      "A responsive image gallery with filtering, search, lightbox view, and lazy loading for optimal performance.",
    image:
      "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Gallery", "Lazy Loading"],
    difficulty: "beginner",
    timeEstimate: "2-3 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Image Gallery\n\nA responsive image gallery built with React and TypeScript. This project showcases techniques for efficiently displaying and interacting with collections of images.\n\n## Features\n\n- Responsive grid layout\n- Image filtering and search\n- Lightbox view for individual images\n- Lazy loading for performance\n- Image categories and tags\n- Masonry layout option\n\n## Learning Objectives\n\n- Responsive image handling\n- Lazy loading implementation\n- Lightbox component creation\n- Search and filter functionality\n- Performance optimization for image-heavy applications",
  },
  {
    id: 24,
    title: "Recipe Book",
    description:
      "A personal recipe collection application with ingredients, cooking instructions, and meal planning features.",
    image:
      "https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "Recipes", "Storage"],
    difficulty: "intermediate",
    timeEstimate: "4-5 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# Recipe Book\n\nA personal recipe collection application built with React and TypeScript. This project helps users store and organize their favorite recipes.\n\n## Features\n\n- Recipe creation and editing\n- Ingredient lists with measurements\n- Step-by-step instructions\n- Recipe categories and tags\n- Meal planning calendar\n- Shopping list generation\n\n## Learning Objectives\n\n- Complex form handling for recipes\n- Recipe data structure design\n- Search and filter functionality\n- Local storage strategies\n- Print layout optimization",
  },
  {
    id: 25,
    title: "URL Shortener",
    description:
      "A URL shortening service with custom aliases, QR code generation, and click analytics.",
    image:
      "https://images.unsplash.com/photo-1616469829941-c7200edec809?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
    tags: ["React", "TypeScript", "API", "Analytics"],
    difficulty: "intermediate",
    timeEstimate: "3-4 hours",
    githubUrl: "#",
    demoUrl: "#",
    readme:
      "# URL Shortener\n\nA URL shortening service built with React and TypeScript. This project allows users to create shorter, more manageable links from long URLs.\n\n## Features\n\n- URL shortening\n- Custom alias creation\n- QR code generation\n- Click tracking and analytics\n- Link expiration options\n- Password protection for links\n\n## Learning Objectives\n\n- API integration for URL shortening\n- QR code generation\n- Analytics data visualization\n- Form validation for URLs\n- Copy to clipboard functionality",
  },
];
