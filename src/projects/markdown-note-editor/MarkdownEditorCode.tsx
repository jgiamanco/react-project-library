
import CodeViewer from "@/components/CodeViewer";

export const MarkdownEditorCode = () => {
  const files = {
    "MarkdownEditor.tsx": `import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Sun, Moon, Save, FolderPlus, Search, Download } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { Note, Folder } from "./types";

// Component implementation...`,
    "types.ts": `export interface Note {
  id: string;
  title: string;
  content: string;
  folderId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Folder {
  id: string;
  name: string;
}`,
    "index.ts": `import { MarkdownEditor } from "./MarkdownEditor";
import { MarkdownEditorCode } from "./MarkdownEditorCode";

export default {
  app: MarkdownEditor,
  code: MarkdownEditorCode,
  title: "Markdown Note Editor",
  description: "A beautiful markdown note-taking app with real-time preview.",
};`,
  };

  return <CodeViewer files={files} />;
};

export default MarkdownEditorCode;
