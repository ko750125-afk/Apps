'use client';

import AppGrid from '@/components/layout/AppGrid';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center bg-[#fbfbfd]">
      {/* Hero Section */}
      <section className="relative w-full pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#e5e5ea] shadow-sm text-[#86868b] text-[11px] font-semibold tracking-wider mb-8">
            Portfolio 2026
          </div>
          <h1 className="font-semibold text-5xl md:text-7xl lg:text-8xl tracking-tight text-[#1d1d1f] mb-6">
            Antigravity<br/><span className="text-[#86868b]">Portfolio</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-[#86868b] font-medium leading-relaxed mb-10 mx-auto">
            A curated collection of web applications, productivity tools, and digital experiences.
          </p>
        </motion.div>
      </section>
      
      {/* Main Grid Section */}
      <section className="w-full relative z-10 py-10 bg-white border-t border-[#f5f5f7]">
        <AppGrid />
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center text-[#86868b] border-t border-[#f5f5f7] bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} Antigravity. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#1d1d1f] transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
