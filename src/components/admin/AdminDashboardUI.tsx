'use client';

import React from 'react';
import Image from 'next/image';
import { AppData } from '@/data/apps';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search } from 'lucide-react';
import { cn, getAppImage } from '@/lib/utils';

const StatCard = ({ label, value }: { label: string; value: number | string }) => (
  <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/20 px-4 py-3">
    <p className="text-xs font-medium text-zinc-500">{label}</p>
    <p className="mt-1 text-2xl font-semibold tracking-tight text-zinc-100 tabular-nums">{value}</p>
  </div>
);

const ProjectDesktopRow = ({
  app,
  onDelete,
  confirmDeleteId,
  setConfirmDeleteId,
}: {
  app: AppData;
  onDelete: (id: string) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
}) => (
  <motion.tr
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="border-b border-zinc-800/60 last:border-0 hover:bg-zinc-900/25"
  >
    <td className="py-3 pl-4 pr-3 md:py-4 md:pl-5">
      <div className="flex items-center gap-3">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
          {(() => {
            const displayImg = getAppImage(app);
            return displayImg ? (
              <Image src={displayImg} alt="" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs font-medium text-zinc-600">
                {app.name.charAt(0)}
              </div>
            );
          })()}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-zinc-100 truncate">{app.name}</p>
          <p className="text-xs text-zinc-500 truncate">{app.category}</p>
        </div>
      </div>
    </td>
    <td className="py-3 px-3 md:py-4">
      <span
        className={cn(
          'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium',
          app.status === 'Repair'
            ? 'border-red-900/50 bg-red-950/30 text-red-300'
            : 'border-zinc-700 bg-zinc-900/50 text-zinc-300',
        )}
      >
        {app.status === 'Repair' ? '점검' : '활성'}
      </span>
    </td>
    <td className="py-3 pr-4 pl-3 text-right md:py-4 md:pr-5">
      <ActionButtons
        app={app}
        onDelete={onDelete}
        confirmDeleteId={confirmDeleteId}
        setConfirmDeleteId={setConfirmDeleteId}
      />
    </td>
  </motion.tr>
);

const ProjectMobileCard = ({
  app,
  onDelete,
  confirmDeleteId,
  setConfirmDeleteId,
}: {
  app: AppData;
  onDelete: (id: string) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 6 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col gap-4 border-b border-zinc-800/60 py-5 last:border-0"
  >
    <div className="flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-zinc-800 bg-zinc-900">
          {(() => {
            const displayImg = getAppImage(app);
            return displayImg ? (
              <Image src={displayImg} alt="" fill className="object-cover" unoptimized />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-sm font-medium text-zinc-600">
                {app.name.charAt(0)}
              </div>
            );
          })()}
        </div>
        <div className="min-w-0">
          <p className="font-medium text-zinc-100 truncate">{app.name}</p>
          <p className="text-xs text-zinc-500">{app.category}</p>
        </div>
      </div>
      <span
        className={cn(
          'shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium',
          app.status === 'Repair'
            ? 'border-red-900/50 bg-red-950/30 text-red-300'
            : 'border-zinc-700 bg-zinc-900/50 text-zinc-300',
        )}
      >
        {app.status === 'Repair' ? '점검' : '활성'}
      </span>
    </div>
    <ActionButtons
      app={app}
      onDelete={onDelete}
      confirmDeleteId={confirmDeleteId}
      setConfirmDeleteId={setConfirmDeleteId}
      fullWidth
    />
  </motion.div>
);

const ActionButtons = ({
  app,
  onDelete,
  confirmDeleteId,
  setConfirmDeleteId,
  fullWidth = false,
}: {
  app: AppData;
  onDelete: (id: string) => void;
  confirmDeleteId: string | null;
  setConfirmDeleteId: (id: string | null) => void;
  fullWidth?: boolean;
}) => (
  <div className={cn('flex flex-wrap items-center justify-end gap-2', fullWidth && 'w-full')}>
    <AnimatePresence mode="wait">
      {confirmDeleteId === app.id ? (
        <motion.div
          key="confirm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            'flex flex-wrap items-center justify-center gap-2 rounded-md border border-red-900/40 bg-red-950/20 px-3 py-2',
            fullWidth && 'w-full',
          )}
        >
          <span className="text-xs font-medium text-red-300">삭제할까요?</span>
          <button
            type="button"
            onClick={() => {
              onDelete(app.id);
              setConfirmDeleteId(null);
            }}
            className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-500"
          >
            삭제
          </button>
          <button
            type="button"
            onClick={() => setConfirmDeleteId(null)}
            className="rounded-md border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800"
          >
            취소
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="actions"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={cn('flex gap-2', fullWidth && 'w-full')}
        >
          <Link
            href={`/admin/edit/${app.id}`}
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-md border border-zinc-700 bg-zinc-900 px-3 text-xs font-medium text-zinc-200 hover:bg-zinc-800',
              fullWidth && 'flex-1',
            )}
          >
            수정
          </Link>
          <button
            type="button"
            onClick={() => setConfirmDeleteId(app.id)}
            className={cn(
              'inline-flex h-9 items-center justify-center rounded-md border border-red-900/50 bg-transparent px-3 text-xs font-medium text-red-400 hover:bg-red-950/40',
              fullWidth && 'flex-1',
            )}
          >
            삭제
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

export const AdminDashboardContent = ({ children }: { children: React.ReactNode }) => (
  <div className="space-y-8">{children}</div>
);

export const DashboardHeader = () => (
  <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h1 className="text-xl font-semibold tracking-tight text-zinc-50">프로젝트</h1>
      <p className="mt-0.5 text-sm text-zinc-500">등록된 앱을 확인하고 수정합니다.</p>
    </div>
    <Link
      href="/admin/new"
      className="inline-flex h-9 items-center justify-center gap-2 rounded-md bg-zinc-100 px-4 text-sm font-medium text-zinc-950 hover:bg-zinc-200"
    >
      <Plus className="h-4 w-4 opacity-80" />
      새 프로젝트
    </Link>
  </header>
);

export const QuickStats = ({ apps }: { apps: AppData[] }) => {
  const stats = [
    { label: '전체', value: apps.length },
    { label: '추천', value: apps.filter((a) => a.featured).length },
    { label: '활성', value: apps.filter((a) => a.status === 'Exhibit').length },
    { label: '점검', value: apps.filter((a) => a.status === 'Repair').length },
  ];

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {stats.map((stat) => (
        <StatCard key={stat.label} label={stat.label} value={stat.value} />
      ))}
    </div>
  );
};

export const DashboardTable = ({
  apps,
  searchTerm,
  setSearchTerm,
  onDelete,
}: {
  apps: AppData[];
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  onDelete: (id: string) => void;
}) => {
  const [confirmDeleteId, setConfirmDeleteId] = React.useState<string | null>(null);

  return (
    <section className="overflow-hidden rounded-lg border border-zinc-800/80 bg-zinc-900/15">
      <div className="flex flex-col gap-4 border-b border-zinc-800/80 p-4 md:flex-row md:items-center md:justify-between md:px-5 md:py-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-200">목록</h2>
          <p className="text-xs text-zinc-500 mt-0.5">{apps.length}건</p>
        </div>
        <div className="relative w-full md:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-500" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="검색…"
            className="h-9 w-full rounded-md border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
          />
        </div>
      </div>

      <div className="w-full">
        <table className="hidden w-full border-collapse text-sm md:table">
          <thead>
            <tr className="border-b border-zinc-800/80 text-left text-xs font-medium text-zinc-500">
              <th className="py-2 pl-5 pr-3 font-medium">프로젝트</th>
              <th className="py-2 px-3 font-medium">상태</th>
              <th className="py-2 pr-5 pl-3 text-right font-medium">동작</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {apps.map((app) => (
                <ProjectDesktopRow
                  key={app.id}
                  app={app}
                  onDelete={onDelete}
                  confirmDeleteId={confirmDeleteId}
                  setConfirmDeleteId={setConfirmDeleteId}
                />
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        <div className="md:hidden">
          <AnimatePresence mode="popLayout">
            {apps.length === 0 ? (
              <div className="px-4 py-12 text-center text-sm text-zinc-500">항목이 없습니다.</div>
            ) : (
              apps.map((app) => (
                <ProjectMobileCard
                  key={app.id}
                  app={app}
                  onDelete={onDelete}
                  confirmDeleteId={confirmDeleteId}
                  setConfirmDeleteId={setConfirmDeleteId}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
