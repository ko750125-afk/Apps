'use client';

import React from 'react';
import Image from 'next/image';
import { AppData } from '@/data/apps';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import { 
  Plus, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Star, 
  Search,
  LayoutGrid,
  Image as ImageIcon,
  Rocket,
  Wrench,
  Trophy,
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Stats ─── */
const StatCard = ({ label, value, icon: Icon, color, delay }: { label: string; value: number; icon: LucideIcon; color: string; delay: number }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="relative bg-neutral-900/40 backdrop-blur-xl border border-neutral-800/50 rounded-[2.5rem] p-8 flex flex-col gap-4 shadow-2xl group hover:border-accent/30 transition-all duration-500 hover:-translate-y-1 overflow-hidden"
  >
    <div className={cn("absolute -right-4 -top-4 w-24 h-24 blur-[60px] rounded-full opacity-20 transition-all duration-700 group-hover:scale-150", color.replace('bg-', 'bg-'))} />
    
    <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center border shadow-inner transition-transform group-hover:rotate-12 duration-500 relative z-10", color)}>
      <Icon className="w-5 h-5" />
    </div>
    <div className="relative z-10">
      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
    </div>
  </motion.div>
);

export const DashboardStats = ({ apps }: { apps: AppData[] }) => {
  const total = apps.length;
  const featured = apps.filter(a => a.featured).length;
  const maintenance = apps.filter(a => a.status === 'Repair').length;

  return (
    <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
      <StatCard 
        label="Total Projects" 
        value={total} 
        icon={Rocket} 
        color="bg-accent/10 border-accent/20 text-accent" 
        delay={0.1}
      />
      <StatCard 
        label="Featured Apps" 
        value={featured} 
        icon={Trophy} 
        color="bg-amber-500/10 border-amber-500/20 text-amber-500" 
        delay={0.2}
      />
      <StatCard 
        label="Maintenance" 
        value={maintenance} 
        icon={Wrench} 
        color="bg-rose-500/10 border-rose-500/20 text-rose-500" 
        delay={0.3}
      />
    </section>
  );
};

/* ─── Header ─── */
export const DashboardHeader = ({ 
  searchTerm, 
  setSearchTerm 
}: { 
  searchTerm: string; 
  setSearchTerm: (val: string) => void;
}) => (
  <section className="flex flex-col lg:flex-row justify-between items-start lg:items-end gap-10 mb-16">
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-accent mb-2">
        <div className="w-10 h-10 bg-accent/10 rounded-2xl flex items-center justify-center border border-accent/20">
          <LayoutGrid className="w-5 h-5" />
        </div>
        <span className="text-xs font-black uppercase tracking-[0.3em]">Management Hub</span>
      </div>
      <h1 className="text-6xl font-black text-white tracking-tight leading-tight">프로젝트 센터</h1>
      <p className="text-neutral-500 text-xl font-medium max-w-xl">번거로운 설정 없이, 당신의 앱을 직관적으로 관리하세요.</p>
    </div>

    <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
      <div className="relative w-full sm:w-96 group">
        <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-600 group-focus-within:text-accent transition-colors" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="어떤 프로젝트를 찾으시나요?"
          className="w-full bg-neutral-900/50 border border-neutral-800/80 rounded-3xl py-5 pl-16 pr-6 text-base text-white placeholder:text-neutral-600 focus:outline-none focus:ring-4 focus:ring-accent/10 focus:border-accent/40 transition-all shadow-2xl"
        />
      </div>
      <Link
        href="/admin/new"
        className="flex items-center justify-center gap-3 px-12 py-5 text-lg font-black text-white bg-accent hover:bg-accent-hover rounded-[1.5rem] transition-all active:scale-95 shadow-[0_20px_50px_rgba(59,130,246,0.3)] w-full sm:w-auto whitespace-nowrap group"
      >
        <Plus className="w-6 h-6 group-hover:rotate-90 transition-transform duration-500" />
        새 앱 등록
      </Link>
    </div>
  </section>
);

/* ─── Grid ─── */
export const DashboardTable = ({
  apps,
  onDelete,
}: {
  apps: AppData[];
  onDelete: (id: string) => void;
}) => (
  <section className="relative min-h-[400px]">
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
      <AnimatePresence mode="popLayout">
        {apps.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="col-span-full py-48 bg-neutral-900/20 rounded-[3rem] border border-dashed border-neutral-800 flex flex-col items-center justify-center text-center"
          >
            <div className="relative mb-10">
              <div className="w-32 h-32 bg-neutral-900 rounded-[3rem] flex items-center justify-center border border-neutral-800 shadow-2xl relative z-10">
                <Search className="w-14 h-14 text-neutral-800" />
              </div>
              <div className="absolute inset-0 bg-accent/20 blur-[80px] rounded-full scale-150 opacity-30 animate-pulse" />
            </div>
            <h3 className="text-3xl font-black text-white mb-3">검색 결과가 없습니다</h3>
            <p className="text-neutral-500 text-lg font-medium">검색어를 확인하거나 새로운 앱을 추가해보세요.</p>
          </motion.div>
        ) : (
          apps.map((app, index) => (
            <motion.div 
              key={app.id} 
              layout
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, delay: index * 0.05, ease: [0.23, 1, 0.32, 1] }}
              className="group relative bg-neutral-900/30 backdrop-blur-md border border-neutral-800/60 rounded-[2.5rem] overflow-hidden hover:border-accent/40 hover:bg-neutral-900/50 transition-all duration-700 shadow-xl"
            >
              {/* Image Section */}
              <div className="aspect-[16/9] relative overflow-hidden bg-neutral-950">
                {app.image ? (
                  <Image src={app.image} alt="" fill className="object-cover group-hover:scale-105 transition-transform duration-1000 ease-out" unoptimized />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-neutral-900">
                    <ImageIcon className="w-12 h-12 text-neutral-800" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                
                {/* Status Badge */}
                <div className="absolute top-6 left-6">
                  <div className={cn(
                    "flex items-center gap-3 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-widest backdrop-blur-xl border shadow-2xl",
                    app.status === 'Repair' 
                      ? "bg-rose-500/10 text-rose-500 border-rose-500/20" 
                      : "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  )}>
                    <div className={cn("w-2 h-2 rounded-full", app.status === 'Repair' ? "bg-rose-500 animate-pulse" : "bg-emerald-500")} />
                    {app.status === 'Repair' ? 'Maintenance' : 'Live'}
                  </div>
                </div>

                {/* Featured Badge */}
                {app.featured && (
                  <div className="absolute top-6 right-6 w-10 h-10 bg-amber-500/20 backdrop-blur-xl border border-amber-500/30 rounded-2xl flex items-center justify-center text-amber-500 shadow-2xl">
                    <Star className="w-5 h-5 fill-amber-500" />
                  </div>
                )}
              </div>

              {/* Info Section */}
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-accent uppercase tracking-widest">{app.category}</span>
                    <h3 className="text-3xl font-black text-white tracking-tighter line-clamp-1">{app.name}</h3>
                  </div>
                </div>
                
                <p className="text-neutral-500 text-base font-medium line-clamp-2 h-12 mb-8 leading-relaxed">
                  {app.description}
                </p>

                {/* Actions */}
                <div className="flex items-center gap-3 border-t border-neutral-800/50 pt-8 mt-2">
                  <Link
                    href={`/admin/edit/${app.id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-4 bg-white/5 hover:bg-white/10 border border-white/5 rounded-2xl text-sm font-bold text-white transition-all active:scale-95 group/btn"
                  >
                    <Pencil className="w-4 h-4 text-neutral-500 group-hover/btn:text-accent transition-colors" />
                    수정하기
                  </Link>
                  <button
                    onClick={() => onDelete(app.id)}
                    className="w-14 h-14 flex items-center justify-center bg-rose-500/5 hover:bg-rose-500/10 border border-rose-500/10 hover:border-rose-500/20 rounded-2xl text-rose-500 transition-all active:scale-90"
                    title="삭제"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                  {app.url && (
                    <a
                      href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-14 h-14 flex items-center justify-center bg-accent/5 hover:bg-accent/10 border border-accent/10 hover:border-accent/20 rounded-2xl text-accent transition-all active:scale-90"
                      title="방문"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))
        )}
      </AnimatePresence>
    </div>
  </section>
);
