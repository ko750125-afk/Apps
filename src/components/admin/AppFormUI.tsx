'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ─── High-Tech Form Field ─── */
export const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-3 group/field">
    <div className="flex items-center justify-between px-2">
      <label className="text-[10px] font-black text-neutral-600 uppercase tracking-[0.3em] group-focus-within/field:text-indigo-400 transition-all duration-500 group-hover/field:text-neutral-400">
        {label}
      </label>
      {hint && <span className="text-[9px] font-bold text-neutral-700 uppercase tracking-widest">{hint}</span>}
    </div>
    <div className="relative">
      {children}
      {/* Subtle background glow on focus */}
      <div className="absolute -inset-1 rounded-2xl bg-indigo-500/0 group-focus-within/field:bg-indigo-500/5 blur-md pointer-events-none transition-all duration-700" />
    </div>
  </div>
);

/* ─── Cyberpunk Inputs ─── */
export const inputClassName = 
  "w-full bg-neutral-900/60 border border-neutral-800/80 rounded-2xl px-6 py-5 text-sm text-neutral-100 placeholder:text-neutral-800 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/60 focus:bg-neutral-900 transition-all duration-500 shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md selection:bg-indigo-500/30";

export const selectClassName = 
  "w-full bg-neutral-900/60 border border-neutral-800/80 rounded-2xl px-6 py-5 text-sm text-neutral-100 focus:outline-none focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/60 focus:bg-neutral-900 transition-all duration-500 appearance-none cursor-pointer shadow-[inset_0_2px_4px_rgba(0,0,0,0.3)] backdrop-blur-md";
