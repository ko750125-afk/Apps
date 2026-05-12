'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const COLLECTION_NAME = '18_apps_list';
const CONFIRMATION_PHRASE = 'DELETE ALL PROJECTS';

export default function DangerZonePage() {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deletedCount, setDeletedCount] = useState(0);

  const handleFullReset = async () => {
    if (confirmText !== CONFIRMATION_PHRASE) return;

    setIsDeleting(true);
    setStatus('idle');

    try {
      const firestore = db!;
      const snapshot = await getDocs(collection(firestore, COLLECTION_NAME));
      const batch = writeBatch(firestore);

      snapshot.docs.forEach((d) => {
        batch.delete(d.ref);
      });

      await batch.commit();
      setDeletedCount(snapshot.size);
      setStatus('success');
      setConfirmText('');
    } catch (error) {
      console.error('Reset failed:', error);
      setStatus('error');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 py-12">
      <Link
        href="/admin"
        className="absolute left-4 top-4 text-sm font-medium text-zinc-500 hover:text-zinc-300 md:left-8 md:top-8"
      >
        <span className="inline-flex items-center gap-1.5">
          <ArrowLeft className="h-4 w-4" />
          대시보드
        </span>
      </Link>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg rounded-lg border border-red-900/40 bg-zinc-900/30 p-8 text-center md:p-10"
      >
        <h1 className="text-xl font-semibold text-zinc-100">데이터 초기화</h1>
        <p className="mt-2 text-sm font-medium text-red-400">복구할 수 없습니다</p>

        <div className="mt-8 rounded-md border border-red-900/30 bg-red-950/20 p-4 text-left">
          <p className="text-sm leading-relaxed text-zinc-400">
            Firestore 컬렉션 <code className="rounded bg-zinc-950 px-1 py-0.5 text-xs text-zinc-300">{COLLECTION_NAME}</code> 의
            모든 문서가 삭제됩니다. 백업이 없다면 되돌릴 수 없습니다.
          </p>
        </div>

        <div className="mt-8 space-y-2 text-left">
          <label htmlFor="danger-confirm" className="text-xs font-medium text-zinc-500">
            아래 문구를 그대로 입력하세요: <span className="text-zinc-400">{CONFIRMATION_PHRASE}</span>
          </label>
          <input
            id="danger-confirm"
            type="text"
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            autoComplete="off"
            placeholder={CONFIRMATION_PHRASE}
            className="h-10 w-full rounded-md border border-zinc-800 bg-zinc-950 px-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-red-800 focus:outline-none focus:ring-1 focus:ring-red-900"
          />
        </div>

        <button
          type="button"
          onClick={handleFullReset}
          disabled={confirmText !== CONFIRMATION_PHRASE || isDeleting}
          className={
            confirmText === CONFIRMATION_PHRASE && !isDeleting
              ? 'mt-6 inline-flex h-10 w-full items-center justify-center rounded-md bg-red-600 text-sm font-medium text-white hover:bg-red-500'
              : 'mt-6 inline-flex h-10 w-full items-center justify-center rounded-md border border-zinc-800 bg-zinc-900 text-sm font-medium text-zinc-500'
          }
        >
          {isDeleting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              삭제 중…
            </>
          ) : (
            '전체 프로젝트 삭제'
          )}
        </button>

        <AnimatePresence>
          {status === 'success' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm font-medium text-emerald-400"
            >
              완료 — {deletedCount}건 삭제됨
            </motion.p>
          )}
          {status === 'error' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm font-medium text-red-400"
            >
              오류가 발생했습니다. 권한과 콘솔 로그를 확인하세요.
            </motion.p>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
