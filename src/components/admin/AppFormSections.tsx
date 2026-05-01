'use client';

import React from 'react';
import Image from 'next/image';
import { Save, Loader2, Sparkles, Star, Monitor, Globe, Tag, Info, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppData, CATEGORIES } from '@/data/apps';
import { FormField, inputClassName, selectClassName } from './AppFormUI';
import MarkdownEditor from '@/components/admin/MarkdownEditor';

interface BaseSectionProps {
  formData: AppData;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  setFormData: React.Dispatch<React.SetStateAction<AppData>>;
}

/* ─── Main Section (Left) ─── */
export const AppFormMain = ({
  formData,
  handleChange,
  handleMemoChange,
}: Omit<BaseSectionProps, 'setFormData'> & { handleMemoChange: (val: string) => void }) => (
  <div className="space-y-8">
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 bg-accent rounded-full" />
        <h3 className="text-lg font-bold text-neutral-100">Core Information</h3>
      </div>
      
      <FormField label="App Name" hint="What is the official title of your application?">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className={inputClassName}
          placeholder="e.g., Ultra Dashboard"
        />
      </FormField>

      <FormField label="Description" hint="A punchy one-liner or short summary.">
        <textarea
          name="description"
          value={formData.description || ''}
          onChange={handleChange}
          rows={3}
          className={cn(inputClassName, "resize-none min-h-[100px]")}
          placeholder="Describe what makes this app special..."
        />
      </FormField>
    </div>

    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-8 space-y-6 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <div className="w-2 h-6 bg-purple-500 rounded-full" />
        <h3 className="text-lg font-bold text-neutral-100">Technical Details</h3>
      </div>
      
      <FormField label="Full Specification (Markdown)" hint="Detailed write-up about stack, features, and challenges.">
        <div className="rounded-2xl border border-neutral-800 overflow-hidden bg-neutral-950">
          <MarkdownEditor
            value={formData.memo || ''}
            onChange={(val) => handleMemoChange(val || '')}
          />
        </div>
      </FormField>
    </div>
  </div>
);

/* ─── Sidebar Section (Right) ─── */
export const AppFormSidebar = ({
  formData,
  handleChange,
  setFormData,
  fetchAppInfo,
  loading,
}: BaseSectionProps & {
  setFormData: React.Dispatch<React.SetStateAction<AppData>>;
  fetchAppInfo: () => void;
  loading: boolean;
  systemLogs: string[];
}) => (
  <div className="space-y-8 sticky top-24">
    {/* Deployment & Metadata */}
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Globe className="w-5 h-5 text-accent" />
        <h3 className="text-base font-bold text-neutral-100 uppercase tracking-tight">Deployment</h3>
      </div>

      <FormField label="App URL">
        <div className="relative group">
          <input
            type="text"
            name="url"
            value={formData.url || ''}
            onChange={handleChange}
            className={cn(inputClassName, "pr-24 bg-neutral-950")}
            placeholder="https://yourapp.com"
          />
          <button
            type="button"
            onClick={fetchAppInfo}
            disabled={loading}
            className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase text-white bg-accent hover:bg-accent-hover transition-all shadow-lg shadow-accent/20 disabled:opacity-50 active:scale-95"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
            Auto-fill
          </button>
        </div>
      </FormField>

      <FormField label="Category">
        <div className="relative group">
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={cn(selectClassName, "bg-neutral-950")}
          >
            {CATEGORIES.filter(c => c !== 'All apps').map(cat => (
              <option key={cat} value={cat} className="bg-neutral-900">{cat}</option>
            ))}
          </select>
          <Tag className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
        </div>
      </FormField>
    </div>

    {/* Visual Representation */}
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-6 space-y-6 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Monitor className="w-5 h-5 text-emerald-400" />
        <h3 className="text-base font-bold text-neutral-100 uppercase tracking-tight">Thumbnail</h3>
      </div>

      <FormField label="Cover Image URL">
        <input
          type="text"
          name="image"
          value={formData.image || ''}
          onChange={handleChange}
          className={cn(inputClassName, "bg-neutral-950")}
          placeholder="Direct link to image..."
        />
        {formData.image && (
          <div className="mt-4 rounded-2xl overflow-hidden border border-neutral-800 bg-neutral-950 shadow-inner group">
            <div className="relative h-40">
              <Image 
                src={formData.image} 
                alt="Preview" 
                fill
                className="object-cover opacity-60 group-hover:opacity-100 transition-opacity duration-500" 
                unoptimized 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-3 left-4 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.5)]" />
                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Live Preview</span>
              </div>
            </div>
          </div>
        )}
      </FormField>
    </div>

    {/* Publication Status */}
    <div className="bg-neutral-900/50 backdrop-blur-sm border border-neutral-800 rounded-3xl p-6 space-y-4 shadow-xl">
      <div className="flex items-center gap-2 mb-2">
        <Info className="w-5 h-5 text-amber-400" />
        <h3 className="text-base font-bold text-neutral-100 uppercase tracking-tight">Status</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, status: 'Exhibit' }))}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
            formData.status !== 'Repair' 
              ? "bg-emerald-500/10 border-emerald-500/50 text-emerald-400" 
              : "bg-neutral-950 border-neutral-800 text-neutral-600 hover:border-neutral-700"
          )}
        >
          <CheckCircle2 className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase">Operational</span>
        </button>
        <button
          type="button"
          onClick={() => setFormData(prev => ({ ...prev, status: 'Repair' }))}
          className={cn(
            "flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all",
            formData.status === 'Repair' 
              ? "bg-rose-500/10 border-rose-500/50 text-rose-400" 
              : "bg-neutral-950 border-neutral-800 text-neutral-600 hover:border-neutral-700"
          )}
        >
          <Loader2 className="w-5 h-5" />
          <span className="text-[10px] font-bold uppercase tracking-tight">Maintenance</span>
        </button>
      </div>

      <button
        type="button"
        onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}
        className={cn(
          "w-full flex items-center justify-between p-4 rounded-2xl border transition-all mt-2 group",
          formData.featured
            ? "bg-amber-400 text-neutral-950 border-amber-400 shadow-lg shadow-amber-400/20"
            : "bg-neutral-950 border-neutral-800 text-neutral-500 hover:border-neutral-700"
        )}
      >
        <div className="flex items-center gap-3">
          <Star className={cn("w-4 h-4", formData.featured && "fill-neutral-950")} />
          <span className="text-xs font-bold uppercase tracking-widest">Featured Spotlight</span>
        </div>
        <div className={cn(
          "w-5 h-5 rounded-lg border-2 flex items-center justify-center transition-colors",
          formData.featured ? "border-neutral-950 bg-neutral-950" : "border-neutral-800"
        )}>
          {formData.featured && <span className="text-[10px] text-amber-400 font-bold">✓</span>}
        </div>
      </button>
    </div>
  </div>
);

/* ─── Form Actions ─── */
export const AppFormActions = ({
  loading,
  isEditing,
  onAbort,
}: {
  loading: boolean;
  isEditing: boolean;
  onAbort: () => void;
}) => (
  <div className="fixed bottom-0 left-0 right-0 z-50 bg-neutral-950/80 backdrop-blur-2xl border-t border-neutral-900">
    <div className="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between gap-4">
      <div className="hidden md:flex items-center gap-2 text-neutral-500">
        <Info className="w-4 h-4" />
        <p className="text-xs">All changes are saved to the primary cloud registry.</p>
      </div>
      <div className="flex items-center gap-3 w-full md:w-auto">
        <button
          type="button"
          onClick={onAbort}
          className="flex-1 md:flex-none px-6 py-2.5 text-sm font-bold uppercase tracking-widest text-neutral-400 hover:text-neutral-200 transition-colors"
        >
          Discard
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex-1 md:flex-none flex items-center justify-center gap-2 px-8 py-3 text-sm font-bold uppercase tracking-widest text-white bg-accent hover:bg-accent-hover rounded-xl shadow-xl shadow-accent/20 transition-all active:scale-95 disabled:opacity-50"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {loading ? 'Processing...' : isEditing ? 'Save Changes' : 'Publish Project'}
        </button>
      </div>
    </div>
  </div>
);
