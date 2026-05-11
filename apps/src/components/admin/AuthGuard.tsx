'use client';

import React, { useEffect, useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!auth) {
      console.error('❌ AuthGuard: Firebase Auth is not initialized.');
      setError('Authentication system failed to initialize.');
      setLoading(false);
      return;
    }

    console.log(`🔐 AuthGuard: Checking auth state for ${pathname}...`);

    const unsubscribe = onAuthStateChanged(
      auth,
      async (user) => {
        if (user) {
          console.log('🔍 AuthGuard: User found:', user.email, '- Checking admin role...');
          
          try {
            // Firestore에서 유저의 role 확인
            if (db) {
              const userDoc = await getDoc(doc(db, 'users', user.uid));
              const userData = userDoc.data();
              
              if (userData?.role === 'admin') {
                console.log('✅ AuthGuard: Admin role confirmed for', user.email);
                setAuthenticated(true);
                setError(null);
              } else {
                console.warn('⛔ AuthGuard: User is NOT admin. Role:', userData?.role || 'none');
                setAuthenticated(false);
                setError('관리자 권한이 없습니다. 일반 사용자는 관리자 페이지에 접근할 수 없습니다.');
                // 세션 쿠키 삭제 후 홈으로 리다이렉트
                await fetch('/api/auth/session', { method: 'DELETE' });
                setTimeout(() => {
                  window.location.href = '/';
                }, 2000);
              }
            } else {
              // Firestore가 없으면 기존 방식 (fallback)
              console.warn('⚠️ AuthGuard: Firestore not available, allowing access');
              setAuthenticated(true);
            }
          } catch (err) {
            console.error('❌ AuthGuard: Role check failed:', err);
            // Firestore 접근 실패 시에도 안전하게 차단
            setAuthenticated(false);
            setError('권한 확인 중 오류가 발생했습니다. 다시 시도해주세요.');
          }
        } else {
          console.warn('⚠️ AuthGuard: No active session found.');
          setAuthenticated(false);
          // Clear stale server cookie to prevent redirect loops
          void fetch('/api/auth/session', { method: 'DELETE' }).finally(() => {
            router.replace('/admin/login');
          });
        }
        setLoading(false);
      },
      (err) => {
        console.error('❌ AuthGuard: onAuthStateChanged error:', err);
        setError(`Auth system error: ${err.message}`);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, [router, pathname]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
            <div className="absolute inset-0 blur-lg bg-accent/20 animate-pulse" />
          </div>
          <div className="text-center">
            <p className="text-sm font-medium text-neutral-200">Verifying access...</p>
            <p className="text-[10px] text-neutral-500 uppercase tracking-widest mt-1">RapidForge Security Gate</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-950 p-6">
        <div className="max-w-md w-full bg-neutral-900 border border-rose-500/20 rounded-2xl p-8 text-center shadow-2xl">
          <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Access Denied</h2>
          <p className="text-sm text-neutral-400 mb-6">{error}</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
