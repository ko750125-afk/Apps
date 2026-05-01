'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor'),
  { ssr: false }
);

interface MarkdownEditorProps {
  value: string;
  onChange: (value?: string) => void;
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  return (
    <div className="w-full" data-color-mode="dark">
      <MDEditor
        value={value}
        onChange={onChange}
        height={500}
        preview="live"
        style={{
          backgroundColor: '#18181b',
          borderRadius: '0.5rem',
          border: '1px solid #27272a',
          overflow: 'hidden',
        }}
      />
      <style jsx global>{`
        .w-md-editor {
          --w-md-editor-background-color: #18181b !important;
          --w-md-editor-color: #e4e4e7 !important;
          --w-md-editor-toolbar-background-color: #09090b !important;
          --w-md-editor-toolbar-color: #71717a !important;
          border-radius: 0.5rem !important;
        }
        .w-md-editor-toolbar {
          border-bottom: 1px solid #27272a !important;
          padding: 6px 8px !important;
        }
        .w-md-editor-toolbar button {
          color: #71717a !important;
          border-radius: 6px !important;
        }
        .w-md-editor-toolbar button:hover {
          color: #e4e4e7 !important;
          background-color: #27272a !important;
        }
        .w-md-editor-content {
          background-color: #18181b !important;
        }
        .w-md-editor-text-pre > code, .w-md-editor-text-input {
          font-size: 14px !important;
          line-height: 1.7 !important;
          color: #d4d4d8 !important;
        }
        .w-md-editor-preview {
          border-left: 1px solid #27272a !important;
          padding: 20px !important;
          background-color: #09090b !important;
        }
        .w-md-editor-preview .wmde-markdown {
          background-color: transparent !important;
          color: #d4d4d8 !important;
        }
      `}</style>
    </div>
  );
}
