import { Project } from "@/types/Project";

export const projects: Project[] = [
  // ... other projects ...
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
  // ... other projects ...
];