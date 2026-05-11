'use client';

import React from 'react';
import Image from 'next/image';
import { Save, Loader2, Star, Globe, Image as ImageIcon, Link as LinkIcon, Tag, Terminal, Activity, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppData, CATEGORIES } from '@/data/apps';
import { FormField, inputClassName, selectClassName } from './AppFormUI';
import { getAppImage } from '@/lib/utils';
import ImageUpload from './ImageUpload';

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
    <div className="max-w-4xl mx-auto space-y-8 pb-32 px-6">
      {/* Header */}
      <div className="pt-12 mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">
          {props.isEditing ? '프로젝트 수정' : '새 프로젝트 등록'}
        </h2>
        <p className="text-neutral-500">프로젝트의 핵심 정보를 입력하세요.</p>
      </div>

      {/* Core Info Card */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 space-y-8">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-6 mb-6">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            기본 정보
          </h3>
          <button 
            type="button"
            onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all text-xs font-bold",
              formData.featured 
                ? "bg-amber-500/10 border-amber-500/50 text-amber-500" 
                : "bg-neutral-800 border-neutral-700 text-neutral-500 hover:text-neutral-300"
            )}
          >
            <Star className={cn("w-3.5 h-3.5", formData.featured && "fill-current")} />
            추천 프로젝트
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
            <div className="relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <select name="category" value={formData.category} onChange={handleChange} className={cn(selectClassName, "pl-12")}>
                {CATEGORIES.filter(c => c !== 'All apps').map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>
          </FormField>

          <FormField label="운영 상태">
            <div className="relative">
              <Activity className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <select name="status" value={formData.status} onChange={handleChange} className={cn(selectClassName, "pl-12")}>
                <option value="Exhibit">정상 운영 (Active)</option>
                <option value="Repair">개발/점검 중 (Maintenance)</option>
              </select>
            </div>
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
          <FormField label="배포 URL (선택)">
            <div className="relative">
              <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
              <input 
                type="text" 
                name="url" 
                value={formData.url || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "pl-12")} 
                placeholder="https://..." 
              />
            </div>
          </FormField>
        </div>
      </div>

      {/* Image Control Card */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 space-y-6">
        <div className="flex justify-between items-center border-b border-neutral-800 pb-4">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            대표 이미지
          </h3>
          <p className="text-xs text-neutral-500 font-medium">프로젝트 스크린샷 또는 썸네일을 업로드하세요.</p>
        </div>
        
        <ImageUpload 
          defaultImage={formData.image} 
          onUploadComplete={(url) => setFormData(prev => ({ ...prev, image: url }))} 
        />

        <FormField label="또는 이미지 직접 경로">
          <div className="relative">
            <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <input 
              type="text" 
              name="image" 
              value={formData.image || ''} 
              onChange={handleChange} 
              className={cn(inputClassName, "pl-12 opacity-60 hover:opacity-100 transition-opacity")} 
              placeholder="/apps/my-image.png 또는 외부 URL" 
            />
          </div>
        </FormField>
      </div>

      {/* Tech Spec Card */}
      <div className="bg-neutral-900/50 border border-neutral-800 rounded-3xl p-8 space-y-6">
        <h3 className="text-lg font-bold text-white flex items-center gap-2 border-b border-neutral-800 pb-4">
          상세 기술 사양 (Markdown)
        </h3>
        <textarea 
          name="memo"
          value={formData.memo || ''} 
          onChange={(e) => handleMemoChange(e.target.value)} 
          className={cn(
            inputClassName, 
            "min-h-[400px] p-6 text-sm font-mono leading-relaxed bg-neutral-950 border-neutral-800"
          )} 
          placeholder="# 기술 스택 및 상세 설명...&#10;- React / Next.js&#10;- Firebase" 
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
  <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-xl px-6">
    <div className="bg-neutral-900/90 backdrop-blur-xl border border-neutral-800 p-3 rounded-2xl flex items-center gap-3 shadow-2xl">
      <button
        type="button"
        onClick={() => {
          if (window.confirm('입력한 내용이 저장되지 않습니다. 취소하시겠습니까?')) onAbort();
        }}
        className="flex-1 h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
      >
        <X className="w-4 h-4" />
        취소
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-[2] h-12 flex items-center justify-center gap-2 rounded-xl text-sm font-bold text-white bg-blue-600 hover:bg-blue-500 transition-all disabled:opacity-50 shadow-lg shadow-blue-600/20"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {loading ? '저장 중...' : '변경사항 저장'}
      </button>
    </div>
  </div>
);
