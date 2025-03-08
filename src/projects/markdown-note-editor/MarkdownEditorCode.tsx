import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

export const MarkdownEditorCode = () => {
  const [activeFile, setActiveFile] = useState<string>("MarkdownEditor.tsx");

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

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {Object.keys(files).map((fileName) => (
          <Button
            key={fileName}
            variant={activeFile === fileName ? "default" : "outline"}
            onClick={() => setActiveFile(fileName)}
          >
            {fileName}
          </Button>
        ))}
      </div>
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
          {files[activeFile]}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default MarkdownEditorCode;
