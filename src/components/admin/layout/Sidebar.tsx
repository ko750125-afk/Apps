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
  { href: '/admin/migrate', label: 'Migration', icon: ArrowRightLeft },
];

export default function Sidebar({ isCollapsed, onToggle }: { isCollapsed: boolean, onToggle: () => void }) {
  const pathname = usePathname();

  return (
    <aside 
      className={cn(
        "fixed left-0 top-0 h-screen bg-neutral-950 border-r border-neutral-900 transition-all duration-300 z-50 flex flex-col",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-neutral-900/50">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
              <Monitor className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-neutral-50 tracking-tight group-hover:text-accent transition-colors">RapidForge</span>
          </Link>
        )}
        {isCollapsed && (
          <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mx-auto">
            <Monitor className="w-5 h-5 text-white" />
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
        <p className={cn(
          "text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 px-3 transition-opacity",
          isCollapsed ? "opacity-0" : "opacity-100"
        )}>
          Management
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
                "group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 relative",
                isActive 
                  ? "bg-accent/10 text-accent" 
                  : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900"
              )}
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className={cn("w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110", isActive && "text-accent")} />
              {!isCollapsed && <span>{item.label}</span>}
              {isActive && !isCollapsed && (
                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
              )}
            </Link>
          );
        })}

        <div className="pt-8">
          <p className={cn(
            "text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-4 px-3 transition-opacity",
            isCollapsed ? "opacity-0" : "opacity-100"
          )}>
            Public
          </p>
          <Link
            href="/"
            target="_blank"
            className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 transition-all duration-200"
            title={isCollapsed ? "Visit Website" : undefined}
          >
            <Globe className="w-5 h-5 flex-shrink-0 group-hover:rotate-12 transition-transform" />
            {!isCollapsed && <span>Visit Website</span>}
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-neutral-900/50 space-y-2">
        <button
          onClick={async () => {
            if (!confirm('SIGN OUT?')) return;
            const { signOut } = await import('firebase/auth');
            const { auth } = await import('@/lib/firebase');
            if (auth) {
              await signOut(auth);
              await fetch('/api/auth/session', { method: 'DELETE' });
              window.location.href = '/admin/login';
            }
          }}
          className={cn(
            "w-full group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-500 hover:text-red-400 hover:bg-red-500/10 transition-all duration-200",
            isCollapsed && "justify-center"
          )}
          title={isCollapsed ? "Sign Out" : undefined}
        >
          <LogOut className="w-5 h-5 flex-shrink-0 group-hover:-translate-x-0.5 transition-transform" />
          {!isCollapsed && <span>Sign Out</span>}
        </button>

        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 rounded-lg text-neutral-600 hover:text-neutral-400 hover:bg-neutral-900 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>
    </aside>
  );
}
