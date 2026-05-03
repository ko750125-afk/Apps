'use client';

import React from 'react';

/* ─── Clean Form Field ─── */
export const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-1.5 group">
    <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-[0.2em] px-1 group-focus-within:text-accent transition-colors">
      {label}
    </label>
    {children}
    {hint && <p className="text-[10px] text-neutral-600 px-1 leading-relaxed">{hint}</p>}
  </div>
);

/* ─── Input ─── */
export const inputClassName = 
  "w-full bg-neutral-900/30 border border-neutral-800/40 rounded-2xl px-5 py-4 text-sm text-neutral-100 placeholder:text-neutral-700 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all hover:bg-neutral-900/50";

export const selectClassName = 
  "w-full bg-neutral-900/30 border border-neutral-800/40 rounded-2xl px-5 py-4 text-sm text-neutral-100 focus:outline-none focus:ring-4 focus:ring-accent/5 focus:border-accent/30 transition-all hover:bg-neutral-900/50 appearance-none cursor-pointer";
