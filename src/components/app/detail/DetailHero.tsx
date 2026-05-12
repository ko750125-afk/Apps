'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ImageIcon } from 'lucide-react';
import { AppData } from '@/data/apps';
import { getAppImage, appImageObjectPositionCss } from '@/lib/utils';

export const DetailHero = ({ app }: { app: AppData }) => {
  const heroSrc = getAppImage(app);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: 40 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[21/9] rounded-[4rem] overflow-hidden bg-neutral-900 shadow-[0_64px_128px_-16px_rgba(0,0,0,0.8)] border border-neutral-800 mb-24 group"
    >
      <div className="absolute -inset-20 bg-blue-600/10 blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {heroSrc ? (
        <Image
          src={heroSrc}
          alt={app.name}
          fill
          style={{ objectPosition: appImageObjectPositionCss(app) }}
          className="object-cover transition-transform duration-[2000ms] group-hover:scale-110"
          unoptimized
        />
      ) : (
        <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-neutral-500 bg-gradient-to-br from-neutral-900 to-black px-6 text-center">
          <ImageIcon className="w-16 h-16 text-neutral-700" strokeWidth={1.25} aria-hidden />
          <div className="space-y-1">
            <p className="text-sm font-medium text-neutral-400">대표 이미지가 없습니다</p>
            <p className="text-xs text-neutral-600 max-w-md leading-relaxed">
              관리자에서 이미지를 업로드한 뒤 <span className="text-neutral-500">저장</span>하면 이 영역에 표시됩니다.
            </p>
          </div>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent pointer-events-none opacity-60" />
    </motion.div>
  );
};
