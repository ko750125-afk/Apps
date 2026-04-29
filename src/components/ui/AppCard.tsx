'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';
import { ExternalLink } from 'lucide-react';

interface AppCardProps {
  app: AppData;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  
  // Use screenshot service if URL exists but no image is provided, or as a fallback
  const displayImage = app.image || (app.url ? `https://screenshot.vercel.app/${app.url}` : null);

  const content = (
    <div className="relative h-full flex flex-col p-6">
      {/* App Image Section */}
      <div className="relative aspect-[16/10] mb-6 rounded-[24px] overflow-hidden bg-[#f0f0f3] shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff] border border-white/20 group/img">
        {displayImage ? (
          <>
            {/* Shimmer Effect while loading */}
            {!isLoaded && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
            )}
            <motion.img 
              src={displayImage} 
              alt={app.name}
              initial={{ opacity: 0 }}
              animate={{ opacity: isLoaded ? 0.9 : 0 }}
              transition={{ duration: 0.5 }}
              onLoad={() => setIsLoaded(true)}
              className={cn(
                "w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:scale-105",
                isLoaded ? "group-hover:opacity-100" : "opacity-0"
              )}
            />
            {/* Glossy overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50" />
          </>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2">
            <div className="w-12 h-12 rounded-full bg-[#f0f0f3] shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff] flex items-center justify-center">
              <span className="text-[#86868b] text-[10px] font-bold opacity-30">APP</span>
            </div>
            <span className="text-[12px] text-[#86868b] font-medium opacity-40">Preparing Preview</span>
          </div>
        )}
      </div>

      {/* App Info Section */}
      <div className="flex flex-col flex-grow px-2">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-[19px] font-bold text-[#1d1d1f] tracking-tight group-hover:text-[#0066cc] transition-colors duration-300">
            {app.name}
          </h3>
          <div className="w-8 h-8 rounded-full bg-[#f0f0f3] shadow-[2px_2px_4px_#d1d1d6,-2px_-2px_4px_#ffffff] flex items-center justify-center opacity-0 -translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <ExternalLink className="w-3.5 h-3.5 text-[#0066cc]" />
          </div>
        </div>
        
        <p className="text-[14px] leading-[1.6] text-[#86868b] line-clamp-2 mb-6 font-medium">
          {app.description || '혁신적인 웹 서비스 경험을 만나보세요.'}
        </p>

        {/* Footer/Meta Info */}
        <div className="mt-auto pt-4 flex items-center justify-between border-t border-[#d2d2d7]/30">
          <span className="text-[12px] font-semibold text-[#86868b]/60 uppercase tracking-widest">
            {app.category}
          </span>
          <span className="text-[12px] font-medium text-[#86868b]/60">
            {app.date}
          </span>
        </div>
      </div>
    </div>
  );

  const wrapperClass = cn(
    "group relative h-full block rounded-[32px] transition-all duration-500",
    "bg-[#f0f0f3] border border-white/40",
    "shadow-[inset_6px_6px_12px_#d1d1d6,inset_-6px_-6px_12px_#ffffff]",
    "hover:shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff,0_10px_20px_rgba(0,0,0,0.05)]",
    "hover:-translate-y-0.5 active:scale-[0.98]"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.6, 
        delay: (index % 6) * 0.05,
        ease: [0.23, 1, 0.32, 1]
      }}
      className="h-full"
    >
      {app.url ? (
        <a
          href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className={wrapperClass}
        >
          {content}
        </a>
      ) : (
        <div className={wrapperClass}>
          {content}
        </div>
      )}
    </motion.div>
  );
}
