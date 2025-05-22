import { useState, useEffect } from "react";
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

  // Load notes and folders from Supabase or localStorage on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user) {
          // Attempt to load from Supabase
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
          // Not logged in, use localStorage
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

  // Save notes to localStorage always, attempt Supabase if logged in
  useEffect(() => {
    const saveData = async () => {
      // Always save to localStorage as fallback
      localStorage.setItem("markdown_notes", JSON.stringify(notes));

      // If logged in, try to save to Supabase
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
            // Silent failure - data is already in localStorage
          }
        } catch (error) {
          console.error("Error saving notes:", error);
        }
      }
    };

    saveData();
  }, [notes, folders, user]);

  // Save folders to localStorage always
  useEffect(() => {
    localStorage.setItem("markdown_folders", JSON.stringify(folders));
  }, [folders]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: "Untitled Note",
      content: `# Welcome to Markdown Editor\n\nThis is a **markdown** editor with _real-time_ preview.`,
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

export default useMarkdownEditor;
