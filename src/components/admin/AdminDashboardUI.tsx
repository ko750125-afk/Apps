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
  Star, 
  Search,
  Monitor,
  ArrowRightLeft,
  LayoutGrid,
  CheckCircle2,
  Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Stats Card ─── */
const StatCard = ({ label, value, icon: Icon }: { label: string; value: number; icon: any }) => (
  <div className="bg-[#0A0A0A] border border-neutral-900 rounded-3xl p-6 relative overflow-hidden group">
    <div className="flex justify-between items-start mb-4">
      <span className="text-[11px] font-black text-blue-500 uppercase tracking-widest">{label}</span>
      <Icon className="w-5 h-5 text-neutral-700" />
    </div>
    <div className="text-4xl font-black text-white">{value}</div>
  </div>
);

export const DashboardStats = ({ apps }: { apps: AppData[] }) => {
  const total = apps.length;
  const featured = apps.filter(a => a.featured).length;
  const operational = apps.filter(a => a.status !== 'Repair').length;
  const maintenance = apps.filter(a => a.status === 'Repair').length;

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      <StatCard label="TOTAL" value={total} icon={Monitor} />
      <StatCard label="FEATURED" value={featured} icon={Star} />
      <StatCard label="OPERATIONAL" value={operational} icon={ExternalLink} />
      <StatCard label="MAINTENANCE" value={maintenance} icon={ArrowRightLeft} />
    </section>
  );
};

/* ─── Header ─── */
export const DashboardHeader = () => (
  <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
    <div className="space-y-1">
      <h1 className="text-4xl font-black text-white tracking-tight">Portfolio Hub</h1>
      <p className="text-neutral-500 text-sm font-medium">Control center for your digital ecosystem.</p>
    </div>

    <div className="flex items-center gap-3">
      <Link
        href="/admin/migration"
        className="flex items-center gap-2 px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 rounded-xl text-sm font-bold text-white transition-all"
      >
        <ArrowRightLeft className="w-4 h-4" />
        Migration
      </Link>
      <Link
        href="/admin/new"
        className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-500 rounded-xl text-sm font-black text-white transition-all shadow-lg shadow-blue-600/20"
      >
        <Plus className="w-5 h-5" />
        Add Project
      </Link>
    </div>
  </section>
);

/* ─── Project Registry Table ─── */
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
}) => (
  <section className="bg-[#0A0A0A] border border-neutral-900 rounded-[2rem] overflow-hidden">
    {/* Table Header Area */}
    <div className="p-8 border-b border-neutral-900 flex flex-col md:flex-row justify-between items-center gap-6">
      <div className="relative">
        <h2 className="text-xl font-black text-white inline-block relative z-10">Project Registry</h2>
        <div className="absolute -inset-x-2 inset-y-1 bg-blue-600/20 -z-0 rounded" />
      </div>

      <div className="relative w-full md:w-80 group">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
        <input 
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search projects..."
          className="w-full bg-black border border-neutral-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-neutral-700 focus:outline-none focus:border-blue-500/50 transition-all"
        />
      </div>
    </div>

    {/* Table Content */}
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-neutral-900">
            <th className="text-left py-6 px-8">
              <span className="px-2 py-1 bg-blue-600/20 text-blue-500 text-[10px] font-black tracking-widest rounded uppercase">Application</span>
            </th>
            <th className="text-left py-6 px-8">
              <span className="px-2 py-1 bg-blue-600/20 text-blue-500 text-[10px] font-black tracking-widest rounded uppercase">Deployment</span>
            </th>
            <th className="text-left py-6 px-8">
              <span className="px-2 py-1 bg-blue-600/20 text-blue-500 text-[10px] font-black tracking-widest rounded uppercase">Status</span>
            </th>
            <th className="text-right py-6 px-8">
              <span className="px-2 py-1 bg-blue-600/20 text-blue-500 text-[10px] font-black tracking-widest rounded uppercase">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-900/50">
          <AnimatePresence mode="popLayout">
            {apps.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-20 text-center text-neutral-600 font-medium">
                  No projects found.
                </td>
              </tr>
            ) : (
              apps.map((app) => (
                <motion.tr 
                  key={app.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="group hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-6 px-8">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-neutral-900 border border-neutral-800 overflow-hidden relative flex-shrink-0">
                        {app.image ? (
                          <Image src={app.image} alt="" fill className="object-cover" unoptimized />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <LayoutGrid className="w-5 h-5 text-neutral-700" />
                          </div>
                        )}
                      </div>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <span className="font-black text-white group-hover:text-blue-500 transition-colors">{app.name}</span>
                          {app.featured && <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />}
                        </div>
                        <span className="text-[10px] font-black text-blue-500 uppercase tracking-wider bg-blue-600/10 px-1.5 py-0.5 rounded w-fit mt-1">
                          {app.category}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="py-6 px-8">
                    {app.url ? (
                      <a 
                        href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-sm font-bold text-blue-500 hover:text-blue-400 transition-colors"
                      >
                        Live View
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    ) : (
                      <span className="text-neutral-700 text-sm font-medium">N/A</span>
                    )}
                  </td>
                  <td className="py-6 px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-full">
                      <div className={cn(
                        "w-1.5 h-1.5 rounded-full",
                        app.status === 'Repair' ? "bg-rose-500 animate-pulse" : "bg-emerald-500"
                      )} />
                      <span className={cn(
                        "text-[10px] font-black uppercase tracking-widest",
                        app.status === 'Repair' ? "text-rose-500" : "text-emerald-500"
                      )}>
                        {app.status === 'Repair' ? 'Maintenance' : 'Active'}
                      </span>
                    </div>
                  </td>
                  <td className="py-6 px-8 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/admin/edit/${app.id}`}
                        className="p-2 text-neutral-500 hover:text-white hover:bg-neutral-800 rounded-lg transition-all"
                        title="Edit"
                      >
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => onDelete(app.id)}
                        className="p-2 text-neutral-500 hover:text-rose-500 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </AnimatePresence>
        </tbody>
      </table>
    </div>
  </section>
);
