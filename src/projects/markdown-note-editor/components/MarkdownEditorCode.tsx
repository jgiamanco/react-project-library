
import React from "react";
import CodeViewer from "@/components/CodeViewer";

export const MarkdownEditorCode = () => {
  const files = {
    "MarkdownEditor.tsx": `import React, { useState } from 'react';
import { marked } from 'marked';
import { Button, Textarea } from '@/components/ui';
import { Note } from './types';
// ... Rest of MarkdownEditor.tsx code ...`,
    "components/Preview.tsx": `import React from 'react';
import { Card } from '@/components/ui';
// ... Rest of Preview.tsx code ...`,
    "components/NoteList.tsx": `import React from 'react';
import { Note } from '../types';
// ... Rest of NoteList.tsx code ...`,
    "types.ts": `export interface Note {
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
    "utils/markdown.ts": `import { marked } from 'marked';

export const parseMarkdown = (content: string): string => {
  return marked(content);
};

export const createExcerpt = (content: string, length: number = 100): string => {
  const plainText = content.replace(/[#*\\[\\]\`]/g, '');
  return plainText.length > length 
    ? plainText.slice(0, length) + '...'
    : plainText;
};`
  };

  return <CodeViewer files={files} />;
};

export default MarkdownEditorCode;
