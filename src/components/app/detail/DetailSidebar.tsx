'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import { AppData, categoryLabelKo } from '@/data/apps';
import { formatUrl, formatAppDateForDisplay } from '@/lib/utils';
import InquiryModal from '@/components/inquiry/InquiryModal';

const DEFAULT_TECH: string[] = ['Next.js', 'TypeScript', 'Tailwind CSS'];

export const DetailSidebar = ({ app }: { app: AppData }) => {
  const [isInquiryOpen, setIsInquiryOpen] = React.useState(false);
  const techStack = app.techStack?.length ? app.techStack : DEFAULT_TECH;

  return (
    <aside className="space-y-10">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        className="sticky top-32 rounded-2xl border border-neutral-800 bg-neutral-900/90 p-8 md:p-9 space-y-8 backdrop-blur-sm"
      >
        <dl className="space-y-6 text-sm">
          <div>
            <dt className="text-zinc-400 mb-1">일자</dt>
            <dd className="text-white font-medium tracking-tight">{formatAppDateForDisplay(app.date)}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 mb-1">유형</dt>
            <dd className="text-white font-medium tracking-tight">{categoryLabelKo(app.category)}</dd>
          </div>
          <div>
            <dt className="text-zinc-400 mb-2">기술 스택</dt>
            <dd className="flex flex-wrap gap-2">
              {techStack.map((tech) => (
                <span
                  key={tech}
                  className="px-2.5 py-1 rounded-md bg-neutral-800/80 border border-neutral-700/80 text-zinc-200 text-xs font-medium"
                >
                  {tech}
                </span>
              ))}
            </dd>
          </div>
        </dl>

        <div className="pt-6 border-t border-neutral-800 space-y-3">
          {app.url && (
            <a
              href={formatUrl(app.url)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-full px-5 py-3.5 bg-neutral-800 text-white border border-neutral-700 rounded-xl text-sm font-semibold transition-colors hover:bg-neutral-700 hover:border-neutral-600 active:scale-[0.99]"
            >
              사이트 열기
              <ExternalLink className="w-4 h-4 ml-2 opacity-70" />
            </a>
          )}

          <button
            type="button"
            onClick={() => setIsInquiryOpen(true)}
            className="w-full px-5 py-3.5 bg-white text-neutral-950 rounded-xl text-sm font-semibold transition-colors hover:bg-neutral-200 active:scale-[0.99]"
          >
            상담 및 견적 문의
          </button>
        </div>
      </motion.div>

      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} preselectedApp={app} />
    </aside>
  );
};
