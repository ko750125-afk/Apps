'use client';

import React from 'react';
import Image from 'next/image';
import { Save, Loader2, Star, Globe, Image as ImageIcon, Sparkles, Link as LinkIcon, Tag, Eye, Terminal, Cpu, Zap, X, ShieldCheck, Activity } from 'lucide-react';
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

/* ─── 01. Advanced Intelligence Section ─── */
const EssentialInfoSection = ({ formData, handleChange, setFormData, analyzeGitHubRepo, isAnalyzing }: BaseSectionProps) => (
  <div className="relative group overflow-hidden bg-neutral-950/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-indigo-500/40">
    {/* Animated Scanning Line */}
    {isAnalyzing && (
      <div className="absolute top-0 left-0 w-full h-[2px] bg-indigo-500 shadow-[0_0_15px_rgba(79,70,229,1)] animate-scan z-10" />
    )}
    
    <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-700" />
    <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 rounded-full blur-[100px] pointer-events-none group-hover:bg-purple-500/20 transition-all duration-700" />

    <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-neutral-900 pb-10 mb-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.4em]">Protocol 01</span>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
          CORE_IDENTITY
          <Cpu className="w-6 h-6 text-indigo-500/50" />
        </h3>
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Synchronizing primary application parameters...</p>
      </div>
      
      <button 
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
        className={cn(
          "group/star flex items-center gap-3 px-8 py-4 rounded-2xl border transition-all duration-500 active:scale-95",
          formData.featured 
            ? "bg-indigo-600 border-indigo-400 text-white shadow-[0_0_30px_rgba(79,70,229,0.5)]" 
            : "bg-neutral-900/80 border-neutral-800 text-neutral-500 hover:border-neutral-600 hover:text-neutral-300"
        )}
      >
        <Star className={cn("w-4 h-4 transition-transform duration-500 group-hover/star:scale-150 group-hover/star:rotate-[72deg]", formData.featured && "fill-current animate-pulse")} />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">FEATURED_ASSET</span>
      </button>
    </div>

    <div className="space-y-12">
      <FormField label="SYSTEM_ALIAS">
        <div className="relative">
          <input 
            type="text" 
            name="name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            className={cn(inputClassName, "text-4xl font-black tracking-tighter py-8 bg-transparent border-none rounded-none px-0 focus:ring-0 placeholder:text-neutral-900 text-white selection:bg-indigo-500/50")} 
            placeholder="APP_NAME_v1.0" 
          />
          <div className="absolute bottom-0 left-0 w-full h-[2px] bg-gradient-to-r from-indigo-500 via-purple-500 to-transparent opacity-20 group-focus-within:opacity-100 transition-opacity duration-700" />
        </div>
      </FormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <FormField label="CLASSIFICATION_TAG">
          <div className="relative group/select">
            <Tag className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/select:text-indigo-400 transition-colors" />
            <select name="category" value={formData.category} onChange={handleChange} className={cn(selectClassName, "pl-16 py-5 border-neutral-800/50")}>
              {CATEGORIES.filter(c => c !== 'All apps').map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </FormField>
        <FormField label="OPERATIONAL_STATUS">
          <div className="relative group/select">
            <Activity className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/select:text-emerald-400 transition-colors" />
            <select name="status" value={formData.status} onChange={handleChange} className={cn(selectClassName, "pl-16 py-5 border-neutral-800/50")}>
              <option value="Exhibit">ACTIVE_FEED</option>
              <option value="Repair">SYSTEM_PATCHING</option>
            </select>
          </div>
        </FormField>
      </div>

      <FormField label="FUNCTIONAL_ABSTRACT">
        <textarea 
          name="description" 
          value={formData.description || ''} 
          onChange={handleChange} 
          className={cn(inputClassName, "min-h-[140px] py-6 resize-none leading-relaxed bg-neutral-900/20 border-dashed border-neutral-800/50 hover:border-indigo-500/30 transition-all")} 
          placeholder="Detailed neural summary of the application entity..." 
        />
      </FormField>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8">
        <div className="space-y-10">
          <FormField label="ACCESS_ENDPOINT (URL)">
            <div className="relative group/input">
              <Globe className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                name="url" 
                value={formData.url || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "pl-16 py-5")} 
                placeholder="https://deploy.rapidforge.ai" 
              />
            </div>
          </FormField>
          
          <FormField label="SOURCE_REPOSITORY (GITHUB)">
            <div className="flex gap-4">
              <div className="relative flex-1 group/input">
                <LinkIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-indigo-400 transition-colors" />
                <input 
                  type="text" 
                  name="repo" 
                  value={formData.repo || ''} 
                  onChange={handleChange} 
                  className={cn(inputClassName, "pl-16 py-5")} 
                  placeholder="github.com/developer/project" 
                />
              </div>
              <button
                type="button"
                onClick={analyzeGitHubRepo}
                disabled={isAnalyzing}
                className={cn(
                  "px-8 bg-gradient-to-br from-indigo-600 to-purple-700 hover:from-indigo-500 hover:to-purple-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.25em] transition-all duration-500 active:scale-95 flex items-center gap-3 whitespace-nowrap disabled:opacity-50 shadow-[0_10px_30px_rgba(79,70,229,0.4)] relative overflow-hidden group/scan",
                  isAnalyzing && "cursor-wait"
                )}
              >
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover/scan:translate-x-[100%] transition-transform duration-1000" />
                {isAnalyzing ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4 group-hover/scan:rotate-180 transition-transform duration-700" />
                )}
                {isAnalyzing ? 'SYSTEM_SCANNING...' : 'SMART_SYNC'}
              </button>
            </div>
          </FormField>

          <FormField label="VISUAL_INTERFACE_URL">
            <div className="relative group/input">
              <ImageIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within/input:text-indigo-400 transition-colors" />
              <input 
                type="text" 
                name="image" 
                value={formData.image || ''} 
                onChange={handleChange} 
                className={cn(inputClassName, "pl-16 py-5")} 
                placeholder="https://assets.rapidforge.ai/preview.png" 
              />
            </div>
          </FormField>
        </div>
        
        <div className="relative aspect-video rounded-3xl overflow-hidden border border-neutral-800 bg-neutral-900/50 group/preview shadow-[0_30px_100px_rgba(0,0,0,0.6)]">
          {formData.image ? (
            <Image src={formData.image} alt="Preview" fill className="object-cover transition-transform duration-1000 group-hover/preview:scale-110" unoptimized />
          ) : (
            <div className="flex flex-col items-center justify-center h-full gap-5 opacity-20">
              <Zap className="w-20 h-20 text-indigo-500 animate-pulse" />
              <span className="text-[11px] font-black uppercase tracking-[0.5em]">SIGNAL_LOST</span>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent opacity-60" />
          <div className="absolute bottom-6 left-6 flex items-center gap-4">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping absolute" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] font-black text-white/80 uppercase tracking-[0.4em]">LIVE_FEED_STABLE</span>
          </div>
        </div>
      </div>
    </div>
  </div>
);

/* ─── 02. Technical Specifications Section ─── */
const DetailedDescriptionSection = ({ formData, handleMemoChange }: Pick<BaseSectionProps, 'formData'> & { handleMemoChange: (val: string) => void }) => (
  <div className="relative overflow-hidden bg-neutral-950/40 backdrop-blur-xl border border-neutral-800/50 rounded-3xl p-8 md:p-12 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-all duration-700 hover:border-purple-500/40">
    <div className="absolute top-0 right-0 p-12 opacity-[0.02] pointer-events-none rotate-12">
      <Terminal className="w-96 h-96 text-white" />
    </div>

    <div className="relative flex items-center justify-between border-b border-neutral-900 pb-10 mb-10">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />
          <span className="text-[10px] font-black text-purple-400 uppercase tracking-[0.4em]">Protocol 02</span>
        </div>
        <h3 className="text-3xl font-black text-white tracking-tighter flex items-center gap-3">
          TECH_SPECIFICATIONS
          <Terminal className="w-6 h-6 text-purple-500/50" />
        </h3>
        <p className="text-xs text-neutral-500 font-bold uppercase tracking-wider">Synthesizing deep system architecture details...</p>
      </div>
      <div className="flex items-center gap-4 px-6 py-3 bg-neutral-900/80 rounded-2xl border border-neutral-800 shadow-inner">
        <ShieldCheck className="w-4 h-4 text-purple-500" />
        <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em]">MARKDOWN_SECURE</span>
      </div>
    </div>

    <div className="relative group/editor">
      <div className="absolute -inset-2 bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-transparent rounded-[2.5rem] blur-2xl opacity-0 group-focus-within/editor:opacity-100 transition-opacity duration-700" />
      <textarea 
        name="memo"
        value={formData.memo || ''} 
        onChange={(e) => handleMemoChange(e.target.value)} 
        className={cn(
          inputClassName, 
          "relative min-h-[600px] p-10 text-sm font-mono leading-relaxed text-indigo-100/90 resize-none bg-neutral-900/30 border-neutral-800/30 selection:bg-indigo-500/40 border-dashed"
        )} 
        placeholder="// INIT_TECHNICAL_SPECIFICATIONS...&#10;// Deploy deep analysis data here..." 
      />
      <div className="absolute bottom-8 right-8 flex items-center gap-6">
        <div className="h-4 w-px bg-neutral-800" />
        <span className="text-[10px] font-black text-neutral-600 tracking-[0.3em] uppercase">
          {new Blob([formData.memo || '']).size} BYTES_TRANSFERRED
        </span>
      </div>
    </div>
  </div>
);

/* ─── Main Form Flow ─── */
export const AppFormMain = (props: BaseSectionProps & { handleMemoChange: (val: string) => void; loading: boolean; isAnalyzing: boolean; isEditing: boolean }) => (
  <div className="max-w-6xl mx-auto space-y-16 pb-48 px-6">
    {/* Dynamic Header */}
    <div className="flex flex-col space-y-6 pt-16">
      <div className="flex items-center gap-4">
        <div className="w-16 h-[2px] bg-gradient-to-r from-indigo-500 to-transparent" />
        <span className="text-[11px] font-black text-indigo-400 uppercase tracking-[0.6em] animate-pulse">Neural Interface Active</span>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-8">
        <h2 className="text-6xl md:text-8xl font-black text-white tracking-tighter leading-none">
          {props.isEditing ? 'UPDATE_NODE' : 'CREATE_ENTITY'}
        </h2>
        <div className="px-6 py-3 bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl backdrop-blur-md">
          <span className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.3em]">
            ID_TOKEN: <span className="text-indigo-400">{props.formData.id || 'GEN_PENDING'}</span>
          </span>
        </div>
      </div>
      <p className="text-neutral-500 text-xl font-medium max-w-3xl leading-relaxed">
        Executing administrative protocols for decentralized project synchronization. 
        <span className="text-neutral-700"> Advanced spectral analysis enabled for automated metadata harvesting.</span>
      </p>
    </div>

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
}) => {
  const handleDiscard = () => {
    if (window.confirm('⚠️ WARNING: All unsaved neural data will be purged. Proceed with node deletion?')) {
      onAbort();
    }
  };

  return (
    <div className="fixed bottom-12 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-6">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-40 transition duration-1000 group-hover:duration-200 animate-pulse" />
        <div className="relative bg-neutral-900/90 backdrop-blur-3xl border border-neutral-800/50 p-4 rounded-2xl flex items-center gap-4 shadow-[0_40px_80px_-15px_rgba(0,0,0,0.9)]">
          <button
            type="button"
            onClick={handleDiscard}
            className="flex-1 h-16 flex items-center justify-center gap-3 rounded-xl text-[11px] font-black text-neutral-500 hover:text-red-400 hover:bg-red-500/5 transition-all uppercase tracking-[0.3em] group/btn"
          >
            <X className="w-4 h-4 transition-transform group-hover/btn:rotate-90 group-hover/btn:scale-125" />
            DISCARD_NODE
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-[2] h-16 flex items-center justify-center gap-4 rounded-xl text-[11px] font-black text-white bg-indigo-600 hover:bg-indigo-500 transition-all disabled:opacity-50 uppercase tracking-[0.3em] shadow-2xl shadow-indigo-500/40 relative overflow-hidden group/save"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover/save:translate-x-[100%] transition-transform duration-1000" />
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Save className="w-5 h-5 transition-transform group-hover/save:-translate-y-1 group-hover/save:scale-110" />
            )}
            {loading ? 'EXECUTING_COMMIT...' : 'COMMIT_CHANGES'}
          </button>
        </div>
      </div>
    </div>
  );
};
