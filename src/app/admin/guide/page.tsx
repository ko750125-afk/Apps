'use client';

import React from 'react';
import { ArrowLeft, Printer } from 'lucide-react';
import Link from 'next/link';

export default function AdminGuidePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="mx-auto min-h-screen max-w-3xl bg-zinc-950 px-4 py-8 text-zinc-100 md:px-8 md:py-10 print:bg-white print:text-zinc-950 print:py-6">
      <nav className="mb-10 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/admin"
          className="text-sm font-medium text-zinc-500 hover:text-zinc-200"
        >
          ← 대시보드
        </Link>
        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex h-9 items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 text-sm font-medium text-zinc-100 hover:bg-zinc-800"
        >
          <Printer className="h-4 w-4 opacity-80" />
          인쇄
        </button>
      </nav>

      <article className="space-y-12 print:space-y-8">
        <header className="border-b border-zinc-800 pb-8 print:border-zinc-200">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500 print:text-zinc-600">
            RapidForge · 운영 안내
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 print:text-zinc-900 md:text-3xl">
            관리자 매뉴얼
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-zinc-400 print:text-zinc-600 md:text-base">
            메뉴 구성과 프로젝트 등록 절차를 정리했습니다. 처음 사용할 때 한 번 읽어 주세요.
          </p>
        </header>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100 print:text-zinc-900">
            1. 대시보드
          </h2>
          <p className="text-sm leading-relaxed text-zinc-400 print:text-zinc-600">
            관리자 첫 화면입니다. 프로젝트 수·추천·활성/점검 요약과 목록, 검색·수정·삭제를 할 수 있습니다.
          </p>
          <div className="grid gap-3 md:grid-cols-2">
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/20 p-4 print:border-zinc-200 print:bg-zinc-50">
              <h3 className="text-sm font-medium text-zinc-200 print:text-zinc-900">요약</h3>
              <p className="mt-1 text-sm text-zinc-500 print:text-zinc-600">
                상단 카드에서 전체·추천·활성·점검 건수를 확인합니다.
              </p>
            </div>
            <div className="rounded-lg border border-zinc-800/80 bg-zinc-900/20 p-4 print:border-zinc-200 print:bg-zinc-50">
              <h3 className="text-sm font-medium text-zinc-200 print:text-zinc-900">목록</h3>
              <p className="mt-1 text-sm text-zinc-500 print:text-zinc-600">
                썸네일, 카테고리, 상태를 보고 수정·삭제합니다.
              </p>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100 print:text-zinc-900">
            2. 프로젝트 등록·수정 필드
          </h2>
          <p className="text-sm text-zinc-400 print:text-zinc-600">
            새 프로젝트 또는 수정 화면에서 입력하는 항목입니다.
          </p>
          <dl className="space-y-3 text-sm">
            {[
              ['프로젝트 이름', '사이트와 상세 페이지에 표시되는 제목입니다.'],
              ['배포 URL', '실서비스 주소입니다. 비워도 됩니다. 입력 후 「URL에서 제목·설명·이미지 가져오기」로 메타를 채울 수 있습니다.'],
              ['카테고리', '홈 필터에 쓰입니다.'],
              ['운영 상태', '활성 또는 점검 중.'],
              ['한 줄 설명', '카드·목록용 짧은 문구입니다.'],
              ['대표 이미지', '업로드하거나 URL을 직접 넣을 수 있습니다.'],
              ['상세 (Markdown)', '상세 페이지 본문입니다. 마크다운을 사용합니다.'],
            ].map(([title, body]) => (
              <div
                key={title}
                className="border-b border-zinc-800/80 pb-3 last:border-0 print:border-zinc-200"
              >
                <dt className="font-medium text-zinc-200 print:text-zinc-900">{title}</dt>
                <dd className="mt-1 text-zinc-500 print:text-zinc-600">{body}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="rounded-lg border border-zinc-800/80 bg-zinc-900/15 p-5 md:p-6 print:border-zinc-200 print:bg-zinc-50">
          <h2 className="text-lg font-semibold text-zinc-100 print:text-zinc-900">
            3. Markdown 요약
          </h2>
          <p className="mt-1 text-sm text-zinc-400 print:text-zinc-600">
            상세 본문에서 자주 쓰는 문법입니다.
          </p>
          <div className="mt-4 grid gap-6 lg:grid-cols-2">
            <div>
              <p className="text-xs font-medium text-zinc-500 print:text-zinc-600">입력 예</p>
              <pre className="mt-2 overflow-x-auto rounded-md border border-zinc-800 bg-zinc-950 p-4 text-xs text-zinc-300 print:border-zinc-300 print:bg-white print:text-zinc-800">
{`# 제목
## 소제목
- 항목
**강조** *기울임*
[링크](https://...)`}
              </pre>
            </div>
            <div>
              <p className="text-xs font-medium text-zinc-500 print:text-zinc-600">표시</p>
              <div className="mt-2 rounded-md border border-zinc-800 bg-zinc-950/50 p-4 text-sm text-zinc-300 print:border-zinc-200 print:bg-white print:text-zinc-800">
                <p className="text-base font-semibold">제목</p>
                <p className="mt-2 text-sm font-medium">소제목</p>
                <ul className="mt-2 list-disc pl-5 text-sm">
                  <li>항목</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-lg font-semibold text-zinc-100 print:text-zinc-900">
            4. 기타
          </h2>
          <ul className="list-disc space-y-2 pl-5 text-sm text-zinc-400 print:text-zinc-600">
            <li>
              <strong className="font-medium text-zinc-300 print:text-zinc-800">문의</strong> — 접수 목록과 답변·공개 여부를 관리합니다.
            </li>
            <li>
              <strong className="font-medium text-zinc-300 print:text-zinc-800">위험 구역</strong> —{' '}
              <code className="rounded bg-zinc-900 px-1.5 py-0.5 text-xs print:bg-zinc-100">/admin/danger</code>
              에서 전체 프로젝트를 삭제할 수 있습니다. 복구되지 않습니다.
            </li>
          </ul>
        </section>

        <footer className="border-t border-zinc-800 pt-8 text-center text-xs text-zinc-500 print:border-zinc-200 print:text-zinc-500">
          © {new Date().getFullYear()} RapidForge
        </footer>
      </article>

      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
}
