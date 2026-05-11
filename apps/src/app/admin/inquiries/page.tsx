'use client';

import React, { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot, doc, updateDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { AdminDashboardContent } from '@/components/admin/AdminDashboardUI';
import { 
  MessageSquare, 
  User, 
  Mail, 
  Phone, 
  Clock, 
  CheckCircle, 
  ArrowRight,
  ExternalLink,
  Loader2,
  AlertCircle,
  Send
} from 'lucide-react';
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

const CATEGORY_LABELS: Record<string, { label: string; color: string }> = {
  project: { label: '프로젝트 문의', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  new: { label: '신규 의뢰', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  other: { label: '기타 문의', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
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

  const InfoCard = ({ title, value, subValue, colorSchema }: { title: string, value: string, subValue?: string, colorSchema: 'blue' | 'amber' }) => {
    const colors = {
      blue: { bg: 'bg-blue-600/5 border-blue-600/10', text: 'text-blue-500' },
      amber: { bg: 'bg-amber-500/5 border-amber-500/10', text: 'text-amber-500' },
    }[colorSchema];

    return (
      <div className={cn(colors.bg, "border rounded-2xl p-5")}>
        <p className={cn("text-[10px] font-black uppercase tracking-widest mb-1", colors.text)}>{title}</p>
        <p className="text-white font-bold">{value}</p>
        {subValue && <p className="text-neutral-500 text-xs mt-1">{subValue}</p>}
      </div>
    );
  };

  const InquiryListItem = ({ inquiry, isSelected, onClick }: { inquiry: Inquiry, isSelected: boolean, onClick: () => void }) => (
    <motion.div
      layoutId={inquiry.id}
      onClick={onClick}
      className={cn(
        "group relative bg-neutral-900 border transition-all duration-300 p-6 rounded-[2rem] cursor-pointer hover:shadow-2xl hover:shadow-blue-600/5",
        isSelected ? "border-blue-500 ring-4 ring-blue-500/10" : "border-neutral-800 hover:border-neutral-700"
      )}
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-neutral-800 border border-neutral-700 flex items-center justify-center text-neutral-400 group-hover:text-white transition-colors">
            <User className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-white font-bold tracking-tight">{inquiry.userName}</h3>
            <div className="flex items-center gap-2 mt-0.5">
              <span className={cn(
                "px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border",
                CATEGORY_LABELS[inquiry.category || 'project']?.color || 'bg-neutral-800 text-neutral-500 border-neutral-700'
              )}>
                {CATEGORY_LABELS[inquiry.category || 'project']?.label || inquiry.appName}
              </span>
              {inquiry.appName && inquiry.category === 'project' && (
                <span className="text-[10px] text-neutral-600 font-bold">{inquiry.appName}</span>
              )}
            </div>
          </div>
        </div>
        <div className={cn(
          "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border",
          inquiry.status === 'answered' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-amber-500/10 text-amber-500 border-amber-500/20"
        )}>
          {inquiry.status === 'answered' ? '답변완료' : '대기중'}
        </div>
      </div>
      <p className="text-neutral-400 text-sm line-clamp-2 mb-4 leading-relaxed">
        {inquiry.content}
      </p>
      <div className="flex items-center justify-between text-[11px] text-neutral-600 font-bold">
        <div className="flex items-center gap-2">
          <Clock className="w-3 h-3" />
          {new Date(inquiry.createdAt).toLocaleDateString()}
        </div>
        <ArrowRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-all translate-x-[-10px] group-hover:translate-x-0" />
      </div>
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
    await updateDoc(doc(db, 'rapidforge_inquiries', selectedInquiry.id), { isPublic: newPublic });
    setSelectedInquiry({ ...selectedInquiry, isPublic: newPublic });
  };

  if (loading) {
// ... existing loading UI ...
    return (
      <AdminDashboardContent>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <Loader2 className="w-10 h-10 text-blue-500 animate-spin mb-4" />
          <p className="text-neutral-500 font-bold uppercase tracking-widest text-xs">Fetching Inquiries...</p>
        </div>
      </AdminDashboardContent>
    );
  }

  return (
    <AdminDashboardContent>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
            <MessageSquare className="w-8 h-8 text-blue-500" />
            고객 문의 관리
          </h1>
          <p className="text-neutral-500 text-sm mt-2">고객들의 견적 문의 및 제작 상담 요청을 관리합니다.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Inquiry List */}
          <div className="lg:col-span-7 space-y-4">
            {inquiries.length === 0 ? (
              <div className="bg-neutral-900/50 border border-neutral-800 rounded-[2.5rem] p-12 text-center">
                <AlertCircle className="w-12 h-12 text-neutral-700 mx-auto mb-4" />
                <p className="text-neutral-500 font-bold">접수된 문의가 없습니다.</p>
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
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="sticky top-8 bg-neutral-900 border border-neutral-800 rounded-[2.5rem] p-8 md:p-10 space-y-8 shadow-2xl"
                >
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <h2 className="text-2xl font-black text-white tracking-tight">상세 정보</h2>
                      <button 
                        onClick={togglePublic}
                        className={cn(
                          "flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                          selectedInquiry.isPublic 
                            ? "bg-blue-600/10 text-blue-500 border-blue-500/20" 
                            : "bg-neutral-800 text-neutral-500 border-neutral-700"
                        )}
                      >
                        {selectedInquiry.isPublic ? '공개 중' : '비공개'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-4">
                      {/* ... existing user info cards ... */}
                      <div className="bg-black/30 border border-neutral-800/50 rounded-2xl p-5 space-y-4">
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-300 font-medium">{selectedInquiry.userEmail}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Phone className="w-4 h-4 text-neutral-500" />
                          <span className="text-sm text-neutral-300 font-medium">
                            {userDetails?.phoneNumber || '불러오는 중...'}
                          </span>
                        </div>
                      </div>

                      <InfoCard 
                        title="문의 유형"
                        value={CATEGORY_LABELS[selectedInquiry.category || 'project']?.label || selectedInquiry.appName}
                        subValue={selectedInquiry.category === 'project' && selectedInquiry.appName ? `프로젝트: ${selectedInquiry.appName}` : undefined}
                        colorSchema="blue"
                      />

                      {selectedInquiry.budget && (
                        <InfoCard 
                          title="예산 범위"
                          value={selectedInquiry.budget}
                          colorSchema="amber"
                        />
                      )}
                    </div>

                    <div className="space-y-3">
                      <p className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">문의 내용</p>
                      <div className="bg-black/40 border border-neutral-800 rounded-2xl p-6 text-sm text-neutral-300 leading-relaxed whitespace-pre-wrap">
                        {selectedInquiry.content}
                      </div>
                    </div>

                    {/* Admin Response Section */}
                    <div className="space-y-3 pt-4 border-t border-neutral-800">
                      <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">관리자 답변 (사이트 노출용)</p>
                      <textarea 
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                        placeholder="고객에게 전달할 답변을 입력하세요. 공개 설정 시 사이트에도 노출됩니다."
                        className="w-full h-32 bg-black border border-neutral-800 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={saveResponse}
                          disabled={isUpdating}
                          className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98]"
                        >
                          {isUpdating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                          답변 저장하기
                        </button>
                      </div>
                    </div>

                    <div className="pt-4 flex gap-3 opacity-50 hover:opacity-100 transition-opacity">
                      <a 
                        href={`mailto:${selectedInquiry.userEmail}`}
                        className="flex-1 bg-neutral-800 text-neutral-400 font-bold py-3 rounded-xl text-center text-xs hover:bg-neutral-700 transition-all"
                      >
                        이메일 직접 발송
                      </a>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="bg-neutral-900/30 border border-dashed border-neutral-800 rounded-[2.5rem] p-20 text-center flex flex-col items-center justify-center">
                  <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center text-neutral-700 mb-6">
                    <MessageSquare className="w-8 h-8" />
                  </div>
                  <p className="text-neutral-600 font-bold max-w-[150px]">문의를 선택하여 상세 내용을 확인하세요.</p>
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </AdminDashboardContent>
  );
}
