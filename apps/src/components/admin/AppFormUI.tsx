'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ─── Admin Form Field ─── */
export const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-2 group/field">
    <div className="flex items-center justify-between px-1">
      <label className="text-xs font-bold text-neutral-500 group-focus-within/field:text-blue-500 transition-colors">
        {label}
      </label>
      {hint && <span className="text-[10px] font-medium text-neutral-700">{hint}</span>}
    </div>
    <div className="relative">
      {children}
    </div>
  </div>
);

/* ─── Simplified Admin Inputs ─── */
export const inputClassName = 
  "w-full bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-3.5 text-sm text-neutral-200 placeholder:text-neutral-700 focus:outline-none focus:border-blue-500 transition-all";

export const selectClassName = 
  "w-full bg-neutral-950 border border-neutral-800 rounded-xl px-5 py-3.5 text-sm text-neutral-200 focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer";
