'use client';

import { motion } from 'framer-motion';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: AppData;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  const cardContent = (
    <>
      <div className="relative w-full aspect-video shrink-0 overflow-hidden bg-[#f9fafb] border-b border-[#f3f4f6]">
        {app.image ? (
          <img 
            src={app.image} 
            alt={app.name} 
            className="w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500 ease-in-out" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=800&auto=format&fit=crop';
            }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f9fafb] to-[#f3f4f6]">
            <span className="text-[#9ca3af] font-medium text-sm">No Preview Available</span>
          </div>
        )}
        <div className="absolute inset-0 ring-1 ring-inset ring-black/5 pointer-events-none" />
      </div>

      <div className="relative flex flex-col flex-1 p-6 bg-white">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-bold text-[#111827] text-lg tracking-tight group-hover:text-cyan-600 transition-colors duration-300">
            {app.name}
          </h3>
          {app.status === 'Repair' && (
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-600 border border-amber-100 uppercase tracking-wider">
              Repair
            </span>
          )}
        </div>
        
        {app.description && (
          <p className="text-[14px] text-[#6b7280] line-clamp-2 font-normal leading-relaxed mb-4">
            {app.description}
          </p>
        )}

        <div className="mt-auto flex items-center justify-between">
          <span className="text-[11px] font-semibold text-[#9ca3af] uppercase tracking-widest">
            {app.category}
          </span>
          <span className="text-[11px] text-[#9ca3af]">
            {app.date}
          </span>
        </div>
      </div>
    </>
  );

  const wrapperClass = cn(
    "group relative flex flex-col rounded-2xl overflow-hidden cursor-pointer h-full transition-all duration-500",
    "bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)] hover:shadow-[0_20px_25px_-5px_rgba(0,0,0,0.1),0_10px_10px_-5px_rgba(0,0,0,0.04)]",
    "border border-[#e5e7eb] hover:border-cyan-500/30 hover:-translate-y-1.5"
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
          {cardContent}
        </a>
      ) : (
        <div className={wrapperClass}>
          {cardContent}
        </div>
      )}
    </motion.div>
  );
}
