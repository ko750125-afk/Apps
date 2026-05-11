import AppGrid from '@/components/layout/AppGrid';
import Link from 'next/link';
import HomeHero from '@/components/home/HomeHero';
import { getApps } from '@/lib/server-apps';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Home',
  description: 'A curated collection of premium web applications and digital tools by RapidForge.',
};

export default async function Home() {
  const apps = await getApps();

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#fbfbfd]">
      {/* Hero Section */}
      <HomeHero />
      
      {/* Main Grid Section */}
      <section className="w-full relative z-10 py-10 bg-white border-t border-[#f5f5f7]">
        <AppGrid initialApps={apps} />
      </section>

      {/* Footer */}
      <footer className="w-full py-12 text-center text-[#86868b] border-t border-[#f5f5f7] bg-[#fbfbfd]">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-sm font-medium">
            &copy; {new Date().getFullYear()} RapidForge. All rights reserved.
          </p>
          <div className="flex items-center space-x-6 text-sm font-medium">
            <Link href="/" className="hover:text-[#1d1d1f] transition-colors">Home</Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
