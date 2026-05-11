'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Layers, Code2, ExternalLink, Globe } from 'lucide-react';
import { AppData } from '@/data/apps';
import { formatUrl } from '@/lib/utils';
import InquiryModal from '@/components/inquiry/InquiryModal';

export const DetailSidebar = ({ app }: { app: AppData }) => {
  const [isInquiryOpen, setIsInquiryOpen] = React.useState(false);
  const techStack = ['Next.js', 'TypeScript', 'Tailwind CSS', 'Firebase'];

  return (
    <aside className="space-y-10">
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="sticky top-32 p-8 md:p-10 rounded-[3rem] bg-neutral-900 border border-neutral-800 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] space-y-10 overflow-hidden relative"
      >
        {/* Decorative corner glow */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-600/10 blur-3xl rounded-full" />

        <div className="space-y-8 relative z-10">
          {/* ... existing stats ... */}
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-500 shadow-lg shadow-blue-600/5">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Architected</p>
              <p className="text-lg font-bold text-white tracking-tight">{app.date}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Layers className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Domain Class</p>
              <p className="text-lg font-bold text-white tracking-tight">{app.category}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Code2 className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-black text-neutral-500 uppercase tracking-[0.2em] mb-1">Core Infrastructure</p>
              <div className="flex flex-wrap gap-2 pt-2">
                {techStack.map(tech => (
                  <span 
                    key={tech}
                    className="px-3 py-1.5 bg-black border border-neutral-800 text-neutral-400 text-[10px] font-black uppercase tracking-widest rounded-lg"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-neutral-800 space-y-4 relative z-10">
          {app.url && (
            <a 
              href={formatUrl(app.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between w-full px-6 py-4.5 bg-neutral-800 text-white border border-neutral-700 rounded-2xl font-black text-sm transition-all hover:bg-neutral-700 active:scale-[0.98] group"
            >
              <span>Connect Live</span>
              <ExternalLink className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
          )}

          <button 
            onClick={() => setIsInquiryOpen(true)}
            className="flex items-center justify-center w-full px-6 py-4.5 bg-blue-600 text-white rounded-2xl font-black text-sm transition-all hover:bg-blue-500 hover:shadow-[0_20px_40px_-12px_rgba(59,130,246,0.5)] active:scale-[0.98] group gap-2"
          >
            <Globe className="w-4 h-4" />
            <span>상담 및 견적 문의</span>
          </button>
        </div>
      </motion.div>

      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
        preselectedApp={app} 
      />
    </aside>
  );
};
