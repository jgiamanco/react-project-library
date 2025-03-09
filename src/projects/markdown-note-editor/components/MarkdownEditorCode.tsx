import React from "react";
import CodeViewer from "@/components/CodeViewer";

export const MarkdownEditorCode = () => {
  const files = [
    {
      name: "MarkdownEditor.tsx",
      content: `import React, { useState } from 'react';
import { marked } from 'marked';
import { Button, Textarea } from '@/components/ui';
import { Note } from './types';
// ... Rest of MarkdownEditor.tsx code ...`,
      language: "typescript",
    },
    {
      name: "components/Preview.tsx",
      content: `import React from 'react';
import { Card } from '@/components/ui';
// ... Rest of Preview.tsx code ...`,
      language: "typescript",
    },
    {
      name: "components/NoteList.tsx",
      content: `import React from 'react';
import { Note } from '../types';
// ... Rest of NoteList.tsx code ...`,
      language: "typescript",
    },
    {
      name: "types.ts",
      content: `export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NoteMetadata {
  id: string;
  title: string;
  excerpt: string;
  createdAt: Date;
  updatedAt: Date;
}`,
      language: "typescript",
    },
    {
      name: "utils/markdown.ts",
      content: `import { marked } from 'marked';

export const parseMarkdown = (content: string): string => {
  return marked(content);
};

export const createExcerpt = (content: string, length: number = 100): string => {
  const plainText = content.replace(/[#*\\[\\]\`]/g, '');
  return plainText.length > length 
    ? plainText.slice(0, length) + '...'
    : plainText;
};`,
      language: "typescript",
    },
  ];

  return <CodeViewer files={files} title="Markdown Editor Code" />;
};

export default MarkdownEditorCode;
