import React, { useState } from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Button,
} from "@/components/ui";
import styles from "./CodeViewer.module.css";

interface CodeViewerProps {
  files: Array<{
    name: string;
    content: string;
    language: string;
  }>;
  title?: string;
}

const CodeViewer = ({ files, title = "Project Code" }: CodeViewerProps) => {
  const [activeFile, setActiveFile] = useState(files[0]?.name);

  const activeFileContent =
    files.find((file) => file.name === activeFile)?.content || "";
  const activeFileLanguage =
    files.find((file) => file.name === activeFile)?.language || "typescript";

  return (
    <div className={styles.codeViewer}>
      <Card>
        <CardHeader className={styles.header}>
          <CardTitle className={styles.title}>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className={styles.fileList}>
            {files.map((file) => (
              <Button
                key={file.name}
                variant="ghost"
                className={`${styles.fileButton} ${
                  activeFile === file.name
                    ? styles.fileButtonActive
                    : styles.fileButtonInactive
                }`}
                onClick={() => setActiveFile(file.name)}
              >
                {file.name}
              </Button>
            ))}
          </div>
          <div className={styles.codeContainer}>
            <SyntaxHighlighter
              language={activeFileLanguage}
              style={vscDarkPlus}
              customStyle={{
                margin: 0,
                borderRadius: "0.5rem",
                fontSize: "0.9rem",
              }}
              showLineNumbers
              className={styles.code}
            >
              {activeFileContent}
            </SyntaxHighlighter>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CodeViewer;
