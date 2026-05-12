'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';

const NAV_ITEMS = [
  { href: '/admin', label: '대시보드', collapsedLabel: '보' },
  { href: '/admin/inquiries', label: '문의', collapsedLabel: '문' },
  { href: '/admin/new', label: '앱 추가', collapsedLabel: '추' },
] as const;

export default function Sidebar({
  isCollapsed,
  onToggle,
  onClose,
}: {
  isCollapsed: boolean;
  onToggle: () => void;
  onClose?: () => void;
}) {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      if (auth) {
        await signOut(auth);
        await fetch('/api/auth/session', { method: 'DELETE' });
      }
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      window.location.href = '/admin/login';
    }
  };

  return (
    <aside
      className={cn(
        'h-screen border-r border-zinc-800/80 bg-zinc-950 flex flex-col transition-[width] duration-200 ease-out',
        isCollapsed ? 'w-[4.25rem]' : 'w-56',
      )}
    >
      <div className="h-14 flex items-center border-b border-zinc-800/80 px-3">
        {!isCollapsed ? (
          <Link
            href="/"
            onClick={() => onClose?.()}
            className="flex flex-col min-w-0 group"
          >
            <span className="text-sm font-semibold text-zinc-100 tracking-tight truncate group-hover:text-zinc-50">
              RapidForge
            </span>
            <span className="text-[11px] text-zinc-500 truncate">관리</span>
          </Link>
        ) : (
          <span className="text-xs font-semibold text-zinc-400 w-full text-center">R</span>
        )}
      </div>

      <nav className="flex-1 py-3 px-2 space-y-0.5 overflow-y-auto">
        {!isCollapsed && (
          <p className="px-2 pb-2 text-[11px] font-medium text-zinc-500">메뉴</p>
        )}
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.href === '/admin' ? pathname === '/admin' : pathname?.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => onClose?.()}
              title={isCollapsed ? item.label : undefined}
              className={cn(
                'block rounded-md px-2 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-zinc-800/80 text-zinc-50'
                  : 'text-zinc-400 hover:bg-zinc-800/40 hover:text-zinc-200',
              )}
            >
              {isCollapsed ? (
                <span className="block text-center text-xs text-zinc-300">{item.collapsedLabel}</span>
              ) : (
                item.label
              )}
            </Link>
          );
        })}
      </nav>

      <button
        type="button"
        onClick={onToggle}
        className="hidden md:flex mx-auto mb-2 h-7 w-7 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-500 hover:text-zinc-300 hover:bg-zinc-800/80"
        aria-label={isCollapsed ? '사이드바 펼치기' : '사이드바 접기'}
      >
        {isCollapsed ? <ChevronRight className="h-3.5 w-3.5" /> : <ChevronLeft className="h-3.5 w-3.5" />}
      </button>

      <div className="p-2 border-t border-zinc-800/80">
        <button
          type="button"
          onClick={handleLogout}
          className={cn(
            'w-full rounded-md px-2 py-2 text-left text-sm font-medium text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-300',
            isCollapsed && 'text-center text-xs px-0',
          )}
        >
          {isCollapsed ? '로' : '로그아웃'}
        </button>
      </div>
    </aside>
  );
}
