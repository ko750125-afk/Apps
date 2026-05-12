'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { motion } from 'framer-motion';
import { Loader2, ArrowRight, AlertCircle, CheckCircle, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const router = useRouter();

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError('');
    setStatusMsg('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth!, provider);
      const user = result.user;

      // 🚨 관리자 화이트리스트 (허가된 이메일만 접속 가능)
      const ALLOWED_EMAILS = ['ko750125@gmail.com'];
      
      if (!user.email || !ALLOWED_EMAILS.includes(user.email)) {
        await auth?.signOut();
        throw new Error('등록된 관리자 이메일이 아닙니다. 접근이 거부되었습니다.');
      }

      setStatusMsg('계정 확인 완료. 최고 관리자 권한을 부여합니다...');

      // DB에 관리자 권한 보장
      await setDoc(doc(db!, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || 'Executive Admin',
        role: 'admin',
        updatedAt: new Date().toISOString()
      }, { merge: true });

      // 관리자 세션 생성을 위한 API 호출 (필요시)
      const token = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      setStatusMsg('환영합니다! 제어 센터로 이동합니다.');
      setTimeout(() => {
        window.location.href = '/admin';
      }, 500);

    } catch (err: any) {
      console.error('Auth Error:', err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || '구글 연동 중 인증에 실패했습니다.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md z-10"
      >
        <div className="bg-neutral-900/50 border border-neutral-800 backdrop-blur-2xl rounded-[2.5rem] p-8 md:p-10 shadow-2xl">
          <div className="text-center mb-10 flex flex-col items-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-2xl mb-4 group transition-all">
              <ShieldCheck className="w-7 h-7 text-blue-500" />
            </div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              관리자 전용 로그인
            </h1>
            <p className="text-neutral-500 text-sm font-medium">
              오직 허가된 이메일(ko750125@gmail.com)만 접속할 수 있습니다.
            </p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGoogleAuth}
              disabled={loading}
              className="group w-full flex items-center justify-center gap-3 bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 text-[14px] shadow-xl shadow-white/5"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>구글 계정으로 로그인</span>
                  <ArrowRight className="w-4 h-4 ml-1 opacity-70" />
                </>
              )}
            </button>

            {/* 진행 상태 알림 */}
            {statusMsg && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 text-blue-400 text-sm font-semibold leading-tight mt-4"
              >
                <CheckCircle className="w-5 h-5 shrink-0 text-blue-500 animate-bounce" />
                <span>{statusMsg}</span>
              </motion.div>
            )}

            {/* 에러 메시지 */}
            {error && !statusMsg && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-3 text-rose-400 text-sm font-medium leading-relaxed mt-4"
              >
                <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                <span>{error}</span>
              </motion.div>
            )}
          </div>
        </div>

        <Link href="/" className="block mt-8 text-center text-neutral-600 hover:text-neutral-400 text-sm font-bold transition-colors">
          홈으로 돌아가기
        </Link>
      </motion.div>
    </div>
  );
}
