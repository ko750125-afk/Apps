'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';
import AdminShell from '@/components/admin/layout/AdminShell';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname?.startsWith('/admin/login');

  if (isLoginPage) {
    return (
      <div className="min-h-screen bg-neutral-950 text-neutral-50 antialiased selection:bg-accent/30">
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
