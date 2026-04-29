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
  Info,
  Edit3,
  Square,
  CheckSquare,
  ChevronRight
} from 'lucide-react';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

// Source collection name
const DEFAULT_SOURCE_COLLECTION = 'local';
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
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Fetch data
  const fetchData = async () => {
    setLoading(true);
    setStatus('loading');
    try {
      let sourceData: AppData[] = [];
      
      if (sourceCollection.toLowerCase() === 'local') {
        // Load from local apps.ts
        const { apps: localApps } = await import('@/data/apps');
        sourceData = [...localApps];
      } else {
        // Load from Firestore registry
        const sourceQuery = query(collection(db, sourceCollection), orderBy('name', 'asc'));
        const sourceSnapshot = await getDocs(sourceQuery);
        sourceData = sourceSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            ...data,
            id: doc.id // Ensure document ID is the ID we use
          };
        }) as AppData[];
      }
      
      setSourceApps(sourceData);

      const targetSnapshot = await getDocs(collection(db, TARGET_COLLECTION));
      const targetIds = new Set(targetSnapshot.docs.map(doc => doc.id));
      setTargetAppIds(targetIds);
      
      setStatus('idle');
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Fetch error:', error);
      setError(`Connection failed. Check collection name or local import: "${sourceCollection}"`);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
    }, 0);
    return () => clearTimeout(timer);
  }, [sourceCollection]);

  const handleMigrateSingle = async (app: AppData) => {
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
    } catch (err: unknown) {
      const error = err as Error;
      console.error('Migration error:', error);
      alert(`Migration failed: ${error.message}`);
    } finally {
      setMigratingId(null);
    }
  };

  const handleMigrateSelected = async () => {
    const appsToMigrate = sourceApps.filter(app => selectedIds.has(app.id));
    if (appsToMigrate.length === 0) return;
    
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
      
      const newIds = new Set(targetAppIds);
      appsToMigrate.forEach(app => newIds.add(app.id));
      setTargetAppIds(newIds);
      setSelectedIds(new Set());
    } catch (err: unknown) {
      const error = err as Error;
      alert(`Bulk migration failed: ${error.message}`);
    } finally {
      setBulkMigrating(false);
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    const visibleUnmigrated = filteredApps.filter(app => !targetAppIds.has(app.id));
    const allSelected = visibleUnmigrated.length > 0 && visibleUnmigrated.every(app => selectedIds.has(app.id));
    
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) {
        visibleUnmigrated.forEach(app => next.delete(app.id));
      } else {
        visibleUnmigrated.forEach(app => next.add(app.id));
      }
      return next;
    });
  };

  const filteredApps = sourceApps.filter(app => 
    app.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    app.category.toLowerCase().includes(searchTerm.toLowerCase())
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
                <h1 className="text-4xl font-black text-white tracking-tighter flex items-center gap-2 uppercase italic">
                  Migration <span className="text-cyan-500 underline decoration-cyan-500/30 underline-offset-8">Hub</span>
                </h1>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse shadow-[0_0_8px_#06b6d4]" />
                  <p className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase">Security Protocol: Active</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto items-center">
            <button
              onClick={() => {
                setSourceCollection('local');
                // Timeout needed to let state update before fetching
                setTimeout(fetchData, 50);
              }}
              className="px-4 py-3 rounded-2xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10 transition-all text-xs font-bold whitespace-nowrap"
            >
              Load apps.ts
            </button>
            <div className="relative group">
              <div className="absolute inset-0 bg-white/5 blur-md rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
              <Database className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-hover:text-cyan-400 transition-colors z-10" />
              <input 
                type="text"
                value={sourceCollection}
                onChange={(e) => setSourceCollection(e.target.value)}
                placeholder="'local' or collection"
                title="Type 'local' to use apps.ts, or type a Firestore collection name"
                className="relative bg-black/60 border border-white/10 text-white pl-11 pr-4 py-3 rounded-2xl focus:outline-none focus:border-cyan-500/50 transition-all text-xs font-bold w-full md:w-[200px] backdrop-blur-xl"
              />
            </div>
            <button 
              onClick={fetchData}
              disabled={loading}
              className="px-6 py-3 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 hover:bg-cyan-500/20 transition-all flex items-center justify-center gap-2 text-xs font-black tracking-widest active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              SYNC CORE
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
                  <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic">Pipeline Analysis</h3>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Registry</span>
                      <span className="text-2xl font-black text-white leading-none tracking-tighter">{sourceApps.length}</span>
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
                      <span className="text-gray-500 text-[10px] font-black uppercase tracking-wider">Live</span>
                      <span className="text-2xl font-black text-cyan-400 leading-none tracking-tighter">{targetAppIds.size}</span>
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
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/10">
                      <ShieldCheck className="w-5 h-5 text-cyan-500 shrink-0" />
                      <p className="text-[9px] text-cyan-400/80 leading-relaxed font-bold uppercase tracking-tight">
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
              <ChevronRight className="w-4 h-4 mr-2 text-gray-500 group-hover:translate-x-1 transition-transform" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
            </Link>
          </motion.div>

          {/* Main Registry List */}
          <div className="lg:col-span-9 space-y-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center">
              <div className="relative flex-1 w-full group">
                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-gray-500 group-focus-within:text-cyan-400 transition-colors" />
                </div>
                <input 
                  type="text"
                  placeholder="Filter by name, category, or stack..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full bg-black/40 border border-white/10 text-white pl-14 pr-4 py-5 rounded-[2rem] focus:outline-none focus:border-cyan-500/50 transition-all backdrop-blur-xl text-sm font-bold placeholder:text-gray-600"
                />
              </div>
              
              <div className="flex gap-2 w-full sm:w-auto">
                <button
                  onClick={selectAllVisible}
                  className="px-6 py-5 rounded-[2rem] bg-white/5 border border-white/10 text-white font-black text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95"
                >
                  Toggle All
                </button>
                <button
                  onClick={handleMigrateSelected}
                  disabled={bulkMigrating || selectedIds.size === 0}
                  className="flex-1 sm:flex-none px-10 py-5 rounded-[2rem] bg-cyan-600 text-white font-black text-[10px] uppercase tracking-widest hover:bg-cyan-500 transition-all disabled:opacity-30 disabled:grayscale active:scale-95 shadow-xl shadow-cyan-900/20"
                >
                  {bulkMigrating ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : `Deploy (${selectedIds.size})`}
                </button>
              </div>
            </div>

            <div className="relative">
              {/* Scanline Effect Overlay */}
              <div className="absolute inset-0 pointer-events-none z-10 opacity-[0.02] bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.5)_50%)] bg-[length:100%_4px] rounded-[2rem] overflow-hidden" />

              {status === 'error' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-500/5 border border-red-500/20 p-12 rounded-[2rem] text-center backdrop-blur-md"
                >
                  <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-black text-white mb-3 uppercase italic tracking-tighter">Link Severed</h3>
                  <p className="text-red-400/80 text-xs mb-8 font-bold uppercase tracking-widest">{error}</p>
                  <button onClick={fetchData} className="px-10 py-4 bg-red-500 text-white rounded-2xl hover:bg-red-600 transition-all text-[10px] font-black uppercase tracking-widest active:scale-95">
                    Retry Connection
                  </button>
                </motion.div>
              ) : status === 'loading' && sourceApps.length === 0 ? (
                <div className="py-32 text-center bg-black/20 rounded-[2rem] border border-white/5">
                  <Loader2 className="w-10 h-10 text-cyan-500 animate-spin mx-auto mb-6" />
                  <p className="text-gray-500 font-black uppercase tracking-[0.3em] text-[10px]">Retrieving Core Data...</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <AnimatePresence mode="popLayout">
                    {filteredApps.length === 0 ? (
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="col-span-full py-32 text-center bg-white/5 border border-white/10 border-dashed rounded-[2rem]"
                      >
                        <p className="text-gray-600 font-black uppercase tracking-widest text-[10px] italic">No compatible records detected.</p>
                      </motion.div>
                    ) : (
                      filteredApps.map((app, index) => {
                        const isMigrated = targetAppIds.has(app.id);
                        const isSelected = selectedIds.has(app.id);
                        
                        return (
                          <motion.div 
                            key={app.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.03 }}
                            layout
                            className={cn(
                              "relative group p-5 rounded-2xl border transition-all duration-300",
                              isSelected ? "bg-cyan-500/10 border-cyan-500/50" :
                              isMigrated 
                                ? "bg-white/[0.02] border-white/5 opacity-80" 
                                : "bg-black/40 border-white/10 hover:border-white/20"
                            )}
                          >
                            <div className="flex items-start gap-4">
                              {!isMigrated && (
                                <button 
                                  onClick={() => toggleSelect(app.id)}
                                  className="mt-1 transition-colors"
                                >
                                  {isSelected ? (
                                    <CheckSquare className="w-5 h-5 text-cyan-400" />
                                  ) : (
                                    <Square className="w-5 h-5 text-gray-600 group-hover:text-gray-400" />
                                  )}
                                </button>
                              )}
                              
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1">
                                  <h4 className={cn(
                                    "font-black text-base tracking-tighter truncate transition-colors uppercase italic",
                                    isMigrated ? "text-gray-500" : "text-white"
                                  )}>
                                    {app.name}
                                  </h4>
                                  {isMigrated && (
                                    <CheckCircle2 className="w-3 h-3 text-green-500/50" />
                                  )}
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className="text-[9px] font-black text-gray-600 uppercase tracking-widest">
                                    {app.category}
                                  </span>
                                  {app.featured && (
                                    <Sparkles className="w-2.5 h-2.5 text-amber-500/50" />
                                  )}
                                </div>
                              </div>

                              <div className="flex flex-col items-end gap-2">
                                {isMigrated ? (
                                  <div className="flex gap-2">
                                    <Link
                                      href={`/admin/edit/${app.id}`}
                                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-cyan-400 hover:border-cyan-500/30 transition-all"
                                      title="Edit Live Node"
                                    >
                                      <Edit3 className="w-3.5 h-3.5" />
                                    </Link>
                                    <button
                                      onClick={() => handleMigrateSingle(app)}
                                      disabled={migratingId === app.id}
                                      className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-green-400 hover:border-green-500/30 transition-all"
                                      title="Resync Node"
                                    >
                                      {migratingId === app.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={() => handleMigrateSingle(app)}
                                    disabled={migratingId === app.id}
                                    className="p-2.5 rounded-xl bg-cyan-600/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-600 hover:text-white transition-all active:scale-90"
                                  >
                                    {migratingId === app.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                                  </button>
                                )}
                              </div>
                            </div>
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
    </div>
  );
}
