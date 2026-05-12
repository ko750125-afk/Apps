import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import type { AppData } from "@/data/apps";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a URL to ensure it has a protocol.
 */
export function formatUrl(url: string | null | undefined): string {
  if (!url) return '';
  return url.startsWith('http') ? url : `https://${url}`;
}

/** Firestore `imageObjectPosition` → 퍼센트 초점 (0~100). 빈 값이면 가운데. */
export function parseAppImageFocus(input: string | undefined | null): { x: number; y: number } {
  if (!input?.trim()) return { x: 50, y: 50 };
  const m = /^(\d+(?:\.\d+)?)%\s+(\d+(?:\.\d+)?)%$/i.exec(input.trim());
  if (!m) return { x: 50, y: 50 };
  return {
    x: Math.min(100, Math.max(0, Number(m[1]))),
    y: Math.min(100, Math.max(0, Number(m[2]))),
  };
}

/** object-fit: cover용 CSS object-position 문자열 */
export function appImageObjectPositionCss(app: Pick<AppData, 'imageObjectPosition'>): string {
  const { x, y } = parseAppImageFocus(app.imageObjectPosition);
  return `${x}% ${y}%`;
}

/** 폼·Firestore 저장용. 정중앙이면 빈 문자열로 줄임. */
export function formatImageObjectPositionForSave(f: { x: number; y: number }): string {
  if (Math.abs(f.x - 50) < 0.25 && Math.abs(f.y - 50) < 0.25) return '';
  return `${f.x.toFixed(1)}% ${f.y.toFixed(1)}%`;
}

/**
 * 상세·목록에서 공통으로 쓰는 출시·완료 일자 표기 (년·월 중심, 한국어).
 * Firestore에 "May 12", "2024-05", ISO 등 섞여 있어도 표시만 통일한다.
 */
export function formatAppDateForDisplay(raw: string | undefined | null): string {
  if (raw === undefined || raw === null || String(raw).trim() === '') {
    return '—';
  }
  const s = String(raw).trim();

  const ymd = /^(\d{4})-(\d{2})(?:-(\d{2}))?/.exec(s);
  if (ymd) {
    const y = Number(ymd[1]);
    const mo = Number(ymd[2]);
    if (y >= 1900 && mo >= 1 && mo <= 12) {
      return `${y}년 ${mo}월`;
    }
  }

  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(s)) {
    const d = new Date(s);
    if (!Number.isNaN(d.getTime())) {
      return `${d.getFullYear()}년 ${d.getMonth() + 1}월`;
    }
  }

  let parsed = new Date(s);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월`;
  }

  const y = new Date().getFullYear();
  parsed = new Date(`${s}, ${y}`);
  if (!Number.isNaN(parsed.getTime())) {
    return `${parsed.getFullYear()}년 ${parsed.getMonth() + 1}월`;
  }

  return s;
}

/**
 * Generates a stable screenshot URL using WordPress mshots.
 */
export function getScreenshotUrl(url: string, width: number = 800) {
  if (!url) return null;
  // Use raw URL for mshots to handle complex query parameters correctly
  const cleanUrl = url.startsWith('http') ? url : `https://${url}`;
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=${width}`;
}

/**
 * Firebase Storage, 확장자 URL, 로컬 경로 등은 이미지로 직접 사용한다.
 * 그 외 http(s)는 배포 URL로 간주해 mshots 썸네일을 쓴다.
 */
function isLikelyDirectImageUrl(url: string): boolean {
  const t = url.trim();
  if (t.startsWith('/')) return true;
  if (!t.startsWith('http')) return false;
  const pathNoQuery = t.split('?')[0];
  if (/\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(pathNoQuery)) return true;
  if (/^https:\/\/firebasestorage\.googleapis\.com\//i.test(t)) return true;
  if (/^https:\/\/[^/]+\.firebasestorage\.app\//i.test(t)) return true;
  return false;
}

/**
 * Determines the best image to display for an app.
 * Prioritizes custom images, then screenshots, then GitHub OG images.
 */
export function getAppImage(app: { image?: string | null; url?: string | null }) {
  if (!app) return null;

  // 1. Priority: Custom Image
  if (app.image && app.image.trim() !== '') {
    const img = app.image.trim();
    if (img.startsWith('http') && !isLikelyDirectImageUrl(img)) {
      return getScreenshotUrl(img);
    }
    return img;
  }

  // 2. Fallback: Project URL Screenshot
  if (app.url && app.url.trim() !== '') {
    return getScreenshotUrl(app.url);
  }

  return null;
}
