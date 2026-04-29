'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Menu, X, LogOut, LayoutDashboard, User } from 'lucide-react';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/firebase';
import { onAuthStateChanged, signOut, User as FirebaseUser } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';

export default function Header() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
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
            Portfolio
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-[13px] font-medium text-[#1d1d1f] hover:text-black transition-colors">
            Apps
          </Link>
          <Link href="#" className="text-[13px] font-medium text-[#86868b] hover:text-[#1d1d1f] transition-colors">
            About
          </Link>
          
          <div className="h-4 w-[1px] bg-black/10 mx-2" />
          
          {user ? (
            <div className="flex items-center gap-4">
              <Link 
                href="/admin" 
                className="flex items-center gap-2 text-[13px] font-medium text-[#1d1d1f] hover:text-[#0066cc] transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
                Admin
              </Link>
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
              href="/admin/login" 
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
              <Link href="#" onClick={() => setMobileMenuOpen(false)} className="text-[#86868b] font-medium">
                About
              </Link>
              <div className="h-[1px] bg-black/5 w-full" />
              {user ? (
                <>
                  <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#1d1d1f] font-medium">
                    <LayoutDashboard className="w-5 h-5" /> Admin
                  </Link>
                  <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-medium text-left">
                    <LogOut className="w-5 h-5" /> Logout
                  </button>
                </>
              ) : (
                <Link href="/admin/login" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#86868b] font-medium">
                  <User className="w-5 h-5" /> Sign In
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
