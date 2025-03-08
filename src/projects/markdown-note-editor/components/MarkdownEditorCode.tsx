import React, { useState, ComponentType } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";

const files = {
  "MarkdownEditor.tsx": `import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Button,
  Input,
} from "@/components/ui";
import { Save, FileText, Trash2, Sun, Moon } from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  lastModified: Date;
}

export const MarkdownEditor = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [darkMode, setDarkMode] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("markdown-notes");
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes));
    }
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("markdown-notes", JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: "# Start writing here...",
      lastModified: new Date(),
    };
    setNotes([...notes, newNote]);
    setSelectedNote(newNote);
  };

  const updateNote = (content: string) => {
    if (!selectedNote) return;

    const updatedNote = {
      ...selectedNote,
      content,
      lastModified: new Date(),
    };

    setSelectedNote(updatedNote);
    setNotes(notes.map((note) => (note.id === selectedNote.id ? updatedNote : note)));
  };

  const deleteNote = (id: string) => {
    setNotes(notes.filter((note) => note.id !== id));
    if (selectedNote?.id === id) {
      setSelectedNote(null);
    }
  };

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className={\`min-h-screen p-4 \${darkMode ? "dark bg-gray-900" : "bg-gray-100"}\`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <h1 className={\`text-2xl font-bold \${darkMode ? "text-white" : ""}\`}>
            Markdown Note Editor
          </h1>
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>

        <div className="grid grid-cols-12 gap-4">
          {/* Notes Sidebar */}
          <div className="col-span-3">
            <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
              <CardHeader>
                <CardTitle>Notes</CardTitle>
                <CardDescription className={darkMode ? "text-gray-400" : ""}>
                  {notes.length} notes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={createNewNote} className="w-full mb-4">
                  <FileText className="h-4 w-4 mr-2" /> New Note
                </Button>
                <div className="space-y-2">
                  {notes.map((note) => (
                    <div
                      key={note.id}
                      className={\`flex items-center justify-between p-2 rounded cursor-pointer \${
                        selectedNote?.id === note.id
                          ? "bg-primary text-primary-foreground"
                          : darkMode
                          ? "hover:bg-gray-700"
                          : "hover:bg-gray-100"
                      }\`}
                      onClick={() => setSelectedNote(note)}
                    >
                      <span className="truncate">{note.title}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Editor and Preview */}
          {selectedNote ? (
            <>
              <div className="col-span-4">
                <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
                  <CardHeader>
                    <CardTitle>Editor</CardTitle>
                    <Input
                      value={selectedNote.title}
                      onChange={(e) =>
                        updateNote(selectedNote.content)
                      }
                      className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
                    />
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={selectedNote.content}
                      onChange={(e) => updateNote(e.target.value)}
                      className={\`w-full h-[600px] p-4 rounded-md font-mono \${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "bg-white border"
                      }\`}
                    />
                  </CardContent>
                </Card>
              </div>
              <div className="col-span-5">
                <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
                  <CardHeader>
                    <CardTitle>Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div
                      className={\`prose max-w-none h-[600px] overflow-y-auto p-4 rounded-md \${
                        darkMode ? "prose-invert" : ""
                      }\`}
                    >
                      <ReactMarkdown>{selectedNote.content}</ReactMarkdown>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </>
          ) : (
            <div className="col-span-9">
              <Card className={darkMode ? "bg-gray-800 text-white" : ""}>
                <CardContent>
                  <div className="flex flex-col items-center justify-center h-[400px]">
                    <FileText className="h-16 w-16 mb-4 text-gray-400" />
                    <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                      Select a note or create a new one to start editing
                    </p>
                    <Button onClick={createNewNote} className="mt-4">
                      Create New Note
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};`,
  "index.ts": `import type { Project } from "@/types/Project";
import type { ProjectImplementation } from "../index";
import { MarkdownEditor } from "./components/MarkdownEditor";
import { MarkdownEditorCode } from "./components/MarkdownEditorCode";

const implementation: ProjectImplementation = {
  app: MarkdownEditor,
  code: MarkdownEditorCode,
  title: "Markdown Note Editor",
  description: "A beautiful markdown note-taking app with real-time preview, organization features, and local storage persistence.",
};

const project: Project = {
  id: 3,
  title: implementation.title,
  description: implementation.description,
  image: "https://images.unsplash.com/photo-1512758017271-d7b84c2113f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80",
  tags: ["React", "TypeScript", "Markdown", "LocalStorage"],
  difficulty: "intermediate",
  timeEstimate: "4-6 hours",
  githubUrl: "#",
  demoUrl: "#",
  readme: "# Markdown Note Editor\\n\\nA sleek, minimalist markdown note-taking application built with React and TypeScript. This project offers a distraction-free writing experience with real-time preview.\\n\\n## Features\\n\\n- Real-time markdown preview\\n- Note organization with folders\\n- Syntax highlighting\\n- Search functionality\\n- Export notes to various formats\\n- Local storage persistence\\n\\n## Learning Objectives\\n\\n- Working with markdown parsers\\n- Text editor implementation\\n- File system-like structure in frontend\\n- Search and filter algorithms\\n- Local storage strategies for larger data"
};

export default { ...project, ...implementation };`,
};

export const MarkdownEditorCode = () => {
  const [activeFile, setActiveFile] = useState("MarkdownEditor.tsx");

  return (
    <div className="p-4">
      <Card>
        <CardHeader>
          <CardTitle>Project Files</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2 mb-4">
            {Object.keys(files).map((filename) => (
              <Button
                key={filename}
                variant={activeFile === filename ? "default" : "outline"}
                onClick={() => setActiveFile(filename)}
              >
                {filename}
              </Button>
            ))}
          </div>
          <div className="relative">
            <SyntaxHighlighter
              language="typescript"
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
              }}
              showLineNumbers
            >
              {files[activeFile]}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
