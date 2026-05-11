'use client';

import React, { useState, useCallback } from 'react';
import { storage } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { Upload, X, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Image from 'next/image';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  defaultImage?: string | null;
}

export default function ImageUpload({ onUploadComplete, defaultImage }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(defaultImage || null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const handleUpload = useCallback(async (file: File) => {
    if (!storage) {
      setError('Firebase Storage is not initialized.');
      return;
    }

    if (!file.type.startsWith('image/')) {
      setError('Please upload an image file.');
      return;
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setError('Image size must be less than 5MB.');
      return;
    }

    setUploading(true);
    setError(null);
    setProgress(0);

    const fileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
    const storageRef = ref(storage, `apps/${fileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setProgress(progress);
      },
      (error) => {
        console.error('Upload error:', error);
        // Error message might be in error.message or error.code
        const errorMsg = error.message || '';
        if (errorMsg.includes('CORS') || errorMsg.includes('cross-origin')) {
          setError('CORS 정책 에러: Firebase 스토리지의 CORS 설정이 필요합니다.');
        } else {
          setError('업로드 실패: ' + (errorMsg || '다시 시도해주세요.'));
        }
        setUploading(false);
      },
      async () => {
        const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
        setPreview(downloadURL);
        onUploadComplete(downloadURL);
        setUploading(false);
      }
    );
  }, [onUploadComplete]);

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  };

  return (
    <div className="space-y-4 w-full">
      <div 
        className={cn(
          "relative group border-2 border-dashed rounded-[24px] overflow-hidden transition-all duration-300",
          uploading ? "border-[#0066cc]/30 bg-[#0066cc]/5" : "border-[#d2d2d7] hover:border-[#0066cc] bg-[#f5f5f7]",
          error ? "border-red-300 bg-red-50" : ""
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {preview ? (
          <div className="relative aspect-video w-full">
            <Image 
              src={preview} 
              alt="Preview" 
              fill 
              className="object-cover"
              unoptimized
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
              <label className="cursor-pointer px-4 py-2 bg-white text-[#1d1d1f] rounded-full text-sm font-medium hover:bg-[#f5f5f7] transition-colors">
                Change Image
                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={uploading} />
              </label>
              <button 
                onClick={() => { setPreview(null); onUploadComplete(''); }}
                className="p-2 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors"
                disabled={uploading}
              >
                <X size={20} />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center p-12 cursor-pointer">
            <div className={cn(
              "w-12 h-12 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
              uploading ? "bg-[#0066cc]/10" : "bg-white shadow-sm"
            )}>
              {uploading ? (
                <Loader2 className="w-6 h-6 text-[#0066cc] animate-spin" />
              ) : (
                <Upload className="w-6 h-6 text-[#86868b] group-hover:text-[#0066cc]" />
              )}
            </div>
            <div className="text-center">
              <p className="text-[15px] font-semibold text-[#1d1d1f]">
                {uploading ? 'Uploading...' : 'Drop image here or click to upload'}
              </p>
              <p className="text-[13px] text-[#86868b] mt-1">
                Supports PNG, JPG (Max 5MB)
              </p>
            </div>
            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={uploading} />
          </label>
        )}

        {/* Upload Progress Bar */}
        {uploading && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#d2d2d7]">
            <div 
              className="h-full bg-[#0066cc] transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>

      {/* Status Messages */}
      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm font-medium animate-in fade-in slide-in-from-top-1">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
      {preview && !uploading && !error && (
        <div className="flex items-center gap-2 text-green-600 text-sm font-medium animate-in fade-in slide-in-from-top-1">
          <CheckCircle2 size={16} />
          Image uploaded successfully
        </div>
      )}
    </div>
  );
}
