import React from "react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";

// Custom styles for different languages
const languageStyles = {
  javascript: vscDarkPlus,
  typescript: vscDarkPlus,
  jsx: vscDarkPlus,
  tsx: vscDarkPlus,
  java: vscDarkPlus,
  csharp: vscDarkPlus,
  cpp: vscDarkPlus,
  python: vscDarkPlus,
  html: vscDarkPlus,
  css: vscDarkPlus,
};

// Function to extract language from className
const extractLanguage = (className: string | undefined) => {
  if (!className) return null;
  const match = /language-(\w+)/.exec(className);
  return match ? match[1] : null;
};

// Custom pre component to handle code blocks
export const PreBlock = (props: any) => {
  // Check if this is a code block
  if (
    props.children &&
    props.children.props &&
    props.children.props.className
  ) {
    const language = extractLanguage(props.children.props.className);

    if (language) {
      // Get the code content
      const code = props.children.props.children;

      return (
        <SyntaxHighlighter
          language={language}
          style={
            languageStyles[language as keyof typeof languageStyles] ||
            vscDarkPlus
          }
        >
          {code}
        </SyntaxHighlighter>
      );
    }
  }

  // If not a code block, render as normal pre
  return <pre {...props} />;
};
