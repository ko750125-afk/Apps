'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Category, CATEGORIES } from '@/data/apps';
import AppCard from '@/components/ui/AppCard';
import { useApps } from '@/hooks/useApps';
import { cn } from '@/lib/utils';
import { AlertTriangle } from 'lucide-react';
import { AppData } from '@/data/apps';

interface AppGridProps {
  initialApps?: AppData[];
}

export default function AppGrid({ initialApps }: AppGridProps) {
  const { apps, error, loading } = useApps(initialApps);
  const [activeCategory, setActiveCategory] = useState<Category>('All apps');

  const filteredApps = useMemo(() => {
    return apps.filter(app => {
      const matchesCategory = activeCategory === 'All apps' || app.category === activeCategory;
      return matchesCategory && app.status !== 'Repair';
    });
  }, [apps, activeCategory]);

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Filter Header */}
      <div className="flex flex-col items-center gap-8 mb-20">
        <CategoryFilter active={activeCategory} onChange={setActiveCategory} />
      </div>

      {error && <ConnectionWarning />}

      {/* App Grid */}
      <motion.div 
        layout
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr"
        role="list"
        aria-label="Application List"
      >
        <AnimatePresence mode="popLayout">
          {filteredApps.map((app, index) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              role="listitem"
            >
              <AppCard app={app} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {!loading && filteredApps.length === 0 && <EmptyState />}
    </div>
  );
}

// Sub-components for cleaner structure
function CategoryFilter({ active, onChange }: { active: Category, onChange: (c: Category) => void }) {
  return (
    <nav className="flex flex-wrap justify-center gap-3" aria-label="Category filtering">
      {CATEGORIES.map((category) => (
        <button
          key={category}
          onClick={() => onChange(category)}
          aria-pressed={active === category}
          className={cn(
            "relative px-6 py-3 rounded-full text-sm font-bold transition-all duration-300 border",
            category === 'All apps' 
              ? "px-16 py-4 text-base bg-[#1d1d1f] text-white border-[#1d1d1f] shadow-lg shadow-black/10" 
              : "bg-transparent border-[#f5f5f7] text-[#86868b]",
            active === category && category !== 'All apps'
              ? "text-white border-[#1d1d1f]" 
              : category !== 'All apps' && "hover:text-[#1d1d1f] hover:border-[#d2d2d7]"
          )}
        >
          {active === category && (
            <motion.div
              layoutId="activeFilter"
              className="absolute inset-0 bg-[#1d1d1f] rounded-full -z-10"
              transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
            />
          )}
          <span className="relative z-10">{category}</span>
        </button>
      ))}
    </nav>
  );
}

function ConnectionWarning() {
  return (
    <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-600 text-sm animate-in fade-in slide-in-from-top-2">
      <AlertTriangle className="w-5 h-5 flex-shrink-0" />
      <p>Firestore connection failed. Showing offline static data.</p>
    </div>
  );
}

function EmptyState() {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="text-center py-32 flex flex-col items-center gap-4"
    >
      <p className="text-[#86868b] font-medium text-lg">No applications found in this category.</p>
    </motion.div>
  );
}
