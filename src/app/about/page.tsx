import { Metadata } from 'next';
import AboutContent from '@/components/layout/AboutContent';

export const metadata: Metadata = {
  title: 'About',
  description: 'Learn about the philosophy and technology behind RapidForge.',
  openGraph: {
    title: 'About RapidForge | Digital Excellence',
    description: 'Our philosophy and approach to building modern web applications.',
  }
};

export default function AboutPage() {
  return <AboutContent />;
}
