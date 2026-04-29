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
    image: 'https://s0.wp.com/mshots/v1/builder-workflow-hub-final-v2.vercel.app?w=800'
  },
  {
    id: 'study-archive',
    name: 'Study Archive',
    url: 'ko-study-archive.vercel.app',
    repo: null,
    category: 'Others',
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
    category: 'Productivity',
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
    category: 'AI & Smart',
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
    category: 'Productivity',
    date: 'Apr 25',
    featured: false,
    description: 'Supabase를 연동한 노션 클론 코딩 프로젝트',
    image: 'https://s0.wp.com/mshots/v1/notion-clone-amber-seven.vercel.app?w=800'
  },
  {
    id: 'smart-qr',
    name: 'Smart QR',
    url: 'smart-qr-alpha.vercel.app',
    repo: 'ko750125-afk/smart-qr',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/smart-qr-alpha.vercel.app?w=800'
  },
  {
    id: 'qrmaker',
    name: 'QR Maker',
    url: null,
    repo: 'ko750125-afk/QRmaker',
    category: 'Utility & Tools',
    date: '6h ago',
    featured: false,
    image: 'https://opengraph.githubassets.com/1/ko750125-afk/QRmaker'
  },
  {
    id: 'grab-pdf',
    name: 'Grab PDF',
    url: 'grab-pdf.vercel.app',
    repo: 'ko750125-afk/grabPDF',
    category: 'Utility & Tools',
    date: '6h ago',
    featured: false,
    description: 'PDF 추출 및 병합 유틸리티',
    image: 'https://s0.wp.com/mshots/v1/grab-pdf.vercel.app?w=800'
  },
  {
    id: 'smart-neon-calculator',
    name: 'Smart Neon Calculator',
    url: 'smart-neon-calculator.vercel.app',
    repo: 'ko750125-afk/calculator',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/smart-neon-calculator.vercel.app?w=800'
  },
  {
    id: 'memo',
    name: 'Memo',
    url: 'memo-pi-ochre.vercel.app',
    repo: 'ko750125-afk/memo',
    category: 'Productivity',
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
    category: 'Utility & Tools',
    date: 'Apr 14',
    featured: false,
    description: '실시간 데이터 동기화 택배 조회기',
    image: 'https://s0.wp.com/mshots/v1/courier-tracker-app.vercel.app?w=800'
  },
  {
    id: 'global-time-schedule',
    name: 'Global Time Schedule',
    url: 'global-time-schedule.vercel.app',
    repo: 'ko750125-afk/Global-Time-Schedule',
    category: 'Utility & Tools',
    date: 'Apr 11',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/global-time-schedule.vercel.app?w=800'
  },
  {
    id: 'gift_fund',
    name: 'Gift Fund',
    url: 'giftfund.vercel.app',
    repo: 'ko750125-afk/gift_fund',
    category: 'Finance',
    date: 'Apr 6',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/giftfund.vercel.app?w=800'
  },
  {
    id: 'sunbi-go',
    name: 'Sunbi Go',
    url: 'sunbi-go.vercel.app',
    repo: 'ko750125-afk/sunbi-go',
    category: 'Games & Edu',
    date: 'Apr 1',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/sunbi-go.vercel.app?w=800'
  },
  {
    id: 'study-archive-j582',
    name: 'Study Archive (Clone)',
    url: 'study-archive-j582.vercel.app',
    repo: 'ko750125-afk/study-archive',
    category: 'Others',
    date: 'Apr 1',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/study-archive-j582.vercel.app?w=800'
  },
  {
    id: 'cyber-mole',
    name: 'Cyber Mole',
    url: 'cyber-mole.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 18',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/cyber-mole.vercel.app?w=800'
  },
  {
    id: 'math-apple',
    name: 'Math Apple',
    url: null,
    repo: 'ko750125-afk/math-apple',
    category: 'Games & Edu',
    date: 'Apr 19',
    featured: false,
    image: 'https://opengraph.githubassets.com/1/ko750125-afk/math-apple'
  },
  {
    id: 'mbti-test',
    name: 'MBTI Test',
    url: 'mbti-test-kos.vercel.app',
    repo: 'ko750125-afk/MBTI-test',
    category: 'Others',
    date: 'Mar 31',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/mbti-test-kos.vercel.app?w=800'
  },
  {
    id: 'mobile-wedding-invitation',
    name: 'Mobile Invitation',
    url: 'mobile-wedding-invitation-virid.vercel.app',
    repo: 'ko750125-afk/mobile-invitation',
    category: 'Others',
    date: 'Apr 22',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/mobile-wedding-invitation-virid.vercel.app?w=800'
  },
  {
    id: 'my-first-idea',
    name: 'My First Idea',
    url: 'my-first-idea-kappa.vercel.app',
    repo: 'ko750125-afk/my-first-idea',
    category: 'Others',
    date: 'Mar 30',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/my-first-idea-kappa.vercel.app?w=800'
  },
  {
    id: 'voicecam-memo',
    name: 'VoiceCam Memo',
    url: 'voicecam-memo.vercel.app',
    repo: 'ko750125-afk/develop-PRD-master',
    category: 'AI & Smart',
    date: 'Mar 18',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/voicecam-memo.vercel.app?w=800'
  },
  {
    id: 'pay-cycle-app',
    name: 'Pay Cycle',
    url: 'pay-cycle-app.vercel.app',
    repo: 'ko750125-afk/pay-cycle',
    category: 'Finance',
    date: 'Mar 22',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/pay-cycle-app.vercel.app?w=800'
  },
  {
    id: 'ai-build-coach',
    name: 'AI Build Coach',
    url: 'ai-build-coach.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Mar 18',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/ai-build-coach.vercel.app?w=800'
  },
  {
    id: 'ai-build-architect',
    name: 'AI Build Architect',
    url: 'ai-build-architect.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Mar 17',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/ai-build-architect.vercel.app?w=800'
  },
  {
    id: 'kids-math-monster',
    name: 'Kids Math Monster',
    url: 'kids-math-monster.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 11',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/kids-math-monster.vercel.app?w=800'
  },
  {
    id: 'reflex-vocab',
    name: 'Reflex Vocab',
    url: 'reflex-vocab.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Feb 28',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/reflex-vocab.vercel.app?w=800'
  },
  {
    id: 'reflex-vocab-en',
    name: 'Reflex Vocab EN',
    url: null,
    repo: null,
    category: 'Games & Edu',
    date: 'Feb 28',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/reflex-vocab.vercel.app?w=800'
  },
  {
    id: 'kanpyeon-budget',
    name: 'Kanpyeon Budget',
    url: 'kanpyeon-budget.vercel.app',
    repo: null,
    category: 'Finance',
    date: 'Feb 23',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/kanpyeon-budget.vercel.app?w=800'
  },
  {
    id: 'past-life-analyzer',
    name: 'Past Life Analyzer',
    url: 'past-life-analyzer.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Feb 16',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/past-life-analyzer.vercel.app?w=800'
  },
  {
    id: 'frontend',
    name: 'Frontend Template',
    url: 'frontend-three-pink-68.vercel.app',
    repo: null,
    category: 'Others',
    date: '18h ago',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/frontend-three-pink-68.vercel.app?w=800'
  },
  {
    id: 'backend',
    name: 'Backend API',
    url: 'backend-theta-blond-16.vercel.app',
    repo: null,
    category: 'Others',
    date: '18h ago',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/backend-theta-blond-16.vercel.app?w=800'
  },
  {
    id: '100-websites',
    name: '100 Websites',
    url: '100-websites-iota.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 31',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/100-websites-iota.vercel.app?w=800'
  },
  {
    id: 'apps-hub',
    name: 'Apps Hub (Legacy)',
    url: 'kos-apps-hub.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 11',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/kos-apps-hub.vercel.app?w=800'
  },
  {
    id: 'builder-workflow-hub',
    name: 'Builder Workflow (V1)',
    url: 'builder-workflow-hub.vercel.app',
    repo: null,
    category: 'Productivity',
    date: 'Mar 23',
    featured: false,
    image: 'https://s0.wp.com/mshots/v1/builder-workflow-hub.vercel.app?w=800'
  }
];
