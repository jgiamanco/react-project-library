import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";

export const TodoAppCode = () => {
  const [activeFile, setActiveFile] = useState<string>("TodoApp.tsx");

  const files = {
    "TodoApp.tsx": `import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Check, Sun, Moon } from "lucide-react";
import { Todo } from "./types";

// Component implementation...`,
    "types.ts": `export interface Todo {
  id: string;
  text: string;
  completed: boolean;
}`,
    "index.ts": `import TodoApp from "./TodoApp";
import TodoAppCode from "./TodoAppCode";

export default {
  app: TodoApp,
  code: TodoAppCode,
  title: "Todo App with Drag & Drop",
  description: "A sleek todo application with drag and drop functionality to reorder tasks.",
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

export default TodoAppCode;
