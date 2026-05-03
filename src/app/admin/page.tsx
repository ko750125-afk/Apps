"use client";

import React from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { DashboardHeader, DashboardTable, DashboardStats } from '@/components/admin/AdminDashboardUI';
import { Loader2, AlertTriangle, RefreshCcw } from 'lucide-react';

export default function AdminPage() {
  const { apps, allApps, loading, fetchError, searchTerm, setSearchTerm, handleDelete, refresh } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <div className="relative">
          <Loader2 className="w-10 h-10 text-accent animate-spin" />
          <div className="absolute inset-0 blur-xl bg-accent/30 animate-pulse" />
        </div>
        <p className="text-sm font-black text-neutral-500 uppercase tracking-widest">Loading Infrastructure...</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8">
        <div className="w-full max-w-md bg-rose-500/5 border border-rose-500/10 rounded-[2.5rem] p-10 text-center shadow-2xl animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-rose-500/10 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-inner">
            <AlertTriangle className="w-10 h-10 text-rose-500" />
          </div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight">Data Access Failed</h2>
          <p className="text-base text-neutral-500 mb-10 leading-relaxed font-medium">
            {fetchError === 'ERR_DB_INIT_FAIL' 
              ? '파이어베이스 데이터베이스 연결에 실패했습니다. 설정을 확인해주세요.'
              : `데이터를 불러오는 중 오류가 발생했습니다: ${fetchError}`}
          </p>
          <button 
            onClick={() => refresh()}
            className="flex items-center justify-center gap-3 w-full bg-neutral-800 hover:bg-neutral-700 text-white font-black py-5 rounded-2xl transition-all active:scale-95 shadow-xl"
          >
            <RefreshCcw className="w-5 h-5" />
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <DashboardHeader />
      <DashboardStats apps={allApps} />
      <DashboardTable 
        apps={apps} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onDelete={handleDelete} 
      />
    </div>
  );
}
