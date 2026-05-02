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
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 text-accent animate-spin" />
        <p className="text-sm font-medium text-neutral-500">데이터를 불러오는 중입니다...</p>
      </div>
    );
  }

  if (!app) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-8">
        <div className="w-16 h-16 bg-rose-500/10 rounded-2xl flex items-center justify-center mb-6">
          <AlertCircle className="w-8 h-8 text-rose-500" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">프로젝트를 찾을 수 없습니다</h2>
        <p className="text-sm text-neutral-500">요청하신 ID(&quot;{id}&quot;)의 앱 정보를 가져올 수 없습니다.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-accent/10 rounded-2xl shadow-inner shadow-accent/5">
            <Pencil className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight">프로젝트 정보 수정</h1>
            <p className="text-sm font-medium text-neutral-500">
              <span className="text-accent font-bold">&quot;{app.name}&quot;</span> 프로젝트의 세부 사항을 업데이트합니다.
            </p>
          </div>
        </div>
      </div>
      <AppForm initialData={app} isEditing />
    </div>
  );
}
