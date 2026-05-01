'use client';

import React from 'react';
import AppForm from '@/components/admin/AppForm';
import { Plus } from 'lucide-react';

export default function NewAppPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <div className="p-2 bg-accent/10 rounded-lg">
            <Plus className="w-5 h-5 text-accent" />
          </div>
          <h1 className="text-xl font-bold text-neutral-50">Create New App</h1>
        </div>
        <p className="text-sm text-neutral-500 ml-12">Add a new application to your portfolio</p>
      </div>
      <AppForm />
    </div>
  );
}
