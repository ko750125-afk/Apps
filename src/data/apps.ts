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
  url: string;
  category: string;
  date: string;
  featured: boolean;
  description: string;
  image: string;
  status: 'Exhibit' | 'Repair';
  memo?: string;
  /** object-cover 초점. 예: "40% 35%". 비우면 50% 50%로 표시 */
  imageObjectPosition?: string;
  /** Optional tags for detail sidebar; also writable from Firestore */
  techStack?: string[];
}

export const CATEGORIES: Category[] = [
  'All apps',
  'Business Website',
  'Reservation & Booking',
  'Admin Dashboard',
  'E-commerce',
  'Automation & Tools',
];

export const apps: AppData[] = [];

/** 공개 상세 등 한글 UI용(저장 값은 영문 카테고리 유지) */
export const CATEGORY_LABEL_KO: Record<string, string> = {
  'All apps': '전체',
  'Business Website': '비즈니스 웹사이트',
  'Reservation & Booking': '예약 · 부킹',
  'Admin Dashboard': '관리자 대시보드',
  'E-commerce': '이커머스',
  'Automation & Tools': '자동화 · 도구',
};

export function categoryLabelKo(category: string | undefined | null): string {
  if (!category) return '—';
  return CATEGORY_LABEL_KO[category] ?? category;
}
