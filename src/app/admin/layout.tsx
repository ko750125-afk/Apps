'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import AuthGuard from '@/components/admin/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't guard the login page itself
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return <AuthGuard>{children}</AuthGuard>;
}
