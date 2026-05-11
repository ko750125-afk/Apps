import React from 'react';
import { getAppById } from '@/lib/server-apps';
import AppDetailContent from '@/components/app/AppDetailContent';
import { Metadata } from 'next';
import Link from 'next/link';

interface Props {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const app = await getAppById(id);

  if (!app) {
    return {
      title: 'Project Not Found',
    };
  }

  return {
    title: app.name,
    description: app.description,
    openGraph: {
      title: `${app.name} | RapidForge`,
      description: app.description,
      images: app.image ? [{ url: app.image }] : [],
    },
  };
}

export default async function AppDetailPage({ params }: Props) {
  const { id } = await params;
  const app = await getAppById(id);

  if (!app) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#fbfbfd] p-6 text-center">
        <h1 className="text-4xl font-bold text-[#1d1d1f] mb-4">Project Not Found</h1>
        <p className="text-[#86868b] mb-8">The application you are looking for does not exist in our registry.</p>
        <Link 
          href="/"
          className="px-6 py-3 bg-[#1d1d1f] text-white rounded-full font-medium transition-transform hover:scale-105"
        >
          Return to Hub
        </Link>
      </div>
    );
  }

  return <AppDetailContent app={app} />;
}
