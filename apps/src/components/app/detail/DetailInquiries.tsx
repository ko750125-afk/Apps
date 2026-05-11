'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, User, CheckCircle2, ChevronDown, ChevronUp, Lock, Unlock } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppData } from '@/data/apps';

interface PublicInquiry {
  id: string;
  userName: string;
  content: string;
  adminResponse?: string;
  isPublic: boolean;
  status: 'pending' | 'answered';
  createdAt: string;
}

export default function DetailInquiries({ app }: { app: AppData }) {
  const [inquiries, setInquiries] = useState<PublicInquiry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(
      collection(db, 'rapidforge_inquiries'),
      where('appId', '==', app.id)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as PublicInquiry))
        // 답변 완료된 것만 표시 (pending 상태는 숨김)
        .filter(item => item.status === 'answered')
        // 최신순 정렬
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      setInquiries(data);
    }, (error) => {
      console.error("Firestore Q&A Error:", error);
    });

    return () => unsubscribe();
  }, [app.id]);

  if (inquiries.length === 0) return null;

  return (
    <section className="mt-20 pt-20 border-t border-neutral-900">
      <div className="flex items-center gap-4 mb-12">
        <div className="w-12 h-12 rounded-2xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 shadow-lg shadow-blue-600/5">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-3xl font-black text-white tracking-tight">Project Q&A</h2>
          <p className="text-neutral-500 text-sm font-medium">이 프로젝트에 대해 다른 사용자들이 문의한 내용입니다.</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs font-black text-neutral-600 bg-neutral-900 px-4 py-2 rounded-full border border-neutral-800">
            {inquiries.length}건의 문의
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {inquiries.map((inquiry) => {
          const isExpanded = expandedId === inquiry.id;
          const isPublic = inquiry.isPublic;

          return (
            <div 
              key={inquiry.id}
              className={cn(
                "group bg-neutral-900/50 border rounded-[2rem] overflow-hidden transition-all",
                isPublic 
                  ? "border-neutral-800 hover:border-neutral-700" 
                  : "border-neutral-800/50 hover:border-neutral-800"
              )}
            >
              <button 
                onClick={() => setExpandedId(isExpanded ? null : inquiry.id)}
                className="w-full p-8 flex items-start justify-between text-left"
              >
                <div className="flex items-start gap-4">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    isPublic ? "bg-neutral-800 text-neutral-500" : "bg-neutral-800/50 text-neutral-600"
                  )}>
                    <User className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className="text-sm font-bold text-white">{inquiry.userName.charAt(0)}**</span>
                      <span className="text-[10px] text-neutral-600 font-black uppercase tracking-widest">
                        {new Date(inquiry.createdAt).toLocaleDateString()}
                      </span>
                      {/* 비공개 배지 */}
                      {!isPublic && (
                        <span className="flex items-center gap-1 text-[10px] font-black text-neutral-600 bg-neutral-800/80 px-2 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" />
                          비공개
                        </span>
                      )}
                    </div>
                    {isPublic ? (
                      <p className="text-neutral-300 text-sm leading-relaxed line-clamp-1 group-hover:line-clamp-none transition-all">
                        {inquiry.content}
                      </p>
                    ) : (
                      <p className="text-neutral-500 text-sm leading-relaxed italic">
                        비공개 문의입니다. 답변이 완료되었습니다.
                      </p>
                    )}
                  </div>
                </div>
                <div className="shrink-0 ml-4 flex items-center gap-2">
                  {/* 답변 완료 표시 */}
                  <span className={cn(
                    "text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-full",
                    isPublic 
                      ? "text-emerald-500 bg-emerald-500/10" 
                      : "text-neutral-600 bg-neutral-800/50"
                  )}>
                    답변완료
                  </span>
                  {isPublic && (
                    isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-neutral-600" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-neutral-600" />
                    )
                  )}
                </div>
              </button>

              {/* 공개 문의만 답변 펼치기 가능 */}
              <AnimatePresence>
                {isExpanded && isPublic && inquiry.adminResponse && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    {/* 공개 문의 내용 (펼쳤을 때) */}
                    <div className="px-8 pb-2">
                      <div className="bg-black/20 border border-neutral-800/50 rounded-2xl p-6">
                        <p className="text-[10px] font-black text-neutral-600 uppercase tracking-widest mb-2">문의 내용</p>
                        <p className="text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">{inquiry.content}</p>
                      </div>
                    </div>
                    
                    {/* 관리자 답변 */}
                    <div className="px-8 pb-8 pt-2">
                      <div className="flex items-start gap-4 bg-blue-600/5 border border-blue-600/10 p-6 rounded-2xl">
                        <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-600/20">
                          <CheckCircle2 className="w-5 h-5" />
                        </div>
                        <div>
                          <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Admin Response</p>
                          <p className="text-sm text-neutral-200 leading-relaxed whitespace-pre-wrap">
                            {inquiry.adminResponse}
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 비공개 문의 펼쳤을 때 - 간략한 안내만 */}
              <AnimatePresence>
                {isExpanded && !isPublic && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-8 pb-8">
                      <div className="flex items-center gap-3 bg-neutral-800/30 border border-neutral-800/50 p-5 rounded-2xl text-neutral-500 text-sm">
                        <Lock className="w-4 h-4 shrink-0" />
                        <span>이 문의는 비공개로 답변이 완료되었습니다. 문의자에게 직접 답변이 전달되었습니다.</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
}
