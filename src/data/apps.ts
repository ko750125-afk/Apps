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
    image: 'https://screenshot.vercel.app/builder-workflow-hub-final-v2.vercel.app'
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
    image: 'https://screenshot.vercel.app/ko-study-archive.vercel.app'
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
    image: 'https://screenshot.vercel.app/notion-clone-amber-seven.vercel.app'
  },
  {
    id: 'smart-qr',
    name: 'Smart QR',
    url: 'smart-qr-alpha.vercel.app',
    repo: 'ko750125-afk/smart-qr',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,
    image: 'https://screenshot.vercel.app/smart-qr-alpha.vercel.app'
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
    image: 'https://screenshot.vercel.app/grab-pdf.vercel.app'
  },
  {
    id: 'smart-neon-calculator',
    name: 'Smart Neon Calculator',
    url: 'smart-neon-calculator.vercel.app',
    repo: 'ko750125-afk/calculator',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,
    image: 'https://screenshot.vercel.app/smart-neon-calculator.vercel.app'
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
    image: 'https://screenshot.vercel.app/memo-pi-ochre.vercel.app'
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
    image: 'https://screenshot.vercel.app/courier-tracker-app.vercel.app'
  },
  {
    id: 'global-time-schedule',
    name: 'Global Time Schedule',
    url: 'global-time-schedule.vercel.app',
    repo: 'ko750125-afk/Global-Time-Schedule',
    category: 'Utility & Tools',
    date: 'Apr 11',
    featured: false,
    image: 'https://screenshot.vercel.app/global-time-schedule.vercel.app'
  },
  {
    id: 'gift_fund',
    name: 'Gift Fund',
    url: 'giftfund.vercel.app',
    repo: 'ko750125-afk/gift_fund',
    category: 'Finance',
    date: 'Apr 6',
    featured: false,
    image: 'https://screenshot.vercel.app/giftfund.vercel.app'
  },
  {
    id: 'sunbi-go',
    name: 'Sunbi Go',
    url: 'sunbi-go.vercel.app',
    repo: 'ko750125-afk/sunbi-go',
    category: 'Games & Edu',
    date: 'Apr 1',
    featured: false,
    image: 'https://screenshot.vercel.app/sunbi-go.vercel.app'
  },
  {
    id: 'study-archive-j582',
    name: 'Study Archive (Clone)',
    url: 'study-archive-j582.vercel.app',
    repo: 'ko750125-afk/study-archive',
    category: 'Others',
    date: 'Apr 1',
    featured: false,
    image: 'https://screenshot.vercel.app/study-archive-j582.vercel.app'
  },
  {
    id: 'cyber-mole',
    name: 'Cyber Mole',
    url: 'cyber-mole.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 18',
    featured: false,
    image: 'https://screenshot.vercel.app/cyber-mole.vercel.app'
  },
  {
    id: 'math-apple',
    name: 'Math Apple',
    url: null,
    repo: 'ko750125-afk/math-apple',
    category: 'Games & Edu',
    date: 'Apr 19',
    featured: false,
    image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop'
  },
  {
    id: 'mbti-test',
    name: 'MBTI Test',
    url: 'mbti-test-kos.vercel.app',
    repo: 'ko750125-afk/MBTI-test',
    category: 'Others',
    date: 'Mar 31',
    featured: false,
    image: 'https://screenshot.vercel.app/mbti-test-kos.vercel.app'
  },
  {
    id: 'mobile-wedding-invitation',
    name: 'Mobile Invitation',
    url: 'mobile-wedding-invitation-virid.vercel.app',
    repo: 'ko750125-afk/mobile-invitation',
    category: 'Others',
    date: 'Apr 22',
    featured: false,
    image: 'https://screenshot.vercel.app/mobile-wedding-invitation-virid.vercel.app'
  },
  {
    id: 'my-first-idea',
    name: 'My First Idea',
    url: 'my-first-idea-kappa.vercel.app',
    repo: 'ko750125-afk/my-first-idea',
    category: 'Others',
    date: 'Mar 30',
    featured: false,
    image: 'https://screenshot.vercel.app/my-first-idea-kappa.vercel.app'
  },
  {
    id: 'voicecam-memo',
repo: null,
    category: 'Others',
    date: 'Mar 26',
    featured: true,
    description: '개인 스터디 기록 및 아카이빙 플랫폼',
    image: 'https://screenshot.vercel.app/ko-study-archive.vercel.app'
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
    image: 'https://screenshot.vercel.app/notion-clone-amber-seven.vercel.app'
  },
  {
    id: 'smart-qr',
    name: 'Smart QR',
    url: 'smart-qr-alpha.vercel.app',
    repo: 'ko750125-afk/smart-qr',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,
    image: 'https://screenshot.vercel.app/smart-qr-alpha.vercel.app'
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
    image: 'https://screenshot.vercel.app/grab-pdf.vercel.app'
  },
  {
    id: 'smart-neon-calculator',
    name: 'Smart Neon Calculator',
    url: 'smart-neon-calculator.vercel.app',
    repo: 'ko750125-afk/calculator',
    category: 'Utility & Tools',
    date: 'Apr 22',
    featured: false,
    image: 'https://screenshot.vercel.app/smart-neon-calculator.vercel.app'
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
    image: 'https://screenshot.vercel.app/memo-pi-ochre.vercel.app'
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
    image: 'https://screenshot.vercel.app/courier-tracker-app.vercel.app'
  },
  {
    id: 'global-time-schedule',
    name: 'Global Time Schedule',
    url: 'global-time-schedule.vercel.app',
    repo: 'ko750125-afk/Global-Time-Schedule',
    category: 'Utility & Tools',
    date: 'Apr 11',
    featured: false,
    image: 'https://screenshot.vercel.app/global-time-schedule.vercel.app'
  },
  {
    id: 'gift_fund',
    name: 'Gift Fund',
    url: 'giftfund.vercel.app',
    repo: 'ko750125-afk/gift_fund',
    category: 'Finance',
    date: 'Apr 6',
    featured: false,
    image: 'https://screenshot.vercel.app/giftfund.vercel.app'
  },
  {
    id: 'sunbi-go',
    name: 'Sunbi Go',
    url: 'sunbi-go.vercel.app',
    repo: 'ko750125-afk/sunbi-go',
    category: 'Games & Edu',
    date: 'Apr 1',
    featured: false,
    image: 'https://screenshot.vercel.app/sunbi-go.vercel.app'
  },
  {
    id: 'study-archive-j582',
    name: 'Study Archive (Clone)',
    url: 'study-archive-j582.vercel.app',
    repo: 'ko750125-afk/study-archive',
    category: 'Others',
    date: 'Apr 1',
    featured: false,
    image: 'https://screenshot.vercel.app/study-archive-j582.vercel.app'
  },
  {
    id: 'cyber-mole',
    name: 'Cyber Mole',
    url: 'cyber-mole.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 18',
    featured: false,
    image: 'https://screenshot.vercel.app/cyber-mole.vercel.app'
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
    image: 'https://screenshot.vercel.app/mbti-test-kos.vercel.app'
  },
  {
    id: 'mobile-wedding-invitation',
    name: 'Mobile Invitation',
    url: 'mobile-wedding-invitation-virid.vercel.app',
    repo: 'ko750125-afk/mobile-invitation',
    category: 'Others',
    date: 'Apr 22',
    featured: false,
    image: 'https://screenshot.vercel.app/mobile-wedding-invitation-virid.vercel.app'
  },
  {
    id: 'my-first-idea',
    name: 'My First Idea',
    url: 'my-first-idea-kappa.vercel.app',
    repo: 'ko750125-afk/my-first-idea',
    category: 'Others',
    date: 'Mar 30',
    featured: false,
    image: 'https://screenshot.vercel.app/my-first-idea-kappa.vercel.app'
  },
  {
    id: 'voicecam-memo',
    name: 'VoiceCam Memo',
    url: 'voicecam-memo.vercel.app',
    repo: 'ko750125-afk/develop-PRD-master',
    category: 'AI & Smart',
    date: 'Mar 18',
    featured: false,
    image: 'https://screenshot.vercel.app/voicecam-memo.vercel.app'
  },
  {
    id: 'pay-cycle-app',
    name: 'Pay Cycle',
    url: 'pay-cycle-app.vercel.app',
    repo: 'ko750125-afk/pay-cycle',
    category: 'Finance',
    date: 'Mar 22',
    featured: false,
    image: 'https://screenshot.vercel.app/pay-cycle-app.vercel.app'
  },
  {
    id: 'ai-build-coach',
    name: 'AI Build Coach',
    url: 'ai-build-coach.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Mar 18',
    featured: false,
    image: 'https://screenshot.vercel.app/ai-build-coach.vercel.app'
  },
  {
    id: 'ai-build-architect',
    name: 'AI Build Architect',
    url: 'ai-build-architect.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Mar 17',
    featured: false,
    image: 'https://screenshot.vercel.app/ai-build-architect.vercel.app'
  },
  {
    id: 'kids-math-monster',
    name: 'Kids Math Monster',
    url: 'kids-math-monster.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Mar 11',
    featured: false,
    image: 'https://screenshot.vercel.app/kids-math-monster.vercel.app'
  },
  {
    id: 'reflex-vocab',
    name: 'Reflex Vocab',
    url: 'reflex-vocab.vercel.app',
    repo: null,
    category: 'Games & Edu',
    date: 'Feb 28',
    featured: false,
    image: 'https://screenshot.vercel.app/reflex-vocab.vercel.app'
  },
  {
    id: 'reflex-vocab-en',
    name: 'Reflex Vocab EN',
    url: null,
    repo: null,
    category: 'Games & Edu',
    date: 'Feb 28',
    featured: false,
    image: 'https://screenshot.vercel.app/reflex-vocab.vercel.app'
  },
  {
    id: 'kanpyeon-budget',
    name: 'Kanpyeon Budget',
    url: 'kanpyeon-budget.vercel.app',
    repo: null,
    category: 'Finance',
    date: 'Feb 23',
    featured: false,
    image: 'https://screenshot.vercel.app/kanpyeon-budget.vercel.app'
  },
  {
    id: 'past-life-analyzer',
    name: 'Past Life Analyzer',
    url: 'past-life-analyzer.vercel.app',
    repo: null,
    category: 'AI & Smart',
    date: 'Feb 16',
    featured: false,
    image: 'https://screenshot.vercel.app/past-life-analyzer.vercel.app'
  },
  {
    id: 'frontend',
    name: 'Frontend Template',
    url: 'frontend-three-pink-68.vercel.app',
    repo: null,
    category: 'Others',
    date: '18h ago',
    featured: false,
    image: 'https://screenshot.vercel.app/frontend-three-pink-68.vercel.app'
  },
  {
    id: 'backend',
    name: 'Backend API',
    url: 'backend-theta-blond-16.vercel.app',
    repo: null,
    category: 'Others',
    date: '18h ago',
    featured: false,
    image: 'https://screenshot.vercel.app/backend-theta-blond-16.vercel.app'
  },
  {
    id: '100-websites',
    name: '100 Websites',
    url: '100-websites-iota.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 31',
    featured: false,
    image: 'https://screenshot.vercel.app/100-websites-iota.vercel.app'
  },
  {
    id: 'apps-hub',
    name: 'Apps Hub (Legacy)',
    url: 'kos-apps-hub.vercel.app',
    repo: null,
    category: 'Others',
    date: 'Mar 11',
    featured: false,
    image: 'https://screenshot.vercel.app/kos-apps-hub.vercel.app'
  },
  {
    id: 'builder-workflow-hub',
    name: 'Builder Workflow (V1)',
    url: 'builder-workflow-hub.vercel.app',
    repo: null,
    category: 'Productivity',
    date: 'Mar 23',
    featured: false,
    image: 'https://screenshot.vercel.app/builder-workflow-hub.vercel.app'
  }
];
