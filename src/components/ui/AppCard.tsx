'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Code2 } from 'lucide-react';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';

interface AppCardProps {
  app: AppData;
  index: number;
}

const GithubIcon = ({ className }: { className?: string }) => (
  <svg
    role="img"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="currentColor"
  >
    <title>GitHub</title>
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
);

export default function AppCard({ app, index }: AppCardProps) {
  const categoryColor: Record<string, string> = {
    'AI & Smart': 'text-neon-purple shadow-[0_0_10px_rgba(138,43,226,0.5)]',
    'Productivity': 'text-electric-cyan shadow-[0_0_10px_rgba(0,240,255,0.5)]',
    'Utility & Tools': 'text-hologram-blue shadow-[0_0_10px_rgba(77,159,255,0.5)]',
    'Games & Edu': 'text-ai-green shadow-[0_0_10px_rgba(0,255,157,0.5)]',
    'Finance': 'text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.5)]',
    'Others': 'text-muted-steel shadow-[0_0_10px_rgba(148,163,184,0.5)]',
  };

  const categoryBorder: Record<string, string> = {
    'AI & Smart': 'group-hover:border-neon-purple/50',
    'Productivity': 'group-hover:border-electric-cyan/50',
    'Utility & Tools': 'group-hover:border-hologram-blue/50',
    'Games & Edu': 'group-hover:border-ai-green/50',
    'Finance': 'group-hover:border-yellow-400/50',
    'Others': 'group-hover:border-muted-steel/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.08,
        ease: [0.23, 1, 0.32, 1] 
      }}
      whileHover={{ 
        y: -10, 
        scale: 1.05,
        rotateX: 2,
        rotateY: -2,
        transition: { duration: 0.3 }
      }}
      className={cn(
        "group relative flex flex-col justify-between p-7 rounded-3xl overflow-hidden cursor-pointer h-full min-h-[300px]",
        "glass-panel border-white/5 transition-all duration-500",
        "bg-space-navy/30 backdrop-blur-xl shimmer",
        categoryBorder[app.category] || 'group-hover:border-white/20'
      )}
    >
      {/* Animated Border Gradient */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
        <div className="absolute inset-[-2px] bg-gradient-to-r from-electric-cyan/50 via-neon-purple/50 to-electric-cyan/50 animate-pulse blur-[1px]" />
      </div>

      {/* Nebula Background */}
      <div className="absolute inset-0 z-0 opacity-10 group-hover:opacity-30 transition-opacity duration-700 pointer-events-none">
        <div className="absolute -inset-[100%] bg-[radial-gradient(circle_at_50%_50%,#00f0ff_0%,transparent_60%)] blur-3xl animate-pulse" />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 mix-blend-overlay" />
      </div>

      <div className="relative z-10">
        <div className="flex justify-between items-start mb-5">
          <div className={cn(
            "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-[0.25em] bg-white/5 border border-white/10",
            categoryColor[app.category] || categoryColor['Others']
          )}>
            {app.category}
          </div>
        </div>
        
        <h3 className={cn(
          "font-display font-bold text-starlight-white group-hover:text-electric-cyan transition-colors text-2xl mb-3 leading-tight"
        )}>
          {app.name}
        </h3>
        
        {app.description && (
          <p className="text-sm text-muted-steel line-clamp-3 mb-6 font-light leading-relaxed group-hover:text-starlight-white/80 transition-colors">
            {app.description}
          </p>
        )}
      </div>

      <div className="relative z-10 flex items-center justify-between mt-auto pt-6 border-t border-white/5">
        <div className="flex items-center gap-2 text-muted-steel group-hover:text-electric-cyan transition-colors">
          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-electric-cyan/30">
            <Code2 className="w-4 h-4" />
          </div>
          <span className="text-[10px] font-medium tracking-widest uppercase">Explore</span>
        </div>
        
        {app.url && (
          <a
            href={`https://${app.url}`}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all duration-300",
              "bg-electric-cyan/10 text-electric-cyan border border-electric-cyan/20",
              "hover:bg-electric-cyan hover:text-space-black hover:shadow-[0_0_20px_rgba(0,240,255,0.5)]"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            Launch <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </motion.div>
  );
}
