'use client';

import React from 'react';
import { AppData } from '@/data/apps';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

export const DetailMainContent = ({ app }: { app: AppData }) => {
  return (
    <div className="space-y-16">
      <section className="space-y-8">
        {app.memo ? (
          <div className="prose prose-lg max-w-none prose-img:rounded-2xl prose-img:shadow-xl prose-hr:border-zinc-800">
            <MarkdownRenderer content={app.memo} variant="dark" />
          </div>
        ) : (
          <div className="p-16 rounded-[2rem] bg-neutral-900/50 border border-dashed border-neutral-800 text-center">
            <p className="text-zinc-400 font-medium leading-relaxed max-w-sm mx-auto">
              프로젝트 상세 명세가 아직 등록되지 않았습니다.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
