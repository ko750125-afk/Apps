'use client';

import React from 'react';
import { 
  ArrowLeft, Printer, BookOpen, CheckCircle2, AlertCircle, 
  Lightbulb, LayoutDashboard, PlusCircle, ArrowRightLeft, 
  Trash2, Pencil, ExternalLink, Star, Image as ImageIcon, 
  FileText, Info
} from 'lucide-react';
import Link from 'next/link';

export default function AdminGuidePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-white text-black p-8 md:p-16 max-w-5xl mx-auto print:p-0">
      {/* Header - Hidden on Print */}
      <nav className="flex justify-between items-center mb-12 print:hidden">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 text-neutral-500 hover:text-black transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>
        <button 
          onClick={handlePrint}
          className="flex items-center gap-2 px-6 py-3 bg-black text-white rounded-xl text-sm font-black hover:bg-neutral-800 transition-all shadow-xl shadow-black/10 active:scale-95"
        >
          <Printer className="w-4 h-4" />
          가이드 인쇄하기 (Print)
        </button>
      </nav>

      {/* Main Content */}
      <article className="space-y-16">
        <header className="border-b-8 border-black pb-10">
          <div className="flex items-center gap-3 mb-6 text-blue-600 print:text-black">
            <BookOpen className="w-10 h-10" />
            <span className="font-black tracking-[0.2em] uppercase text-xl">RapidForge Operation Manual</span>
          </div>
          <h1 className="text-6xl font-black tracking-tight mb-6 leading-none">관리자 통합 운영 매뉴얼</h1>
          <p className="text-xl text-neutral-500 font-medium leading-relaxed">
            이 가이드는 RapidForge 시스템의 각 메뉴 구성과 프로젝트 등록 과정을 상세히 설명합니다.<br />
            처음 이용하시는 경우 이 문서를 정독해 주세요.
          </p>
        </header>

        {/* 메뉴 1: 대시보드 */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3 border-l-8 border-blue-600 pl-4">
            <LayoutDashboard className="w-8 h-8 text-blue-600" />
            1. 대시보드 (Dashboard)
          </h2>
          <p className="text-neutral-600 text-lg">관리자 페이지의 첫 화면으로, 전체 프로젝트의 현황을 파악하고 관리합니다.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ml-4">
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> 통계 섹션 (Stats)</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">상단 카드에서 전체 프로젝트 수, 주요 프로젝트(Featured), 현재 운영 중인 앱과 점검 중인 앱의 숫자를 실시간으로 보여줍니다.</p>
            </div>
            <div className="p-5 bg-neutral-50 rounded-2xl border border-neutral-100">
              <h3 className="font-bold mb-2 flex items-center gap-2"><Info className="w-4 h-4 text-blue-500" /> 프로젝트 레지스트리 (Table)</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">등록된 모든 앱의 리스트입니다. 여기서 각 앱의 썸네일, 카테고리, 배포 상태를 확인하고 수정/삭제할 수 있습니다.</p>
            </div>
          </div>
        </section>

        {/* 메뉴 2: 프로젝트 등록 상세 설명 */}
        <section className="space-y-8">
          <h2 className="text-3xl font-black flex items-center gap-3 border-l-8 border-emerald-500 pl-4">
            <PlusCircle className="w-8 h-8 text-emerald-500" />
            2. 프로젝트 등록 및 수정 필드 가이드
          </h2>
          <p className="text-neutral-600 text-lg">새 프로젝트를 등록할 때 작성해야 하는 각 항목에 대한 상세 설명입니다.</p>
          
          <div className="space-y-4 ml-4">
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">🆔 Project ID</h4>
              <p className="text-sm text-neutral-500">시스템에서 사용하는 고유 식별자입니다. 영어 소문자와 하이픈(-)만 사용하세요. (예: <code>my-awesome-app</code>)</p>
            </div>
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">📛 Name (프로젝트명)</h4>
              <p className="text-sm text-neutral-500">홈페이지와 상세 페이지 상단에 노출될 공식 명칭입니다.</p>
            </div>
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">🌐 URL (배포 주소)</h4>
              <p className="text-sm text-neutral-500">실제 서비스 중인 주소를 입력하세요. 없을 경우 비워두셔도 됩니다.</p>
            </div>
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">📂 GitHub Repo</h4>
              <p className="text-sm text-neutral-500">깃허브 사용자명/저장소명 형식으로 입력하세요. (예: <code>username/repo-name</code>)</p>
            </div>
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">🏷️ Category</h4>
              <p className="text-sm text-neutral-500">앱의 성격에 맞는 카테고리를 선택하세요. 홈페이지에서 필터링의 기준이 됩니다.</p>
            </div>
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">🖼️ Image URL</h4>
              <p className="text-sm text-neutral-500">대표 이미지 주소를 입력하세요. (팁: 사이트 주소가 있다면 <code>https://s0.wp.com/mshots/v1/[URL]?w=800</code> 형식을 사용해 보세요.)</p>
            </div>
            <div className="border-b border-neutral-100 pb-4">
              <h4 className="font-black text-neutral-800 mb-1">📝 Memo (상세 내용 - 중요!)</h4>
              <p className="text-sm text-neutral-500">상세 페이지의 본문이 되는 곳입니다. <strong>마크다운(Markdown)</strong> 문법을 사용하여 풍부하게 꾸밀 수 있습니다. (아래 팁 참조)</p>
            </div>
          </div>
        </section>

        {/* 메뉴 3: 마크다운 작성 팁 */}
        <section className="space-y-6 bg-blue-50 p-10 rounded-[3rem] border border-blue-100 print:bg-white print:border-neutral-300">
          <h2 className="text-3xl font-black flex items-center gap-3">
            <FileText className="w-8 h-8 text-blue-600" />
            3. 마크다운(Markdown) 작성 꿀팁
          </h2>
          <p className="text-neutral-700 font-medium">상세 페이지를 프리미엄하게 만드는 마크다운 예시입니다.</p>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-3">
              <p className="text-xs font-black text-blue-500 uppercase tracking-widest">이렇게 입력하면:</p>
              <pre className="text-xs bg-neutral-900 text-neutral-300 p-6 rounded-2xl leading-relaxed">
{`# 큰 제목
## 중간 제목
### 소제목

- 리스트 1
- 리스트 2

**굵은 글씨**와 *기울임*

[링크 텍스트](https://...)

> 인용구 블록`}
              </pre>
            </div>
            <div className="space-y-3">
              <p className="text-xs font-black text-emerald-500 uppercase tracking-widest">실제 화면에서는:</p>
              <div className="p-6 bg-white rounded-2xl border border-blue-100 shadow-sm text-sm space-y-2">
                <div className="text-xl font-bold">큰 제목</div>
                <div className="text-lg font-bold border-b pb-1">중간 제목</div>
                <ul className="list-disc pl-4 space-y-1">
                  <li>리스트 1</li>
                  <li>리스트 2</li>
                </ul>
                <p><strong>굵은 글씨</strong>가 적용됩니다.</p>
                <div className="pl-4 border-l-4 border-neutral-200 italic text-neutral-500">인용구 블록입니다.</div>
              </div>
            </div>
          </div>
        </section>

        {/* 메뉴 4: 기타 관리 기능 */}
        <section className="space-y-6">
          <h2 className="text-3xl font-black flex items-center gap-3 border-l-8 border-rose-500 pl-4">
            <ArrowRightLeft className="w-8 h-8 text-rose-500" />
            4. 기타 관리 기능
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 ml-4">
            <div className="flex gap-4 items-start">
              <div className="w-10 h-10 flex-shrink-0 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center font-bold">1</div>
              <div>
                <h4 className="font-black mb-1">Migration (데이터 이전)</h4>
                <p className="text-sm text-neutral-500">정적 데이터를 데이터베이스로 한 번에 옮길 때 사용합니다. 초기 세팅용입니다.</p>
              </div>
            </div>
            <div className="flex gap-4 items-start text-rose-600">
              <div className="w-10 h-10 flex-shrink-0 bg-rose-600 text-white rounded-xl flex items-center justify-center font-bold">2</div>
              <div>
                <h4 className="font-black mb-1 underline">Danger Zone (초기화)</h4>
                <p className="text-sm text-neutral-700 font-bold">모든 데이터를 삭제합니다. `/admin/danger` 경로를 직접 입력해야 하며, 강력한 경고를 확인한 후 실행 가능합니다.</p>
              </div>
            </div>
          </div>
        </section>

        <footer className="pt-20 border-t-2 border-neutral-100 text-center space-y-4">
          <div className="flex items-center justify-center gap-4 opacity-30 grayscale">
            <ImageIcon className="w-6 h-6" />
            <Star className="w-6 h-6" />
            <ExternalLink className="w-6 h-6" />
            <Pencil className="w-6 h-6" />
            <Trash2 className="w-6 h-6" />
          </div>
          <p className="text-neutral-400 font-medium tracking-tight">
            © {new Date().getFullYear()} RapidForge. 최선을 다해 프로젝트를 관리해 보세요!
          </p>
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          body { background: white !important; }
          .no-print { display: none !important; }
          nav { display: none !important; }
          pre { border: 1px solid #ddd !important; }
        }
      `}</style>
    </div>
  );
}
