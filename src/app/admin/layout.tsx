'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, ShieldCheck, Home } from 'lucide-react';
import AuthGuard from '@/components/admin/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';
  
  const navBar = (
    <nav className="fixed top-0 left-0 right-0 z-[50] bg-[#fbfbfd]/90 backdrop-blur-xl border-b border-black/5 py-3 px-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link 
            href="/" 
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/5 text-[#1d1d1f] hover:bg-black/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span className="text-[13px] font-medium">Return to Home</span>
          </Link>
          <div className="h-4 w-[1px] bg-black/10" />
          <Link href="/admin" className="flex items-center gap-1.5 text-[#1d1d1f] hover:text-[#0066cc] transition-colors">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[13px] font-medium">Admin Dashboard</span>
          </Link>
        </div>
        
        {!isLoginPage && (
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-medium text-[#86868b] uppercase tracking-wider hidden sm:block">Session Active</span>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          </div>
        )}
      </div>
    </nav>
  );

  const content = (
    <div className="relative min-h-screen bg-[#fbfbfd] text-[#1d1d1f]">
      {navBar}
      {/* Page Content: padding-top ensures content is not hidden under the fixed nav */}
      <div className="relative pt-20 pb-12">
        {children}
      </div>
    </div>
  );

  // Don't guard the login page itself
  if (isLoginPage) {
    return content;
  }

  return (
    <AuthGuard>
      {content}
    </AuthGuard>
  );
}
