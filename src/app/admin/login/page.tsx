'use client';

import React, { useState, useEffect } from 'react';
import { auth } from '@/lib/firebase';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Loader2, Lock, AlertCircle, ShieldCheck, Info } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);
  const [checkingConfig, setCheckingConfig] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Wait a bit for Firebase to potentially initialize if it's slow
    const timer = setTimeout(() => {
      if (auth) {
        console.log("✅ Login: Firebase Auth is ready.");
        setIsFirebaseReady(true);
      } else {
        console.error("❌ Login: Firebase Auth failed to initialize.");
        setError('Firebase configuration is missing or invalid. Check your environment variables.');
      }
      setCheckingConfig(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const establishSession = async (token: string) => {
    console.log("🔗 Establishing server session...");
    try {
      const response = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      
      if (response.ok) {
        console.log("✅ Session established successfully.");
        return true;
      }
      
      const data = await response.json();
      console.error("❌ Session creation failed:", data.error);
      return false;
    } catch (err) {
      console.error('❌ Session establishment error:', err);
      return false;
    }
  };

  const handleGoogleLogin = async () => {
    if (!auth) return;
    const currentAuth = auth;
    setLoading(true);
    setError('');
    console.log("🚀 Starting Google Login...");

    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(currentAuth, provider);
      console.log("✅ Google Auth success for:", result.user.email);
      
      const token = await result.user.getIdToken();
      if (await establishSession(token)) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Authenticated with Google, but failed to create a session on the server.');
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      console.error('❌ Google Auth Error:', error);
      
      if (error.code === 'auth/popup-closed-by-user') {
        setError('');
      } else if (error.code === 'auth/operation-not-allowed') {
        setError('Google login is not enabled in your Firebase Console.');
      } else if (error.code === 'auth/unauthorized-domain') {
        setError('This domain is not authorized for Google login. Add it to Firebase Console.');
      } else {
        setError(error.message || 'Google login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    const currentAuth = auth;
    setLoading(true);
    setError('');
    console.log(`🚀 Attempting login for: ${email}`);

    try {
      const userCredential = await signInWithEmailAndPassword(currentAuth, email, password);
      console.log("✅ Firebase Email Auth success.");
      
      const token = await userCredential.user.getIdToken();
      if (await establishSession(token)) {
        router.push('/admin');
        router.refresh();
      } else {
        setError('Login successful, but server session creation failed.');
      }
    } catch (err: unknown) {
      const error = err as { code?: string; message?: string };
      const code = error.code || '';
      console.error('❌ Email Auth Error:', code, error.message);
      
      if (code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/user-not-found') {
        setError('Invalid email or password. Please double check your credentials.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many failed attempts. This account is temporarily locked. Try again later.');
      } else if (code === 'auth/network-request-failed') {
        setError('Network error. Please check your internet connection and try again.');
      } else {
        setError(error.message || 'Authentication failed. Please check your Firebase settings.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Premium Dynamic Background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.08),transparent_50%)]" />
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] bg-accent/10 blur-[140px] rounded-full animate-pulse" />
        <div className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] bg-purple-600/10 blur-[140px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Branding */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-neutral-900/50 backdrop-blur-xl border border-neutral-800 shadow-2xl mb-8 group transition-all hover:scale-105 hover:border-accent/30">
            <ShieldCheck className="w-10 h-10 text-accent" />
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight mb-3 bg-clip-text text-transparent bg-gradient-to-b from-white to-white/60">
            Control Center
          </h1>
          <p className="text-neutral-500 text-sm font-medium tracking-wide">
            RapidForge Architecture Admin Portal
          </p>
        </div>

        <div className="bg-neutral-900/40 backdrop-blur-2xl border border-neutral-800/50 rounded-[2.5rem] p-10 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)]">
          {checkingConfig ? (
            <div className="py-12 flex flex-col items-center justify-center gap-4">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
              <p className="text-xs text-neutral-500 font-bold uppercase tracking-widest">Checking Configuration...</p>
            </div>
          ) : (
            <>
              {!isFirebaseReady && (
                <div className="mb-8 p-5 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-4 animate-in fade-in slide-in-from-top-4">
                  <AlertCircle className="w-6 h-6 text-amber-500 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-200/70 leading-relaxed">
                    <p className="font-bold text-amber-400 mb-1">Configuration Error</p>
                    {error}
                    <div className="mt-3 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                      <span className="font-semibold text-amber-500/80">Action required in .env.local</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Social Auth */}
              <div className="space-y-4 mb-10">
                <button
                  onClick={handleGoogleLogin}
                  disabled={loading || !isFirebaseReady}
                  className="group w-full flex items-center justify-center gap-4 bg-white text-neutral-950 hover:bg-neutral-100 font-bold py-4 rounded-2xl transition-all active:scale-[0.98] disabled:opacity-50 text-sm shadow-xl shadow-white/5"
                >
                  <svg className="w-5 h-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </button>
              </div>

              <div className="flex items-center gap-6 mb-10">
                <div className="flex-1 h-px bg-neutral-800/50" />
                <span className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em]">Credentials</span>
                <div className="flex-1 h-px bg-neutral-800/50" />
              </div>

              {/* Form */}
              <form onSubmit={handleLogin} className="space-y-6">
                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading || !isFirebaseReady}
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-5 py-4 text-neutral-200 text-sm placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:opacity-50"
                    placeholder="admin@rapidforge.io"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center ml-1">
                    <label className="block text-xs font-bold text-neutral-500 uppercase tracking-widest">Password</label>
                    <button type="button" className="text-[10px] text-accent/80 hover:text-accent font-bold uppercase tracking-wider transition-colors">Recovery</button>
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    disabled={loading || !isFirebaseReady}
                    className="w-full bg-neutral-950/50 border border-neutral-800 rounded-2xl px-5 py-4 text-neutral-200 text-sm placeholder:text-neutral-700 focus:outline-none focus:ring-2 focus:ring-accent/20 focus:border-accent transition-all disabled:opacity-50"
                    placeholder="••••••••"
                  />
                </div>

                {error && isFirebaseReady && (
                  <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/10 flex items-center gap-3 text-rose-400 text-[11px] font-medium leading-tight animate-in shake-in-1">
                    <AlertCircle className="w-5 h-5 shrink-0" />
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading || !isFirebaseReady}
                  className="w-full bg-accent hover:bg-accent-hover text-white font-bold py-4.5 rounded-2xl shadow-[0_20px_40px_-12px_rgba(59,130,246,0.3)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 text-sm mt-4"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      Sign In to Dashboard
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>

        {/* Footer Info */}
        <div className="mt-12 flex items-center justify-center gap-6">
          <div className="flex items-center gap-2 text-neutral-600">
            <ShieldCheck className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">End-to-End Encrypted</span>
          </div>
          <div className="w-1 h-1 rounded-full bg-neutral-800" />
          <div className="flex items-center gap-2 text-neutral-600">
            <Info className="w-4 h-4" />
            <span className="text-[10px] font-bold uppercase tracking-widest">System v2.4.0</span>
          </div>
        </div>
      </div>
    </div>
  );
}
