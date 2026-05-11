'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Monitor } from 'lucide-react';
import { AppData } from '@/data/apps';

export const DetailHero = ({ app }: { app: AppData }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[21/9] rounded-[4rem] overflow-hidden bg-neutral-900 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.8)] border border-neutral-800 mb-24 group"
    >
      {/* Cinematic Glow Behind */}
      <div className="absolute -inset-20 bg-blue-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
      
      {app.image ? (
        <Image 
          src={app.image} 
          alt={app.name} 
          fill
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center text-neutral-600 bg-gradient-to-br from-neutral-900 to-black">
          <div className="relative mb-6">
            <Monitor className="w-24 h-24 text-neutral-800" />
            <div className="absolute inset-0 blur-2xl bg-blue-500/10 animate-pulse" />
          </div>
          <p className="text-xl font-black text-neutral-500 uppercase tracking-[0.3em]">Infrastructure Visualization</p>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none opacity-60" />
    </motion.div>
  );
};
