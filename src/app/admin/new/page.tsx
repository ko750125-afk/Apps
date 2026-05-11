'use client';

import React from 'react';
import AppForm from '@/components/admin/AppForm';
import { Plus } from 'lucide-react';

export default function NewAppPage() {
  return (
    <div>
      <div className="mb-12">
        <div className="flex items-center gap-4 mb-3">
          <div className="p-3 bg-accent/10 rounded-2xl shadow-inner shadow-accent/5">
            <Plus className="w-6 h-6 text-accent" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight">새 프로젝트 등록</h1>
            <p className="text-sm font-medium text-neutral-500">포트폴리오에 새로운 앱을 추가합니다.</p>
          </div>
        </div>
      </div>
      <AppForm />
    </div>
  );
}
