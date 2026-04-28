import AppGrid from '@/components/layout/AppGrid';
import { Rocket } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center">
      {/* Header Space */}
      <div className="w-full h-24" />
      
      {/* Main Grid Section */}
      <section className="w-full relative z-10 pt-10 pb-24">
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
            <Link href="/admin" className="hover:text-electric-cyan transition-colors opacity-50 hover:opacity-100">Admin</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
