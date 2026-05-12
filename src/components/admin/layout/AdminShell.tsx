'use client';

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { cn } from '@/lib/utils';

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex overflow-hidden antialiased">
      {/* Sidebar Overlay (Mobile only) */}
        {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[55] md:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed md:relative z-[60] transition-transform duration-300 md:translate-x-0",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <Sidebar 
          isCollapsed={isCollapsed} 
          onToggle={() => setIsCollapsed(!isCollapsed)} 
          onClose={() => setIsMobileOpen(false)}
        />
      </div>
      
      {/* Main Content */}
      <div 
        className={cn(
          "flex-1 flex flex-col transition-all duration-300 min-w-0 w-full"
        )}
      >
        <Header onMenuClick={() => setIsMobileOpen(true)} />
        
        <main className="flex-1 overflow-y-auto overflow-x-hidden relative bg-zinc-950">
          <div className="max-w-6xl mx-auto p-4 md:p-8 md:pl-6 relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
