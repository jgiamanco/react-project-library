
import { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@/components/ui/button";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  files: Record<string, string>;
  filename?: string;
}

const CodeViewer = ({ files, filename }: CodeViewerProps) => {
  const [activeFile, setActiveFile] = useState<string>(filename || Object.keys(files)[0] || "");

  return (
    <div className={styles.codeViewer}>
      <div className={styles.fileList}>
        {Object.keys(files).map((fileName) => (
          <Button
            key={fileName}
            onClick={() => setActiveFile(fileName)}
            className={`${styles.fileButton} ${
              activeFile === fileName ? styles.fileButtonActive : styles.fileButtonInactive
            }`}
          >
            {fileName}
          </Button>
        ))}
      </div>
      <div className={styles.codeContainer}>
        <SyntaxHighlighter
          language={activeFile.endsWith(".css") ? "css" : "typescript"}
          style={vscDarkPlus}
          showLineNumbers
          customStyle={{
            margin: 0,
            borderRadius: "0.375rem",
          }}
          className={styles.code}
        >
          {files[activeFile] || ""}
        </SyntaxHighlighter>
      </div>
    </div>
  );
};

export default CodeViewer;
