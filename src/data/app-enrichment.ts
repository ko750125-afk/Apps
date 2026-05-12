import type { AppData } from '@/data/apps';

type AppEnrichmentCore = Partial<Omit<AppData, 'id'>>;

/** Firestore 값이 있어도 로컬 문자열로 덮어쓸 때 사용 */
type AppEnrichment = AppEnrichmentCore & {
  replaceMemo?: boolean;
  replaceDescription?: boolean;
};

/** Local copy for apps whose Firestore row is still minimal (e.g. new shells). */
const RAW_ENRICHMENT: Record<string, AppEnrichment> = {
  urbandeco: {
    name: 'Urban Deco',
    description:
      '인테리어·리빙 브랜드 Urban Deco 공식 웹. 공간 연출과 제품 스토리를 담은 쇼룸형 레이아웃으로, 상담·문의까지 한 흐름으로 이어집니다.',
    category: 'Business Website',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Firebase'],
    memo: `## 프로젝트 소개

Urban Deco는 도시 감성과 실내 장식을 아우르는 리빙 브랜드 사이트입니다. 라인별 제품 하이라이트, 실제 공간 연출, 브랜드 스토리를 섹션 단위로 풀어 방문자가 **제품 맥락 → 구매 동기 → 문의** 순으로 자연스럽게 이동하도록 구성했습니다.

## 타깃과 목표

- **타깃**: 인테리어에 관심 있는 20~40대, 소형 거주·오피스, 리빙 큐레이션을 찾는 고객
- **목표**: 브랜드 톤 유지, 핵심 컬렉션 노출, 상담·견적 전환 단순화

## 주요 구성

- **랜딩·컬렉션**: 히어로와 추천 라인, 카테고리별 그리드로 스크롤 리듬을 나눔
- **스토리·룩북**: 텍스트·이미지 블록을 교차 배치해 ‘잡지형’ 가독성 확보
- **문의 동선**: 상·하단 CTA와 사이드 패널의 문의 진입을 동일한 메시지 톤으로 정렬

## 기술 스택

- **프레임워크**: Next.js(App Router), React
- **언어**: TypeScript(엄격 모드)
- **스타일**: Tailwind CSS
- **모션**: Framer Motion(스크롤·섹션 전환)
- **데이터·인프라**: Firebase(Firestore·호스팅 연동, 필요 시 확장)

## 퍼포먼스·운영

- 이미지 최적화·정적 캐시를 활용해 초기 로딩과 페이지 전환 체감 속도를 우선
- 접근성·메타 정보(OG/TITLE) 정비로 공유·검색 대비
`,
  },
  'vive-dev-wiki': {
    description:
      'VR·MR 개발자를 위한 문서·가이드·레퍼런스를 한곳에서 탐색하는 위키형 지식 허브. 빠른 검색과 읽기 중심 UI로 온보딩과 이슈 해결 시간을 줄입니다.',
    category: 'Automation & Tools',
    techStack: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Markdown', 'Firebase'],
    replaceDescription: true,
    replaceMemo: true,
    memo: `## 프로젝트 소개

**Vive Dev Wiki**는 VR·MR 개발 과정에서 필요한 **문서, 튜토리얼, API·SDK 레퍼런스**를 한곳에서 찾을 수 있도록 정리한 위키형 사이트입니다. 공식 자료와 실무에서 자주 쓰는 설정·트러블슈팅 노트를 연결해, 개발자가 **검색 → 확인 → 적용**까지 끊기지 않게 만드는 것을 목표로 했습니다.

## 기획 의도

- **온보딩 단축**: 처음 환경을 잡는 단계에서 필요한 링크·체크리스트를 한 페이지 흐름으로 묶음
- **정보 산재 완화**: 버전별 SDK, 플러그인, 빌드 설정이 흩어져 있을 때 비교·요약이 가능한 목차 구조
- **장시간 읽기**: 코드 블록·표가 많은 문서에 맞춘 타이포·여백·다크 테마 대비

## 주요 구성

- **문서 허브**: 카테고리·태그·교차 링크로 문서 간 이동을 단순화
- **검색·목차**: 긴 문서에서도 원하는 섹션으로 빠르게 점프할 수 있는 내비게이션
- **공유·메타**: OG·제목·설명을 정리해 링크 공유 시에도 맥락이 드러나도록 구성

## 기술 스택

- **프레임워크**: Next.js(App Router), React
- **언어**: TypeScript(엄격 모드)
- **스타일**: Tailwind CSS
- **콘텐츠**: Markdown 기반 렌더링(필요 시 MDX 등으로 확장 가능)
- **데이터·운영**: Firebase(Firestore 등)와 포트폴리오 목록 연동

## 퍼포먼스·운영

- 정적 생성·캐시 전략으로 문서 페이지의 첫 로딩과 전환 체감 속도를 우선
- 접근성·스크린 리더 대비, 코드 블록 가독성(줄바꿈·복사 UX) 점검
- 문서 추가·수정 시 검토·배포 절차를 짧게 정의해 기여가 늘어도 품질을 유지
`,
  },
};

function isBlank(s: string | undefined | null): boolean {
  return s === undefined || s === null || String(s).trim() === '';
}

function matchesUrbanDeco(app: AppData): boolean {
  const id = (app.id || '').toLowerCase().trim();
  const idCompact = id.replace(/\s+/g, '');
  if (idCompact === 'urbandeco' || (id.includes('urban') && id.includes('deco'))) {
    return true;
  }
  const n = (app.name || '').toLowerCase();
  const letters = n.replace(/[^a-z]/g, '');
  if (letters === 'urbandeco') return true;
  return n.includes('urban') && n.includes('deco');
}

function matchesViveDevWiki(app: AppData): boolean {
  const id = (app.id || '').toLowerCase().trim();
  const idCompact = id.replace(/[\s_-]/g, '');
  if (idCompact === 'vivedevwiki' || (id.includes('vive') && id.includes('wiki'))) {
    return true;
  }
  const n = (app.name || '').toLowerCase();
  return n.includes('vive') && n.includes('wiki');
}

function resolveEnrichment(app: AppData): AppEnrichment | null {
  const idKey = app.id?.toLowerCase()?.trim() ?? '';
  if (RAW_ENRICHMENT[idKey]) return RAW_ENRICHMENT[idKey];
  const idCompact = idKey.replace(/\s+/g, '');
  if (RAW_ENRICHMENT[idCompact]) return RAW_ENRICHMENT[idCompact];
  const idLoose = idKey.replace(/[\s_-]/g, '');
  if (RAW_ENRICHMENT[idLoose]) return RAW_ENRICHMENT[idLoose];

  if (matchesViveDevWiki(app)) {
    return RAW_ENRICHMENT['vive-dev-wiki'];
  }
  if (matchesUrbanDeco(app)) {
    return RAW_ENRICHMENT.urbandeco;
  }
  return null;
}

export function applyAppEnrichment(app: AppData): AppData {
  const extra = resolveEnrichment(app);
  if (!extra) return app;

  const next: AppData = { ...app };

  if (
    extra.name &&
    (isBlank(app.name) ||
      /^urbandeco$/i.test(String(app.name).trim()) ||
      String(app.name).trim() === String(app.id).trim())
  ) {
    next.name = extra.name;
  }
  if (!isBlank(extra.description) && (isBlank(app.description) || extra.replaceDescription)) {
    next.description = extra.description!;
  }
  if (!isBlank(extra.category) && isBlank(app.category)) {
    next.category = extra.category!;
  }
  if (!isBlank(extra.memo) && (isBlank(app.memo) || extra.replaceMemo)) {
    next.memo = extra.memo!;
  }
  if ((!app.techStack || app.techStack.length === 0) && extra.techStack?.length) {
    next.techStack = extra.techStack;
  }

  return next;
}
