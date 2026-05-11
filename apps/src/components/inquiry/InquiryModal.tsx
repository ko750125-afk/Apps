'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, MessageSquare, AlertCircle, Loader2, CheckCircle2, ChevronDown, Briefcase, PlusCircle, HelpCircle } from 'lucide-react';
import { auth, db } from '@/lib/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { AppData } from '@/data/apps';
import { cn } from '@/lib/utils';

type InquiryCategory = 'project' | 'new' | 'other';

interface InquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  /** 프로젝트 상세 페이지에서 호출 시 자동 선택 */
  preselectedApp?: AppData;
  /** 초기 카테고리 (기본: undefined → 유저가 선택) */
  initialCategory?: InquiryCategory;
}

const CATEGORY_OPTIONS = [
  { 
    value: 'project' as InquiryCategory, 
    label: '기존 프로젝트 문의',
    desc: '전시된 프로젝트 기반 견적/상담',
    icon: Briefcase,
    color: 'blue'
  },
  { 
    value: 'new' as InquiryCategory, 
    label: '신규 프로젝트 의뢰',
    desc: '새로운 웹앱/사이트 제작 의뢰',
    icon: PlusCircle,
    color: 'emerald'
  },
  { 
    value: 'other' as InquiryCategory, 
    label: '기타 문의',
    desc: '기술 상담, 협업 제안 등',
    icon: HelpCircle,
    color: 'purple'
  },
];

const BUDGET_OPTIONS = [
  '100만원 미만',
  '100~300만원',
  '300~500만원',
  '500~1000만원',
  '1000만원 이상',
  '협의 필요',
];

export default function InquiryModal({ isOpen, onClose, preselectedApp, initialCategory }: InquiryModalProps) {
  const [category, setCategory] = useState<InquiryCategory | null>(initialCategory || null);
  const [content, setContent] = useState('');
  const [budget, setBudget] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(preselectedApp?.id || '');
  const [selectedAppName, setSelectedAppName] = useState(preselectedApp?.name || '');
  const [apps, setApps] = useState<{ id: string; name: string }[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const user = auth?.currentUser;

  // 프로젝트 목록 로드 (기존 프로젝트 문의 시)
  useEffect(() => {
    if (!db || !isOpen) return;
    const fetchApps = async () => {
      try {
        const snapshot = await getDocs(collection(db!, 'rapidforge_apps'));
        const appList = snapshot.docs.map(doc => ({ 
          id: doc.id, 
          name: (doc.data() as any).name 
        }));
        setApps(appList);
      } catch (err) {
        console.error('Failed to fetch apps:', err);
      }
    };
    fetchApps();
  }, [isOpen]);

  // 모달 열릴 때 초기값 설정
  useEffect(() => {
    if (isOpen) {
      if (preselectedApp) {
        setCategory('project');
        setSelectedAppId(preselectedApp.id);
        setSelectedAppName(preselectedApp.name);
      } else if (initialCategory) {
        setCategory(initialCategory);
      } else {
        setCategory(null);
      }
      setContent('');
      setBudget('');
      setIsPublic(false);
      setError('');
      setSuccess(false);
    }
  }, [isOpen, preselectedApp, initialCategory]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      router.push('/login');
      return;
    }
    if (!category) {
      setError('문의 유형을 선택해주세요.');
      return;
    }
    if (!content.trim()) {
      setError('문의 내용을 입력해주세요.');
      return;
    }
    if (category === 'project' && !selectedAppId) {
      setError('관련 프로젝트를 선택해주세요.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await addDoc(collection(db!, 'rapidforge_inquiries'), {
        userId: user.uid,
        userEmail: user.email,
        userName: user.displayName || user.email?.split('@')[0],
        category,
        appId: category === 'project' ? selectedAppId : '',
        appName: category === 'project' ? selectedAppName : (category === 'new' ? '신규 프로젝트' : '기타'),
        budget: category !== 'other' ? budget : '',
        content: content.trim(),
        status: 'pending',
        isPublic: isPublic,
        createdAt: new Date().toISOString()
      });

      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        setContent('');
        setBudget('');
        setCategory(null);
        onClose();
      }, 2500);
    } catch (err: any) {
      console.error('Inquiry submission error:', err);
      setError('문의 전송 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  const handleAppSelect = (appId: string) => {
    setSelectedAppId(appId);
    const found = apps.find(a => a.id === appId);
    setSelectedAppName(found?.name || '');
  };

  const currentCategoryOption = CATEGORY_OPTIONS.find(c => c.value === category);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-xl bg-neutral-900 border border-neutral-800 rounded-[2.5rem] shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="p-8 border-b border-neutral-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white tracking-tight">문의하기</h2>
                  <p className="text-xs text-neutral-500 font-medium">RapidForge 통합 문의 센터</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="p-2 rounded-full hover:bg-neutral-800 text-neutral-500 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body - Scrollable */}
            <div className="p-8 overflow-y-auto flex-1">
              {success ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="py-12 flex flex-col items-center text-center space-y-4"
                >
                  <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mb-2">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-black text-white">전송 완료!</h3>
                  <p className="text-neutral-500 font-medium">
                    문의가 성공적으로 전달되었습니다.<br />
                    검토 후 기재해주신 이메일/전화번호로 연락드리겠습니다.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* 로그인 필요 안내 */}
                  {!user && (
                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-start gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-200">로그인이 필요합니다</p>
                        <p className="text-xs text-amber-500/80 font-medium mt-1">문의를 남기시려면 먼저 로그인해주세요.</p>
                      </div>
                    </div>
                  )}

                  {/* Step 1: 카테고리 선택 */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">문의 유형</label>
                    <div className="grid grid-cols-1 gap-2">
                      {CATEGORY_OPTIONS.map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = category === opt.value;
                        
                        // Define colors outside the component or use a switch, but keeping it simple here
                        const getColors = (color: string, selected: boolean) => {
                          if (!selected) return { bg: "border-neutral-800 bg-black/20 hover:border-neutral-700", icon: "text-neutral-600", text: "text-neutral-400" };
                          switch (color) {
                            case 'blue': return { bg: 'border-blue-500/50 bg-blue-600/10 ring-2 ring-blue-500/20', icon: 'text-blue-400', text: 'text-white' };
                            case 'emerald': return { bg: 'border-emerald-500/50 bg-emerald-600/10 ring-2 ring-emerald-500/20', icon: 'text-emerald-400', text: 'text-white' };
                            case 'purple': return { bg: 'border-purple-500/50 bg-purple-600/10 ring-2 ring-purple-500/20', icon: 'text-purple-400', text: 'text-white' };
                            default: return { bg: '', icon: '', text: '' };
                          }
                        };
                        
                        const colors = getColors(opt.color, isSelected);

                        return (
                          <button
                            key={opt.value}
                            type="button"
                            onClick={() => {
                              setCategory(opt.value);
                              setError('');
                            }}
                            className={cn(
                              "flex items-center gap-4 p-4 rounded-2xl border transition-all text-left",
                              colors.bg
                            )}
                          >
                            <Icon className={cn("w-5 h-5 shrink-0", colors.icon)} />
                            <div>
                              <p className={cn("text-sm font-bold", colors.text)}>
                                {opt.label}
                              </p>
                              <p className="text-[11px] text-neutral-600 font-medium">{opt.desc}</p>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Step 2: 조건부 필드 */}
                  <AnimatePresence mode="wait">
                    {category && (
                      <motion.div
                        key={category}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="space-y-6 overflow-hidden"
                      >
                        {/* 기존 프로젝트 선택 (project 카테고리) */}
                        {category === 'project' && (
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">관련 프로젝트</label>
                            {preselectedApp ? (
                              <div className="px-5 py-4 bg-blue-600/5 border border-blue-600/15 rounded-2xl text-sm text-blue-400 font-bold">
                                {preselectedApp.name}
                              </div>
                            ) : (
                              <div className="relative">
                                <select
                                  value={selectedAppId}
                                  onChange={(e) => handleAppSelect(e.target.value)}
                                  className="w-full bg-black/40 border border-neutral-800 rounded-2xl py-3.5 px-5 text-sm text-white focus:outline-none focus:border-blue-500/50 appearance-none cursor-pointer"
                                >
                                  <option value="">프로젝트를 선택해주세요</option>
                                  {apps.map(app => (
                                    <option key={app.id} value={app.id}>{app.name}</option>
                                  ))}
                                </select>
                                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600 pointer-events-none" />
                              </div>
                            )}
                          </div>
                        )}

                        {/* 예산 범위 (project, new) */}
                        {(category === 'project' || category === 'new') && (
                          <div className="space-y-3">
                            <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">예산 범위 <span className="text-neutral-700">(선택)</span></label>
                            <div className="flex flex-wrap gap-2">
                              {BUDGET_OPTIONS.map(opt => (
                                <button
                                  key={opt}
                                  type="button"
                                  onClick={() => setBudget(budget === opt ? '' : opt)}
                                  className={cn(
                                    "px-3.5 py-2 rounded-xl text-xs font-bold border transition-all",
                                    budget === opt 
                                      ? "bg-blue-600/10 border-blue-500/30 text-blue-400" 
                                      : "bg-black/20 border-neutral-800 text-neutral-500 hover:border-neutral-700"
                                  )}
                                >
                                  {opt}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* 문의 내용 */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">문의 내용</label>
                          <textarea 
                            placeholder={
                              category === 'project' 
                                ? "프로젝트 커스터마이징 요구사항, 기능 추가, 일정 등을 자유롭게 적어주세요."
                                : category === 'new'
                                ? "제작하려는 앱/사이트의 목적, 희망 기능, 참고 사이트 등을 상세히 적어주세요."
                                : "문의하실 내용을 자유롭게 적어주세요."
                            }
                            className="w-full h-40 bg-black/40 border border-neutral-800 rounded-2xl p-5 text-sm text-white focus:outline-none focus:border-blue-500/50 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            disabled={loading || !user}
                          />
                        </div>

                        {/* 공개/비공개 설정 */}
                        <div className="space-y-3">
                          <label className="text-[10px] font-black text-neutral-500 uppercase tracking-widest ml-1">공개 설정</label>
                          <div className="flex gap-3">
                            {[
                              { label: '비공개 문의', value: false, activeClass: 'bg-blue-600/10 border-blue-500/30 text-blue-400' },
                              { label: '공개 문의', value: true, activeClass: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' }
                            ].map((opt) => (
                              <button
                                key={opt.label}
                                type="button"
                                onClick={() => setIsPublic(opt.value)}
                                className={cn(
                                  "flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl border text-sm font-bold transition-all",
                                  isPublic === opt.value
                                    ? opt.activeClass
                                    : "bg-black/20 border-neutral-800 text-neutral-500 hover:border-neutral-700"
                                )}
                              >
                                {opt.label}
                              </button>
                            ))}
                          </div>
                          <p className="text-[11px] text-neutral-600 font-medium ml-1">
                            {isPublic ? '답변 완료 시 다른 사용자들도 볼 수 있게 노출됩니다.' : '관리자와 작성자 본인만 확인할 수 있습니다.'}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && <p className="text-rose-500 text-xs font-bold px-2">{error}</p>}

                  {/* 제출 버튼 */}
                  <button
                    type="submit"
                    disabled={loading || !user || !content.trim() || !category}
                    className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-neutral-800 disabled:text-neutral-600 text-white font-black py-4.5 rounded-2xl flex items-center justify-center gap-2 transition-all active:scale-[0.98] shadow-xl shadow-blue-600/10"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <>
                        <span>문의 접수하기</span>
                        <Send className="w-4 h-4" />
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
