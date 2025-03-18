import React from "react";
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

export default EditorToolbar;
