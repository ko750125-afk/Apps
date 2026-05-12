'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';
import AdminShell from '@/components/admin/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isPublicPage = pathname?.startsWith('/admin/login') || pathname?.startsWith('/admin/setup');

  if (isPublicPage) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 antialiased selection:bg-zinc-700/50">
        {children}
      </div>
    );
  }

  return (
    <AuthGuard>
      <AdminShell>
        {children}
      </AdminShell>
    </AuthGuard>
  );
}
