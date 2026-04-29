export type Category = 
  | 'All' 
  | 'AI & Smart' 
  | 'Productivity' 
  | 'Utility & Tools' 
  | 'Games & Edu' 
  | 'Finance' 
  | 'Others';

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
    category: 'Productivity',
    date: 'Apr 1',
    featured: true,
    description: '기능 개선 및 UI/UX가 고도화된 워크플로우 관리 허브',
    image: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'study-archive',
    name: 'Study Archive',
    url: 'ko-study-archive.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 26',
    featured: true,
    description: '개인 스터디 기록 및 아카이빙 플랫폼',,
    image: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '14_studydev',
    name: 'StudyDev',
    url: null,
    repo: 'ko750125-afk/studydev',
    category: 'Productivity',
    date: '2d ago',
    featured: true,
    description: 'Firebase 인증 및 히스토리 동기화를 지원하는 개발 학습 도구',,
    image: 'https://images.unsplash.com/photo-1504639725590-34d0984388bd?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ai-emotion-diary',
    name: 'AI Emotion Diary',
    url: null,
    repo: 'ko750125-afk/ai-emotion-diary',
    category: 'AI & Smart',
    date: 'Apr 5',
    featured: false,
    description: '익명 로그인 및 AI 감정 분석 기능을 제공하는 일기장',,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'notion-clone',
    name: 'Notion Clone',
    url: 'notion-clone-amber-seven.vercel.app',
    repo: 'ko750125-afk/notion-clone',
    category: 'Productivity',
    date: 'Apr 25',
    featured: false,
    description: 'Supabase를 연동한 노션 클론 코딩 프로젝트',,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'smart-qr',
    name: 'Smart QR',
    url: 'smart-qr-alpha.vercel.app',
    repo: 'ko750125-afk/smart-qr',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'qrmaker',
    name: 'QR Maker',
    url: null,
    repo: 'ko750125-afk/QRmaker',
    category: 'Utility & Tools',
    date: '6h ago',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'grab-pdf',
    name: 'Grab PDF',
    url: 'grab-pdf.vercel.app',
    repo: 'ko750125-afk/grabPDF',
    category: 'Utility & Tools',
    date: '6h ago',
    featured: false,
    description: 'PDF 추출 및 병합 유틸리티',,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'smart-neon-calculator',
    name: 'Smart Neon Calculator',
    url: 'smart-neon-calculator.vercel.app',
    repo: 'ko750125-afk/calculator',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'memo',
    name: 'Memo',
    url: 'memo-pi-ochre.vercel.app',
    repo: 'ko750125-afk/memo',
    category: 'Productivity',
    date: 'Apr 21',
    featured: false,
    description: '달력, 음력 토글이 포함된 메모장 앱',,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'courier-tracker',
    name: 'Courier Tracker',
    url: 'courier-tracker-app.vercel.app',
    repo: 'ko750125-afk/courier-tracker',
    category: 'Utility & Tools',
    date: 'Apr 14',
    featured: false,
    description: '실시간 데이터 동기화 택배 조회기',,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'global-time-schedule',
    name: 'Global Time Schedule',
    url: 'global-time-schedule.vercel.app',
    repo: 'ko750125-afk/Global-Time-Schedule',
    category: 'Utility & Tools',
    date: 'Apr 11',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'gift_fund',
    name: 'Gift Fund',
    url: 'giftfund.vercel.app',
    repo: 'ko750125-afk/gift_fund',
    category: 'Finance',
    date: 'Apr 6',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'sunbi-go',
    name: 'Sunbi Go',
    url: 'sunbi-go.vercel.app',
    repo: 'ko750125-afk/sunbi-go',
    category: 'Games & Edu',
    date: 'Apr 1',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'study-archive-j582',
    name: 'Study Archive (Clone)',
    url: 'study-archive-j582.vercel.app',
    repo: 'ko750125-afk/study-archive',
    category: 'Others',
    date: 'Apr 1',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'cyber-mole',
    name: 'Cyber Mole',
    url: 'cyber-mole.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 18',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'math-apple',
    name: 'Math Apple',
    url: null,
    repo: 'ko750125-afk/math-apple',
    category: 'Games & Edu',
    date: 'Apr 19',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'mbti-test',
    name: 'MBTI Test',
    url: 'mbti-test-kos.vercel.app',
    repo: 'ko750125-afk/MBTI-test',
    category: 'Others',
    date: 'Mar 31',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'mobile-wedding-invitation',
    name: 'Mobile Invitation',
    url: 'mobile-wedding-invitation-virid.vercel.app',
    repo: 'ko750125-afk/mobile-invitation',
    category: 'Others',
    date: 'Apr 22',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'my-first-idea',
    name: 'My First Idea',
    url: 'my-first-idea-kappa.vercel.app',
    repo: 'ko750125-afk/my-first-idea',
    category: 'Others',
    date: 'Mar 30',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'voicecam-memo',
    name: 'VoiceCam Memo',
    url: 'voicecam-memo.vercel.app',
    repo: 'ko750125-afk/develop-PRD-master',
    category: 'AI & Smart',
    date: 'Mar 18',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'pay-cycle-app',
    name: 'Pay Cycle',
    url: 'pay-cycle-app.vercel.app',
    repo: 'ko750125-afk/pay-cycle',
    category: 'Finance',
    date: 'Mar 22',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ai-build-coach',
    name: 'AI Build Coach',
    url: 'ai-build-coach.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Mar 18',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'ai-build-architect',
    name: 'AI Build Architect',
    url: 'ai-build-architect.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Mar 17',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'kids-math-monster',
    name: 'Kids Math Monster',
    url: 'kids-math-monster.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 11',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'reflex-vocab',
    name: 'Reflex Vocab',
    url: 'reflex-vocab.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Feb 28',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'reflex-vocab-en',
    name: 'Reflex Vocab EN',
    url: null,
    repo: null,
    category: 'Games & Edu',
    date: 'Feb 28',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'kanpyeon-budget',
    name: 'Kanpyeon Budget',
    url: 'kanpyeon-budget.vercel.app',
    repo: null,
    category: 'Finance',
    date: 'Feb 23',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'past-life-analyzer',
    name: 'Past Life Analyzer',
    url: 'past-life-analyzer.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Feb 16',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'frontend',
    name: 'Frontend Template',
    url: 'frontend-three-pink-68.vercel.app',
    repo: null,
    category: 'Others',
    date: '18h ago',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'backend',
    name: 'Backend API',
    url: 'backend-theta-blond-16.vercel.app',
    repo: null,
    category: 'Others',
    date: '18h ago',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: '100-websites',
    name: '100 Websites',
    url: '100-websites-iota.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 31',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'apps-hub',
    name: 'Apps Hub (Legacy)',
    url: 'kos-apps-hub.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 11',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'builder-workflow-hub',
    name: 'Builder Workflow (V1)',
    url: 'builder-workflow-hub.vercel.app',
    repo: null,
    category: 'Productivity',
    date: 'Mar 23',
    featured: false,,
    image: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?q=80&w=800&auto=format&fit=crop'
  }
];
