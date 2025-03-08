import type { Project } from "@/types/Project";
import type { ProjectImplementation } from "../index";
import MarkdownEditor from "./MarkdownEditor";
import MarkdownEditorCode from "./MarkdownEditorCode";

const implementation: ProjectImplementation = {
  app: MarkdownEditor,
  code: MarkdownEditorCode,
  title: "Markdown Note Editor",
  description:
    "A beautiful markdown note-taking app with real-time preview, organization features, and local storage persistence.",
};

const project: Project = {
  id: 3,
  title: implementation.title,
  description: implementation.description,
  image:
    "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
  tags: ["React", "TypeScript", "Markdown", "LocalStorage"],
  difficulty: "intermediate",
  timeEstimate: "4-6 hours",
  githubUrl: "#",
  demoUrl: "#",
  readme:
    "# Markdown Note Editor\n\nA sleek, minimalist markdown note-taking application built with React and TypeScript. This project offers a distraction-free writing experience with real-time preview.\n\n## Features\n\n- Real-time markdown preview\n- Note organization with folders\n- Syntax highlighting\n- Search functionality\n- Export notes to various formats\n- Local storage persistence\n\n## Learning Objectives\n\n- Working with markdown parsers\n- Text editor implementation\n- File system-like structure in frontend\n- Search and filter algorithms\n- Local storage strategies for larger data",
};

export default { ...project, ...implementation };
