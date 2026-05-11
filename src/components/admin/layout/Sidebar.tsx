'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  PlusCircle, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Monitor,
  MessageSquare
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/inquiries', label: 'Inquiries', icon: MessageSquare },
  { href: '/admin/new', label: 'New App', icon: PlusCircle },
];

export default function Sidebar({ 
  isCollapsed, 
  onToggle,
  onClose
}: { 
  isCollapsed: boolean; 
  onToggle: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    console.log('🚀 Sidebar: Logout initiated');
    try {
      if (auth) {
        await signOut(auth);
        console.log('✅ Sidebar: Firebase Signed Out');
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
    } catch (error) {
      console.error('❌ Sidebar: Logout failed', error);
    } finally {
      console.log('🏁 Sidebar: Redirecting to login');
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside 
      className={cn(
        "h-screen bg-[#050505] border-r border-neutral-900 transition-all duration-300 flex flex-col relative shadow-2xl",
        isCollapsed ? "w-20" : "w-64"
      )}
    >
      {/* Brand */}
      <div className="h-16 md:h-20 flex items-center justify-between px-6 border-b border-neutral-900/50">
        {!isCollapsed && (
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Monitor className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <span className="font-black text-white tracking-tighter text-lg md:text-xl group-hover:text-blue-500 transition-colors">RapidForge</span>
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
              onClick={() => onClose?.()}
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
      </div>

      {/* Collapse Toggle (Desktop only) */}
      <button 
        onClick={onToggle}
        className="hidden md:flex absolute -right-3 top-24 w-6 h-6 bg-blue-600 rounded-full items-center justify-center border-2 border-[#050505] text-white hover:bg-blue-500 transition-colors z-50 shadow-lg"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      {/* Footer */}
      <div className="p-4 border-t border-neutral-900/50">
        <button
          onClick={handleLogout}
          type="button"
          className={cn(
            "w-full group flex items-center gap-3 px-3 py-4 rounded-xl text-sm font-bold text-neutral-500 hover:text-red-500 hover:bg-red-500/5 transition-all duration-300",
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
