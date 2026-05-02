import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { apps as staticApps, AppData } from '@/data/apps';

const COLLECTION_NAME = '18_apps_list';

function isFirebaseReady(): boolean {
  return !!(
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY &&
    process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key' &&
    db
  );
}

export function useApps(initialApps?: AppData[]) {
  const [apps, setApps] = useState<AppData[]>(initialApps || staticApps);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!isFirebaseReady()) {
      console.warn('Firebase API key missing or db not initialized. Using static fallback data.');
      setLoading(false);
      return;
    }

    const q = query(collection(db!, COLLECTION_NAME), orderBy('name', 'asc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          setApps(snapshot.docs.map(d => ({ id: d.id, ...d.data() } as AppData)));
        } else {
          console.info('Firestore collection is empty. Using static fallback data.');
          setApps(staticApps);
        }
        setError(false);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore sync error:', err);
        setError(true);
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { apps, loading, error };
}
