
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
            onClick={() => currentNote && deleteNote(currentNote.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      )}
      <Button variant="ghost" size="icon" onClick={toggleTheme} className="ml-auto">
        {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </Button>
    </div>
  );
};

export default EditorToolbar;
