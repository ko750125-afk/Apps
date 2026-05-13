'use client';

import React from 'react';
import { Save, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppData, CATEGORIES } from '@/data/apps';
import { FormField, inputClassName, selectClassName } from './AppFormUI';
import ImageUpload from './ImageUpload';
import MarkdownEditor from './MarkdownEditor';

interface BaseSectionProps {
  formData: AppData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<AppData>>;
  analyzeGitHubRepo?: () => Promise<void>;
  isAnalyzing?: boolean;
}

/* ─── Main Form Section ─── */
export const AppFormMain = (props: BaseSectionProps & { handleMemoChange: (val: string) => void; loading: boolean; isAnalyzing: boolean; isEditing: boolean }) => {
  const { formData, handleChange, setFormData, analyzeGitHubRepo, isAnalyzing, handleMemoChange } = props;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-28 px-4 md:px-6">
      <div className="pt-8 mb-6">
        <h2 className="text-xl font-semibold text-zinc-50">
          {props.isEditing ? '프로젝트 수정' : '새 프로젝트'}
        </h2>
        <p className="mt-1 text-sm text-zinc-500">필수 항목을 입력한 뒤 저장하세요.</p>
      </div>

      <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/15 p-5 md:p-6 space-y-6">
        <div className="flex flex-col gap-4 border-b border-zinc-800/80 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="text-sm font-medium text-zinc-200">기본 정보</h3>
          <button
            type="button"
            onClick={() => setFormData((prev) => ({ ...prev, featured: !prev.featured }))}
            className={cn(
              'inline-flex h-9 items-center rounded-md border px-3 text-xs font-medium transition-colors',
              formData.featured
                ? 'border-zinc-600 bg-zinc-800 text-zinc-50'
                : 'border-zinc-800 text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300',
            )}
          >
            추천 {formData.featured ? '· 켜짐' : '· 꺼짐'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <FormField label="프로젝트 이름">
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                required 
                className={cn(inputClassName, "text-lg font-bold")} 
                placeholder="프로젝트 명칭을 입력하세요" 
              />
            </FormField>
          </div>

          <FormField label="카테고리">
            <select name="category" value={formData.category} onChange={handleChange} className={selectClassName}>
              {CATEGORIES.filter((c) => c !== 'All apps').map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </FormField>

          <FormField label="운영 상태">
            <select name="status" value={formData.status} onChange={handleChange} className={selectClassName}>
              <option value="Exhibit">정상 운영 (Active)</option>
              <option value="Repair">개발/점검 중 (Maintenance)</option>
            </select>
          </FormField>
        </div>

        <FormField label="한 줄 설명">
          <textarea 
            name="description" 
            value={formData.description || ''} 
            onChange={handleChange} 
            className={cn(inputClassName, "min-h-[100px] py-4 resize-none")} 
            placeholder="프로젝트에 대한 간단한 설명을 입력하세요" 
          />
        </FormField>

        <div className="grid grid-cols-1 gap-6">
          <FormField label="배포 URL (선택)" hint={analyzeGitHubRepo ? '입력 후 아래에서 메타데이터를 채울 수 있습니다.' : undefined}>
            <input
              type="text"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className={inputClassName}
              placeholder="https://..."
            />
          </FormField>
          {analyzeGitHubRepo && (
            <div className="flex justify-end -mt-2">
              <button
                type="button"
                onClick={() => void analyzeGitHubRepo()}
                disabled={isAnalyzing}
                className="text-xs font-medium text-zinc-500 hover:text-zinc-300 disabled:opacity-50"
              >
                {isAnalyzing ? '가져오는 중…' : 'URL에서 제목·설명·이미지 가져오기'}
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/15 p-5 md:p-6 space-y-5">
        <div className="border-b border-zinc-800/80 pb-4">
          <h3 className="text-sm font-medium text-zinc-200">대표 이미지</h3>
          <p className="mt-1 text-xs text-zinc-500">
            업로드하거나 URL을 직접 입력할 수 있습니다. 변경 후 반드시 하단 <strong className="text-zinc-400">저장</strong>을
            눌러야 공개 상세 페이지에 반영됩니다.
          </p>
        </div>
        
        <ImageUpload
          defaultImage={formData.image}
          objectPosition={formData.imageObjectPosition}
          onUploadComplete={(url) => setFormData((prev) => ({ ...prev, image: url }))}
          onObjectPositionChange={(v) => setFormData((prev) => ({ ...prev, imageObjectPosition: v }))}
        />

        <FormField label="이미지 URL">
          <input
            type="text"
            name="image"
            value={formData.image || ''}
            onChange={handleChange}
            className={inputClassName}
            placeholder="/apps/… 또는 https://…"
          />
        </FormField>
      </div>

      <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/15 p-5 md:p-6 space-y-4">
        <h3 className="text-sm font-medium text-zinc-200 border-b border-zinc-800/80 pb-3">
          상세 (Markdown)
        </h3>
        <MarkdownEditor
          value={formData.memo || ''}
          onChange={handleMemoChange}
          placeholder={'# 기술 스택…\n- 항목 (이미지를 복사/붙여넣기 할 수 있습니다)'}
        />
      </div>
    </div>
  );
};

/* ─── Form Actions ─── */
export const AppFormActions = ({
  loading,
  onAbort,
}: {
  loading: boolean;
  onAbort: () => void;
}) => (
  <div className="fixed bottom-6 left-1/2 z-50 w-[calc(100%-1.5rem)] max-w-md -translate-x-1/2 px-0">
    <div className="flex gap-2 rounded-lg border border-zinc-800 bg-zinc-950/95 p-2 shadow-lg backdrop-blur-sm">
      <button
        type="button"
        onClick={() => {
          if (window.confirm('입력한 내용이 저장되지 않습니다. 취소하시겠습니까?')) onAbort();
        }}
        className="flex-1 h-10 rounded-md text-sm font-medium text-zinc-500 hover:bg-zinc-900 hover:text-zinc-200"
      >
        취소
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-[1.5] inline-flex h-10 items-center justify-center gap-2 rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4 opacity-70" />}
        {loading ? '저장 중…' : '저장'}
      </button>
    </div>
  </div>
);
