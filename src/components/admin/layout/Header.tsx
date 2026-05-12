'use client';

import React, { useState, useEffect } from 'react';
import { Menu } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = auth?.currentUser;
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'rapidforge_inquiries'),
      where('status', '==', 'pending'),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setPendingCount(snapshot.docs.length);
    });

    return () => unsubscribe();
  }, []);

  const handleInquiriesShortcut = () => {
    router.push('/admin/inquiries');
  };

  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-between border-b border-zinc-800/80 bg-zinc-950/95 px-3 md:px-5 backdrop-blur-sm">
      <div className="flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 md:hidden"
          aria-label="메뉴 열기"
        >
          <Menu className="h-4 w-4" />
        </button>
        <span className="hidden text-sm text-zinc-500 md:inline">관리자</span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={handleInquiriesShortcut}
          className={cn(
            'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
            pendingCount > 0
              ? 'border-zinc-600 bg-zinc-900 text-zinc-100'
              : 'border-transparent bg-transparent text-zinc-500 hover:bg-zinc-900 hover:text-zinc-300',
          )}
        >
          문의
          {pendingCount > 0 ? (
            <span className="ml-1.5 tabular-nums text-zinc-400">({pendingCount})</span>
          ) : null}
        </button>

        <div className="hidden h-4 w-px bg-zinc-800 sm:block" />

        <div className="hidden min-w-0 text-right sm:block">
          <p className="truncate text-sm font-medium text-zinc-200">
            {user?.displayName || '관리자'}
          </p>
          <p className="truncate text-xs text-zinc-500">{user?.email ?? ''}</p>
        </div>
        <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full border border-zinc-700 bg-zinc-800">
          {user?.photoURL ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={user.photoURL} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-[10px] font-medium text-zinc-500">
              {(user?.displayName || user?.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
