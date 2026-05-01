import React, { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { AppData } from '@/data/apps';

export function useAdminDashboard() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const fetchApps = React.useCallback(async () => {
    setLoading(true);
    setFetchError(null);
    try {
      if (!db) {
        setFetchError('ERR_DB_INIT_FAIL');
        return;
      }
      
      const appsCollection = collection(db, '18_apps_list');
      const q = query(appsCollection, orderBy('name', 'asc'));
      const querySnapshot = await getDocs(q);
      
      const appsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as AppData[];
      
      setApps(appsData);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Error in fetchApps:', err);
      setFetchError(err.code || err.message || 'UNKNOWN_FETCH_ERROR');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    Promise.resolve().then(() => fetchApps());
  }, [fetchApps]);

  const handleDelete = async (id: string) => {
    if (!confirm('CONFIRM DELETION?')) return false;

    try {
      if (!db) return false;
      await deleteDoc(doc(db, '18_apps_list', id));
      setApps(prev => prev.filter(app => app.id !== id));
      return true;
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('ERR_DELETE');
      return false;
    }
  };

  return {
    apps,
    loading,
    fetchError,
    handleDelete,
    refresh: fetchApps
  };
}
