
import React from 'react';
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
  filteredNotes
}) => {
  return (
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
            variant={currentFolder === folder.id ? "default" : "outline"}
            className="w-full justify-start"
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
  );
};

export default Sidebar;
