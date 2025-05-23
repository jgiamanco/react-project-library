import * as React from "react";
import MarkdownEditor from "./MarkdownEditor";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useEffect, useState } from "react";
import MarkdownEditorCode from "./MarkdownEditorCode";

const CodeViewer = () => {
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    // Fetch the code content
    fetch("/src/projects/markdown-note-editor/MarkdownEditor.tsx")
      .then((response) => response.text())
      .then((text) => setCode(text))
      .catch((error) => console.error("Error loading code:", error));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <SyntaxHighlighter
        language="typescript"
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          backgroundColor: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};

const project = {
  app: MarkdownEditor,
  code: CodeViewer,
  title: "Markdown Note Editor",
  description:
    "A beautiful markdown note-taking app with real-time preview, organization features, and local storage persistence.",
  id: 3,
  image:
    "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
  tags: ["React", "TypeScript", "Markdown", "LocalStorage"],
  difficulty: "intermediate" as const,
  timeEstimate: "4-6 hours",
  githubUrl: "#",
  demoUrl: "#",
  readme:
    "# Markdown Note Editor\n\nA sleek, minimalist markdown note-taking application built with React and TypeScript. This project offers a distraction-free writing experience with real-time preview.\n\n## Features\n\n- Real-time markdown preview\n- Note organization with folders\n- Syntax highlighting\n- Search functionality\n- Export notes to various formats\n- Local storage persistence\n\n## Learning Objectives\n\n- Working with markdown parsers\n- Text editor implementation\n- File system-like structure in frontend\n- Search and filter algorithms\n- Local storage strategies for larger data",
};

export const app = MarkdownEditor;
export const code = MarkdownEditorCode;

export default project;
