'use client';

import React from 'react';
import { cn } from '@/lib/utils';

/* ─── Admin Form Field ─── */
export const FormField = ({ label, children, hint }: { label: string; children: React.ReactNode; hint?: string }) => (
  <div className="space-y-1.5 group/field">
    <div className="flex items-center justify-between gap-2 px-0.5">
      <label className="text-xs font-medium text-zinc-500">{label}</label>
      {hint && <span className="text-[11px] text-zinc-600">{hint}</span>}
    </div>
    <div className="relative">{children}</div>
  </div>
);

/* ─── Simplified Admin Inputs ─── */
export const inputClassName =
  'w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600';

export const selectClassName =
  'w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600 appearance-none cursor-pointer';
