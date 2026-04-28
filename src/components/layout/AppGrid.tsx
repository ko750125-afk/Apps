'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { apps as staticApps, AppData, Category } from '@/data/apps';
import AppCard from '@/components/ui/AppCard';
import { cn } from '@/lib/utils';
import { Loader2, AlertTriangle } from 'lucide-react';

const categories: Category[] = [
  'All',
  'AI & Smart',
  'Productivity',
  'Utility & Tools',
  'Games & Edu',
  'Finance',
  'Others'
];

export default function AppGrid() {
  const [activeCategory, setActiveCategory] = useState<Category>('All');
  const [apps, setApps] = useState<AppData[]>(staticApps); // Start with static data for instant load
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchApps = async () => {
      // Check if API key is set
      if (!process.env.NEXT_PUBLIC_FIREBASE_API_KEY || process.env.NEXT_PUBLIC_FIREBASE_API_KEY === 'your_api_key') {
        console.warn('Firebase API key not found. Using static data.');
        setLoading(false);
        return;
      }

      try {
        const q = query(collection(db, '18_apps_list'), orderBy('name', 'asc'));
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const appsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as AppData[];
          setApps(appsData);
        }
      } catch (error) {
        console.error('Error fetching from Firestore, falling back to static data:', error);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchApps();
  }, []);

  const filteredApps = apps.filter(app => 
    activeCategory === 'All' ? true : app.category === activeCategory
  );

  return (
    <div className="w-full max-w-7xl mx-auto px-6 py-12">
      {/* Configuration Warning (Only shown if API key is invalid) */}
      {error && (
        <div className="mb-8 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3 text-amber-200 text-sm">
          <AlertTriangle className="w-5 h-5 flex-shrink-0" />
          <p>Firestore connection failed. Showing offline static data. Please check your Firebase configuration.</p>
        </div>
      )}

      {/* Category Filter */}
      <div className="flex flex-wrap justify-center gap-3 mb-20">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={cn(
              "relative px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-500 backdrop-blur-xl border overflow-hidden",
              activeCategory === category
                ? "bg-electric-cyan/20 border-electric-cyan text-electric-cyan shadow-[0_0_25px_rgba(0,240,255,0.4)] scale-105"
                : "bg-white/5 border-white/10 text-muted-steel hover:bg-white/10 hover:text-starlight-white hover:border-white/20"
            )}
          >
            {activeCategory === category && (
              <motion.div
                layoutId="activeFilter"
                className="absolute inset-0 bg-electric-cyan/10 -z-10"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
            <span className="relative z-10 tracking-wider">{category}</span>
          </button>
        ))}
      </div>

      {/* Grid with Staggered Children */}
      <motion.div 
        layout
        initial="hidden"
        animate="visible"
        variants={{
          visible: {
            transition: {
              staggerChildren: 0.1
            }
          }
        }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 auto-rows-fr"
      >
        <AnimatePresence mode="popLayout">
          {filteredApps.map((app, index) => (
            <motion.div
              key={app.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.2 } }}
              transition={{ duration: 0.5 }}
            >
              <AppCard app={app} index={index} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>
      
      {filteredApps.length === 0 && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-32 text-muted-steel font-display text-lg tracking-widest uppercase opacity-50"
        >
          No cosmic entities found in this sector.
        </motion.div>
      )}
    </div>
  );
}
