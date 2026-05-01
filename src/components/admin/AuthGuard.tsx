'use client';

import React, { useEffect, useState, useRef } from 'react';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { Loader2, ShieldAlert } from 'lucide-react';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const checkCount = useRef(0);

  useEffect(() => {
    const currentAuth = auth;
    if (!currentAuth) {
      console.error('❌ AuthGuard: Firebase Auth is not initialized.');
      Promise.resolve().then(() => {
        setError('Authentication system failed to initialize.');
        setLoading(false);
      });
      return;
    }

    console.log(`🔐 AuthGuard: Checking auth state for ${pathname}...`);

    const unsubscribe = onAuthStateChanged(currentAuth, (user) => {
      checkCount.current++;
      if (user) {
        console.log('✅ AuthGuard: User authenticated:', user.email);
        setAuthenticated(true);
        setError(null);
      } else {
        console.warn('⚠️ AuthGuard: No active session found.');
        setAuthenticated(false);
        // Clear stale server cookie to prevent /admin <-> /admin/login redirect loops.
        void fetch('/api/auth/session', { method: 'DELETE' }).finally(() => {
          router.replace('/admin/login');
        });
      }
      setLoading(false);
    }, (err) => {
      console.error('❌ AuthGuard: onAuthStateChanged error:', err);
      setError(`Auth system error: ${err.message}`);
      setLoading(false);
    });

    // 3. Safety timeout
    const timeout = setTimeout(() => {
      // If still loading after 10s, it's likely a network/config issue
      // We don't force a state change here, but we could show a warning in UI
    }, 10000);

    return () => {
      unsubscribe();
      clearTimeout(timeout);
    };
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
            onClick={() => window.location.reload()}
            className="w-full bg-neutral-800 hover:bg-neutral-700 text-white py-3 rounded-xl font-bold transition-all"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  return authenticated ? <>{children}</> : null;
}
