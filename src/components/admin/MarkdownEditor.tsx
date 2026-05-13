"use client";

import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Loader2 } from 'lucide-react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

// SSR 문제를 피하기 위해 dynamic import 사용
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function MarkdownEditor({ value, onChange, placeholder, className }: MarkdownEditorProps) {
  const [isUploading, setIsUploading] = useState(false);

  const uploadImage = async (file: File): Promise<string> => {
    if (!storage) {
      throw new Error("Firebase Storage가 초기화되지 않았습니다.");
    }

    if (!file.type.startsWith('image/')) {
      throw new Error("이미지 파일만 업로드할 수 있습니다.");
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new Error("이미지 크기는 5MB 미만이어야 합니다.");
    }

    setIsUploading(true);

    try {
      const fileName = `apps/markdown/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          null,
          (error) => {
            console.error('Markdown Image Upload Error:', error);
            reject(error);
          },
          async () => {
            try {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              resolve(downloadURL);
            } catch (err) {
              reject(err);
            }
          }
        );
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className={`relative rounded-md overflow-hidden ${className || ''}`}>
      <div data-color-mode="dark" className="border border-zinc-800/80 rounded-md">
        <MDEditor
          value={value}
          onChange={(val) => onChange(val || '')}
          height={400}
          textareaProps={{
            placeholder: placeholder || '마크다운 형식으로 내용을 입력하세요... (이미지 복사+붙여넣기 가능)',
          }}
          onDrop={async (event) => {
            const files = event.dataTransfer.files;
            if (files && files.length > 0) {
              const file = files[0];
              if (file.type.startsWith('image/')) {
                event.preventDefault();
                try {
                  const url = await uploadImage(file);
                  const imageMarkdown = `\n![image](${url})\n`;
                  onChange((value || "") + imageMarkdown);
                } catch (err: any) {
                  alert(`이미지 업로드 실패: ${err.message}`);
                }
              }
            }
          }}
          onPaste={async (event) => {
            const items = event.clipboardData?.items;
            if (items) {
              for (const item of items) {
                if (item.type.startsWith('image/')) {
                  event.preventDefault();
                  const file = item.getAsFile();
                  if (file) {
                    const target = event.target as HTMLTextAreaElement;
                    const start = target.selectionStart || value.length;
                    const end = target.selectionEnd || value.length;
                    
                    try {
                      const url = await uploadImage(file);
                      const imageMarkdown = `![image](${url})`;
                      const newVal = value.substring(0, start) + imageMarkdown + value.substring(end);
                      onChange(newVal);
                    } catch (err: any) {
                      alert(`이미지 붙여넣기 업로드 실패: ${err.message}`);
                    }
                  }
                  break;
                }
              }
            }
          }}
        />
      </div>
      {isUploading && (
        <div className="absolute inset-0 z-50 flex flex-col items-center justify-center bg-zinc-950/70 backdrop-blur-sm">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-200 mb-2" />
          <p className="text-sm text-zinc-200 font-medium">이미지 업로드 중...</p>
        </div>
      )}
    </div>
  );
}
