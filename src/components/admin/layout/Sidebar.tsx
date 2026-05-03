'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  ArrowRightLeft, 
  LogOut,
  Globe,
  ChevronLeft,
  ChevronRight,
  Monitor
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/new', label: 'New App', icon: PlusCircle },
  { href: '/admin/migration', label: 'Migration', icon: ArrowRightLeft },
];

export default function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-[#050505] border-r border-neutral-900 transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="h-20 flex items-center justify-between px-6">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Monitor className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-white tracking-tighter text-xl group-hover:text-blue-500 transition-colors">RapidForge</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center mx-auto shadow-lg shadow-blue-600/20">
            <Monitor className="w-6 h-6 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        {!isCollapsed && (
          <p className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4 px-3">
            MANAGEMENT
          </p>
        )}
        
        {NAV_ITEMS.map((item) => {
          const isActive = item.href === '/admin' 
            ? pathname === '/admin' 
            : pathname?.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold transition-all duration-300 relative",
                isActive 
                  ? "bg-blue-600/10 text-blue-500" 
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "text-blue-500")} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(37,99,235,0.8)]" />
              )}
            </Link>
          );
        })}

        <div className="pt-10">
          {!isCollapsed && (
            <p className="text-[11px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4 px-3">
              PUBLIC
            </p>
          )}
          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-3 px-3 py-3 rounded-xl text-sm font-bold text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50 transition-all duration-300"
            title={isCollapsed ? "Visit Website" : undefined}
          >
            <Globe className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span>Visit Website</span>}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-900/50">
        <button
          onClick={async () => {
            if (!confirm('로그아웃 하시겠습니까?')) return;
            const { signOut } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase');
            if (auth) {
              await signOut(auth);
              await fetch('/api/auth/session', { method: 'DELETE' });
              window.location.href = '/admin/login';
            }
          }}
          className={cn(
            "w-full group flex items-center gap-3 px-3 py-4 rounded-xl text-sm font-bold text-neutral-500 hover:text-neutral-200 transition-all duration-300",
            isCollapsed && "justify-center"
          )}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
}
