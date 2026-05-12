"use client";

import React from 'react';
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { DashboardHeader, DashboardTable, QuickStats, AdminDashboardContent } from '@/components/admin/AdminDashboardUI';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { apps, allApps, loading, fetchError, searchTerm, setSearchTerm, handleDelete, handleSeed, refresh } = useAdminDashboard();

  if (loading) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
        <p className="text-sm text-zinc-500">불러오는 중…</p>
      </div>
    );
  }

  if (fetchError) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-900/30 p-8 text-center">
          <h2 className="text-base font-semibold text-zinc-100">데이터를 불러오지 못했습니다</h2>
          <p className="mt-2 text-sm text-zinc-500 leading-relaxed">
            {fetchError === 'ERR_DB_INIT_FAIL'
              ? 'Firebase 연결을 확인해 주세요.'
              : String(fetchError)}
          </p>
          <button
            type="button"
            onClick={() => refresh()}
            className="mt-6 inline-flex h-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <AdminDashboardContent>
      <DashboardHeader />
      <QuickStats apps={allApps} />
      <DashboardTable 
        apps={apps} 
        searchTerm={searchTerm} 
        setSearchTerm={setSearchTerm} 
        onDelete={handleDelete} 
      />
    </AdminDashboardContent>
  );
}
