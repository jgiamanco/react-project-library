import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sun,
  Moon,
  Save,
  FolderPlus,
  Search,
  Download,
  Trash2,
} from "lucide-react";
import ReactMarkdown from "react-markdown";
import { PreBlock } from "./SyntaxHighlighterPlugin";
import { Note, Folder } from "./types";
import "./markdown-styles.css";

const MarkdownEditor = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);

  // Load notes from localStorage on mount
  useEffect(() => {
    const savedNotes = localStorage.getItem("markdown_notes");
    const savedFolders = localStorage.getItem("markdown_folders");
    if (savedNotes) setNotes(JSON.parse(savedNotes));
    if (savedFolders) setFolders(JSON.parse(savedFolders));
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("markdown_notes", JSON.stringify(notes));
  }, [notes]);

  // Save folders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("markdown_folders", JSON.stringify(folders));
  }, [folders]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: `# Welcome to Markdown Editor

This is a **markdown** editor with _real-time_ preview.

## Features

- Create and edit notes
- Organize notes in folders
- Real-time markdown preview
- Export notes

## Code Examples

### JavaScript

\`\`\`javascript
// JavaScript example
function greeting(name) {
  return \`Hello, \${name}!\`;
}

console.log(greeting('World'));
\`\`\`

### Python

\`\`\`python
# Python example
def greeting(name):
    return f"Hello, {name}!"

print(greeting("World"))
\`\`\`

### TypeScript

\`\`\`typescript
// TypeScript example
function greeting(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greeting('World'));
\`\`\`

### Java

\`\`\`java
// Java example
public class Greeting {
    public static void main(String[] args) {
        System.out.println(greeting("World"));
    }
    
    public static String greeting(String name) {
        return "Hello, " + name + "!";
    }
}
\`\`\`

### C#

\`\`\`csharp
// C# example
using System;

class Program
{
    static void Main()
    {
        Console.WriteLine(Greeting("World"));
    }
    
    static string Greeting(string name)
    {
        return $"Hello, {name}!";
    }
}
\`\`\`

### C++

\`\`\`cpp
// C++ example
#include <iostream>
#include <string>

std::string greeting(const std::string& name) {
    return "Hello, " + name + "!";
}

int main() {
    std::cout << greeting("World") << std::endl;
    return 0;
}
\`\`\`

### JSX

\`\`\`jsx
// React JSX example
import React from 'react';

function GreetingComponent({ name }) {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to our application.</p>
    </div>
  );
}

export default GreetingComponent;
\`\`\`

### TSX

\`\`\`tsx
// React TSX example
import React from 'react';

interface GreetingProps {
  name: string;
}

const GreetingComponent: React.FC<GreetingProps> = ({ name }) => {
  return (
    <div className="greeting">
      <h1>Hello, {name}!</h1>
      <p>Welcome to our application.</p>
    </div>
  );
};

export default GreetingComponent;
\`\`\`

### HTML

\`\`\`html
<!-- HTML example -->
<!DOCTYPE html>
<html>
<head>
  <title>Hello World</title>
</head>
<body>
  <h1>Hello, World!</h1>
</body>
</html>
\`\`\`

### CSS

\`\`\`css
/* CSS example */
body {
  font-family: Arial, sans-serif;
  margin: 0;
  padding: 20px;
  color: #333;
}

h1 {
  color: navy;
}
\`\`\`

> Try editing this note to see the preview update in real-time!`,
      folderId: currentFolder,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
    setCurrentNote(newNote);
  };

  const createNewFolder = () => {
    const folderName = prompt("Enter folder name:");
    if (folderName) {
      const newFolder: Folder = {
        id: Date.now().toString(),
        name: folderName,
      };
      setFolders([...folders, newFolder]);
    }
  };

  const updateNoteTitle = (title: string) => {
    if (!currentNote) return;

    const updatedNote = {
      ...currentNote,
      title,
      updatedAt: new Date().toISOString(),
    };

    setNotes(
      notes.map((note) => (note.id === currentNote.id ? updatedNote : note))
    );
    setCurrentNote(updatedNote);
  };

  const updateNoteContent = (content: string) => {
    if (!currentNote) return;

    console.log("Updating note content:", content);

    const updatedNote = {
      ...currentNote,
      content,
      updatedAt: new Date().toISOString(),
    };

    setCurrentNote(updatedNote);
    setNotes(
      notes.map((note) => (note.id === currentNote.id ? updatedNote : note))
    );
  };

  const exportNote = () => {
    if (!currentNote) return;

    const blob = new Blob([currentNote.content], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentNote.title}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteNote = (id: string) => {
    // Ask for confirmation before deleting
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      // Remove the note from the notes array
      setNotes(notes.filter((note) => note.id !== id));

      // If the deleted note is the current note, set currentNote to null
      if (currentNote && currentNote.id === id) {
        setCurrentNote(null);
      }
    }
  };

  const filteredNotes = notes.filter(
    (note) =>
      (!currentFolder || note.folderId === currentFolder) &&
      (note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
    document.querySelector(".markdown-body")?.classList.toggle("dark");
  };

  return (
    <div
      className={`min-h-screen p-4 ${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }`}
    >
      <Card
        className={`mx-auto max-w-6xl ${
          darkMode ? "bg-gray-800 text-white" : ""
        }`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Markdown Note Editor</CardTitle>
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {darkMode ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <CardDescription className={darkMode ? "text-gray-400" : ""}>
            Create and edit markdown notes with real-time preview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-4 mb-4">
            <div className="w-1/4">
              <div className="flex items-center space-x-2 mb-4">
                <Input
                  placeholder="Search notes..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={
                    darkMode ? "bg-gray-700 text-white border-gray-600" : ""
                  }
                />
                <Button onClick={createNewFolder}>
                  <FolderPlus className="h-4 w-4" />
                </Button>
              </div>
              <div className="space-y-2">
                <Button
                  variant={currentFolder === null ? "default" : "outline"}
                  className="w-full justify-start"
                  onClick={() => setCurrentFolder(null)}
                >
                  All Notes
                </Button>
                {folders.map((folder) => (
                  <Button
                    key={folder.id}
                    variant={
                      currentFolder === folder.id ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => setCurrentFolder(folder.id)}
                  >
                    {folder.name}
                  </Button>
                ))}
              </div>
              <div className="mt-4 space-y-2">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    className="flex items-center justify-between"
                  >
                    <Button
                      variant={
                        currentNote?.id === note.id ? "default" : "outline"
                      }
                      className="w-full justify-start overflow-hidden text-ellipsis"
                      onClick={() => setCurrentNote(note)}
                    >
                      {note.title}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-1 text-red-500 hover:text-red-700 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-3/4">
              <div className="flex justify-between mb-4">
                <Button onClick={createNewNote}>Create New Note</Button>
                {currentNote && (
                  <div className="space-x-2">
                    <Button onClick={exportNote}>
                      <Download className="h-4 w-4 mr-2" />
                      Export
                    </Button>
                    <Button>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => deleteNote(currentNote.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                )}
              </div>
              {currentNote ? (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Input
                      value={currentNote.title}
                      onChange={(e) => updateNoteTitle(e.target.value)}
                      className={`mb-2 ${
                        darkMode ? "bg-gray-700 text-white border-gray-600" : ""
                      }`}
                    />
                    <textarea
                      value={currentNote.content}
                      onChange={(e) => updateNoteContent(e.target.value)}
                      className={`w-full h-[600px] p-4 rounded border font-mono ${
                        darkMode
                          ? "bg-gray-700 text-white border-gray-600"
                          : "border-gray-200"
                      }`}
                      placeholder="Type your markdown here..."
                    />
                  </div>
                  <div
                    className={`p-4 rounded border overflow-auto h-[600px] markdown-body ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "bg-white border-gray-200 text-gray-900"
                    }`}
                  >
                    <ReactMarkdown components={{ pre: PreBlock }}>
                      {currentNote.content}
                    </ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  Select a note or create a new one to start editing
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div
            className={`text-sm ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            {notes.length} notes in total
          </div>
          {currentNote && (
            <div
              className={`text-sm ${
                darkMode ? "text-gray-400" : "text-gray-500"
              }`}
            >
              Last updated: {new Date(currentNote.updatedAt).toLocaleString()}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkdownEditor;
