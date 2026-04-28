'use client';

import React, { useEffect, useState } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { AppData } from '@/data/apps';
import Link from 'next/link';
import { Plus, Edit2, Trash2, ExternalLink, Loader2 } from 'lucide-react';



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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24 bg-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-gray-400 mt-1">Manage your Cyber-Cosmos portfolio applications</p>
          </div>
          <Link
            href="/admin/new"
            className="flex items-center space-x-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New App</span>
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl rounded-2xl overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-white/5">
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Name</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Category</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-sm font-semibold text-gray-300 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {apps.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                    No applications found. Click "Add New App" to get started.
                  </td>
                </tr>
              ) : (
                apps.map((app) => (
                  <tr key={app.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-medium text-white">{app.name}</div>
                      <div className="flex space-x-3 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        {app.url && (
                          <a href={`https://${app.url}`} target="_blank" rel="noopener noreferrer" className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center">
                            <ExternalLink className="w-3 h-3 mr-1" /> Visit
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 text-xs rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                        {app.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {app.featured ? (
                        <span className="text-xs text-amber-400 flex items-center">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-2 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                          Featured
                        </span>
                      ) : (
                        <span className="text-xs text-gray-500">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end space-x-2">
                        <Link
                          href={`/admin/edit/${app.id}`}
                          className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(app.id)}
                          className="p-2 rounded-lg hover:bg-red-500/10 text-gray-400 hover:text-red-400 transition-colors"
                          title="Delete"
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
      </div>
    </div>
  );
}
