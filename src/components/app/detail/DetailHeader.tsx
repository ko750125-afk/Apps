'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AppData } from '@/data/apps';

export const DetailHeader = ({ app }: { app: AppData }) => {
  return (
    <header className="mb-20">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-5xl"
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="px-4 py-1.5 bg-blue-600/10 border border-blue-600/20 text-blue-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg">
            {app.category}
          </span>
          {app.featured && (
            <span className="px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-500 text-[10px] font-black uppercase tracking-[0.2em] rounded-lg flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" />
              Featured Project
            </span>
          )}
        </div>
        <h1 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.9] mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {app.name}
        </h1>
        <p className="text-xl md:text-3xl text-neutral-400 leading-relaxed font-medium max-w-3xl">
          {app.description}
        </p>
      </motion.div>
    </header>
  );
};
