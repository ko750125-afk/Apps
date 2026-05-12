'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardUI';
import { Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Inquiry {
  id: string;
  userId: string;
  userEmail: string;
  userName: string;
  category: 'project' | 'new' | 'other';
  appId: string;
  appName: string;
  budget?: string;
  content: string;
  status: 'pending' | 'answered';
  isPublic: boolean;
  createdAt: string;
  phoneNumber?: string;
}

const CATEGORY_LABELS: Record<string, { label: string; className: string }> = {
  project: { label: '프로젝트', className: 'border-zinc-700 bg-zinc-900 text-zinc-300' },
  new: { label: '신규', className: 'border-zinc-700 bg-zinc-900 text-zinc-300' },
  other: { label: '기타', className: 'border-zinc-700 bg-zinc-900 text-zinc-300' },
};

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (!db) return;
    const q = query(collection(db, 'rapidforge_inquiries'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Inquiry));
      setInquiries(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const fetchUserDetails = async (uid: string) => {
    if (!db) return;
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (userDoc.exists()) {
      setUserDetails(userDoc.data());
    }
  };

  const [response, setResponse] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const InfoCard = ({ title, value, subValue }: { title: string; value: string; subValue?: string }) => (
    <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/20 px-4 py-3">
      <p className="text-xs font-medium text-zinc-500">{title}</p>
      <p className="mt-1 text-sm font-medium text-zinc-100">{value}</p>
      {subValue && <p className="mt-1 text-xs text-zinc-500">{subValue}</p>}
    </div>
  );

  const InquiryListItem = ({ inquiry, isSelected, onClick }: { inquiry: Inquiry, isSelected: boolean, onClick: () => void }) => (
    <motion.div
      layoutId={inquiry.id}
      onClick={onClick}
      className={cn(
        'cursor-pointer rounded-lg border p-4 transition-colors',
        isSelected
          ? 'border-zinc-600 bg-zinc-900/40'
          : 'border-zinc-800/80 bg-zinc-900/10 hover:border-zinc-700 hover:bg-zinc-900/25',
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h3 className="font-medium text-zinc-100 truncate">{inquiry.userName}</h3>
          <div className="mt-1 flex flex-wrap items-center gap-2">
            <span
              className={cn(
                'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium',
                CATEGORY_LABELS[inquiry.category || 'project']?.className || 'border-zinc-700 bg-zinc-900 text-zinc-400',
              )}
            >
              {CATEGORY_LABELS[inquiry.category || 'project']?.label || inquiry.appName}
            </span>
            {inquiry.appName && inquiry.category === 'project' && (
              <span className="text-xs text-zinc-500 truncate">{inquiry.appName}</span>
            )}
          </div>
        </div>
        <span
          className={cn(
            'shrink-0 rounded-md border px-2 py-0.5 text-xs font-medium',
            inquiry.status === 'answered'
              ? 'border-zinc-600 bg-zinc-800 text-zinc-300'
              : 'border-amber-900/40 bg-amber-950/25 text-amber-200/90',
          )}
        >
          {inquiry.status === 'answered' ? '답변됨' : '대기'}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-zinc-500">{inquiry.content}</p>
      <p className="mt-3 text-xs text-zinc-600">
        {new Date(inquiry.createdAt).toLocaleString()}
      </p>
    </motion.div>
  );

  const handleInquiryClick = async (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setResponse((inquiry as any).adminResponse || '');
    setUserDetails(null);
    fetchUserDetails(inquiry.userId);
  };

  const saveResponse = async () => {
    if (!db || !selectedInquiry) return;
    setIsUpdating(true);
    try {
      await updateDoc(doc(db, 'rapidforge_inquiries', selectedInquiry.id), { 
        adminResponse: response,
        status: response ? 'answered' : 'pending'
      });
      
      const updatedInquiry = { 
        ...selectedInquiry, 
        status: (response ? 'answered' : 'pending') as 'pending' | 'answered', 
        adminResponse: response
      };
      setSelectedInquiry(updatedInquiry as any);
      
      alert('답변이 성공적으로 저장되었습니다.');
    } catch (err) {
      console.error('Error saving response:', err);
      alert('저장 중 오류가 발생했습니다.');
    } finally {
      setIsUpdating(false);
    }
  };

  const togglePublic = async () => {
    if (!db || !selectedInquiry) return;
    const newPublic = !selectedInquiry.isPublic;
    
    // Optimistic UI update
    const previousInquiry = { ...selectedInquiry };
    setSelectedInquiry({ ...selectedInquiry, isPublic: newPublic });
    
    try {
      await updateDoc(doc(db, 'rapidforge_inquiries', selectedInquiry.id), { isPublic: newPublic });
    } catch (err) {
      console.error('Error toggling public state:', err);
      // Revert on failure
      setSelectedInquiry(previousInquiry);
      alert('상태 변경에 실패했습니다.');
    }
  };

  if (loading) {
    return (
      <AdminDashboardContent>
        <div className="min-h-[50vh] flex flex-col items-center justify-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
          <p className="text-sm text-zinc-500">불러오는 중…</p>
        </div>
      </AdminDashboardContent>
    );
  }

  return (
    <AdminDashboardContent>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-xl font-semibold text-zinc-50">문의</h1>
          <p className="mt-1 text-sm text-zinc-500">접수·답변을 관리합니다.</p>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12 lg:gap-8">
          {/* Inquiry List */}
          <div className="space-y-3 lg:col-span-7">
            {inquiries.length === 0 ? (
              <div className="rounded-lg border border-dashed border-zinc-800 bg-zinc-900/15 px-6 py-14 text-center">
                <p className="text-sm text-zinc-500">접수된 문의가 없습니다.</p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <InquiryListItem 
                  key={inquiry.id}
                  inquiry={inquiry}
                  isSelected={selectedInquiry?.id === inquiry.id}
                  onClick={() => handleInquiryClick(inquiry)}
                />
              ))
            )}
          </div>

          {/* Inquiry Detail Sidebar */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              {selectedInquiry ? (
                <motion.div
                  key="detail"
                  initial={{ opacity: 0, x: 12 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 12 }}
                  className="sticky top-6 space-y-6 rounded-lg border border-zinc-800/80 bg-zinc-900/20 p-5 md:p-6"
                >
                  <div className="space-y-5">
                    <div className="flex items-center justify-between gap-3">
                      <h2 className="text-base font-semibold text-zinc-100">상세</h2>
                      <button
                        type="button"
                        onClick={togglePublic}
                        className={cn(
                          'rounded-md border px-3 py-1.5 text-xs font-medium transition-colors',
                          selectedInquiry.isPublic
                            ? 'border-zinc-600 bg-zinc-800 text-zinc-100'
                            : 'border-zinc-800 text-zinc-500 hover:bg-zinc-900',
                        )}
                      >
                        {selectedInquiry.isPublic ? '공개' : '비공개'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-3 rounded-lg border border-zinc-800/80 bg-zinc-950/40 p-4">
                        <div className="flex gap-2 text-sm">
                          <span className="w-10 shrink-0 text-zinc-500">메일</span>
                          <span className="text-zinc-200 break-all">{selectedInquiry.userEmail}</span>
                        </div>
                        <div className="flex gap-2 text-sm">
                          <span className="w-10 shrink-0 text-zinc-500">전화</span>
                          <span className="text-zinc-200">
                            {userDetails?.phoneNumber || '—'}
                          </span>
                        </div>
                      </div>

                      <InfoCard
                        title="유형"
                        value={CATEGORY_LABELS[selectedInquiry.category || 'project']?.label || selectedInquiry.appName}
                        subValue={
                          selectedInquiry.category === 'project' && selectedInquiry.appName
                            ? `프로젝트: ${selectedInquiry.appName}`
                            : undefined
                        }
                      />

                      {selectedInquiry.budget && (
                        <InfoCard title="예산" value={selectedInquiry.budget} />
                      )}
                    </div>

                    <div className="space-y-2">
                      <p className="text-xs font-medium text-zinc-500">내용</p>
                      <div className="rounded-md border border-zinc-800 bg-zinc-950/50 p-4 text-sm leading-relaxed text-zinc-300 whitespace-pre-wrap">
                        {selectedInquiry.content}
                      </div>
                    </div>

                    <div className="space-y-2 border-t border-zinc-800/80 pt-5">
                      <p className="text-xs font-medium text-zinc-500">답변 (노출용)</p>
                      <textarea
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="고객에게 보여 줄 답변을 입력하세요."
                        className="min-h-[7.5rem] w-full rounded-md border border-zinc-800 bg-zinc-950 p-3 text-sm text-zinc-100 placeholder:text-zinc-600 focus:border-zinc-600 focus:outline-none focus:ring-1 focus:ring-zinc-600"
                      />
                      <button
                        type="button"
                        onClick={saveResponse}
                        disabled={isUpdating}
                        className="h-9 w-full rounded-md bg-zinc-100 text-sm font-medium text-zinc-950 hover:bg-zinc-200 disabled:opacity-50"
                      >
                        {isUpdating ? '저장 중…' : '저장'}
                      </button>
                    </div>

                    <div className="pt-1">
                      <a
                        href={`mailto:${selectedInquiry.userEmail}`}
                        className="block w-full rounded-md border border-zinc-800 py-2.5 text-center text-xs font-medium text-zinc-400 hover:bg-zinc-900 hover:text-zinc-200"
                      >
                        메일 앱으로 열기
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="flex min-h-[280px] flex-col items-center justify-center rounded-lg border border-dashed border-zinc-800 bg-zinc-900/10 px-6 py-12 text-center">
                  <p className="text-sm text-zinc-500">왼쪽에서 문의를 선택하세요.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminDashboardContent>
  );
}
