'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { AppData } from '@/data/apps';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  ExternalLink, 
  LayoutGrid
} from 'lucide-react';
import { formatUrl } from '@/lib/utils';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

interface AppDetailContentProps {
  app: AppData;
}

export default function AppDetailContent({ app }: AppDetailContentProps) {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fbfbfd] pb-32">
      {/* Sub Navigation */}
      <nav className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-xl border-b border-[#f5f5f7] px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#86868b] hover:text-[#1d1d1f] transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            <span className="text-sm font-medium tracking-tight">Showcase</span>
          </button>
          
          {app.url && (
            <a 
              href={formatUrl(app.url)} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-sm font-bold text-[#0066cc] hover:text-[#004499] transition-colors flex items-center gap-1.5 px-4 py-2 bg-[#0066cc]/5 rounded-full"
            >
              Launch App <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-6 pt-20">
        {/* Header Section */}
        <header className="mb-20 space-y-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-4"
          >
            <span className="inline-block px-3 py-1 bg-[#f5f5f7] text-[#86868b] text-[11px] font-bold uppercase tracking-widest rounded-md">
              {app.category}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold text-[#1d1d1f] tracking-tight leading-[1.05]">
              {app.name}
            </h1>
            <p className="text-2xl md:text-3xl text-[#424245] leading-snug font-medium max-w-3xl">
              {app.description}
            </p>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="pt-4"
          >
            {app.url && (
              <a 
                href={formatUrl(app.url)} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-10 py-5 bg-[#1d1d1f] text-white rounded-full text-lg font-bold transition-all hover:bg-black hover:shadow-2xl hover:shadow-black/10 active:scale-95"
              >
                <span>Visit Project</span>
                <ExternalLink className="w-5 h-5" />
              </a>
            )}
          </motion.div>
        </header>

        {/* Featured Image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="relative aspect-video rounded-[40px] overflow-hidden bg-white shadow-[0_40px_100px_-20px_rgba(0,0,0,0.15)] border border-[#f5f5f7] mb-24"
        >
          {app.image ? (
            <Image 
              src={app.image} 
              alt={app.name} 
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#86868b] bg-[#fbfbfd]">
              <LayoutGrid className="w-16 h-16 opacity-10 mb-4" />
              <p className="text-sm font-medium opacity-30">Preview not available</p>
            </div>
          )}
        </motion.div>

        {/* Detailed Content */}
        <div className="max-w-2xl mx-auto">
          {app.memo && (
            <section className="animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <div className="prose-container">
                <MarkdownRenderer content={app.memo} />
              </div>
            </section>
          )}
        </div>
      </div>
    </main>
  );
}
