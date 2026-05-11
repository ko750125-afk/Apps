'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, User, ShieldCheck, MessageSquare } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useRouter, usePathname } from 'next/navigation';
import InquiryModal from '@/components/inquiry/InquiryModal';

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  
  const { scrollY } = useScroll();
  const headerBg = useTransform(
    scrollY,
    [0, 50],
    ['rgba(251, 251, 253, 0.8)', 'rgba(251, 251, 253, 0.95)']
  );
  const headerBlur = useTransform(
    scrollY,
    [0, 50],
    ['blur(10px)', 'blur(20px)']
  );

  useEffect(() => {
    if (!auth) return;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      
      // role 체크
      if (firebaseUser && db) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          const userData = userDoc.data();
          setIsAdmin(userData?.role === 'admin');
        } catch {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
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
    if (!auth) return;
    try {
      await signOut(auth);
      await fetch('/api/auth/session', { method: 'DELETE' });
      window.location.href = '/';
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <>
      <motion.header
        style={{ backgroundColor: headerBg, backdropFilter: headerBlur }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
          isScrolled ? "border-black/5 py-4 shadow-sm" : "border-transparent py-6"
        )}
      >
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="font-semibold text-xl tracking-tight text-[#1d1d1f]">
              RapidForge
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-[13px] font-medium text-[#1d1d1f] hover:text-black transition-colors">
              Apps
            </Link>

            {/* 문의하기 버튼 */}
            <button
              onClick={() => setIsInquiryOpen(true)}
              className="text-[13px] font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors flex items-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              문의하기
            </button>

            <div className="h-4 w-[1px] bg-black/10 mx-2" />
            
            {user ? (
              <div className="flex items-center gap-4">
                {/* 관리자만 Admin 링크 표시 */}
                {isAdmin && (
                  <Link 
                    href="/admin" 
                    className="flex items-center gap-1.5 text-[13px] font-medium text-[#0066cc] hover:text-[#004499] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                    Admin
                  </Link>
                )}
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-[#1d1d1f]">
                  <User className="w-4 h-4" />
                  {user.displayName || user.email?.split('@')[0] || 'Account'}
                </span>
                <button 
                  onClick={handleLogout}
                  className="text-[13px] font-medium text-[#86868b] hover:text-red-500 transition-colors flex items-center gap-1"
                  title="Logout"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            ) : (
              <Link 
                href="/login" 
                className="flex items-center gap-1 text-[13px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile Toggle */}
          <button 
            className="md:hidden p-2 text-[#1d1d1f]"
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
              className="md:hidden overflow-hidden bg-[#fbfbfd]/95 backdrop-blur-xl border-b border-black/5"
            >
              <div className="p-6 flex flex-col space-y-6">
                <Link href="/" onClick={() => setMobileMenuOpen(false)} className="text-[#1d1d1f] font-medium">
                  Apps
                </Link>
                <button 
                  onClick={() => { setMobileMenuOpen(false); setIsInquiryOpen(true); }}
                  className="flex items-center gap-3 text-[#1d1d1f] font-medium text-left"
                >
                  <MessageSquare className="w-5 h-5" /> 문의하기
                </button>
                <div className="h-[1px] bg-black/5 w-full" />
                {user ? (
                  <>
                    <span className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                      <User className="w-5 h-5" /> {user.displayName || user.email?.split('@')[0] || 'Account'}
                    </span>
                    {/* 관리자만 Admin 링크 표시 */}
                    {isAdmin && (
                      <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#0066cc] font-medium">
                        <ShieldCheck className="w-5 h-5" /> Admin Dashboard
                      </Link>
                    )}
                    <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-medium text-left">
                      <LogOut className="w-5 h-5" /> Logout
                    </button>
                  </>
                ) : (
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#86868b] font-medium">
                    <User className="w-5 h-5" /> Sign In
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      {/* 통합 문의 모달 */}
      <InquiryModal 
        isOpen={isInquiryOpen} 
        onClose={() => setIsInquiryOpen(false)} 
      />
    </>
  );
}
