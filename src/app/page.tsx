import AppGrid from '@/components/layout/AppGrid';
import { Rocket } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Hero Section */}
      <section className="relative w-full pt-40 pb-20 px-6 flex flex-col items-center text-center overflow-hidden">
        {/* Admin Quick Access - Floating Top Right */}
        <div className="absolute top-8 right-8 z-50">
          <Link 
            href="/admin" 
            className="group flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 hover:border-electric-cyan/50 hover:bg-electric-cyan/5 transition-all duration-300"
          >
            <div className="w-2 h-2 rounded-full bg-electric-cyan animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-muted-steel group-hover:text-electric-cyan transition-colors">Admin Hub</span>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-electric-cyan/10 rounded-full blur-[120px] -z-10"
        />
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-electric-cyan text-[10px] font-bold uppercase tracking-[0.3em] mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-electric-cyan opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-electric-cyan"></span>
            </span>
            Neural Network Online
          </div>
          <h1 className="font-display font-black text-5xl md:text-7xl lg:text-8xl tracking-tighter text-starlight-white mb-6">
            CYBER <span className="gradient-text">COSMOS</span>
          </h1>
          <p className="max-w-2xl text-lg md:text-xl text-muted-steel font-light leading-relaxed mb-10">
            A sanctuary for experimental AI applications, futuristic tools, and digital artifacts forged in the antigravity chamber.
          </p>
        </motion.div>
      </section>
      
      {/* Main Grid Section */}
      <section className="w-full relative z-10 py-20 bg-space-black/20">
        <div className="max-w-7xl mx-auto px-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/10" />
            <h2 className="font-display font-bold text-2xl tracking-widest uppercase text-muted-steel/50">Project Sector</h2>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/10" />
          </div>
        </div>
        <AppGrid />
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center text-muted-steel border-t border-white/5 bg-space-black/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Cyber-Cosmos Portfolio. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-xs uppercase tracking-widest font-semibold">
            <Link href="/" className="hover:text-electric-cyan transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
