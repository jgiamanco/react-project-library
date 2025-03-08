import { useEffect, useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

export const CodeViewer = () => {
  const [code, setCode] = useState<string>("");

  useEffect(() => {
    // Fetch the code content
    fetch("/src/projects/todo-app/components/TodoApp.tsx")
      .then((response) => response.text())
      .then((text) => setCode(text))
      .catch((error) => console.error("Error loading code:", error));
  }, []);

  return (
    <div className="p-4 bg-gray-900 rounded-lg">
      <SyntaxHighlighter
        language="typescript"
        style={vscDarkPlus}
        showLineNumbers
        customStyle={{
          margin: 0,
          padding: "1rem",
          backgroundColor: "transparent",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
};
