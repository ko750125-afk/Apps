'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { cn } from '@/lib/utils';
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
  Settings,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminPage() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchApps = async () => {
    setLoading(true);
    try {
      if (!db) {
        setLoading(false);
        return;
      }
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
    fetchApps();
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
      <div className="min-h-screen flex items-center justify-center bg-[#fbfbfd]">
        <Loader2 className="w-10 h-10 text-[#0066cc] animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 md:p-12 pt-24 bg-[#fbfbfd]">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6"
        >
          <div>
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2.5 rounded-2xl bg-white shadow-sm border border-[#e5e5ea]">
                <Settings className="w-5 h-5 text-[#1d1d1f]" />
              </div>
              <h1 className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">Admin Dashboard</h1>
            </div>
            <p className="text-[#86868b] font-medium text-sm">Manage your application portfolio</p>
          </div>

          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <Link
              href="/admin/migrate"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-white hover:bg-[#f5f5f7] text-[#1d1d1f] px-6 py-2.5 rounded-2xl border border-[#e5e5ea] shadow-sm transition-all font-semibold text-sm"
            >
              <ArrowRightLeft className="w-4 h-4" />
              <span>Migrate</span>
            </Link>
            <Link
              href="/admin/new"
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 bg-[#0066cc] hover:bg-[#0077ed] text-white px-6 py-2.5 rounded-2xl transition-all shadow-md shadow-blue-500/10 font-semibold text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New App</span>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Apps', value: apps.length, icon: LayoutGrid, color: 'text-blue-500', bg: 'bg-blue-50' },
            { label: 'Featured', value: apps.filter(a => a.featured).length, icon: Star, color: 'text-amber-500', bg: 'bg-amber-50' },
            { label: 'In Repair', value: apps.filter(a => a.status === 'Repair').length, icon: Activity, color: 'text-red-500', bg: 'bg-red-50' },
          ].map((stat, i) => (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="p-6 rounded-3xl bg-white border border-[#f5f5f7] shadow-[0_4px_24px_rgba(0,0,0,0.02)]"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-[11px] font-bold text-[#86868b] uppercase tracking-wider mb-2">{stat.label}</p>
                  <p className="text-3xl font-semibold text-[#1d1d1f] tracking-tight">{stat.value}</p>
                </div>
                <div className={cn("p-2 rounded-xl", stat.bg)}>
                  <stat.icon className={cn("w-4 h-4", stat.color)} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Apps Table */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-[#f5f5f7] rounded-[2rem] overflow-hidden shadow-[0_8px_40px_rgba(0,0,0,0.04)]"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#fbfbfd] border-b border-[#f5f5f7]">
                  <th className="px-8 py-5 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Application</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Category</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-[#86868b] uppercase tracking-wider">Status</th>
                  <th className="px-8 py-5 text-[11px] font-bold text-[#86868b] uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#f5f5f7]">
                {apps.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-20 text-center">
                      <p className="text-[#86868b] font-medium italic">No applications found.</p>
                    </td>
                  </tr>
                ) : (
                  apps.map((app) => (
                    <tr key={app.id} className="hover:bg-[#fbfbfd] transition-colors group">
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-8 rounded-lg bg-[#f5f5f7] border border-[#e5e5ea] overflow-hidden flex items-center justify-center">
                            {app.image ? (
                              <img src={app.image} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <LayoutGrid className="w-4 h-4 text-[#d2d2d7]" />
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-[#1d1d1f]">{app.name}</div>
                            {app.url && (
                              <div className="text-[11px] text-[#86868b] flex items-center gap-1 mt-0.5">
                                <ExternalLink className="w-2.5 h-2.5" />
                                {app.url}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className="text-xs font-medium text-[#1d1d1f] bg-[#f5f5f7] px-2.5 py-1 rounded-full border border-[#e5e5ea]">
                          {app.category}
                        </span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          {app.status === 'Repair' ? (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-50 text-red-600 text-[10px] font-bold uppercase tracking-wider border border-red-100">
                              <EyeOff className="w-3 h-3" />
                              Repair
                            </span>
                          ) : (
                            <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider border border-green-100">
                              <Eye className="w-3 h-3" />
                              Exhibit
                            </span>
                          )}
                          {app.featured && (
                            <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/admin/edit/${app.id}`}
                            className="p-2.5 rounded-xl bg-white border border-[#e5e5ea] text-[#1d1d1f] hover:bg-[#f5f5f7] transition-all shadow-sm"
                          >
                            <Edit2 className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(app.id)}
                            className="p-2.5 rounded-xl bg-white border border-[#e5e5ea] text-red-500 hover:bg-red-50 hover:border-red-100 transition-all shadow-sm"
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
