'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutGrid, ShieldCheck } from 'lucide-react';
import AuthGuard from '@/components/admin/AuthGuard';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  // Don't guard the login page itself
  if (pathname === '/admin/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <div className="relative min-h-screen bg-[#05050a]">
        {/* Admin Navigation Bar */}
        <nav className="fixed top-0 left-0 right-0 z-[60] bg-black/40 backdrop-blur-xl border-b border-white/5 py-3 px-6">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link 
                href="/" 
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-gray-400 hover:text-cyan-400 hover:border-cyan-500/50 transition-all group"
              >
                <LayoutGrid className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                <span className="text-[10px] font-black uppercase tracking-widest">Exit to Home</span>
              </Link>
              <div className="h-4 w-[1px] bg-white/10" />
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span className="text-[10px] font-black text-white uppercase tracking-[0.3em]">Control Center</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-bold text-gray-600 uppercase tracking-widest hidden sm:block">Admin Session Active</span>
              <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse" />
            </div>
          </div>
        </nav>

        {/* Page Content */}
        <div className="relative pt-4">
          {children}
        </div>
      </div>
    </AuthGuard>
  );
}
