'use client';

import React from 'react';
import { ChevronRight } from 'lucide-react';
import { AppData } from '@/data/apps';
import MarkdownRenderer from '@/components/ui/MarkdownRenderer';

export const DetailMainContent = ({ app }: { app: AppData }) => {
  return (
    <div className="space-y-16">
      <section className="space-y-8">
        <div className="flex items-center gap-4 text-white mb-10">
          <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-blue-600/10 border border-blue-600/20 text-blue-500 shadow-lg shadow-blue-600/5">
            <ChevronRight className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-black tracking-tight">Project Intelligence</h2>
        </div>
        
        {app.memo ? (
          <div className="prose prose-invert prose-lg max-w-none prose-neutral prose-headings:font-black prose-headings:tracking-tighter prose-a:text-blue-500 prose-img:rounded-[2.5rem] prose-img:shadow-2xl">
            <MarkdownRenderer content={app.memo} />
          </div>
        ) : (
          <div className="p-16 rounded-[3rem] bg-neutral-900/50 border-2 border-dashed border-neutral-800 text-center">
            <p className="text-neutral-500 font-medium leading-relaxed max-w-sm mx-auto">
              프로젝트의 심층 분석 데이터와 상세 명세가 아직 로드되지 않았습니다.
            </p>
          </div>
        )}
      </section>
    </div>
  );
};
