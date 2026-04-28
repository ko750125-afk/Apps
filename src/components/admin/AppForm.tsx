'use client';

import React, { useState } from 'react';
import { AppData, Category } from '@/data/apps';
import { db } from '@/lib/firebase';
import { doc, setDoc, collection, addDoc, updateDoc } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

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
    <form onSubmit={handleSubmit} className="space-y-6 p-8 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xl max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-white mb-6">
        {isEditing ? 'Edit Application' : 'Add New Application'}
      </h2>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">App Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            placeholder="e.g. Builder Workflow Hub"
          />
        </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">URL (Optional)</label>
            <input
              type="text"
              name="url"
              value={formData.url || ''}
              onChange={handleChange}
              className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
              placeholder="example.vercel.app"
            />
          </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50 appearance-none"
          >
            {categories.map(cat => (
              <option key={cat} value={cat} className="bg-slate-900">{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Description</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleChange}
            rows={3}
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-cyan-500/50"
            placeholder="Brief description of the app..."
          />
        </div>

        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            name="featured"
            id="featured"
            checked={formData.featured}
            onChange={handleChange}
            className="w-4 h-4 rounded border-white/10 bg-white/5 text-cyan-500 focus:ring-cyan-500/50"
          />
          <label htmlFor="featured" className="text-sm font-medium text-gray-400 cursor-pointer">
            Featured Application
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-4 pt-4">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2 rounded-lg border border-white/10 text-white hover:bg-white/5 transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 rounded-lg bg-cyan-600 text-white font-medium hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-cyan-500/20"
        >
          {loading ? 'Saving...' : isEditing ? 'Update App' : 'Add App'}
        </button>
      </div>
    </form>
  );
}
