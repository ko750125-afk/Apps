'use client';

import React, { useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { AlertTriangle, Trash2, ShieldAlert, ArrowLeft, Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const COLLECTION_NAME = '18_apps_list';
const CONFIRMATION_PHRASE = "DELETE ALL PROJECTS";

export default function DangerZonePage() {
  const [confirmText, setConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [deletedCount, setDeletedCount] = useState(0);
  const router = useRouter();

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
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-6">
      <Link 
        href="/admin" 
        className="absolute top-10 left-10 flex items-center gap-2 text-neutral-500 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl w-full bg-black border-2 border-rose-600/30 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(225,29,72,0.15)] text-center space-y-10"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="w-24 h-24 bg-rose-600/10 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-pulse">
            <ShieldAlert className="w-12 h-12 text-rose-600" />
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight uppercase">Danger Zone</h1>
          <p className="text-rose-500 font-bold text-lg">⚠️ 데이터베이스 초기화 (복구 불가)</p>
        </div>

        {/* Warning Text */}
        <div className="bg-rose-600/5 border border-rose-600/20 rounded-2xl p-6 text-left space-y-3">
          <div className="flex items-center gap-2 text-rose-500 font-black text-sm">
            <AlertTriangle className="w-4 h-4" />
            READ CAREFULLY
          </div>
          <p className="text-neutral-400 text-sm leading-relaxed">
            이 작업을 실행하면 <span className="text-white font-bold">Firestore의 모든 프로젝트 데이터가 영구적으로 삭제</span>됩니다. 
            삭제된 데이터는 백업되지 않으며 절대로 복구할 수 없습니다. 계속하시려면 아래 확인 문구를 입력하세요.
          </p>
        </div>

        {/* Action Area */}
        <div className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest px-2">
              Type "{CONFIRMATION_PHRASE}" to confirm
            </label>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="문구를 정확히 입력하세요"
              className="w-full bg-neutral-900 border border-neutral-800 rounded-2xl px-6 py-4 text-white font-bold focus:border-rose-600 outline-none transition-all"
            />
          </div>

          <button 
            onClick={handleFullReset}
            disabled={confirmText !== CONFIRMATION_PHRASE || isDeleting}
            className={`w-full py-5 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-3 ${
              confirmText === CONFIRMATION_PHRASE && !isDeleting
                ? 'bg-rose-600 text-white hover:bg-rose-700 shadow-xl shadow-rose-600/20 active:scale-95'
                : 'bg-neutral-800 text-neutral-600 cursor-not-allowed'
            }`}
          >
            {isDeleting ? (
              <Loader2 className="w-6 h-6 animate-spin" />
            ) : (
              <>
                <Trash2 className="w-6 h-6" />
                DESTROY ALL DATA
              </>
            )}
          </button>
        </div>

        {/* Status Feedback */}
        <AnimatePresence>
          {status === 'success' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-emerald-500 font-bold"
            >
              성공! {deletedCount}개의 프로젝트가 삭제되었습니다.
            </motion.div>
          )}
          {status === 'error' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-rose-500 font-bold"
            >
              삭제 중 오류가 발생했습니다. 권한을 확인하세요.
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
