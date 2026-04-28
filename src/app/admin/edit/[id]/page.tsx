'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AppData } from '@/data/apps';
import AppForm from '@/components/admin/AppForm';
import { Loader2 } from 'lucide-react';

export default function EditAppPage() {
  const params = useParams();
  const id = params.id as string;
  const [app, setApp] = useState<AppData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApp = async () => {
      try {
        const docRef = doc(db, '18_apps_list', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setApp({ id: docSnap.id, ...docSnap.data() } as AppData);
        } else {
          console.error('No such document!');
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
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        App not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Edit Application</h1>
          <p className="text-gray-400 mt-2">Modify the details of {app.name}</p>
        </div>
        <AppForm initialData={app} isEditing />
      </div>
    </div>
  );
}
