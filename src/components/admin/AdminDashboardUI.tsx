'use client';

import React from 'react';
import Image from 'next/image';
import { AppData } from '@/data/apps';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Search,
  LayoutGrid,
  ArrowRightLeft,
  Settings,
  Database,
  Star,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn, getAppImage } from '@/lib/utils';

/* ─── Header ─── */
/* ─── Sub-Components ─── */

const StatCard = ({ label, value, icon: Icon, color }: { label: string; value: number | string; icon: any; color: string }) => (
  <div className="bg-neutral-900/40 border border-neutral-800 p-6 rounded-3xl backdrop-blur-sm group hover:border-neutral-700 transition-all">
    <div className="flex items-center gap-4">
      <div className={cn("p-3 rounded-2xl", color)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-2xl font-black text-white">{value}</p>
      </div>
    </div>
  </div>
);

const ProjectDesktopRow = ({ 
  app, 
  onDelete, 
  confirmDeleteId, 
  setConfirmDeleteId 
}: { 
  app: AppData; 
  onDelete: (id: string) => void; 
  confirmDeleteId: string | null; 
  setConfirmDeleteId: (id: string | null) => void;
}) => (
  <motion.tr 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="group hover:bg-white/[0.01] transition-colors border-b border-neutral-800/50 last:border-0"
  >
    <td className="py-6 px-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl bg-neutral-800 border border-neutral-700 overflow-hidden relative flex-shrink-0 shadow-inner">
          {(() => {
            const displayImg = getAppImage(app);
            return displayImg ? (
              <Image src={displayImg} alt="" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <LayoutGrid className="w-5 h-5 text-neutral-600" />
              </div>
            );
          })()}
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-white group-hover:text-blue-400 transition-colors">{app.name}</span>
          <span className="text-[11px] text-neutral-500 font-medium">{app.category}</span>
        </div>
      </div>
    </td>
    <td className="py-6 px-8">
      <span className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
        app.status === 'Repair' 
          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      )}>
        {app.status === 'Repair' ? '점검중' : '활성'}
      </span>
    </td>
    <td className="py-6 px-8 text-right">
      <ActionButtons 
        app={app} 
        onDelete={onDelete} 
        confirmDeleteId={confirmDeleteId} 
        setConfirmDeleteId={setConfirmDeleteId} 
      />
    </td>
  </motion.tr>
);

const ProjectMobileCard = ({ 
  app, 
  onDelete, 
  confirmDeleteId, 
  setConfirmDeleteId 
}: { 
  app: AppData; 
  onDelete: (id: string) => void; 
  confirmDeleteId: string | null; 
  setConfirmDeleteId: (id: string | null) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="p-6 border-b border-neutral-800/50 last:border-0 flex flex-col gap-5"
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-neutral-800 border border-neutral-700 overflow-hidden relative flex-shrink-0 shadow-xl">
          {(() => {
            const displayImg = getAppImage(app);
            return displayImg ? (
              <Image src={displayImg} alt="" fill className="object-cover" unoptimized />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <LayoutGrid className="w-6 h-6 text-neutral-600" />
              </div>
            );
          })()}
        </div>
        <div className="flex flex-col">
          <span className="text-lg font-bold text-white">{app.name}</span>
          <span className="text-xs text-neutral-500 font-medium">{app.category}</span>
        </div>
      </div>
      <span className={cn(
        "inline-flex items-center px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider h-fit",
        app.status === 'Repair' 
          ? "bg-rose-500/10 text-rose-500 border border-rose-500/20" 
          : "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
      )}>
        {app.status === 'Repair' ? '점검중' : '활성'}
      </span>
    </div>
    
    <div className="flex justify-end pt-2">
      <ActionButtons 
        app={app} 
        onDelete={onDelete} 
        confirmDeleteId={confirmDeleteId} 
        setConfirmDeleteId={setConfirmDeleteId} 
        fullWidth
      />
    </div>
  </motion.div>
);

const ActionButtons = ({ 
  app, 
  onDelete, 
  confirmDeleteId, 
  setConfirmDeleteId,
  fullWidth = false
}: { 
  app: AppData; 
  onDelete: (id: string) => void; 
  confirmDeleteId: string | null; 
  setConfirmDeleteId: (id: string | null) => void;
  fullWidth?: boolean;
}) => (
  <div className={cn("flex items-center justify-end gap-2", fullWidth && "w-full")}>
    <AnimatePresence mode="wait">
      {confirmDeleteId === app.id ? (
        <motion.div 
          key="confirm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="flex items-center gap-2 bg-rose-500/10 border border-rose-500/20 px-3 py-1.5 rounded-xl w-full md:w-auto justify-center"
        >
          <span className="text-[10px] font-bold text-rose-500 uppercase">정말 삭제?</span>
          <button 
            onClick={() => { onDelete(app.id); setConfirmDeleteId(null); }}
            className="px-4 py-1.5 bg-rose-500 text-white text-[10px] font-black rounded-lg hover:bg-rose-600 transition-colors"
          >
            YES
          </button>
          <button 
            onClick={() => setConfirmDeleteId(null)}
            className="px-4 py-1.5 bg-neutral-800 text-white text-[10px] font-black rounded-lg hover:bg-neutral-700 transition-colors"
          >
            NO
          </button>
        </motion.div>
      ) : (
        <motion.div 
          key="actions" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          className={cn("flex items-center gap-2", fullWidth && "w-full")}
        >
          <Link
            href={`/admin/edit/${app.id}`}
            className={cn(
              "px-6 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white text-xs font-bold rounded-xl transition-all border border-neutral-700 flex items-center justify-center gap-2",
              fullWidth && "flex-1"
            )}
          >
            <Pencil className="w-3 h-3" />
            수정
          </Link>
          <button
            onClick={() => setConfirmDeleteId(app.id)}
            className={cn(
              "px-6 py-2.5 bg-rose-500/10 hover:bg-rose-500 text-rose-500 hover:text-white text-xs font-bold rounded-xl transition-all border border-rose-500/20 hover:border-rose-500 flex items-center justify-center gap-2",
              fullWidth && "flex-1"
            )}
          >
            <Trash2 className="w-3 h-3" />
            삭제
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

/* ─── Main UI Components ─── */

export const AdminDashboardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-12">
    {children}
  </div>
);

export const DashboardHeader = () => (
  <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
        프로젝트 관리
      </h1>
    </div>
    <Link 
      href="/admin/new" 
      className="w-full md:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-2xl font-bold text-sm transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-[0.98]"
    >
      <Plus className="w-5 h-5" />
      새 프로젝트 추가
    </Link>
  </header>
);

export const QuickStats = ({ apps }: { apps: AppData[] }) => {
  const stats = [
    { label: '전체 프로젝트', value: apps.length, icon: LayoutGrid, color: 'bg-blue-500/10 text-blue-500' },
    { label: '추천 프로젝트', value: apps.filter(a => a.featured).length, icon: Star, color: 'bg-amber-500/10 text-amber-500' },
    { label: '활성 서비스', value: apps.filter(a => a.status === 'Exhibit').length, icon: CheckCircle, color: 'bg-emerald-500/10 text-emerald-500' },
    { label: '점검 중', value: apps.filter(a => a.status === 'Repair').length, icon: AlertCircle, color: 'bg-rose-500/10 text-rose-500' },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map(stat => <StatCard key={stat.label} {...stat} />)}
    </div>
  );
};

export const DashboardTable = ({
  apps,
  searchTerm,
  setSearchTerm,
  onDelete,
}: {
  apps: AppData[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  return (
    <section className="bg-neutral-900/40 border border-neutral-800 rounded-[2rem] md:rounded-[2.5rem] overflow-hidden backdrop-blur-md shadow-2xl">
      {/* Table Header Area */}
      <div className="p-6 md:p-8 border-b border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
        <div>
          <h2 className="text-xl font-bold text-white">프로젝트 리스트</h2>
          <p className="text-xs text-neutral-500 font-medium mt-1">전체 {apps.length}개의 아이템</p>
        </div>
        <div className="relative w-full md:w-80 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
          <input 
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="프로젝트 검색..."
            className="w-full bg-black/40 border border-neutral-800 rounded-2xl py-3.5 pl-12 pr-5 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/10 transition-all"
          />
        </div>
      </div>

      <div className="w-full">
        {/* Desktop View Table */}
        <table className="w-full border-collapse hidden md:table">
          <thead>
            <tr className="bg-white/[0.02]">
              <th className="text-left py-5 px-8 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-800">프로젝트 정보</th>
              <th className="text-left py-5 px-8 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-800">상태</th>
              <th className="text-right py-5 px-8 text-neutral-500 text-[10px] font-black uppercase tracking-[0.2em] border-b border-neutral-800">매니지먼트</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-800/50">
            <AnimatePresence mode="popLayout">
              {apps.map((app) => (
                <ProjectDesktopRow 
                  key={app.id} 
                  app={app} 
                  onDelete={onDelete} 
                  confirmDeleteId={confirmDeleteId} 
                  setConfirmDeleteId={setConfirmDeleteId} 
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {/* Mobile View List (Div-based) */}
        <div className="md:hidden flex flex-col">
          <AnimatePresence mode="popLayout">
            {apps.length === 0 ? (
              <div className="py-20 text-center text-neutral-600 font-medium font-mono text-xs uppercase tracking-widest">
                NO PROJECTS FOUND
              </div>
            ) : (
              apps.map((app) => (
                <ProjectMobileCard 
                  key={app.id} 
                  app={app} 
                  onDelete={onDelete} 
                  confirmDeleteId={confirmDeleteId} 
                  setConfirmDeleteId={setConfirmDeleteId} 
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
