import CodeViewer from "@/components/CodeViewer";

export const MarkdownEditorCode = () => {
  const files = {
    "MarkdownEditor.tsx": `import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import useMarkdownEditor from "./hooks/useMarkdownEditor";
import Sidebar from "./components/Sidebar";
import NoteEditor from "./components/NoteEditor";
import EditorToolbar from "./components/EditorToolbar";

const MarkdownEditor = () => {
  const {
    darkMode,
    notes,
    folders,
    currentNote,
    searchQuery,
    currentFolder,
    filteredNotes,
    setSearchQuery,
    setCurrentFolder,
    setCurrentNote,
    createNewNote,
    createNewFolder,
    updateNoteTitle,
    updateNoteContent,
    exportNote,
    deleteNote,
    toggleTheme,
  } = useMarkdownEditor();

  return (
    <div
      className={\`min-h-screen p-4 \${
        darkMode ? "dark bg-gray-900" : "bg-gray-100"
      }\`}
    >
      <Card
        className={\`mx-auto max-w-6xl \${
          darkMode ? "bg-gray-800 text-white" : ""
        }\`}
      >
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Markdown Note Editor</CardTitle>
            <EditorToolbar
              darkMode={darkMode}
              toggleTheme={toggleTheme}
              currentNote={currentNote}
              exportNote={exportNote}
              createNewNote={createNewNote}
              createNewFolder={createNewFolder}
              deleteNote={deleteNote}
            />
          </div>
          <CardDescription className={darkMode ? "text-gray-400" : ""}>
            Create and edit markdown notes with real-time preview
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col lg:flex-row space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="w-full lg:w-1/4">
              <Sidebar
                folders={folders}
                notes={notes}
                currentFolder={currentFolder}
                currentNote={currentNote}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                setCurrentFolder={setCurrentFolder}
                setCurrentNote={setCurrentNote}
                createNewFolder={createNewFolder}
                deleteNote={deleteNote}
                darkMode={darkMode}
                filteredNotes={filteredNotes}
              />
            </div>
            <div className="w-full lg:w-3/4">
              {currentNote ? (
                <NoteEditor
                  currentNote={currentNote}
                  darkMode={darkMode}
                  updateNoteTitle={updateNoteTitle}
                  updateNoteContent={updateNoteContent}
                />
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
            className={\`text-sm \${
              darkMode ? "text-gray-400" : "text-gray-500"
            }\`}
          >
            {notes.length} notes in total
          </div>
          {currentNote && (
            <div
              className={\`text-sm \${
                darkMode ? "text-gray-400" : "text-gray-500"
              }\`}
            >
              Last updated: {new Date(currentNote.updatedAt).toLocaleString()}
            </div>
          )}
        </CardFooter>
      </Card>
    </div>
  );
};

export default MarkdownEditor;`,
    "hooks/useMarkdownEditor.ts": `import { useState, useEffect } from "react";
import { Note, Folder } from "../types";
import { useAuth } from "@/contexts/auth-hooks";
import { supabase } from "@/services/supabase-client";
import { toast } from "sonner";

export const useMarkdownEditor = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          try {
            const { data, error } = await supabase
              .from("project_sessions")
              .select("settings")
              .eq("user_id", user.email)
              .eq("project_id", "markdown-editor")
              .single();

            if (error) {
              console.warn("Could not load notes from Supabase:", error);
              loadFromLocalStorage();
            } else if (data?.settings) {
              if (data.settings.notes) setNotes(data.settings.notes);
              if (data.settings.folders) setFolders(data.settings.folders);
            } else {
              loadFromLocalStorage();
            }
          } catch (error) {
            console.error("Error loading notes and folders:", error);
            loadFromLocalStorage();
          }
        } else {
          loadFromLocalStorage();
        }
      } catch (error) {
        console.error("Unexpected error loading data:", error);
        loadFromLocalStorage();
      }
    };

    const loadFromLocalStorage = () => {
      try {
        const savedNotes = localStorage.getItem("markdown_notes");
        const savedFolders = localStorage.getItem("markdown_folders");
        if (savedNotes) setNotes(JSON.parse(savedNotes));
        if (savedFolders) setFolders(JSON.parse(savedFolders));
      } catch (e) {
        console.error("Error loading from localStorage:", e);
      }
    };

    loadData();
  }, [user]);

  useEffect(() => {
    const saveData = async () => {
      localStorage.setItem("markdown_notes", JSON.stringify(notes));

      if (user && notes.length > 0) {
        try {
          const { error } = await supabase.from("project_sessions").upsert(
            {
              user_id: user.email,
              project_id: "markdown-editor",
              last_accessed: new Date().toISOString(),
              settings: {
                notes: notes,
                folders: folders,
              },
            },
            {
              onConflict: "user_id,project_id",
            }
          );

          if (error) {
            console.warn("Could not save notes to Supabase:", error);
          }
        } catch (error) {
          console.error("Error saving notes:", error);
        }
      }
    };

    saveData();
  }, [notes, folders, user]);

  useEffect(() => {
    localStorage.setItem("markdown_folders", JSON.stringify(folders));
  }, [folders]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: \`# Welcome to Markdown Editor\\n\\nThis is a **markdown** editor with _real-time_ preview.\`,
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
    a.download = \`\${currentNote.title}.md\`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const deleteNote = (id: string) => {
    if (
      window.confirm(
        "Are you sure you want to delete this note? This action cannot be undone."
      )
    ) {
      setNotes(notes.filter((note) => note.id !== id));

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

  return {
    darkMode,
    notes,
    folders,
    currentNote,
    searchQuery,
    currentFolder,
    filteredNotes,
    setSearchQuery,
    setCurrentFolder,
    setCurrentNote,
    createNewNote,
    createNewFolder,
    updateNoteTitle,
    updateNoteContent,
    exportNote,
    deleteNote,
    toggleTheme,
  };
};

export default useMarkdownEditor;`,
    "components/Sidebar.tsx": `import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, FolderPlus, Trash2 } from "lucide-react";
import { Note, Folder } from "../types";

interface SidebarProps {
  folders: Folder[];
  notes: Note[];
  currentFolder: string | null;
  currentNote: Note | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  setCurrentFolder: (folderId: string | null) => void;
  setCurrentNote: (note: Note) => void;
  createNewFolder: () => void;
  deleteNote: (id: string) => void;
  darkMode: boolean;
  filteredNotes: Note[];
}

const Sidebar: React.FC<SidebarProps> = ({
  folders,
  currentFolder,
  currentNote,
  searchQuery,
  setSearchQuery,
  setCurrentFolder,
  setCurrentNote,
  createNewFolder,
  deleteNote,
  darkMode,
  filteredNotes,
}) => {
  return (
    <div className="w-1/4">
      <div className="flex items-center space-x-2 mb-4">
        <Input
          placeholder="Search notes..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={darkMode ? "bg-gray-700 text-white border-gray-600" : ""}
        />
        <Button onClick={createNewFolder}>
          <FolderPlus className="h-4 w-4" />
        </Button>
      </div>
      <div className="space-y-2">
        <Button
          variant={currentFolder === null ? "default" : "outline"}
          className="justify-start"
          onClick={() => setCurrentFolder(null)}
        >
          All Notes
        </Button>
        {folders.map((folder) => (
          <Button
            key={folder.id}
            variant={currentFolder === folder.id ? "default" : "outline"}
            className="justify-start"
            onClick={() => setCurrentFolder(folder.id)}
          >
            {folder.name}
          </Button>
        ))}
      </div>
      <div className="mt-4 space-y-2">
        {filteredNotes.map((note) => (
          <div key={note.id} className="flex items-center justify-between">
            <Button
              variant={currentNote?.id === note.id ? "default" : "outline"}
              className="justify-start text-ellipsis"
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
  );
};

export default Sidebar;`,
    "components/NoteEditor.tsx": `import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import MarkdownCodeBlock from "@/components/MarkdownCodeBlock";
import { Note } from "../types";

interface NoteEditorProps {
  currentNote: Note;
  darkMode: boolean;
  updateNoteTitle: (title: string) => void;
  updateNoteContent: (content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = React.memo(({
  currentNote,
  darkMode,
  updateNoteTitle,
  updateNoteContent,
}) => {
  const markdownComponents = useMemo(() => ({
    code: MarkdownCodeBlock,
  }), []);

  const markdownPreview = useMemo(
    () => (
      <ReactMarkdown components={markdownComponents}>
        {currentNote.content}
      </ReactMarkdown>
    ),
    [currentNote.content, markdownComponents]
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      <div>
        <Input
          value={currentNote.title}
          onChange={(e) => updateNoteTitle(e.target.value)}
          className={\`mb-2 \${
            darkMode ? "bg-gray-700 text-white border-gray-600" : ""
          }\`}
        />
        <textarea
          value={currentNote.content}
          onChange={(e) => updateNoteContent(e.target.value)}
          className={\`w-full h-[400px] lg:h-[600px] p-4 rounded border font-mono \${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "bg-white border"
          }\`}
          placeholder="Type your markdown here..."
        />
      </div>
      <div
        className={\`p-4 rounded border overflow-auto h-[400px] lg:h-[600px] prose dark:prose-invert max-w-none \${
          darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }\`}
      >
        {markdownPreview}
      </div>
    </div>
  );
});

NoteEditor.displayName = "NoteEditor";

export default NoteEditor;`,
    "components/EditorToolbar.tsx": `import React from "react";
import { Button } from "@/components/ui/button";
import { Sun, Moon, Save, FolderPlus, Download, Trash2 } from "lucide-react";
import { Note } from "../types";

interface EditorToolbarProps {
  darkMode: boolean;
  toggleTheme: () => void;
  currentNote: Note | null;
  exportNote: () => void;
  createNewNote: () => void;
  createNewFolder: () => void;
  deleteNote: (id: string) => void;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  darkMode,
  toggleTheme,
  currentNote,
  exportNote,
  createNewNote,
  createNewFolder,
  deleteNote,
}) => {
  return (
    <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 sm:items-center">
      <Button onClick={createNewNote} className="w-full sm:w-auto">
        Create New Note
      </Button>
      {currentNote && (
        <div className="flex flex-wrap gap-2 sm:space-x-2">
          <Button onClick={exportNote} className="flex-1 sm:flex-none">
            <Download className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Export</span>
          </Button>
          <Button className="flex-1 sm:flex-none">
            <Save className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Save</span>
          </Button>
          <Button
            variant="destructive"
            onClick={() => currentNote && deleteNote(currentNote.id)}
            className="flex-1 sm:flex-none"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Delete</span>
          </Button>
        </div>
      )}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleTheme}
        className="ml-auto"
      >
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default EditorToolbar;`,
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
}`
  };

  return <CodeViewer files={files} />;
};

export default MarkdownEditorCode;