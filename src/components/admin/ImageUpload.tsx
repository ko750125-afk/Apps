'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useStorageUpload } from '@/hooks/useStorageUpload';
import { Upload, X, Loader2, LayoutGrid, Monitor, Move } from 'lucide-react';
import { cn, parseAppImageFocus, formatImageObjectPositionForSave } from '@/lib/utils';

interface ImageUploadProps {
  onUploadComplete: (url: string) => void;
  defaultImage?: string | null;
  /** Firestore `imageObjectPosition` — 예: "42% 38%" */
  objectPosition?: string;
  onObjectPositionChange: (value: string) => void;
}

const UPLOAD_TIMEOUT_MS = 120_000;

function CoverPreviewImg({
  src,
  alt,
  className,
  objectPosition = '50% 50%',
}: {
  src: string;
  alt: string;
  className?: string;
  objectPosition?: string;
}) {
  // eslint-disable-next-line @next/next/no-img-element
  return (
    <img
      key={src}
      src={src}
      alt={alt}
      style={{ objectPosition }}
      className={cn('h-full w-full object-cover', className)}
    />
  );
}

function CropPreviewFrame({
  label,
  aspectClassName,
  icon: Icon,
  src,
  objectPosition,
}: {
  label: string;
  aspectClassName: string;
  icon: typeof LayoutGrid;
  src: string;
  objectPosition: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-zinc-300">
        <Icon className="h-3.5 w-3.5 shrink-0 text-zinc-500" aria-hidden />
        <p className="text-xs font-medium">{label}</p>
      </div>
      <div
        className={cn(
          'relative w-full overflow-hidden rounded-md border border-zinc-600 bg-zinc-950 ring-1 ring-zinc-800',
          aspectClassName,
        )}
      >
        <CoverPreviewImg
          src={src}
          alt=""
          objectPosition={objectPosition}
          className="absolute inset-0"
        />
        <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]" />
      </div>
    </div>
  );
}

type DragState = {
  active: boolean;
  startX: number;
  startY: number;
  startFx: number;
  startFy: number;
};

export default function ImageUpload({
  onUploadComplete,
  defaultImage,
  objectPosition = '',
  onObjectPositionChange,
}: ImageUploadProps) {
  const [remoteUrl, setRemoteUrl] = useState<string | null>(defaultImage?.trim() || null);
  const [localBlobUrl, setLocalBlobUrl] = useState<string | null>(null);
  const [focus, setFocus] = useState(() => parseAppImageFocus(objectPosition));

  const { uploadImage, cancelUpload, isUploading: uploading, progress, error, setError } = useStorageUpload({ maxSizeMB: 5 });
  const localBlobUrlRef = useRef<string | null>(null);
  /** 부모 `defaultImage`와 동기화할 때 마지막으로 반영한 props 값 (업로드 직후 덮어쓰기 방지) */
  const lastSyncedDefaultImageRef = useRef<string | null | undefined>(undefined);
  const frameRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<DragState | null>(null);
  const focusRef = useRef(focus);

  const displaySrc = localBlobUrl || remoteUrl;
  const posCss = `${focus.x}% ${focus.y}%`;

  useEffect(() => {
    focusRef.current = focus;
  }, [focus]);

  useEffect(() => {
    if (localBlobUrlRef.current) return;

    if (lastSyncedDefaultImageRef.current === undefined) {
      lastSyncedDefaultImageRef.current = defaultImage;
      return;
    }

    if (lastSyncedDefaultImageRef.current === defaultImage) {
      return;
    }

    lastSyncedDefaultImageRef.current = defaultImage;
    setRemoteUrl(defaultImage?.trim() || null);
  }, [defaultImage]);

  useEffect(() => {
    setFocus(parseAppImageFocus(objectPosition));
    focusRef.current = parseAppImageFocus(objectPosition);
  }, [objectPosition]);

  const revokeLocal = useCallback(() => {
    if (localBlobUrlRef.current) {
      URL.revokeObjectURL(localBlobUrlRef.current);
      localBlobUrlRef.current = null;
    }
    setLocalBlobUrl(null);
  }, []);

  useEffect(() => {
    return () => {
      if (localBlobUrlRef.current) {
        URL.revokeObjectURL(localBlobUrlRef.current);
      }
      cancelUpload();
    };
  }, [cancelUpload]);

  const commitFocus = useCallback(() => {
    onObjectPositionChange(formatImageObjectPositionForSave(focusRef.current));
  }, [onObjectPositionChange]);

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (uploading) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const f = focusRef.current;
    dragRef.current = {
      active: true,
      startX: e.clientX,
      startY: e.clientY,
      startFx: f.x,
      startFy: f.y,
    };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d?.active || !frameRef.current) return;
    const rect = frameRef.current.getBoundingClientRect();
    const dx = e.clientX - d.startX;
    const dy = e.clientY - d.startY;
    const nx = Math.min(100, Math.max(0, d.startFx - (dx / Math.max(rect.width, 1)) * 100));
    const ny = Math.min(100, Math.max(0, d.startFy - (dy / Math.max(rect.height, 1)) * 100));
    focusRef.current = { x: nx, y: ny };
    setFocus({ x: nx, y: ny });
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = dragRef.current;
    if (!d?.active) return;
    dragRef.current = null;
    try {
      e.currentTarget.releasePointerCapture(e.pointerId);
    } catch {
      /* noop */
    }
    commitFocus();
  };

  const handleUpload = useCallback(
    async (file: File) => {
      revokeLocal();

      const objectUrl = URL.createObjectURL(file);
      localBlobUrlRef.current = objectUrl;
      setLocalBlobUrl(objectUrl);

      try {
        const url = await uploadImage(file, 'apps');
        revokeLocal();
        lastSyncedDefaultImageRef.current = url;
        setRemoteUrl(url);
        onUploadComplete(url);
      } catch (err: any) {
        // error state is managed by useStorageUpload
      }
    },
    [onUploadComplete, revokeLocal, uploadImage],
  );

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = '';
    if (file) void handleUpload(file);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) void handleUpload(file);
  };

  const handleRemove = () => {
    cancelUpload();
    revokeLocal();
    setRemoteUrl(null);
    setError(null);
    lastSyncedDefaultImageRef.current = '';
    onUploadComplete('');
    setFocus({ x: 50, y: 50 });
    focusRef.current = { x: 50, y: 50 };
    onObjectPositionChange('');
  };

  const resetFocus = () => {
    setFocus({ x: 50, y: 50 });
    focusRef.current = { x: 50, y: 50 };
    onObjectPositionChange('');
  };

  return (
    <div className="w-full space-y-4">
      {/* 수동 URL 입력 란 (최상단으로 이동) */}
      <div className="rounded-lg border-2 border-blue-500/50 bg-blue-900/10 p-4 mb-4 space-y-2 shadow-[0_0_15px_rgba(59,130,246,0.1)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse"></div>
        <label className="text-sm font-bold text-blue-100 flex items-center gap-2">
          <span>🔗 이미지 주소(URL) 직접 복사+붙여넣기</span>
          <span className="bg-blue-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full animate-bounce shadow-lg shadow-blue-500/50">여기입니다!</span>
        </label>
        <input
          type="text"
          placeholder="예: /projects/github.png (채팅창에서 안내받은 주소를 그대로 넣으세요)"
          value={remoteUrl || ''}
          onChange={(e) => {
            const url = e.target.value;
            setRemoteUrl(url);
            onUploadComplete(url);
            lastSyncedDefaultImageRef.current = url;
            if (url) {
               setError(null);
            }
          }}
          disabled={uploading}
          className="w-full bg-black/50 border border-blue-500/50 rounded-lg px-4 py-3 text-sm text-white placeholder:text-zinc-500 focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-500/50 transition-all font-mono"
        />
        <p className="text-xs text-blue-200/70 font-medium">파이어베이스 스토리지 오류 시 가장 빠르고 확실한 우회 등록 방법입니다.</p>
      </div>

      <div
        className={cn(
          'group relative overflow-hidden rounded-lg border border-dashed transition-colors',
          uploading ? 'border-blue-500/40 bg-zinc-900/30' : 'border-zinc-700 bg-zinc-950/50 hover:border-zinc-600',
          error ? 'border-amber-700/50 bg-amber-950/10' : '',
        )}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
      >
        {displaySrc ? (
          <div ref={frameRef} className="relative aspect-video w-full bg-zinc-950">
            {/* 드래그로 object-position 맞춤 (업로드 중엔 비활성) */}
            <div
              className={cn(
                'absolute inset-0 z-[5]',
                !uploading && 'cursor-grab touch-none active:cursor-grabbing',
              )}
              onPointerDown={uploading ? undefined : onPointerDown}
              onPointerMove={uploading ? undefined : onPointerMove}
              onPointerUp={uploading ? undefined : onPointerUp}
              onPointerCancel={uploading ? undefined : onPointerUp}
            >
              <CoverPreviewImg
                src={displaySrc}
                alt="대표 이미지 미리보기"
                objectPosition={posCss}
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
              />
            </div>
            <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1">
              <p className="w-fit rounded bg-black/75 px-2 py-0.5 text-[10px] font-medium text-zinc-100">
                {uploading ? '업로드 중 · 드래그는 잠시 불가' : '드래그로 맞춤 · 목록 16:9'}
              </p>
              {!uploading && (
                <p className="flex w-fit items-center gap-1 rounded bg-black/60 px-2 py-0.5 text-[10px] text-zinc-300">
                  <Move className="h-3 w-3 opacity-70" aria-hidden />
                  클릭 후 밀어서 잘릴 부분 조절
                </p>
              )}
            </div>
            {uploading && (
              <div className="absolute inset-0 z-[15] flex flex-col items-center justify-center gap-3 bg-black/55 backdrop-blur-[2px]">
                <Loader2 className="h-8 w-8 animate-spin text-zinc-200" aria-hidden />
                <p className="text-xs font-medium text-white">Storage 업로드 중… {Math.round(progress)}%</p>
                <button
                  type="button"
                  onClick={() => cancelUpload()}
                  className="rounded-md border border-white/30 bg-black/40 px-3 py-1.5 text-[11px] font-medium text-white hover:bg-black/60"
                >
                  업로드만 취소 (미리보기·맞춤 유지)
                </button>
              </div>
            )}
            <div className="absolute inset-0 z-20 flex items-center justify-center gap-3 bg-black/50 opacity-0 transition-opacity pointer-events-none group-hover:pointer-events-auto group-hover:opacity-100">
              <label
                className="pointer-events-auto cursor-pointer rounded-md bg-zinc-100 px-3 py-2 text-xs font-medium text-zinc-950 hover:bg-zinc-200"
                onPointerDown={(e) => e.stopPropagation()}
              >
                다른 파일
                <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={uploading} />
              </label>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove();
                }}
                className="pointer-events-auto rounded-md border border-zinc-600 bg-zinc-900/90 p-2 text-zinc-300 hover:bg-red-950/50 hover:text-red-300 disabled:opacity-50"
                disabled={uploading}
                aria-label="이미지 제거"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        ) : (
          <label className="flex cursor-pointer flex-col items-center justify-center px-6 py-12">
            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900">
              <Upload className="h-5 w-5 text-zinc-500 group-hover:text-zinc-400" />
            </div>
            <p className="text-center text-sm font-medium text-zinc-200">이미지를 놓거나 클릭하여 선택</p>
            <p className="mt-1 text-center text-xs text-zinc-500">PNG, JPG · 최대 5MB · 바로 미리보기 후 드래그로 맞춤</p>
            <input type="file" className="hidden" accept="image/*" onChange={onFileChange} disabled={uploading} />
          </label>
        )}

        {uploading && displaySrc && (
          <div className="absolute bottom-0 left-0 right-0 z-30 h-1 bg-zinc-800">
            <div className="h-full bg-blue-500 transition-all duration-300" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>

      {displaySrc && (
        <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4 space-y-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-center text-sm font-medium text-zinc-200 sm:text-left">
              공개 화면 미리보기 (같은 맞춤 적용)
            </p>
            <button
              type="button"
              onClick={resetFocus}
              disabled={uploading}
              className="rounded-md border border-zinc-600 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-50"
            >
              초점 가운데로
            </button>
          </div>
          <p className="text-center text-[11px] text-zinc-500 sm:text-left">
            위 큰 프레임에서 드래그한 위치가 저장됩니다. 저장 후 사이트 목록·상세 히어로에 동일하게 적용됩니다.
          </p>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
            <CropPreviewFrame
              label="목록 카드 · 16:9"
              aspectClassName="aspect-video"
              icon={LayoutGrid}
              src={displaySrc}
              objectPosition={posCss}
            />
            <CropPreviewFrame
              label="상세 히어로 · 약 21:9"
              aspectClassName="aspect-[21/9]"
              icon={Monitor}
              src={displaySrc}
              objectPosition={posCss}
            />
          </div>
        </div>
      )}

      {error && <p className="text-sm text-amber-400">{error}</p>}
      {remoteUrl && !localBlobUrl && !uploading && !error && (
        <p className="text-xs text-zinc-500">이미지·맞춤 반영됨 · 하단 저장으로 공개 페이지에 적용하세요</p>
      )}
      {localBlobUrl && !uploading && error && (
        <p className="text-xs text-zinc-500">
          로컬 미리보기만 있습니다. Storage 오류를 해결한 뒤 다시 업로드하거나 상단에 이미지 URL을 직접 입력하세요.
        </p>
      )}
    </div>
  );
}
