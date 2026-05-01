import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { apps as staticApps, AppData } from '@/data/apps';

export function useApps(initialApps?: AppData[]) {
  const [apps, setApps] = useState<AppData[]>(initialApps || staticApps);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const isFirebaseConfigured = process.env.NEXT_PUBLIC_FIREBASE_API_KEY && 
                                process.env.NEXT_PUBLIC_FIREBASE_API_KEY !== 'your_api_key';

    if (!isFirebaseConfigured || !db) {
      console.warn('Firebase API key missing or db not initialized. Using static fallback data.');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setLoading(false);
      return;
    }

    const q = query(collection(db, '18_apps_list'), orderBy('name', 'asc'));
    
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      try {
        if (!querySnapshot.empty) {
          const appsData = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as AppData[];
          setApps(appsData);
        } else {
          console.info('Firestore collection is empty. Using static fallback data.');
          setApps(staticApps);
        }
        setError(false);
      } catch (err) {
        console.error('Data processing error:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    }, (err) => {
      console.error('Firestore sync error:', err);
      setError(true);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { apps, loading, error };
}
