'use client';

import React, { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import {
  collection, getDocs, doc, setDoc, query, orderBy, writeBatch
} from 'firebase/firestore';
import {
  Loader2, CheckCircle2, AlertCircle, ArrowRightLeft, Search,
  Database, ArrowRight, RefreshCw, Pencil, Square, CheckSquare
} from 'lucide-react';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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

  const fetchData = async () => {
    if (!db) {
      setError('Firebase DB not initialized');
      setStatus('error');
      return;
    }
    setLoading(true);
    setStatus('loading');
    try {
      let sourceData: AppData[] = [];
      if (sourceCollection.toLowerCase() === 'local') {
        const { apps: localApps } = await import('@/data/apps');
        sourceData = [...localApps];
      } else {
        const sourceQuery = query(collection(db, sourceCollection), orderBy('name', 'asc'));
        const sourceSnapshot = await getDocs(sourceQuery);
        sourceData = sourceSnapshot.docs.map(d => ({ ...d.data(), id: d.id })) as AppData[];
      }
      setSourceApps(sourceData);

      const targetSnapshot = await getDocs(collection(db, TARGET_COLLECTION));
      setTargetAppIds(new Set(targetSnapshot.docs.map(d => d.id)));
      setStatus('idle');
    } catch (err: unknown) {
      const e = err as Error;
      setError(`Failed to load from "${sourceCollection}": ${e.message}`);
      setStatus('error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 0);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceCollection]);

  const handleMigrateSingle = async (app: AppData) => {
    if (!db) return;
    setMigratingId(app.id);
    try {
      await setDoc(doc(db, TARGET_COLLECTION, app.id), {
        ...app,
        featured: app.featured || false,
        date: app.date || new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        updatedAt: new Date().toISOString(),
        migrationSource: sourceCollection,
      });
      setTargetAppIds(prev => new Set(prev).add(app.id));
    } catch (err: unknown) {
      alert(`Migration failed: ${(err as Error).message}`);
    } finally {
      setMigratingId(null);
    }
  };

  const handleMigrateSelected = async () => {
    if (!db) return;
    const currentDb = db;
    const apps = sourceApps.filter(a => selectedIds.has(a.id));
    if (apps.length === 0) return;
    setBulkMigrating(true);
    try {
      const batch = writeBatch(currentDb);
      apps.forEach(app => {
        batch.set(doc(currentDb, TARGET_COLLECTION, app.id), {
          ...app,
          featured: app.featured || false,
          updatedAt: new Date().toISOString(),
          migrationSource: sourceCollection,
        });
      });
      await batch.commit();
      const newIds = new Set(targetAppIds);
      apps.forEach(a => newIds.add(a.id));
      setTargetAppIds(newIds);
      setSelectedIds(new Set());
    } catch (err: unknown) {
      alert(`Bulk migration failed: ${(err as Error).message}`);
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
    const unmigrated = filteredApps.filter(a => !targetAppIds.has(a.id));
    const allSelected = unmigrated.length > 0 && unmigrated.every(a => selectedIds.has(a.id));
    setSelectedIds(prev => {
      const next = new Set(prev);
      if (allSelected) unmigrated.forEach(a => next.delete(a.id));
      else unmigrated.forEach(a => next.add(a.id));
      return next;
    });
  };

  const filteredApps = sourceApps.filter(a =>
    a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    a.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const migratedCount = sourceApps.filter(a => targetAppIds.has(a.id)).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-accent/10 rounded-lg">
              <ArrowRightLeft className="w-5 h-5 text-accent" />
            </div>
            <h1 className="text-xl font-bold text-neutral-50">Migration</h1>
          </div>
          <p className="text-sm text-neutral-500 ml-12">Sync apps from source to portfolio</p>
        </div>

        <div className="flex items-center gap-3">
          {/* Source selector */}
          <div className="relative">
            <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-500" />
            <input
              type="text"
              value={sourceCollection}
              onChange={(e) => setSourceCollection(e.target.value)}
              placeholder="Source collection"
              className="bg-neutral-900 border border-neutral-700 rounded-lg pl-9 pr-4 py-2 text-sm text-neutral-50 w-44 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
            />
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
            Refresh
          </button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4">
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Source</p>
          <p className="text-3xl font-bold text-neutral-50">{sourceApps.length}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Migrated</p>
          <p className="text-3xl font-bold text-green-400">{migratedCount}</p>
        </div>
        <div className="bg-neutral-900 border border-neutral-800 rounded-xl p-5">
          <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-2">Pending</p>
          <p className="text-3xl font-bold text-amber-400">{sourceApps.length - migratedCount}</p>
        </div>
      </section>

      {/* Search + Bulk Actions */}
      <section className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-800 rounded-lg pl-11 pr-4 py-2.5 text-sm text-neutral-50 placeholder:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent transition-all"
          />
        </div>
        <button
          onClick={selectAllVisible}
          className="px-4 py-2.5 text-sm font-medium text-neutral-300 bg-neutral-800 hover:bg-neutral-700 rounded-lg border border-neutral-700 transition-colors"
        >
          Toggle All
        </button>
        <button
          onClick={handleMigrateSelected}
          disabled={bulkMigrating || selectedIds.size === 0}
          className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-accent hover:bg-accent-hover rounded-lg transition-colors disabled:opacity-30"
        >
          {bulkMigrating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
          Migrate ({selectedIds.size})
        </button>
      </section>

      {/* App List */}
      <section className="bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
        {status === 'error' ? (
          <div className="p-12 text-center">
            <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-neutral-200 mb-2">Connection Failed</h3>
            <p className="text-sm text-neutral-500 mb-6">{error}</p>
            <button
              onClick={fetchData}
              className="px-6 py-2.5 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors"
            >
              Retry
            </button>
          </div>
        ) : status === 'loading' && sourceApps.length === 0 ? (
          <div className="p-16 text-center">
            <Loader2 className="w-6 h-6 text-neutral-500 animate-spin mx-auto mb-3" />
            <p className="text-sm text-neutral-500">Loading source data...</p>
          </div>
        ) : filteredApps.length === 0 ? (
          <div className="p-16 text-center">
            <p className="text-sm text-neutral-500">No apps found matching your search.</p>
          </div>
        ) : (
          <div className="divide-y divide-neutral-800/50">
            {filteredApps.map((app) => {
              const isMigrated = targetAppIds.has(app.id);
              const isSelected = selectedIds.has(app.id);

              return (
                <div
                  key={app.id}
                  className={cn(
                    "flex items-center gap-4 px-6 py-4 transition-colors",
                    isSelected ? "bg-accent/5" : "hover:bg-neutral-800/30"
                  )}
                >
                  {/* Checkbox */}
                  {!isMigrated ? (
                    <button onClick={() => toggleSelect(app.id)} className="flex-shrink-0">
                      {isSelected ? (
                        <CheckSquare className="w-5 h-5 text-accent" />
                      ) : (
                        <Square className="w-5 h-5 text-neutral-600 hover:text-neutral-400" />
                      )}
                    </button>
                  ) : (
                    <CheckCircle2 className="w-5 h-5 text-green-500/50 flex-shrink-0" />
                  )}

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <span className={cn(
                      "text-sm font-medium truncate block",
                      isMigrated ? "text-neutral-500" : "text-neutral-100"
                    )}>
                      {app.name}
                    </span>
                    <span className="text-xs text-neutral-500">{app.category}</span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    {isMigrated && (
                      <Link
                        href={`/admin/edit/${app.id}`}
                        className="p-2 rounded-lg text-neutral-500 hover:text-accent hover:bg-accent/10 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </Link>
                    )}
                    <button
                      onClick={() => handleMigrateSingle(app)}
                      disabled={migratingId === app.id}
                      className={cn(
                        "p-2 rounded-lg transition-colors disabled:opacity-50",
                        isMigrated
                          ? "text-neutral-500 hover:text-green-400 hover:bg-green-500/10"
                          : "text-accent hover:bg-accent/10"
                      )}
                      title={isMigrated ? "Re-sync" : "Migrate"}
                    >
                      {migratingId === app.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : isMigrated ? (
                        <RefreshCw className="w-3.5 h-3.5" />
                      ) : (
                        <ArrowRight className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
