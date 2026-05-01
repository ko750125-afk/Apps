'use client';

import React from 'react';

/* ─── Clean Form Field ─── */
export const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-2 group">
    <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-widest px-1 group-focus-within:text-accent transition-colors">
      {label}
    </label>
    {children}
    {hint && <p className="text-[11px] text-neutral-600 px-1 leading-relaxed">{hint}</p>}
  </div>
);

/* ─── Input ─── */
export const inputClassName = 
  "w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-50 placeholder:text-neutral-700 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/50 transition-all hover:border-neutral-700";

export const selectClassName = 
  "w-full bg-neutral-900/50 border border-neutral-800 rounded-xl px-4 py-3 text-sm text-neutral-50 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/50 transition-all hover:border-neutral-700 appearance-none cursor-pointer";
