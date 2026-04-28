'use client';

import React from 'react';
import AppForm from '@/components/admin/AppForm';

export default function NewAppPage() {
  return (
    <div className="min-h-screen p-8 pt-24">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white tracking-tight">Register New App</h1>
          <p className="text-gray-400 mt-2">Add a new dimension to your cosmos portfolio</p>
        </div>
        <AppForm />
      </div>
    </div>
  );
}
