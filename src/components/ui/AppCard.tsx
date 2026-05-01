'use client';

import React from 'react';
import { motion, Variants } from 'framer-motion';
import { AppData } from '@/data/apps';
import { cn, getAppImage } from '@/lib/utils';
import { ImageOff } from 'lucide-react';

interface AppCardProps {
  app: AppData;
  index: number;
}

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: (i % 6) * 0.05,
      ease: [0.23, 1, 0.32, 1]
    }
  })
};

// Sub-components moved outside to prevent re-creation on every render
interface CardImageProps {
  displayImage: string | null;
  hasError: boolean;
  isLoaded: boolean;
  appName: string;
  url: string | null;
  onImageLoad: () => void;
  onImageError: () => void;
}

const CardImage = ({ displayImage, hasError, isLoaded, appName, url, onImageLoad, onImageError }: CardImageProps) => (
  <div className="relative aspect-[16/10] mb-6 rounded-[24px] overflow-hidden bg-[#f0f0f3] shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff] border border-white/20 group/img">
    {displayImage && !hasError ? (
      <>
        {!isLoaded && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
        )}
        <motion.img 
          src={displayImage} 
          alt={appName}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 0.9 : 0 }}
          onLoad={onImageLoad}
          onError={onImageError}
          className={cn(
            "w-full h-full object-cover mix-blend-multiply transition-all duration-700 group-hover:scale-105",
            isLoaded ? "group-hover:opacity-100" : "opacity-0"
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none opacity-50" />
      </>
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center gap-2">
        <div className="w-12 h-12 rounded-full bg-[#f0f0f3] shadow-[4px_4px_8px_#d1d1d6,-4px_-4px_8px_#ffffff] flex items-center justify-center">
          <ImageOff className="w-5 h-5 text-[#86868b] opacity-30" />
        </div>
        <span className="text-[12px] text-[#86868b] font-medium opacity-40">
          {url ? 'Preview Loading...' : 'No Preview Available'}
        </span>
      </div>
    )}
  </div>
);

const CardContent = ({ app }: { app: AppData }) => (
  <div className="flex flex-col flex-grow px-2">
    <div className="flex items-start justify-between mb-3">
      <h3 className="text-[19px] font-bold text-[#1d1d1f] tracking-tight group-hover:text-[#0066cc] transition-colors duration-300">
        {app.name}
      </h3>
    </div>
    
    <p className="text-[14px] leading-[1.6] text-[#86868b] line-clamp-2 mb-6 font-medium">
      {app.description || '혁신적인 웹 서비스 경험을 만나보세요.'}
    </p>

  </div>
);

import Link from 'next/link';

export default function AppCard({ app, index }: AppCardProps) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [hasError, setHasError] = React.useState(false);
  
  const displayImage = React.useMemo(() => getAppImage(app), [app]);

  const wrapperClass = cn(
    "group relative h-full flex flex-col p-6 rounded-[32px] transition-all duration-500",
    "bg-[#f0f0f3] border border-white/40",
    "shadow-[inset_6px_6px_12px_#d1d1d6,inset_-6px_-6px_12px_#ffffff]",
    "hover:shadow-[inset_4px_4px_8px_#d1d1d6,inset_-4px_-4px_8px_#ffffff,0_10px_20px_rgba(0,0,0,0.05)]",
    "hover:-translate-y-0.5 active:scale-[0.98]"
  );

  const cardContent = (
    <>
      <CardImage 
        displayImage={displayImage}
        hasError={hasError}
        isLoaded={isLoaded}
        appName={app.name}
        url={app.url}
        onImageLoad={() => setIsLoaded(true)}
        onImageError={() => setHasError(true)}
      />
      <CardContent app={app} />
    </>
  );

  return (
    <motion.div
      custom={index}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={cardVariants}
      className="h-full"
    >
      <Link
        href={`/app/${app.id}`}
        className={wrapperClass}
      >
        {cardContent}
      </Link>
    </motion.div>
  );
}
