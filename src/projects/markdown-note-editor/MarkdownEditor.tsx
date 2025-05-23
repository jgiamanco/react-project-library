import React from "react";
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
