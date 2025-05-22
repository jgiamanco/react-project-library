import React, { useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Input } from "@/components/ui/input";
import { PreBlock } from "../SyntaxHighlighterPlugin";
import { Note } from "../types";

interface NoteEditorProps {
  currentNote: Note;
  darkMode: boolean;
  updateNoteTitle: (title: string) => void;
  updateNoteContent: (content: string) => void;
}

const NoteEditor: React.FC<NoteEditorProps> = ({
  currentNote,
  darkMode,
  updateNoteTitle,
  updateNoteContent,
}) => {
  // Memoize the preview to prevent unnecessary re-renders
  const markdownPreview = useMemo(
    () => (
      <ReactMarkdown components={{ pre: PreBlock }}>
        {currentNote.content}
      </ReactMarkdown>
    ),
    [currentNote.content]
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
        className={`p-4 rounded border overflow-auto h-[400px] lg:h-[600px] markdown-body ${
          darkMode
            ? "markdown-dark bg-gray-700 border-gray-600 text-white"
            : "bg-white border-gray-200 text-gray-900"
        }`}
      >
        {markdownPreview}
      </div>
    </div>
  );
};

export default React.memo(NoteEditor);
