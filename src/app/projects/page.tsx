import AppGrid from '@/components/layout/AppGrid';
import { getApps } from '@/lib/server-apps';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Projects | RapidForge',
  description: 'Explore our collection of premium web applications.',
};

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const apps = await getApps();

  return (
    <main className="flex min-h-screen flex-col items-center bg-[#fbfbfd] py-20">
      <div className="max-w-7xl w-full px-6">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f] mb-4">
          All Projects
        </h1>
        <p className="text-xl text-[#86868b] mb-12 max-w-2xl">
          A comprehensive list of all applications built and maintained by RapidForge.
        </p>
        
        <div className="bg-white rounded-3xl border border-[#f5f5f7] p-8 md:p-12 shadow-sm">
          <AppGrid initialApps={apps} />
        </div>
      </div>
    </main>
  );
}
