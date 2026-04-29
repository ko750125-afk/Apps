'use client';

import React, { useState } from 'react';
import { AppData, Category } from '@/data/apps';
import { db } from '@/lib/firebase';
import { doc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Save, X, Link as LinkIcon, Image as ImageIcon, LayoutGrid, Type, AlignLeft, Star, ShieldCheck } from 'lucide-react';

interface AppFormProps {
  initialData?: AppData;
  isEditing?: boolean;
}

const categories: Category[] = [
  'AI & Smart',
  'Productivity',
  'Utility & Tools',
  'Games & Edu',
  'Finance',
  'Others'
];

export default function AppForm({ initialData, isEditing = false }: AppFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<AppData>>(
    initialData || {
      name: '',
      url: '',
      repo: '',
      category: 'Others',
      featured: false,
      description: '',
      image: '',
      status: 'Exhibit',
      memo: '',
    }
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const appData = {
        ...formData,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      };

      if (isEditing && initialData?.id) {
        const appRef = doc(db, '18_apps_list', initialData.id);
        await updateDoc(appRef, appData);
      } else {
        const appsRef = collection(db, '18_apps_list');
        await addDoc(appsRef, appData);
      }

      router.push('/admin');
      router.refresh();
    } catch (error) {
      console.error('Error saving app:', error);
      alert('Failed to save app. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: val
    }));
  };

  return (
    <motion.form 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit} 
      className="relative p-8 rounded-[2.5rem] bg-black/40 border border-white/10 backdrop-blur-2xl shadow-2xl max-w-3xl mx-auto overflow-hidden group"
    >
      <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-neon-purple/10 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="md:col-span-2 space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-cyan-400 uppercase tracking-[0.2em]">
              <Type className="w-3.5 h-3.5" />
              App Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-xl font-bold text-white placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all uppercase tracking-wide"
              placeholder="E.G. BUILDER WORKFLOW HUB"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <LinkIcon className="w-3.5 h-3.5" />
              Live URL
            </label>
            <input
              type="text"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              placeholder="example.vercel.app"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <ImageIcon className="w-3.5 h-3.5" />
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image || ''}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all font-mono"
              placeholder="https://example.com/image.png"
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <LayoutGrid className="w-3.5 h-3.5" />
              Category
            </label>
            <div className="relative">
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer uppercase tracking-wider font-bold"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat} className="bg-space-navy text-white py-2">{cat}</option>
                ))}
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <LayoutGrid className="w-4 h-4 text-gray-500" />
              </div>
            </div>
          </div>

          <div className="space-y-2 md:col-span-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <AlignLeft className="w-3.5 h-3.5" />
              Description
            </label>
            <textarea
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              rows={3}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none leading-relaxed"
              placeholder="Brief description of the app's primary function and tech stack..."
            />
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <ShieldCheck className="w-3.5 h-3.5" />
              Status
            </label>
            <div className="relative">
              <select
                name="status"
                value={formData.status || 'Exhibit'}
                onChange={handleChange}
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-gray-300 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all appearance-none cursor-pointer uppercase tracking-wider font-bold"
              >
                <option value="Exhibit" className="bg-[#05050a] text-white py-2">Exhibit (공개)</option>
                <option value="Repair" className="bg-[#05050a] text-white py-2">Repair (비공개)</option>
              </select>
            </div>
            {formData.status === 'Repair' && (
              <p className="text-[10px] text-amber-500 mt-1 uppercase tracking-widest font-bold">※ Excluded from public portfolio</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
              <AlignLeft className="w-3.5 h-3.5" />
              Internal Memo
            </label>
            <textarea
              name="memo"
              value={formData.memo || ''}
              onChange={handleChange}
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-4 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 transition-all resize-none leading-relaxed"
              placeholder="Private notes for administrators..."
            />
          </div>

          <div className="md:col-span-2 p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between group/feature hover:border-amber-500/30 transition-colors cursor-pointer" onClick={() => setFormData(prev => ({ ...prev, featured: !prev.featured }))}>
            <div className="flex items-center gap-4">
              <div className={`p-2 rounded-xl transition-colors ${formData.featured ? 'bg-amber-500/20 text-amber-500' : 'bg-white/5 text-gray-500'}`}>
                <Star className={`w-5 h-5 ${formData.featured ? 'fill-amber-500' : ''}`} />
              </div>
              <div>
                <h3 className={`text-sm font-bold uppercase tracking-widest ${formData.featured ? 'text-amber-500' : 'text-gray-400'}`}>Featured Application</h3>
                <p className="text-xs text-gray-500 mt-1">Highlight this app on the main portfolio grid</p>
              </div>
            </div>
            <div className="relative flex items-center">
              <input
                type="checkbox"
                name="featured"
                checked={formData.featured}
                onChange={handleChange}
                className="sr-only"
              />
              <div className={`w-12 h-6 rounded-full transition-colors ${formData.featured ? 'bg-amber-500' : 'bg-gray-700'}`}>
                <div className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.featured ? 'translate-x-6' : 'translate-x-0'}`} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-white/5">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 text-gray-400 hover:text-white hover:bg-white/5 hover:border-white/20 transition-all text-xs font-bold uppercase tracking-widest"
          >
            <X className="w-4 h-4" />
            Abort
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 rounded-xl bg-cyan-600 text-white text-xs font-bold uppercase tracking-widest hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-[0_0_20px_rgba(0,255,255,0.2)] hover:shadow-[0_0_30px_rgba(0,255,255,0.4)] hover:scale-[1.02] active:scale-[0.98]"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {loading ? 'Processing...' : isEditing ? 'Update Record' : 'Initialize Node'}
          </button>
        </div>
      </div>
    </motion.form>
  );
}
