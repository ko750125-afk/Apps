'use client';

import React from 'react';
import Image from 'next/image';
import { Save, Loader2, Star, Globe, Image as ImageIcon, Layout, Sparkles, Link as LinkIcon, Info, Type, Tag, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppData, CATEGORIES } from '@/data/apps';
import { FormField, inputClassName, selectClassName } from './AppFormUI';

interface BaseSectionProps {
  formData: AppData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<AppData>>;
  analyzeGitHubRepo?: () => Promise<void>;
  isAnalyzing?: boolean;
}

/* ─── 01. Essential Info Section (Combined Identity + Assets) ─── */
const EssentialInfoSection = ({ formData, handleChange, setFormData, analyzeGitHubRepo, isAnalyzing }: BaseSectionProps) => (
  <div className="bg-neutral-900/20 backdrop-blur-3xl border border-neutral-800/50 rounded-[3rem] p-8 md:p-12 space-y-12 shadow-2xl">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 bg-accent/10 rounded-[1.5rem] flex items-center justify-center border border-accent/20 shadow-inner">
          <Layout className="w-7 h-7 text-accent" />
        </div>
        <div>
          <h3 className="text-3xl font-black text-white tracking-tight">앱 정보</h3>
          <p className="text-sm text-neutral-500 font-medium tracking-wide">핵심 요소들을 한 곳에서 관리하세요.</p>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
        className={cn(
          "flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all active:scale-95 shadow-lg",
          formData.featured 
            ? "bg-amber-500/10 border-amber-500/30 text-amber-500 shadow-amber-500/5" 
            : "bg-neutral-950/60 border-neutral-800 text-neutral-600"
        )}
      >
        <Star className={cn("w-5 h-5", formData.featured && "fill-amber-500")} />
        <span className="text-sm font-black uppercase tracking-widest">추천 앱</span>
      </button>
    </div>

    <div className="space-y-10">
      <FormField label="앱 이름 (Title)">
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className={cn(inputClassName, "text-5xl font-black bg-transparent border-none focus:ring-0 px-0 py-2 h-auto text-white placeholder:text-neutral-800")} 
          placeholder="App Name" 
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormField label="카테고리">
          <div className="relative">
            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <select name="category" value={formData.category} onChange={handleChange} className={cn(selectClassName, "pl-14 h-16 rounded-2xl bg-neutral-950/60")}>
              {CATEGORIES.filter(c => c !== 'All apps').map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </FormField>
        <FormField label="공개 상태">
          <div className="relative">
            <Eye className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <select name="status" value={formData.status} onChange={handleChange} className={cn(selectClassName, "pl-14 h-16 rounded-2xl bg-neutral-950/60")}>
              <option value="Exhibit">공개 (Live)</option>
              <option value="Repair">비공개 (Maintenance)</option>
            </select>
          </div>
        </FormField>
      </div>

      <FormField label="한 줄 소개">
        <div className="relative">
          <Type className="absolute left-5 top-6 w-4 h-4 text-neutral-600" />
          <textarea 
            name="description" 
            value={formData.description || ''} 
            onChange={handleChange} 
            className={cn(inputClassName, "min-h-[100px] pl-14 py-5 rounded-2xl bg-neutral-950/60 resize-none")} 
            placeholder="이 앱은 어떤 역할을 하나요? 한 줄로 멋지게 설명해주세요." 
          />
        </div>
      </FormField>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
        <div className="space-y-8">
          <FormField label="접속 URL (Link)">
            <div className="relative group">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                name="url" 
                value={formData.url || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "bg-neutral-950/60 border-neutral-800 pl-14 h-14 rounded-2xl")} 
                placeholder="https://..." 
              />
            </div>
          </FormField>
          <FormField label="GitHub 리포지토리 (Repo)">
            <div className="flex gap-3">
              <div className="relative group flex-1">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  name="repo" 
                  value={formData.repo || ''} 
                  onChange={handleChange} 
                  className={cn(inputClassName, "bg-neutral-950/60 border-neutral-800 pl-14 h-14 rounded-2xl")} 
                  placeholder="owner/repo" 
                />
              </div>
              <button
                type="button"
                onClick={analyzeGitHubRepo}
                disabled={isAnalyzing || !formData.repo}
                className={cn(
                  "px-6 bg-neutral-800 hover:bg-neutral-700 text-white rounded-2xl text-xs font-black uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap border border-neutral-700 disabled:opacity-50",
                  isAnalyzing && "cursor-wait"
                )}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-accent" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5 text-accent" />
                )}
                {isAnalyzing ? '분석 중...' : 'AUTO FILL (분석)'}
              </button>
            </div>
          </FormField>
          <FormField label="스크린샷 URL (Image)">
            <div className="relative group">
              <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                name="image" 
                value={formData.image || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "bg-neutral-950/60 border-neutral-800 pl-14 h-14 rounded-2xl")} 
                placeholder="https://..." 
              />
            </div>
          </FormField>
        </div>
        
        <div className="relative aspect-video rounded-[2.5rem] overflow-hidden border-2 border-neutral-800/50 bg-neutral-950 shadow-2xl group">
          {formData.image ? (
            <Image src={formData.image} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" unoptimized />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-20">
              <ImageIcon className="w-16 h-16" />
              <span className="text-xs font-black uppercase tracking-[0.3em]">No Preview</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-8">
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Image Preview</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── 02. Detailed Description Section ─── */
const DetailedDescriptionSection = ({ formData, handleMemoChange }: Pick<BaseSectionProps, 'formData'> & { handleMemoChange: (val: string) => void }) => (
  <div className="bg-neutral-900/20 backdrop-blur-3xl border border-neutral-800/50 rounded-[3rem] p-8 md:p-12 space-y-10 shadow-2xl">
    <div className="flex items-center gap-4">
      <div className="w-14 h-14 bg-amber-500/10 rounded-[1.5rem] flex items-center justify-center border border-amber-500/20 shadow-inner">
        <Sparkles className="w-7 h-7 text-amber-500" />
      </div>
      <div>
        <h3 className="text-3xl font-black text-white tracking-tight">Technical Details</h3>
        <p className="text-sm text-neutral-500 font-medium tracking-wide">앱의 기술적 명세와 개발 메모를 관리하세요. (Markdown 지원)</p>
      </div>
    </div>

    <div className="relative group">
      <textarea 
        name="memo"
        value={formData.memo || ''} 
        onChange={(e) => handleMemoChange(e.target.value)} 
        className={cn(
          inputClassName, 
          "min-h-[500px] bg-neutral-950/60 border-neutral-800 rounded-[2.5rem] p-10 text-xl leading-relaxed text-neutral-200 placeholder:text-neutral-800 focus:border-accent/40 focus:ring-accent/5 transition-all resize-none shadow-inner"
        )} 
        placeholder="어떤 앱인가요? 개발 과정이나 주요 특징을 자유롭게 적어주세요." 
      />
      <div className="absolute bottom-10 right-10 flex items-center gap-3 px-6 py-3 bg-neutral-900/90 rounded-2xl border border-neutral-800/50 text-[10px] font-black text-neutral-500 tracking-[0.2em] shadow-2xl">
        <Sparkles className="w-3 h-3 text-accent" />
        {formData.memo?.length || 0} CHARACTERS
      </div>
    </div>
  </div>
);

/* ─── Main Form Flow ─── */
export const AppFormMain = (props: BaseSectionProps & { handleMemoChange: (val: string) => void; loading: boolean; isAnalyzing: boolean; isEditing: boolean }) => (
  <div className="max-w-5xl mx-auto space-y-10 pb-40 px-6">
    <EssentialInfoSection {...props} />
    <DetailedDescriptionSection {...props} />
  </div>
);

/* ─── Form Actions ─── */
export const AppFormActions = ({
  loading,
  onAbort,
}: {
  loading: boolean;
  onAbort: () => void;
}) => (
  <div className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 w-full max-w-lg px-6">
    <div className="bg-neutral-900/80 backdrop-blur-2xl border border-neutral-800/50 p-3 rounded-[2.5rem] flex items-center gap-3 shadow-[0_30px_60px_rgba(0,0,0,0.5)]">
      <button
        type="button"
        onClick={onAbort}
        className="flex-1 h-16 rounded-[1.8rem] text-sm font-black text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all active:scale-95 uppercase tracking-widest"
      >
        CANCEL
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-[2] h-16 flex items-center justify-center gap-3 rounded-[1.8rem] text-base font-black text-white bg-accent hover:bg-accent-hover shadow-xl shadow-accent/20 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest"
      >
        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
        {loading ? 'SAVING...' : 'SAVE PROJECT'}
      </button>
    </div>
  </div>
);

