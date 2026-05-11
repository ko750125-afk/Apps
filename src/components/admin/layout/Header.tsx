'use client';

import React, { useState, useEffect } from 'react';
import { User, Bell, Menu } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';

export default function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const user = auth?.currentUser;
  const router = useRouter();
  const [pendingCount, setPendingCount] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  // Firestore 실시간 리스너 — pending 상태 문의 건수
  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'rapidforge_inquiries'),
      where('status', '==', 'pending')
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newCount = snapshot.docs.length;
      // 건수가 증가하면 애니메이션 트리거
      if (newCount > pendingCount && pendingCount > 0) {
        setIsAnimating(true);
        setTimeout(() => setIsAnimating(false), 1000);
      }
      setPendingCount(newCount);
    });

    return () => unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBellClick = () => {
    router.push('/admin/inquiries');
  };

  return (
    <header className="h-16 border-b border-neutral-900 bg-neutral-950/50 backdrop-blur-xl sticky top-0 z-40 flex items-center justify-between px-4 md:px-6">
      <div className="flex items-center gap-4">
        {/* Mobile Menu Button */}
        <button 
          onClick={onMenuClick}
          className="p-2 -ml-2 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-900 transition-all md:hidden"
        >
          <Menu className="w-6 h-6" />
        </button>

        {/* Header Title (Optional, keeping it clean) */}
        <div className="hidden md:block">
          <span className="text-xs font-bold text-neutral-600 uppercase tracking-[0.2em]">Management System</span>
        </div>
      </div>

      <div className="flex items-center gap-4 ml-auto">
        {/* Notifications Bell */}
        <button 
          onClick={handleBellClick}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-full relative transition-all group",
            pendingCount > 0 
              ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20" 
              : "text-neutral-400 hover:text-neutral-200 hover:bg-neutral-900 border border-transparent"
          )}
          title={pendingCount > 0 ? `미확인 문의 ${pendingCount}건` : '새 문의 없음'}
        >
          <div className="relative">
            <Bell className={cn(
              "w-5 h-5 transition-transform",
              isAnimating && "animate-[ring_0.5s_ease-in-out_2]",
              pendingCount > 0 && "text-rose-500"
            )} />
            {/* Pulse ring when there are pending items */}
            {pendingCount > 0 && (
              <span className="absolute top-0 right-0 w-2.5 h-2.5 -mt-0.5 -mr-0.5">
                <span className="absolute inset-0 rounded-full bg-rose-500 animate-ping opacity-75" />
                <span className="relative inline-block w-2.5 h-2.5 bg-rose-500 rounded-full" />
              </span>
            )}
          </div>
          
          {/* 미확인 문의 건수 텍스트 표시 (눈에 띄게) */}
          {pendingCount > 0 && (
            <span className={cn(
              "text-xs font-black tracking-wide",
              isAnimating && "animate-pulse"
            )}>
              {pendingCount}건의 새 문의
            </span>
          )}
        </button>

        <div className="h-6 w-px bg-neutral-800 mx-1" />

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-medium text-neutral-200">{user?.displayName || 'Admin'}</p>
            <p className="text-xs text-neutral-500 lowercase">{user?.email || 'admin@rapidforge.io'}</p>
          </div>
          <div className="w-9 h-9 rounded-full bg-neutral-800 border border-neutral-700 flex items-center justify-center overflow-hidden">
            {user?.photoURL ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
            ) : (
              <User className="w-5 h-5 text-neutral-400" />
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
