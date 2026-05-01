'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppData } from '@/data/apps';
import AppForm from '@/components/admin/AppForm';
import { Loader2, Pencil, AlertCircle } from 'lucide-react';

export default function EditAppPage() {
  const params = useParams();
  const id = params.id as string;
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      if (!db) {
        console.error('Firebase is not initialized');
        setLoading(false);
        return;
      }
      try {
        const docRef = doc(db, '18_apps_list', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApp({ id: docSnap.id, ...docSnap.data() } as AppData);
        }
      } catch (error) {
        console.error('Error fetching app:', error);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchApp();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader2 className="w-6 h-6 text-neutral-500 animate-spin mb-3" />
        <p className="text-sm text-neutral-500">Loading app data...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <AlertCircle className="w-8 h-8 text-red-400 mb-3" />
        <h2 className="text-lg font-semibold text-neutral-200 mb-1">App Not Found</h2>
        <p className="text-sm text-neutral-500">The app with ID &quot;{id}&quot; could not be found.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Pencil className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-neutral-50">Edit App</h1>
        </div>
        <p className="text-sm text-neutral-500 ml-12">
          Editing <span className="text-neutral-300 font-medium">{app.name}</span>
        </p>
      </div>
      <AppForm initialData={app} isEditing />
    </div>
  );
}
