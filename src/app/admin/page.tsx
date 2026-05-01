'use client';

import React from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { DashboardHeader, DashboardStats, DashboardTable } from '@/components/admin/AdminDashboardUI';
import { Loader2, AlertTriangle, RefreshCcw } from 'lucide-react';

export default function AdminPage() {
  const { apps, loading, fetchError, handleDelete, refresh } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="w-8 h-8 text-accent animate-spin" />
          <div className="absolute inset-0 blur-lg bg-accent/20 animate-pulse" />
        </div>
        <p className="text-sm font-medium text-neutral-500">Loading infrastructure data...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-rose-500/5 border border-rose-500/10 rounded-3xl p-8 text-center shadow-2xl animate-in zoom-in-95">
          <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <AlertTriangle className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Data Fetching Failed</h2>
          <p className="text-sm text-neutral-400 mb-8 leading-relaxed">
            {fetchError === 'ERR_DB_INIT_FAIL' 
              ? 'Database connection could not be established. Check your Firebase config.'
              : `We encountered an issue while retrieving your apps: ${fetchError}`}
          </p>
          <button 
            onClick={() => refresh()}
            className="flex items-center justify-center gap-2 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-bold py-4 rounded-2xl transition-all active:scale-95 shadow-lg"
          >
            <RefreshCcw className="w-4 h-4" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <DashboardHeader />
      <DashboardStats apps={apps} />
      <div className="bg-neutral-900/30 backdrop-blur-sm border border-neutral-800/50 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <DashboardTable apps={apps} onDelete={handleDelete} />
      </div>
    </div>
  );
}
