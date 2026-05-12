import React from 'react';
import { getAppById } from '@/lib/server-apps';
import AppDetailContent from '@/components/app/AppDetailContent';
import { Metadata } from 'next';
import Link from 'next/link';
import { getAppImage } from '@/lib/utils';

interface Props {
  params: Promise<{ id: string }>;
}

function openGraphImageUrl(app: NonNullable<Awaited<ReturnType<typeof getAppById>>>) {
  const src = getAppImage(app);
  if (!src) return undefined;
  if (src.startsWith('http')) return src;
  const base = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, '');
  if (!base) return undefined;
  return `${base}${src.startsWith('/') ? src : `/${src}`}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const app = await getAppById(id);

  if (!app) {
    return {
      title: '프로젝트를 찾을 수 없습니다',
    };
  }

  const og = openGraphImageUrl(app);

  return {
    title: app.name,
    description: app.description,
    openGraph: {
      title: `${app.name} | RapidForge`,
      description: app.description,
      images: og ? [{ url: og }] : [],
    },
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { id } = await params;
  const app = await getAppById(id);

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfd] p-6 text-center">
        <h1 className="text-4xl font-bold text-[#1d1d1f] mb-4">프로젝트를 찾을 수 없습니다</h1>
        <p className="text-[#86868b] mb-8">요청하신 앱이 목록에 없거나 주소가 바뀌었을 수 있습니다.</p>
        <Link
          href="/"
          className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full font-medium transition-transform hover:scale-105"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  return <AppDetailContent app={app} />;
}
