'use client';

import React, { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { ShieldCheck, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

/**
 * 관리자 계정 초기 설정 페이지
 * 최초 1회만 사용 후 삭제하거나 비활성화할 것
 */
export default function AdminSetupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !db) return;
    setLoading(true);
    setResult(null);

    try {
      // 1. 로그인하여 uid 확보
      const cred = await signInWithEmailAndPassword(auth, email, password);
      const user = cred.user;

      // 2. 기존 Firestore 문서 확인
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);

      // 3. admin role 설정 (기존 문서가 있으면 merge, 없으면 생성)
      await setDoc(userRef, {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || email.split('@')[0],
        role: 'admin',
        updatedAt: new Date().toISOString(),
        ...(userDoc.exists() ? {} : { createdAt: new Date().toISOString() }),
      }, { merge: true });

      // 4. 세션 쿠키 생성 (middleware 통과용)
      const token = await user.getIdToken();
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      setResult({
        type: 'success',
        message: `${user.email} 계정에 관리자 권한이 부여되었습니다. 3초 후 관리자 페이지로 이동합니다...`,
      });

      // 5. 3초 후 관리자 페이지로 이동
      setTimeout(() => {
        window.location.href = '/admin';
      }, 2000);
    } catch (err: any) {
      setResult({
        type: 'error',
        message: err.message || '설정 실패',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <ShieldCheck className="w-16 h-16 text-blue-500 mx-auto mb-4" />
          <h1 className="text-2xl font-black text-white mb-2">Admin Setup</h1>
          <p className="text-neutral-500 text-sm">관리자 계정의 이메일/비밀번호를 입력하여 admin 권한을 부여합니다.</p>
        </div>

        <form onSubmit={handleSetup} className="bg-neutral-900/50 border border-neutral-800 rounded-2xl p-8 space-y-4">
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full mt-2 bg-black/40 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
              placeholder="admin@master.com"
            />
          </div>
          <div>
            <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full mt-2 bg-black/40 border border-neutral-800 rounded-xl py-3 px-4 text-sm text-white focus:outline-none focus:border-blue-500/50"
              placeholder="••••••••"
            />
          </div>

          {result && (
            <div className={`flex items-start gap-3 p-4 rounded-xl text-sm ${
              result.type === 'success' 
                ? 'bg-green-500/10 text-green-400 border border-green-500/20' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20'
            }`}>
              {result.type === 'success' ? <CheckCircle className="w-5 h-5 shrink-0" /> : <AlertCircle className="w-5 h-5 shrink-0" />}
              <span>{result.message}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-all mt-2"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Grant Admin Role'}
          </button>
        </form>

        <p className="text-center text-neutral-600 text-xs mt-6">
          ⚠️ 이 페이지는 초기 설정 후 삭제하거나 보호해야 합니다.
        </p>
      </div>
    </div>
  );
}
