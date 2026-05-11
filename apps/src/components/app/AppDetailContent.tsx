'use client';

import React from 'react';
import { AppData } from '@/data/apps';
import { DetailNavigation } from './detail/DetailNavigation';
import { DetailHeader } from './detail/DetailHeader';
import { DetailHero } from './detail/DetailHero';
import { DetailMainContent } from './detail/DetailMainContent';
import { DetailSidebar } from './detail/DetailSidebar';
import DetailInquiries from './detail/DetailInquiries';

interface AppDetailContentProps {
  app: AppData;
}

export default function AppDetailContent({ app }: AppDetailContentProps) {
  return (
    <main className="min-h-screen bg-neutral-950 text-neutral-50 relative overflow-hidden">
      {/* ... existing bg effects ... */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50%] h-[50%] bg-blue-600/5 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[50%] h-[50%] bg-purple-600/5 blur-[120px] rounded-full animate-pulse [animation-delay:2s]" />
      </div>

      <div className="relative z-10">
        <DetailNavigation app={app} />

        <div className="max-w-7xl mx-auto px-6 py-12 md:py-24">
          <DetailHeader app={app} />
          <DetailHero app={app} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            <div className="lg:col-span-8">
              <DetailMainContent app={app} />
            </div>
            <div className="lg:col-span-4">
              <DetailSidebar app={app} />
            </div>
          </div>

          {/* Q&A Section */}
          <DetailInquiries app={app} />
        </div>
      </div>
    </main>
  );
}
