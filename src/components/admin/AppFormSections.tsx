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

/* ─── 01. Essential Info Section ─── */
const EssentialInfoSection = ({ formData, handleChange, setFormData, analyzeGitHubRepo, isAnalyzing }: BaseSectionProps) => (
  <div className="bg-neutral-900/10 border border-neutral-800/30 rounded-[2.5rem] p-8 md:p-12 space-y-12 transition-all hover:bg-neutral-900/20">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800">
          <Layout className="w-6 h-6 text-neutral-400" />
        </div>
        <div>
          <h3 className="text-2xl font-bold text-white tracking-tight">Project Identity</h3>
          <p className="text-[12px] text-neutral-500 font-medium">관리자의 핵심 정보를 정의합니다.</p>
        </div>
      </div>
      
      <button 
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
        className={cn(
          "flex items-center gap-2.5 px-6 py-3.5 rounded-2xl border transition-all active:scale-95",
          formData.featured 
            ? "bg-amber-500/5 border-amber-500/20 text-amber-500" 
            : "bg-neutral-950 border-neutral-800 text-neutral-600 hover:text-neutral-400"
        )}
      >
        <Star className={cn("w-4 h-4", formData.featured && "fill-amber-500")} />
        <span className="text-[11px] font-bold uppercase tracking-widest">Featured</span>
      </button>
    </div>

    <div className="space-y-10">
      <FormField label="App Title">
        <input 
          type="text" 
          name="name" 
          value={formData.name} 
          onChange={handleChange} 
          required 
          className={cn(inputClassName, "text-4xl font-bold bg-transparent border-none focus:ring-0 p-0 h-auto text-white placeholder:text-neutral-800")} 
          placeholder="Enter App Name" 
        />
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <FormField label="Category">
          <div className="relative">
            <Tag className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <select name="category" value={formData.category} onChange={handleChange} className={cn(selectClassName, "pl-14 h-14")}>
              {CATEGORIES.filter(c => c !== 'All apps').map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </FormField>
        <FormField label="Visibility Status">
          <div className="relative">
            <Eye className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" />
            <select name="status" value={formData.status} onChange={handleChange} className={cn(selectClassName, "pl-14 h-14")}>
              <option value="Exhibit">Public (Live)</option>
              <option value="Repair">Private (Hidden)</option>
            </select>
          </div>
        </FormField>
      </div>

      <FormField label="Short Description">
        <div className="relative">
          <Type className="absolute left-5 top-5 w-4 h-4 text-neutral-600" />
          <textarea 
            name="description" 
            value={formData.description || ''} 
            onChange={handleChange} 
            className={cn(inputClassName, "min-h-[80px] pl-14 py-4 resize-none")} 
            placeholder="What does this app do?" 
          />
        </div>
      </FormField>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 pt-4">
        <div className="space-y-6">
          <FormField label="Live URL">
            <div className="relative group">
              <Globe className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                name="url" 
                value={formData.url || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "pl-14 h-14")} 
                placeholder="https://..." 
              />
            </div>
          </FormField>
          <FormField label="GitHub Repository">
            <div className="flex gap-2.5">
              <div className="relative group flex-1">
                <LinkIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-accent transition-colors" />
                <input 
                  type="text" 
                  name="repo" 
                  value={formData.repo || ''} 
                  onChange={handleChange} 
                  className={cn(inputClassName, "pl-14 h-14")} 
                  placeholder="owner/repo" 
                />
              </div>
              <button
                type="button"
                onClick={analyzeGitHubRepo}
                disabled={isAnalyzing}
                className={cn(
                  "px-6 bg-neutral-100 hover:bg-white text-black rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all active:scale-95 flex items-center gap-2 whitespace-nowrap disabled:opacity-50",
                  isAnalyzing && "cursor-wait"
                )}
              >
                {isAnalyzing ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Sparkles className="w-3.5 h-3.5" />
                )}
                Auto Fill
              </button>
            </div>
          </FormField>
          <FormField label="Screenshot URL">
            <div className="relative group">
              <ImageIcon className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-accent transition-colors" />
              <input 
                type="text" 
                name="image" 
                value={formData.image || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "pl-14 h-14")} 
                placeholder="https://..." 
              />
            </div>
          </FormField>
        </div>
        
        <div className="relative aspect-video rounded-[2rem] overflow-hidden border border-neutral-800/50 bg-neutral-950 group">
          {formData.image ? (
            <Image src={formData.image} alt="Preview" fill className="object-cover group-hover:scale-105 transition-transform duration-1000" unoptimized />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-4 opacity-10">
              <ImageIcon className="w-12 h-12" />
              <span className="text-[10px] font-bold uppercase tracking-[0.3em]">No Image</span>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

/* ─── 02. Detailed Description Section ─── */
const DetailedDescriptionSection = ({ formData, handleMemoChange }: Pick<BaseSectionProps, 'formData'> & { handleMemoChange: (val: string) => void }) => (
  <div className="bg-neutral-900/10 border border-neutral-800/30 rounded-[2.5rem] p-8 md:p-12 space-y-10 transition-all hover:bg-neutral-900/20">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800">
        <Sparkles className="w-6 h-6 text-neutral-400" />
      </div>
      <div>
        <h3 className="text-2xl font-bold text-white tracking-tight">Technical Details</h3>
        <p className="text-[12px] text-neutral-500 font-medium">기술 스택과 상세 정보를 관리합니다.</p>
      </div>
    </div>

    <div className="relative group">
      <textarea 
        name="memo"
        value={formData.memo || ''} 
        onChange={(e) => handleMemoChange(e.target.value)} 
        className={cn(
          inputClassName, 
          "min-h-[400px] p-8 text-lg leading-relaxed text-neutral-300 resize-none bg-neutral-950/40"
        )} 
        placeholder="Describe the technical implementation..." 
      />
      <div className="absolute bottom-6 right-6 flex items-center gap-2.5 px-4 py-2 bg-neutral-950 rounded-xl border border-neutral-800 text-[9px] font-bold text-neutral-500 tracking-widest">
        <Info className="w-3 h-3" />
        {formData.memo?.length || 0} CHARS
      </div>
    </div>
  </div>
);

/* ─── Main Form Flow ─── */
export const AppFormMain = (props: BaseSectionProps & { handleMemoChange: (val: string) => void; loading: boolean; isAnalyzing: boolean; isEditing: boolean }) => (
  <div className="max-w-4xl mx-auto space-y-8 pb-40 px-6">
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
  <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-md px-6">
    <div className="bg-neutral-950/80 backdrop-blur-3xl border border-neutral-800/50 p-2.5 rounded-[2.2rem] flex items-center gap-2.5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.8)]">
      <button
        type="button"
        onClick={onAbort}
        className="flex-1 h-14 rounded-2xl text-[11px] font-bold text-neutral-500 hover:text-white hover:bg-neutral-900 transition-all active:scale-95 uppercase tracking-widest"
      >
        Discard
      </button>
      <button
        type="submit"
        disabled={loading}
        className="flex-[1.5] h-14 flex items-center justify-center gap-2.5 rounded-2xl text-sm font-bold text-black bg-white hover:bg-neutral-200 transition-all active:scale-95 disabled:opacity-50 uppercase tracking-widest shadow-lg shadow-white/5"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {loading ? 'Processing' : 'Publish'}
      </button>
    </div>
  </div>
);


