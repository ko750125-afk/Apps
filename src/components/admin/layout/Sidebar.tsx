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
  { href: '/admin', label: '대시보드', icon: LayoutDashboard },
  { href: '/admin/new', label: '새 프로젝트', icon: PlusCircle },
];

export default function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-neutral-950 border-r border-neutral-900 transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="h-20 flex items-center justify-between px-6 border-b border-neutral-900/50">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-white tracking-tighter text-lg group-hover:text-accent transition-colors">RapidForge</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-9 h-9 rounded-xl bg-accent flex items-center justify-center mx-auto shadow-lg shadow-accent/20">
            <Monitor className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-8 px-4 space-y-1 overflow-y-auto scrollbar-hide">
        <p className={cn(
          "text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4 px-3 transition-opacity",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          관리 메뉴
        </p>
        
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
                "group flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold transition-all duration-300 relative",
                isActive 
                  ? "bg-accent/10 text-accent" 
                  : "text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "text-accent")} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="absolute right-3 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_10px_rgba(59,130,246,0.8)]" />
              )}
            </Link>
          );
        })}

        <div className="pt-10">
          <p className={cn(
            "text-[10px] font-black text-neutral-600 uppercase tracking-[0.2em] mb-4 px-3 transition-opacity",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}>
            공개 페이지
          </p>
          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900/50 transition-all duration-300"
            title={isCollapsed ? "웹사이트 방문" : undefined}
          >
            <Globe className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span>웹사이트 방문</span>}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-900/50 space-y-3">
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
            "w-full group flex items-center gap-3 px-3 py-3 rounded-2xl text-sm font-bold text-neutral-600 hover:text-rose-500 hover:bg-rose-500/10 transition-all duration-300",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "로그아웃" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-1 transition-transform" />
          {!isCollapsed && <span>로그아웃</span>}
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-3 rounded-xl text-neutral-700 hover:text-neutral-400 hover:bg-neutral-900 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
