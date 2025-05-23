import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
// Removed direct SyntaxHighlighter imports
import MarkdownCodeBlock from "@/components/MarkdownCodeBlock"; // Import the new component
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
  // Define custom components for ReactMarkdown, using the new MarkdownCodeBlock
  const markdownComponents = useMemo(() => ({
    code: MarkdownCodeBlock, // Use the dedicated component for code blocks
  }), []); // Memoize the components object

  // Memoize the preview to prevent unnecessary re-renders
  const markdownPreview = useMemo(
    () => (
      <ReactMarkdown components={markdownComponents}>
        {currentNote.content}
      </ReactMarkdown>
    ),
    [currentNote.content, markdownComponents] // Add markdownComponents to dependencies
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          className={`w-full h-[400px] lg:h-[600px] p-4 rounded border font-mono ${
            darkMode
              ? "bg-gray-700 text-white border-gray-600"
              : "border-gray-200"
          }`}
          placeholder="Type your markdown here..."
        />
      </div>
      <div
        className={`p-4 rounded border overflow-auto h-[400px] lg:h-[600px] prose dark:prose-invert max-w-none ${
          darkMode
            ? "bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {markdownPreview}
      </div>
    </div>
  );
});

NoteEditor.displayName = "NoteEditor";

export default NoteEditor;