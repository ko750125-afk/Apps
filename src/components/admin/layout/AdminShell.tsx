'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 flex overflow-hidden">
      <Sidebar isCollapsed={isCollapsed} onToggle={() => setIsCollapsed(!isCollapsed)} />
      
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0",
          isCollapsed ? "ml-16" : "ml-64"
        )}
      >
        <Header />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(59,130,246,0.05),transparent_40%)] pointer-events-none" />
          
          <div className="max-w-7xl mx-auto p-6 md:p-8 relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
