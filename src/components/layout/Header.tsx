'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Rocket, ShieldCheck, User, Menu, X, LogOut, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();
  
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(5, 5, 10, 0)', 'rgba(5, 5, 10, 0.85)']
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(0px)', 'blur(20px)']
  );

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      unsubscribe();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <motion.header
      style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500 border-b",
        isScrolled ? "border-white/10 py-3 shadow-[0_4px_30px_rgba(0,0,0,0.5)]" : "border-transparent py-6"
      )}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group relative">
          <div className="relative">
            <div className="absolute -inset-2 bg-electric-cyan/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-electric-cyan to-neon-purple p-[1px] group-hover:rotate-[15deg] transition-all duration-500 shadow-lg shadow-electric-cyan/20">
              <div className="w-full h-full rounded-xl bg-space-black flex items-center justify-center">
                <Rocket className="w-5 h-5 text-electric-cyan group-hover:animate-pulse" />
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-display font-bold text-xl tracking-tight text-starlight-white leading-none">
              Cyber<span className="text-electric-cyan">Cosmos</span>
            </span>
            <span className="text-[10px] text-muted-steel uppercase tracking-[0.2em] font-medium mt-1 group-hover:text-electric-cyan/80 transition-colors">
              Portfolio Engine
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-10">
          <Link href="/" className="relative text-sm font-medium text-muted-steel hover:text-starlight-white transition-all group">
            Portfolio
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-electric-cyan transition-all group-hover:w-full" />
          </Link>
          <Link href="#" className="relative text-sm font-medium text-muted-steel hover:text-starlight-white transition-all group">
            Services
            <span className="absolute -bottom-1 left-0 w-0 h-[1px] bg-electric-cyan transition-all group-hover:w-full" />
          </Link>
          
          <div className="h-4 w-[1px] bg-white/10 mx-2" />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 px-5 py-2 rounded-full bg-gradient-to-r from-neon-purple to-electric-cyan text-white text-[11px] font-bold uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(138,43,226,0.4)]"
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                System Dashboard
              </Link>
              <button 
                onClick={handleLogout}
                className="p-2 rounded-full bg-white/5 border border-white/10 text-muted-steel hover:text-neon-pink hover:bg-neon-pink/10 hover:border-neon-pink/30 transition-all"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link 
              href="/admin/login" 
              className="flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-starlight-white text-[11px] font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all group"
            >
              <User className="w-3.5 h-3.5 group-hover:text-electric-cyan transition-colors" />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 rounded-lg bg-white/5 text-starlight-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden bg-space-navy/95 backdrop-blur-xl border-b border-white/10"
          >
            <div className="p-6 flex flex-col space-y-6">
              <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-starlight-white font-medium flex items-center justify-between">
                Portfolio <span className="text-[10px] text-electric-cyan">Exploration</span>
              </Link>
              <Link href="#" onClick={() => setMobileMenuOpen(false)} className="text-starlight-white font-medium">Services</Link>
              <div className="h-[1px] bg-white/5 w-full" />
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-neon-purple font-bold">
                    <LayoutDashboard className="w-5 h-5" /> System Dashboard
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-neon-pink font-bold text-left">
                    <LogOut className="w-5 h-5" /> Terminate Session
                  </button>
                </>
              ) : (
                <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-starlight-white font-bold">
                  <User className="w-5 h-5" /> Admin Portal
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
