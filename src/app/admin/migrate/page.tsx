'use client';

import React, { useState } from 'react';
import { apps } from '@/data/apps';
import { db } from '@/lib/firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';

export default function MigratePage() {
  const [status, setStatus] = useState<'idle' | 'migrating' | 'success' | 'error'>('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  const handleMigrate = async () => {
    if (!confirm('This will upload all static apps to Firestore. Continue?')) return;
    
    setStatus('migrating');
    setProgress(0);
    
    try {
      const appsCollection = collection(db, '18_apps_list');
      
      for (let i = 0; i < apps.length; i++) {
        const app = apps[i];
        // We use the same ID as the static data to avoid duplicates if run multiple times
        const appRef = doc(appsCollection, app.id);
        await setDoc(appRef, app);
        setProgress(Math.round(((i + 1) / apps.length) * 100));
      }
      
      setStatus('success');
    } catch (err: any) {
      console.error('Migration error:', err);
      setError(err.message);
      setStatus('error');
    }
  };

  return (
    <div className="min-h-screen p-8 pt-24 flex items-center justify-center">
      <div className="max-w-md w-full bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-2xl text-center">
        <h1 className="text-2xl font-bold text-white mb-4">Data Migration</h1>
        <p className="text-gray-400 mb-8">
          Upload {apps.length} applications from static data to Firebase Firestore.
        </p>

        {status === 'idle' && (
          <button
            onClick={handleMigrate}
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white font-medium py-3 rounded-lg transition-all shadow-lg shadow-cyan-500/20"
          >
            Start Migration
          </button>
        )}

        {status === 'migrating' && (
          <div className="space-y-4">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto" />
            <div className="text-white font-medium">Migrating... {progress}%</div>
            <div className="w-full bg-white/10 rounded-full h-2">
              <div 
                className="bg-cyan-500 h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        )}

        {status === 'success' && (
          <div className="space-y-4">
            <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto" />
            <div className="text-white font-medium">Migration Complete!</div>
            <p className="text-gray-400 text-sm">All apps have been uploaded to Firestore.</p>
            <button
              onClick={() => window.location.href = '/admin'}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all"
            >
              Go to Dashboard
            </button>
          </div>
        )}

        {status === 'error' && (
          <div className="space-y-4">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto" />
            <div className="text-white font-medium">Migration Failed</div>
            <p className="text-red-400 text-sm">{error}</p>
            <button
              onClick={() => setStatus('idle')}
              className="w-full bg-white/10 hover:bg-white/20 text-white font-medium py-2 rounded-lg transition-all"
            >
              Try Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
