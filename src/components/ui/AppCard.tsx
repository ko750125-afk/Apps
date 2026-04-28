'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Code2, Sparkles } from 'lucide-react';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: AppData;
  index: number;
}

export default function AppCard({ app, index }: AppCardProps) {
  const categoryThemes: Record<string, { color: string, glow: string, border: string }> = {
    'AI & Smart': { 
      color: 'text-neon-purple', 
      glow: 'shadow-[0_0_20px_rgba(138,43,226,0.3)]', 
      border: 'group-hover:border-neon-purple/50' 
    },
    'Productivity': { 
      color: 'text-electric-cyan', 
      glow: 'shadow-[0_0_20px_rgba(0,240,255,0.3)]', 
      border: 'group-hover:border-electric-cyan/50' 
    },
    'Utility & Tools': { 
      color: 'text-hologram-blue', 
      glow: 'shadow-[0_0_20px_rgba(77,159,255,0.3)]', 
      border: 'group-hover:border-hologram-blue/50' 
    },
    'Games & Edu': { 
      color: 'text-ai-green', 
      glow: 'shadow-[0_0_20px_rgba(0,255,157,0.3)]', 
      border: 'group-hover:border-ai-green/50' 
    },
    'Finance': { 
      color: 'text-yellow-400', 
      glow: 'shadow-[0_0_20px_rgba(250,204,21,0.3)]', 
      border: 'group-hover:border-yellow-400/50' 
    },
    'Others': { 
      color: 'text-muted-steel', 
      glow: 'shadow-[0_0_20px_rgba(148,163,184,0.3)]', 
      border: 'group-hover:border-muted-steel/50' 
    },
  };

  const theme = categoryThemes[app.category] || categoryThemes['Others'];

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
      whileHover={{ y: -8 }}
      className={cn(
        "group relative flex flex-col justify-between p-7 rounded-[2rem] overflow-hidden cursor-pointer h-full min-h-[320px] transition-all duration-500",
        "bg-space-navy/20 backdrop-blur-md border border-white/5",
        theme.border
      )}
    >
      {/* Dynamic Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-white/[0.02] pointer-events-none" />
      
      {/* Scanline Effect on Hover */}
      <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-20 transition-opacity duration-700 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%]" />

      {/* Cyber Corner Accents */}
      <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute top-4 right-4 w-[2px] h-4 bg-electric-cyan/40" />
        <div className="absolute top-4 right-4 w-4 h-[2px] bg-electric-cyan/40" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-6">
          <div className={cn(
            "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/10 transition-all duration-500 group-hover:bg-white/10",
            theme.color
          )}>
            {app.category}
          </div>
          <Sparkles className={cn("w-4 h-4 opacity-0 group-hover:opacity-100 transition-all duration-500", theme.color)} />
        </div>
        
        <h3 className="font-display font-bold text-starlight-white text-2xl mb-4 group-hover:translate-x-1 transition-transform duration-500">
          {app.name}
        </h3>
        
        {app.description && (
          <p className="text-sm text-muted-steel line-clamp-3 mb-6 font-light leading-relaxed group-hover:text-muted-steel/80 transition-colors">
            {app.description}
          </p>
        )}
      </div>

      <div className="relative z-10 mt-auto">
        <div className="flex items-center justify-between pt-6 border-t border-white/5">
          <div className="flex items-center gap-2 group/link">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center border border-white/10 transition-all duration-300 group-hover:border-electric-cyan/30 group-hover:rotate-12">
              <Code2 className="w-4 h-4 text-muted-steel group-hover:text-electric-cyan" />
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-muted-steel group-hover:text-starlight-white transition-colors">Details</span>
          </div>
          
          {app.url && (
            <a
              href={`https://${app.url}`}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                "relative flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all duration-500 overflow-hidden",
                "bg-white/5 text-starlight-white border border-white/10",
                "hover:scale-105 active:scale-95 group-hover:bg-gradient-to-r group-hover:from-electric-cyan group-hover:to-neon-purple group-hover:text-white group-hover:border-transparent",
                theme.glow
              )}
              onClick={(e) => e.stopPropagation()}
            >
              <span className="relative z-10 flex items-center gap-2">
                Launch <ExternalLink className="w-3.5 h-3.5" />
              </span>
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
