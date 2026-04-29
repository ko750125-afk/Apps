'use client';

import { motion } from 'framer-motion';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: AppData;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  const CardContent = () => (
    <>
      {app.image && (
        <div className="relative w-full h-48 shrink-0 overflow-hidden bg-[#f5f5f7]">
          <img 
            src={app.image} 
            alt={app.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out" 
          />
        </div>
      )}

      <div className={cn("relative flex flex-col flex-1 p-8 bg-white", app.image ? "" : "pt-8")}>
        <h3 className="font-semibold text-[#1d1d1f] text-2xl mb-3 tracking-tight group-hover:text-[#0066cc] transition-colors duration-300">
          {app.name}
        </h3>
        
        {app.description && (
          <p className="text-[15px] text-[#86868b] line-clamp-3 font-medium leading-relaxed">
            {app.description}
          </p>
        )}
      </div>
    </>
  );

  const wrapperClass = cn(
    "group relative flex flex-col rounded-3xl overflow-hidden cursor-pointer h-full min-h-[280px] transition-all duration-500",
    "bg-white shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_12px_40px_rgba(0,0,0,0.08)] border border-[#f5f5f7] hover:-translate-y-2"
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ 
        duration: 0.5, 
        delay: (index % 6) * 0.1,
        ease: "easeOut" 
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
          <CardContent />
        </a>
      ) : (
        <div className={wrapperClass}>
          <CardContent />
        </div>
      )}
    </motion.div>
  );
}
