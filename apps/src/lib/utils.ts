import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
 * Determines the best image to display for an app.
 * Prioritizes custom images, then screenshots, then GitHub OG images.
 */
export function getAppImage(app: { image?: string | null; url?: string | null }) {
  if (!app) return null;
  
  // 1. Priority: Custom Image
  if (app.image && app.image.trim() !== '') {
    const isDirectImage = app.image.startsWith('/') || /\.(jpg|jpeg|png|webp|avif|gif|svg)$/i.test(app.image.split('?')[0]);
    if (app.image.startsWith('http') && !isDirectImage) {
      return getScreenshotUrl(app.image);
    }
    return app.image;
  }
  
  // 2. Fallback: Project URL Screenshot
  if (app.url && app.url.trim() !== '') {
    return getScreenshotUrl(app.url);
  }
  
  return null;
}
