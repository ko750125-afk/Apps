'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Globe, ExternalLink } from 'lucide-react';
import { AppData } from '@/data/apps';
import { formatUrl } from '@/lib/utils';

export const DetailNavigation = ({ app }: { app: AppData }) => {
  const router = useRouter();
  
  return (
    <nav className="sticky top-0 z-50 w-full bg-black/40 backdrop-blur-2xl border-b border-neutral-900 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <button 
          onClick={() => router.back()}
          className="flex items-center gap-2 text-neutral-400 hover:text-white transition-all group"
        >
          <div className="w-9 h-9 flex items-center justify-center rounded-xl bg-neutral-900 border border-neutral-800 group-hover:border-neutral-700 transition-colors">
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" />
          </div>
          <span className="text-sm font-black tracking-widest uppercase">Showcase</span>
        </button>
        
        <div className="flex items-center gap-3">
          {app.url && (
            <a 
              href={formatUrl(app.url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs font-black text-white px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-blue-600/20 active:scale-95 uppercase tracking-widest"
            >
              Launch App <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </nav>
  );
};
