import { useState, useEffect, useMemo, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, query, orderBy, addDoc } from 'firebase/firestore';
import { AppData } from '@/data/apps';
import { revalidateAppCaches } from '@/lib/revalidate';

/* ─── Constants & Types ─── */
const COLLECTION_NAME = '18_apps_list';

const SAMPLE_PROJECTS: Omit<AppData, 'id'>[] = [
  {
    name: 'LuxeReserve',
    url: 'luxereserve.example.com',
    category: 'Reservation & Booking',
    date: new Date().toISOString(),
    featured: true,
    description: 'A premium hotel and villa reservation system with real-time availability and dynamic pricing engine.',
    status: 'Exhibit',
    memo: '### 🛠 Technical Specifications\n- **Frontend Framework**: Next.js, React\n- **Backend Architecture**: Firebase Cloud Firestore',
    image: '/apps/luxe.png'
  },
  {
    name: 'NovaDash AI',
    url: 'novadash.example.com',
    category: 'Admin Dashboard',
    date: new Date().toISOString(),
    featured: true,
    description: 'Next-generation analytics dashboard powered by AI to provide predictive business insights.',
    status: 'Exhibit',
    memo: '### 🛠 Technical Specifications\n- **AI Engine**: OpenAI API\n- **Analytics**: Real-time business insights',
    image: '/apps/nova.png'
  },
  {
    name: 'EcoShop Plus',
    url: 'ecoshop.example.com',
    category: 'E-commerce',
    date: new Date().toISOString(),
    featured: false,
    description: 'Sustainable e-commerce platform focused on ethical brands and eco-friendly delivery logistics.',
    status: 'Exhibit',
    image: '/apps/ecoshop.png'
  },
  {
    name: 'FlowAutomate',
    url: 'flow.example.com',
    category: 'Automation & Tools',
    date: new Date().toISOString(),
    featured: false,
    description: 'Enterprise-grade workflow automation tool that connects disparate cloud services seamlessly.',
    status: 'Repair',
    memo: 'System maintenance in progress',
    image: '/apps/flow.png'
  }
];

export function useAdminDashboard() {
  const [apps, setApps] = useState<AppData[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Core Fetching Logic
  const fetchApps = useCallback(async () => {
    if (!db) {
      setFetchError('ERR_DB_INIT_FAIL');
      setLoading(false);
      return;
    }

    setLoading(true);
    setFetchError(null);

    try {
      const firestore = db!;
      const q = query(collection(firestore, COLLECTION_NAME), orderBy('name', 'asc'));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() })) as AppData[];
      setApps(data);
    } catch (error: any) {
      console.error('Fetch error:', error);
      
      // 권한 에러 시 Bypass 상태라면 샘플 데이터로 조용히 폴백
      const isBypassed = typeof window !== 'undefined' && localStorage.getItem('admin_bypass') === 'true';
      if (error.message?.includes('permissions') && isBypassed) {
        setApps(SAMPLE_PROJECTS.map((p, i) => ({ ...p, id: `mock-${i}` })));
      } else {
        setFetchError(error.code || error.message || 'UNKNOWN_ERROR');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApps();
  }, [fetchApps]);

  // 2. Memoized Filter
  const filteredApps = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return apps.filter(app => 
      [app.name, app.category, app.description].some(field => 
        (field || '').toLowerCase().includes(term)
      )
    );
  }, [apps, searchTerm]);

  // 3. Document Management
  const handleDelete = async (id: string): Promise<boolean> => {
    if (!id || !db) return false;
    if (!window.confirm('🚨 이 프로젝트를 영구 삭제하시겠습니까?')) return false;

    try {
      await deleteDoc(doc(db, COLLECTION_NAME, id));
      await revalidateAppCaches(id);
      
      setApps(prev => prev.filter(app => app.id !== id));
      alert('✅ 삭제되었습니다.');
      return true;
    } catch (error) {
      console.error('Delete fail:', error);
      alert('❌ 삭제에 실패했습니다. (권한 없음)');
      return false;
    }
  };

  const handleSeed = async () => {
    if (!db) return;
    if (!confirm('샘플 데이터 4개를 추가 생성하시겠습니까?')) return;

    setLoading(true);
    try {
      const firestore = db!;
      await Promise.all(SAMPLE_PROJECTS.map(app => addDoc(collection(firestore, COLLECTION_NAME), app)));
      alert('✅ 샘플 데이터(4건) 생성 완료!');
      await fetchApps();
    } catch (error) {
      console.error('Seed error:', error);
      alert('❌ 데이터 생성 실패');
    } finally {
      setLoading(false);
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
    handleSeed,
    refresh: fetchApps,
  };
}
