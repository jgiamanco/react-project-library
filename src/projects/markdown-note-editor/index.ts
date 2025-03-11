
import MarkdownEditor from "./MarkdownEditor";
import { MarkdownEditorCode } from "./MarkdownEditorCode";

// Define the project metadata
const MarkdownEditorProject = {
  app: MarkdownEditor,
  code: MarkdownEditorCode,
  title: "Markdown Note Editor",
  description: "Create and edit markdown notes with real-time preview",
  id: "markdown-editor" // This ID is used with project_sessions table
};

export default MarkdownEditorProject;
