import { useState, useRef, useCallback } from 'react';
import { storage, auth } from '@/lib/firebase';
import { ref, uploadBytesResumable, getDownloadURL, UploadTask } from 'firebase/storage';

interface UseStorageUploadOptions {
  maxSizeMB?: number;
}

export function useStorageUpload({ maxSizeMB = 5 }: UseStorageUploadOptions = {}) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  
  const uploadTaskRef = useRef<UploadTask | null>(null);

  const cancelUpload = useCallback(() => {
    if (uploadTaskRef.current) {
      uploadTaskRef.current.cancel();
      uploadTaskRef.current = null;
    }
    setIsUploading(false);
    setProgress(0);
  }, []);

  const uploadImage = async (file: File, folderPath: string): Promise<string> => {
    if (!storage) {
      throw new Error('Firebase Storage가 초기화되지 않았습니다. .env의 Storage 설정을 확인해 주세요.');
    }

    if (!file.type.startsWith('image/')) {
      throw new Error('이미지 파일만 업로드할 수 있습니다.');
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      throw new Error(`이미지 크기는 ${maxSizeMB}MB 미만이어야 합니다.`);
    }

    if (auth) {
      await auth.authStateReady();
    }
    
    const isBypassed = typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true';

    if (auth && !auth.currentUser && !isBypassed) {
      throw new Error('로그인이 필요합니다. 관리자 로그인 후 다시 시도하거나 페이지를 새로고침해 주세요.');
    }

    // 기존 진행중인 업로드 취소
    cancelUpload();

    setIsUploading(true);
    setProgress(0);
    setError(null);

    try {
      const fileName = `${folderPath.replace(/\/$/, '')}/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
      const storageRef = ref(storage, fileName);
      
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTaskRef.current = uploadTask;

      return await new Promise<string>((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const currentProgress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setProgress(currentProgress);
          },
          (err) => {
            console.error('Storage Upload Error:', err);
            setError(err.message);
            reject(err);
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
    } catch (err: any) {
      console.error('Upload Process Error:', err);
      setError(err.message || '업로드에 실패했습니다.');
      throw err;
    } finally {
      setIsUploading(false);
      uploadTaskRef.current = null;
    }
  };

  return {
    uploadImage,
    cancelUpload,
    isUploading,
    progress,
    error,
    setError
  };
}
