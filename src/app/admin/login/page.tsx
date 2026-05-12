'use client';

import React, { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Loader2, 
  Lock, 
  AlertCircle, 
  ShieldCheck, 
  UserPlus, 
  Info, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';

export default function LoginPage() {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [statusMsg, setStatusMsg] = useState('');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [checkingConfig, setCheckingConfig] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (auth && db) {
        setIsFirebaseReady(true);
      } else {
        setError('Firebase 설정이 로드되지 않았습니다. 환경 변수를 확인해주세요.');
      }
      setCheckingConfig(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  /**
   * 🚀 원스톱 어드민 권한 부여 및 서버 세션 생성 로직
   * 구글 로그인 또는 이메일 가입/로그인 직후 호출되어 모든 과정을 자동화합니다.
   */
  const finalizeAdminAccess = async (user: any) => {
    try {
      // 🚨 관리자 화이트리스트 (허가된 이메일만 접속 가능)
      const ALLOWED_EMAILS = ['ko750125@gmail.com'];
      
      if (!user.email || !ALLOWED_EMAILS.includes(user.email)) {
        if (auth) await auth.signOut(); // 즉시 로그아웃 처리
        throw new Error('등록된 최고 관리자 이메일이 아닙니다. 접근이 거부되었습니다.');
      }

      setStatusMsg('계정 인증 완료. 최고 관리자 권한을 동기화 중입니다...');
      
      // 1. Firestore에 role: 'admin' 자동 보장
      if (db) {
        const userRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userRef);
        
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split('@')[0] || 'Executive Admin',
          role: 'admin',
          updatedAt: new Date().toISOString(),
          ...(userDoc.exists() ? {} : { createdAt: new Date().toISOString() })
        }, { merge: true });
      }

      setStatusMsg('보안 서버 세션을 생성하고 있습니다...');

      // 2. HTTP-only 쿠키 생성을 위한 세션 API 호출
      const token = await user.getIdToken();
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      if (response.ok) {
        setStatusMsg('환영합니다! 제어 센터로 이동합니다.');
        setTimeout(() => {
          window.location.href = '/admin';
        }, 600);
      } else {
        throw new Error('서버 보안 세션 발급에 실패했습니다.');
      }
    } catch (err: any) {
      console.error('Finalize Access Error:', err);
      setError(err.message || '관리자 권한 부여 및 세션 생성 중 오류가 발생했습니다.');
      setLoading(false);
    }
  };

  // 구글 로그인 연동 (자동 가입 및 어드민 승격 포함)
  const handleGoogleAuth = async () => {
    if (!auth) return;
    setLoading(true);
    setError('');
    setStatusMsg('');

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      await finalizeAdminAccess(result.user);
    } catch (err: any) {
      console.error('Google Auth Error:', err);

      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message || '구글 연동 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
      setLoading(false);
    }
  };

  // 이메일/비밀번호 폼 제출 처리
  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    setError('');
    setStatusMsg('');

    try {
      let userCredential;
      if (mode === 'signin') {
        // 기존 계정 로그인
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 신규 어드민 생성
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      await finalizeAdminAccess(userCredential.user);
    } catch (err: any) {
      console.error('Email Auth Error:', err);
      const code = err.code || '';
      
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('이메일 또는 비밀번호가 일치하지 않습니다. 처음 접속하신다면 상단의 [어드민 생성] 탭을 이용해 즉시 계정을 만들어보세요.');
      } else if (code === 'auth/email-already-in-use') {
        setError('이미 등록된 관리자 이메일입니다. 상단의 [로그인] 탭을 선택하여 진입해주세요.');
      } else if (code === 'auth/weak-password') {
        setError('비밀번호는 보안상 최소 6자리 이상이어야 합니다.');
      } else {
        setError(err.message || '인증 처리 중 문제가 발생했습니다.');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center p-6 relative overflow-hidden select-none">
      {/* 고품격 다이내믹 배경 효과 */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(59,130,246,0.12),transparent_60%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-30 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[150px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* 헤더 브랜딩 */}
        <div className="text-center mb-8">
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-neutral-900/80 backdrop-blur-xl border border-neutral-800 shadow-2xl mb-6 group transition-all hover:border-blue-500/40"
          >
            <ShieldCheck className="w-8 h-8 text-blue-500" />
          </motion.div>
          <h1 className="text-3xl font-black tracking-tight mb-2 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/70">
            RapidForge Portal
          </h1>
          <p className="text-neutral-500 text-xs font-semibold tracking-wide">
            원스톱 아키텍처 제어 및 관리자 통합 진입로
          </p>
        </div>

        {/* 메인 통합 카드 */}
        <div className="bg-neutral-900/60 backdrop-blur-2xl border border-neutral-800/80 rounded-[2rem] p-8 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.6)] relative">
          {checkingConfig ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">환경 설정 검증 중...</p>
            </div>
          ) : (
            <>


              {/* 단일 구글 로그인 버튼 */}
              <div className="mb-4">
                <button
                  onClick={handleGoogleAuth}
                  disabled={loading || !isFirebaseReady}
                  className="group w-full flex items-center justify-center gap-3 bg-white text-neutral-950 hover:bg-neutral-100 font-extrabold py-4 rounded-xl transition-all active:scale-[0.99] disabled:opacity-50 text-[13px] shadow-lg shadow-white/5"
                >
                  <svg className="w-5 h-5 shrink-0 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span>최고 관리자 계정으로 로그인 (Google)</span>
                </button>
              </div>

              {/* 진행 상태 알림 */}
              {statusMsg && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center gap-3 text-blue-400 text-xs font-semibold leading-tight"
                >
                  <CheckCircle className="w-4 h-4 shrink-0 text-blue-500 animate-bounce" />
                  <span>{statusMsg}</span>
                </motion.div>
              )}

              {/* 에러 메시지 */}
              {error && !statusMsg && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-start gap-2.5 text-rose-400 text-[11px] font-medium leading-relaxed"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </motion.div>
              )}
            </>
          )}
        </div>

        {/* 하단 부가 설명 */}
        <div className="mt-8 flex items-center justify-center gap-4 text-neutral-600">
          <div className="flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5" />
            <span className="text-[10px] font-semibold tracking-wider">원스톱 권한 동기화 활성화됨</span>
          </div>
        </div>
      </div>
    </div>
  );
}
