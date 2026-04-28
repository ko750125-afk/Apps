'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  doc, 
  setDoc, 
  query, 
  orderBy,
  writeBatch
} from 'firebase/firestore';
import { 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRightLeft, 
  Search,
  Database,
  ArrowRight,
  ShieldCheck,
  Zap,
  RefreshCw,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Source collection name
const DEFAULT_SOURCE_COLLECTION = '18_all_apps_registry';
const TARGET_COLLECTION = '18_apps_list';

export default function MigratePage() {
  const [sourceCollection, setSourceCollection] = useState(DEFAULT_SOURCE_COLLECTION);
  const [sourceApps, setSourceApps] = useState<AppData[]>([]);
  const [targetAppIds, setTargetAppIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);
  const [migratingId, setMigratingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [error, setError] = useState('');
  const [bulkMigrating, setBulkMigrating] = useState(false);

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setStatus('loading');
    try {
      const sourceQuery = query(collection(db, sourceCollection), orderBy('name', 'asc'));
      const sourceSnapshot = await getDocs(sourceQuery);
      const sourceData = sourceSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppData[];
      setSourceApps(sourceData);

      const targetSnapshot = await getDocs(collection(db, TARGET_COLLECTION));
      const targetIds = new Set(targetSnapshot.docs.map(doc => doc.id));
      setTargetAppIds(targetIds);
      
      setStatus('idle');
    } catch (err: any) {
      console.error('Fetch error:', err);
      setError(`Registry connection failed. Check collection name: "${sourceCollection}"`);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [sourceCollection]);

  const handleMigrateSingle = async (app: AppData, forceUpdate = false) => {
    setMigratingId(app.id);
    try {
      const portfolioData = {
        ...app,
        featured: app.featured || false,
        date: app.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        updatedAt: new Date().toISOString(),
        migrationSource: sourceCollection
      };

      await setDoc(doc(db, TARGET_COLLECTION, app.id), portfolioData);
      setTargetAppIds(prev => new Set(prev).add(app.id));
    } catch (err: any) {
      console.error('Migration error:', err);
      alert(`Migration failed: ${err.message}`);
    } finally {
      setMigratingId(null);
    }
  };

  const handleMigrateAll = async () => {
    const appsToMigrate = filteredApps.filter(app => !targetAppIds.has(app.id));
    if (appsToMigrate.length === 0) return;
    if (!confirm(`Migrate ${appsToMigrate.length} apps to portfolio?`)) return;

    setBulkMigrating(true);
    try {
      const batch = writeBatch(db);
      appsToMigrate.forEach(app => {
        const docRef = doc(db, TARGET_COLLECTION, app.id);
        batch.set(docRef, {
          ...app,
          featured: app.featured || false,
          updatedAt: new Date().toISOString(),
          migrationSource: sourceCollection
        });
      });
      await batch.commit();
      
      // Update local state
      const newIds = new Set(targetAppIds);
      appsToMigrate.forEach(app => newIds.add(app.id));
      setTargetAppIds(newIds);
    } catch (err: any) {
      alert(`Bulk migration failed: ${err.message}`);
    } finally {
      setBulkMigrating(false);
    }
  };

  const filteredApps = useMemo(() => 
    sourceApps.filter(app => 
      app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.category.toLowerCase().includes(searchTerm.toLowerCase())
    ), [sourceApps, searchTerm]
  );

  return (
    <div className="min-h-screen p-4 md:p-8 pt-24 bg-transparent selection:bg-cyan-500/30">
      <div className="max-w-6xl mx-auto">
        {/* Futuristic Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-8"
        >
          <div className="relative">
            <div className="flex items-center gap-4 mb-3">
              <div className="relative group">
                <div className="absolute -inset-2 bg-cyan-500/20 blur-xl group-hover:bg-cyan-500/40 transition-all rounded-full opacity-0 group-hover:opacity-100" />
                <div className="relative p-3 rounded-2xl bg-black/40 border border-cyan-500/30 shadow-lg shadow-cyan-500/10">
                  <ArrowRightLeft className="w-8 h-8 text-cyan-400" />
                </div>
              </div>
              <div>
                <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-2 uppercase">
                  Migration <span className="text-cyan-500">Hub</span>
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                  <p className="text-sm font-medium text-gray-500 tracking-widest uppercase">System Core / Registry Transfer</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors z-10" />
              <input 
                type="text"
                value={sourceCollection}
                onChange={(e) => setSourceCollection(e.target.value)}
                placeholder="Source Collection"
                className="relative bg-black/40 border border-white/10 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-all text-sm w-full md:w-64 backdrop-blur-md"
              />
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 text-sm font-bold active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              SYNC
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Sidebar Stats */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-3 space-y-6"
          >
            <div className="relative overflow-hidden group">
              <div className="absolute -inset-px bg-gradient-to-b from-cyan-500/20 to-transparent rounded-3xl" />
              <div className="relative bg-black/40 border border-white/10 backdrop-blur-2xl p-6 rounded-3xl">
                <div className="flex items-center gap-2 mb-6">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Pipeline Analysis</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-gray-500 text-xs font-medium">REGISTRY APPS</span>
                      <span className="text-2xl font-black text-white leading-none">{sourceApps.length}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: "100%" }}
                        className="h-full bg-gray-600"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-gray-500 text-xs font-medium">LIVE PORTFOLIO</span>
                      <span className="text-2xl font-black text-cyan-400 leading-none">{targetAppIds.size}</span>
                    </div>
                    <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(targetAppIds.size / Math.max(sourceApps.length, 1)) * 100}%` }}
                        className="h-full bg-cyan-500 shadow-[0_0_8px_#06b6d4]"
                      />
                    </div>
                  </div>

                  <div className="pt-6 mt-6 border-t border-white/5">
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-amber-500/5 border border-amber-500/10">
                      <ShieldCheck className="w-5 h-5 text-amber-500 shrink-0" />
                      <p className="text-[10px] text-amber-400 leading-relaxed font-medium">
                        Selective migration ensures only verified builds enter the portfolio stream.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <Link 
              href="/admin" 
              className="group relative flex items-center justify-center w-full py-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Exit to Dashboard</span>
            </Link>
          </motion.div>

          {/* Main Registry List */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full">
                <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type="text"
                  placeholder="Filter by name, category, or stack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full bg-black/40 border border-white/10 text-white pl-14 pr-4 py-5 rounded-3xl focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-xl group"
                />
              </div>
              
              <button
                onClick={handleMigrateAll}
                disabled={bulkMigrating || filteredApps.filter(a => !targetAppIds.has(a.id)).length === 0}
                className="w-full sm:w-auto px-8 py-5 rounded-3xl bg-white text-black font-black text-xs uppercase tracking-widest hover:bg-cyan-400 hover:text-black transition-all disabled:opacity-30 disabled:grayscale active:scale-95 shadow-xl shadow-white/5"
              >
                {bulkMigrating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : "Deploy Visible"}
              </button>
            </div>

            <div className="relative">
              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.03] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] rounded-3xl overflow-hidden" />

              {status === 'error' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/5 border border-red-500/20 p-12 rounded-[2rem] text-center backdrop-blur-md"
                >
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="absolute inset-0 bg-red-500/20 blur-2xl rounded-full animate-pulse" />
                    <AlertCircle className="relative w-full h-full text-red-500" />
                  </div>
                  <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">Connection Breached</h3>
                  <p className="text-red-400/80 text-sm mb-8 font-medium max-w-md mx-auto leading-relaxed">{error}</p>
                  <button onClick={fetchData} className="px-10 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all text-xs font-black uppercase tracking-widest active:scale-95">
                    Re-establish Link
                  </button>
                </motion.div>
              ) : status === 'loading' && sourceApps.length === 0 ? (
                <div className="py-32 text-center bg-black/20 rounded-[2rem] border border-white/5">
                  <div className="relative w-16 h-16 mx-auto mb-8">
                    <div className="absolute inset-0 border-t-2 border-cyan-500 rounded-full animate-spin" />
                    <div className="absolute inset-2 border-r-2 border-cyan-500/50 rounded-full animate-spin-slow" />
                  </div>
                  <p className="text-gray-500 font-bold uppercase tracking-[0.3em] text-[10px]">Accessing Secure Registry...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <AnimatePresence mode="popLayout">
                    {filteredApps.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-32 text-center bg-white/5 border border-white/10 border-dashed rounded-[2rem]"
                      >
                        <p className="text-gray-500 font-medium uppercase tracking-widest text-xs">No records found in current frequency.</p>
                      </motion.div>
                    ) : (
                      filteredApps.map((app, index) => {
                        const isMigrated = targetAppIds.has(app.id);
                        return (
                          <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            layout
                            className={cn(
                              "relative group p-6 rounded-[1.5rem] border transition-all duration-500 overflow-hidden",
                              isMigrated 
                                ? "bg-green-500/[0.03] border-green-500/20" 
                                : "bg-black/40 border-white/10 hover:border-cyan-500/30 hover:bg-white/[0.04] shadow-lg hover:shadow-cyan-500/5"
                            )}
                          >
                            {/* Background Glow */}
                            <div className={cn(
                              "absolute -top-12 -right-12 w-24 h-24 blur-[40px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700",
                              isMigrated ? "bg-green-500/20" : "bg-cyan-500/20"
                            )} />

                            <div className="relative flex items-center justify-between gap-4">
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1.5">
                                  <h4 className={cn(
                                    "font-black text-lg tracking-tighter truncate transition-colors",
                                    isMigrated ? "text-green-400/80" : "text-white group-hover:text-cyan-400"
                                  )}>
                                    {app.name}
                                  </h4>
                                  {isMigrated && (
                                    <div className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-green-500/10 border border-green-500/20">
                                      <CheckCircle2 className="w-3 h-3 text-green-500" />
                                      <span className="text-[8px] font-black text-green-500 uppercase tracking-tighter">Live</span>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-3">
                                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                                    {app.category}
                                  </span>
                                  {app.featured && (
                                    <div className="flex items-center gap-1">
                                      <Sparkles className="w-3 h-3 text-amber-400" />
                                      <span className="text-[8px] font-bold text-amber-400 uppercase tracking-tighter">Priority</span>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                <button
                                  onClick={() => handleMigrateSingle(app)}
                                  disabled={migratingId === app.id}
                                  className={cn(
                                    "relative px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[0.1em] transition-all overflow-hidden shrink-0",
                                    isMigrated
                                      ? "bg-white/5 text-gray-500 hover:bg-cyan-500 hover:text-black border border-white/5 hover:border-cyan-500"
                                      : "bg-cyan-600 text-white hover:bg-cyan-400 hover:text-black shadow-lg shadow-cyan-900/20 active:scale-90"
                                  )}
                                >
                                  {migratingId === app.id ? (
                                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                                  ) : isMigrated ? (
                                    <span className="flex items-center gap-2">Sync <RefreshCw className="w-3 h-3" /></span>
                                  ) : (
                                    <span className="flex items-center gap-2">Migrate <ArrowRight className="w-3 h-3" /></span>
                                  )}
                                </button>
                                
                                <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <Info className="w-3 h-3 text-gray-600" />
                                  <span className="text-[9px] text-gray-600 font-medium">v1.2.0</span>
                                </div>
                              </div>
                            </div>

                            {/* Hover Bar Indicator */}
                            <div className={cn(
                              "absolute bottom-0 left-0 h-[2px] transition-all duration-700",
                              isMigrated ? "bg-green-500/40 w-full" : "bg-cyan-500 w-0 group-hover:w-full shadow-[0_0_8px_#06b6d4]"
                            )} />
                          </motion.div>
                        );
                      })
                    )}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
