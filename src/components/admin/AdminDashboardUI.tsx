'use client';

import React from 'react';
import Image from 'next/image';
import { AppData } from '@/data/apps';
import Link from 'next/link';
import { 
  Plus, 
  ArrowRightLeft, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  Star, 
  Search,
  Filter,
  MoreVertical,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

/* ─── Header ─── */
export const DashboardHeader = () => (
  <section className="flex flex-col sm:flex-row justify-between items-end gap-6 mb-12">
    <div className="space-y-1">
      <h1 className="text-4xl font-bold text-white tracking-tight">Portfolio Hub</h1>
      <p className="text-neutral-500 font-medium">Control center for your digital ecosystem.</p>
    </div>
    <div className="flex items-center gap-3 w-full sm:w-auto">
      <Link
        href="/admin/migrate"
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3 text-sm font-bold text-neutral-400 bg-neutral-900/50 hover:bg-neutral-800 hover:text-white rounded-2xl border border-neutral-800/50 transition-all active:scale-95"
      >
        <ArrowRightLeft className="w-4 h-4" />
        Migration
      </Link>
      <Link
        href="/admin/new"
        className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-6 py-3 text-sm font-bold text-white bg-accent hover:bg-accent-hover rounded-2xl shadow-lg shadow-accent/20 transition-all active:scale-95"
      >
        <Plus className="w-4 h-4" />
        Add Project
      </Link>
    </div>
  </section>
);

/* ─── Stats ─── */
export const DashboardStats = ({ apps }: { apps: AppData[] }) => {
  const stats = [
    { label: 'Total', value: apps.length, color: 'text-neutral-100', icon: Monitor },
    { label: 'Featured', value: apps.filter(a => a.featured).length, color: 'text-amber-400', icon: Star },
    { label: 'Operational', value: apps.filter(a => a.status !== 'Repair').length, color: 'text-emerald-400', icon: ExternalLink },
    { label: 'Maintenance', value: apps.filter(a => a.status === 'Repair').length, color: 'text-rose-400', icon: ArrowRightLeft },
  ];

  return (
    <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-neutral-900/30 border border-neutral-800/50 rounded-3xl p-6 transition-all hover:bg-neutral-900/50"
        >
          <div className="flex items-center justify-between mb-4">
            <span className="text-[11px] font-bold text-neutral-500 uppercase tracking-widest">{stat.label}</span>
            <stat.icon className={cn("w-4 h-4 opacity-50", stat.color)} />
          </div>
          <p className={cn("text-3xl font-bold tracking-tight", stat.color)}>{stat.value}</p>
        </div>
      ))}
    </section>
  );
};

/* ─── Table ─── */
export const DashboardTable = ({
  apps,
  onDelete,
}: {
  apps: AppData[];
  onDelete: (id: string) => void;
}) => (
  <section className="bg-neutral-900/20 border border-neutral-800/50 rounded-[2.5rem] overflow-hidden">
    <div className="px-8 py-6 border-b border-neutral-800/50 flex items-center justify-between">
      <h2 className="text-xl font-bold text-white">Project Registry</h2>
      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input 
            type="text" 
            placeholder="Search projects..." 
            className="bg-neutral-950 border border-neutral-800 rounded-xl pl-10 pr-4 py-2 text-sm text-neutral-300 focus:outline-none focus:border-accent/50 transition-all w-64"
          />
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] border-b border-neutral-800/50">
            <th className="px-8 py-5">Application</th>
            <th className="px-8 py-5">Deployment</th>
            <th className="px-8 py-5">Status</th>
            <th className="px-8 py-5 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-neutral-800/30">
          {apps.length === 0 ? (
            <tr>
              <td colSpan={4} className="px-8 py-32 text-center text-neutral-500">
                <p className="text-lg font-medium mb-4">No projects in registry.</p>
                <Link href="/admin/new" className="text-accent hover:underline font-bold">Initiate first project</Link>
              </td>
            </tr>
          ) : (
            apps.map((app) => (
              <tr key={app.id} className="group hover:bg-white/[0.02] transition-colors">
                <td className="px-8 py-6">
                  <div className="flex items-center gap-5">
                    <div className="relative w-14 h-9 rounded-xl overflow-hidden bg-neutral-800 border border-neutral-700/50 flex-shrink-0">
                      {app.image && (
                        <Image src={app.image} alt="" fill className="object-cover" unoptimized />
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-neutral-100">{app.name}</span>
                        {app.featured && <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />}
                      </div>
                      <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{app.category}</p>
                    </div>
                  </div>
                </td>
                <td className="px-8 py-6">
                  {app.url ? (
                    <a 
                      href={app.url.startsWith('http') ? app.url : `https://${app.url}`}
                      target="_blank"
                      className="text-xs font-bold text-neutral-400 hover:text-accent transition-colors flex items-center gap-1.5"
                    >
                      Live View <ExternalLink className="w-3 h-3" />
                    </a>
                  ) : (
                    <span className="text-xs text-neutral-700 italic">Offline</span>
                  )}
                </td>
                <td className="px-8 py-6">
                  <div className={cn(
                    "inline-flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                    app.status === 'Repair' ? "bg-rose-500/10 text-rose-400" : "bg-emerald-500/10 text-emerald-400"
                  )}>
                    <div className={cn("w-1 h-1 rounded-full", app.status === 'Repair' ? "bg-rose-500 animate-pulse" : "bg-emerald-500")} />
                    {app.status === 'Repair' ? 'Maintenance' : 'Active'}
                  </div>
                </td>
                <td className="px-8 py-6 text-right">
                  <div className="flex justify-end gap-2">
                    <Link
                      href={`/admin/edit/${app.id}`}
                      className="p-2.5 rounded-xl text-neutral-500 hover:text-white hover:bg-neutral-800 transition-all"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    <button
                      onClick={() => onDelete(app.id)}
                      className="p-2.5 rounded-xl text-neutral-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  </section>
);
