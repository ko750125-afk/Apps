export const CATEGORIES: Category[] = [
  'All apps',
  'Business Website',
  'Reservation & Booking',
  'Admin Dashboard',
  'E-commerce',
  'Automation & Tools'
];

export type Category = 
  | 'All apps' 
  | 'Business Website' 
  | 'Reservation & Booking' 
  | 'Admin Dashboard' 
  | 'E-commerce' 
  | 'Automation & Tools';

export type AppStatus = 'Exhibit' | 'Repair';

export interface AppData {
  id: string;
  name: string;
  url: string | null;
  repo: string | null;
  category: Category;
  date: string;
  featured: boolean;
  description?: string;
  image?: string;
  status?: AppStatus;
  memo?: string;
}

export const apps: AppData[] = [
  {
    id: 'builder-workflow-hub-final-v2',
    name: 'Builder Workflow Hub',
    url: 'builder-workflow-hub-final-v2.vercel.app',
    repo: 'ko750125-afk/builder-workflow-hub',
    category: 'Automation & Tools',
    date: 'Apr 1',
    featured: true,
    description: '기능 개선 및 UI/UX가 고도화된 워크플로우 관리 허브',
    image: 'https://s0.wp.com/mshots/v1/builder-workflow-hub-final-v2.vercel.app?w=800'
  },
  {
    id: 'study-archive',
    name: 'Study Archive',
    url: 'ko-study-archive.vercel.app',
    repo: null,
    category: 'Business Website',
    date: 'Mar 26',
    featured: true,
    description: '개인 스터디 기록 및 아카이빙 플랫폼',
    image: 'https://s0.wp.com/mshots/v1/ko-study-archive.vercel.app?w=800'
  },
  {
    id: '14_studydev',
    name: 'StudyDev',
    url: null,
    repo: 'ko750125-afk/studydev',
    category: 'Automation & Tools',
    date: '2d ago',
    featured: true,
    description: 'Firebase 인증 및 히스토리 동기화를 지원하는 개발 학습 도구',
    image: 'https://opengraph.githubassets.com/1/ko750125-afk/studydev'
  },
  {
    id: 'ai-emotion-diary',
    name: 'AI Emotion Diary',
    url: null,
    repo: 'ko750125-afk/ai-emotion-diary',
    category: 'Business Website',
    date: 'Apr 5',
    featured: false,
    description: '익명 로그인 및 AI 감정 분석 기능을 제공하는 일기장',
    image: 'https://opengraph.githubassets.com/1/ko750125-afk/ai-emotion-diary'
  },
  {
    id: 'notion-clone',
    name: 'Notion Clone',
    url: 'notion-clone-amber-seven.vercel.app',
    repo: 'ko750125-afk/notion-clone',
    category: 'Automation & Tools',
    date: 'Apr 25',
    featured: false,
    description: 'Supabase를 연동한 노션 클론 코딩 프로젝트',
    image: 'https://s0.wp.com/mshots/v1/notion-clone-amber-seven.vercel.app?w=800'
  },
  {
    id: 'grab-pdf',
    name: 'Grab PDF',
    url: 'grab-pdf.vercel.app',
    repo: 'ko750125-afk/grabPDF',
    category: 'Automation & Tools',
    date: '6h ago',
    featured: false,
    description: 'PDF 추출 및 병합 유틸리티',
    image: 'https://s0.wp.com/mshots/v1/grab-pdf.vercel.app?w=800'
  },
  {
    id: 'memo',
    name: 'Memo',
    url: 'memo-pi-ochre.vercel.app',
    repo: 'ko750125-afk/memo',
    category: 'Automation & Tools',
    date: 'Apr 21',
    featured: false,
    description: '달력, 음력 토글이 포함된 메모장 앱',
    image: 'https://s0.wp.com/mshots/v1/memo-pi-ochre.vercel.app?w=800'
  },
  {
    id: 'courier-tracker',
    name: 'Courier Tracker',
    url: 'courier-tracker-app.vercel.app',
    repo: 'ko750125-afk/courier-tracker',
    category: 'Business Website',
    date: 'Apr 14',
    featured: false,
    description: '실시간 데이터 동기화 택배 조회기',
    image: 'https://s0.wp.com/mshots/v1/courier-tracker-app.vercel.app?w=800'
  },
  {
    id: 'gift_fund',
    name: 'Gift Fund',
    url: 'giftfund.vercel.app',
    repo: 'ko750125-afk/gift_fund',
    category: 'E-commerce',
    date: 'Apr 6',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/giftfund.vercel.app?w=800'
  }
];
