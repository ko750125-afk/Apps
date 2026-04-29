'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { AppData } from '@/data/apps';
import Link from 'next/link';
import { 
  Plus, 
  Edit2, 
  Trash2, 
  ExternalLink, 
  Loader2, 
  ArrowRightLeft, 
  LayoutGrid, 
  Star, 
  Activity,
  ChevronRight,
  Settings
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, '18_apps_list'), orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      const appsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppData[];
      setApps(appsData);
    } catch (error) {
      console.error('Error fetching apps:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchApps();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this app?')) return;

    try {
      await deleteDoc(doc(db, '18_apps_list', id));
      setApps(apps.filter(app => app.id !== id));
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('Failed to delete app.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="relative">
          <div className="absolute inset-0 bg-cyan-500/20 blur-xl rounded-full animate-pulse" />
          <Loader2 className="relative w-12 h-12 text-cyan-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 md:p-8 pt-24 bg-transparent selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20">
                <Settings className="w-6 h-6 text-cyan-400" />
              </div>
              <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">System <span className="text-cyan-500">Dashboard</span></h1>
            </div>
            <p className="text-gray-500 font-medium tracking-wide uppercase text-xs">Portfolio Management Protocol v2.4</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link
              href="/admin/migrate"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white/5 hover:bg-white/10 text-white px-6 py-3 rounded-2xl border border-white/10 transition-all font-bold text-xs uppercase tracking-widest"
            >
              <ArrowRightLeft className="w-4 h-4 text-cyan-400" />
              <span>Migration Hub</span>
            </Link>
            <Link
              href="/admin/new"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-2xl transition-all shadow-xl shadow-cyan-900/20 font-bold text-xs uppercase tracking-widest"
            >
              <Plus className="w-4 h-4" />
              <span>New Entry</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Live Applications', value: apps.length, icon: LayoutGrid, color: 'text-cyan-400' },
            { label: 'Featured Units', value: apps.filter(a => a.featured).length, icon: Star, color: 'text-amber-400' },
            { label: 'System Uptime', value: '99.9%', icon: Activity, color: 'text-green-400' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="relative group p-6 rounded-3xl bg-black/40 border border-white/10 backdrop-blur-xl overflow-hidden"
            >
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-white/5 rounded-full group-hover:scale-150 transition-transform duration-700" />
              <div className="flex justify-between items-start relative">
                <div>
                  <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-2">{stat.label}</p>
                  <p className="text-3xl font-black text-white tracking-tighter">{stat.value}</p>
                </div>
                <stat.icon className={`w-5 h-5 ${stat.color}`} />
              </div>
            </motion.div>
          ))}
        </div>

        {/* Apps Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative group bg-black/40 border border-white/10 backdrop-blur-2xl rounded-[2.5rem] overflow-hidden shadow-2xl"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.03]">
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Application Record</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Designation</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">Status</th>
                  <th className="px-8 py-6 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] text-right">Operations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-24 text-center">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center border border-dashed border-white/20">
                          <Plus className="w-6 h-6 text-gray-600" />
                        </div>
                        <p className="text-gray-500 font-bold uppercase tracking-widest text-xs italic">No active application nodes detected</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  apps.map((app) => (
                    <tr key={app.id} className="hover:bg-white/[0.02] transition-colors group/row">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center group-hover/row:border-cyan-500/50 transition-colors overflow-hidden">
                            {app.image ? (
                              <img src={app.image} alt="" className="w-full h-full object-cover opacity-50 group-hover/row:opacity-100 transition-opacity" />
                            ) : (
                              <LayoutGrid className="w-4 h-4 text-gray-600 group-hover/row:text-cyan-400" />
                            )}
                          </div>
                          <div>
                            <div className="font-black text-white tracking-tighter group-hover/row:text-cyan-400 transition-colors uppercase italic">{app.name}</div>
                            <div className="flex items-center gap-2 mt-1">
                              {app.url && (
                                <a 
                                  href={`https://${app.url}`} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="text-[10px] font-bold text-gray-500 hover:text-cyan-400 flex items-center gap-1 transition-colors uppercase tracking-widest"
                                >
                                  <ExternalLink className="w-2.5 h-2.5" /> Live Node
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="px-3 py-1 text-[9px] font-black rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase tracking-[0.15em]">
                          {app.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        {app.featured ? (
                          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[9px] font-black text-amber-500 uppercase tracking-[0.1em]">Featured</span>
                          </div>
                        ) : (
                          <span className="text-[9px] font-black text-gray-600 uppercase tracking-[0.1em]">Standard</span>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2">
                          <Link
                            href={`/admin/edit/${app.id}`}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:border-white/20 transition-all active:scale-90"
                            title="Edit Core"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-3 rounded-xl bg-white/5 border border-white/10 text-gray-600 hover:text-red-500 hover:border-red-500/50 transition-all active:scale-90"
                            title="Purge Node"
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
        </motion.div>
      </div>
    </div>
  );
}
