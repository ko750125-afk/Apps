'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile 
} from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        // Login Logic
        await signInWithEmailAndPassword(auth!, email, password);
      } else {
        // Signup Logic
        if (!displayName || !phoneNumber) {
          throw new Error('모든 필드를 입력해주세요.');
        }
        
        const userCredential = await createUserWithEmailAndPassword(auth!, email, password);
        const user = userCredential.user;

        // 1. Update Profile (DisplayName)
        await updateProfile(user, { displayName });

        // 2. Save Additional Info to Firestore (phoneNumber)
        await setDoc(doc(db!, 'users', user.uid), {
          uid: user.uid,
          email: user.email,
          displayName,
          phoneNumber,
          role: 'user',
          createdAt: new Date().toISOString()
        });
      }
      
      router.push('/');
      router.refresh();
    } catch (err: any) {
      console.error('Auth Error:', err);
      const code = err?.code || '';
      const messages: Record<string, string> = {
        'auth/email-already-in-use': '이미 가입된 이메일입니다. 로그인으로 전환합니다.',
        'auth/invalid-email': '올바른 이메일 형식이 아닙니다.',
        'auth/weak-password': '비밀번호는 6자 이상이어야 합니다.',
        'auth/user-not-found': '등록되지 않은 이메일입니다.',
        'auth/wrong-password': '비밀번호가 올바르지 않습니다.',
        'auth/invalid-credential': '이메일 또는 비밀번호가 올바르지 않습니다.',
        'auth/too-many-requests': '너무 많은 시도가 있었습니다. 잠시 후 다시 시도해주세요.',
      };
      setError(messages[code] || err.message || '인증에 실패했습니다.');
      
      // 이미 가입된 이메일이면 자동으로 로그인 모드로 전환
      if (code === 'auth/email-already-in-use') {
        setTimeout(() => setIsLogin(true), 1500);
      }
    } finally {
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
          <div className="text-center mb-10">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              {isLogin ? '환영합니다!' : '계정 생성'}
            </h1>
            <p className="text-neutral-500 text-sm font-medium">
              {isLogin ? '서비스 이용을 위해 로그인해주세요.' : '회원가입 후 모든 기능을 이용해보세요.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  {/* Name Input */}
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="text"
                      placeholder="성함"
                      required
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-800 rounded-2xl py-4 pl-12 pr-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                  {/* Phone Input */}
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
                    <input 
                      type="tel"
                      placeholder="전화번호 (예: 010-1234-5678)"
                      required
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      className="w-full bg-black/40 border border-neutral-800 rounded-2xl py-4 pl-12 pr-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email Input */}
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="email"
                placeholder="이메일 주소"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-black/40 border border-neutral-800 rounded-2xl py-4 pl-12 pr-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {/* Password Input */}
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 group-focus-within:text-blue-500 transition-colors" />
              <input 
                type="password"
                placeholder="비밀번호"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-black/40 border border-neutral-800 rounded-2xl py-4 pl-12 pr-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all"
              />
            </div>

            {error && (
              <p className="text-rose-500 text-xs font-bold px-2">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/20 mt-4"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isLogin ? '로그인' : '회원가입'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-neutral-800 text-center">
            <p className="text-neutral-500 text-sm font-medium">
              {isLogin ? '계정이 없으신가요?' : '이미 계정이 있으신가요?'}
              <button 
                onClick={() => setIsLogin(!isLogin)}
                className="ml-2 text-blue-500 hover:text-blue-400 font-bold"
              >
                {isLogin ? '회원가입' : '로그인'}
              </button>
            </p>
          </div>
        </div>

        <Link href="/" className="block mt-8 text-center text-neutral-600 hover:text-neutral-400 text-xs font-bold transition-colors">
          홈으로 돌아가기
        </Link>
      </motion.div>
    </div>
  );
}
