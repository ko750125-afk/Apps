import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy } from 'firebase/firestore';
import { AppData } from '@/data/apps';
import { revalidateAppCaches } from '@/lib/revalidate';

const COLLECTION_NAME = '18_apps_list';

export function useAdminDashboard() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchApps = useCallback(async () => {
    setLoading(true);
    setFetchError(null);

    if (!db) {
      setFetchError('ERR_DB_INIT_FAIL');
      setLoading(false);
      return;
    }

    try {
      const q = query(collection(db, COLLECTION_NAME), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);

      const data = snapshot.docs.map(d => ({
        id: d.id,
        ...d.data(),
      })) as AppData[];

      setApps(data);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      console.error('Error in fetchApps:', err);
      setFetchError(err.code || err.message || 'UNKNOWN_FETCH_ERROR');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  const filteredApps = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return apps.filter(
      app =>
        app.name.toLowerCase().includes(term) ||
        app.category.toLowerCase().includes(term) ||
        (app.description || '').toLowerCase().includes(term),
    );
  }, [apps, searchTerm]);

  const handleDelete = async (id: string): Promise<boolean> => {
    if (!id) {
      console.error('Delete failed: No ID provided');
      return false;
    }

    if (!window.confirm('정말로 이 프로젝트를 영구 삭제하시겠습니까?')) return false;
    if (!db) return false;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      setApps(prev => prev.filter(app => app.id !== id));
      await revalidateAppCaches(id);
      return true;
    } catch (error) {
      console.error('Error deleting app:', error);
      alert('삭제에 실패했습니다.');
      return false;
    }
  };

  return {
    apps: filteredApps,
    allApps: apps,
    loading,
    fetchError,
    searchTerm,
    setSearchTerm,
    handleDelete,
    refresh: fetchApps,
  };
}
