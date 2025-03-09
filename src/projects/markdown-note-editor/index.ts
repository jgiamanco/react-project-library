
import MarkdownEditor from "./MarkdownEditor";

// Define the project metadata
const MarkdownEditorProject = {
  app: MarkdownEditor,
  code: () => import("./MarkdownEditorCode"),
  title: "Markdown Note Editor",
  description: "Create and edit markdown notes with real-time preview"
};

export default MarkdownEditorProject;
