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
        <h1 className="text-6xl md:text-[10rem] font-black text-white tracking-tighter leading-[0.9] mb-10 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/40">
          {app.name}
        </h1>
        <p className="text-xl md:text-3xl text-zinc-300 leading-relaxed font-normal max-w-3xl">
          {app.description}
        </p>
      </motion.div>
    </header>
  );
};
