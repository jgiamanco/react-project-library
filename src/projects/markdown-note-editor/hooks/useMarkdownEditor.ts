
import { useState, useEffect } from 'react';
import { Note, Folder } from '../types';

export const useMarkdownEditor = () => {
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
