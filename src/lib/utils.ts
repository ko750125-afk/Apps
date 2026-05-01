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
  const cleanUrl = formatUrl(url);
  return `https://s0.wp.com/mshots/v1/${encodeURIComponent(cleanUrl)}?w=${width}`;
}

/**
 * Determines the best image to display for an app.
 * Prioritizes custom images, then screenshots, then GitHub OG images.
 */
export function getAppImage(app: { image?: string | null; url?: string | null; repo?: string | null }) {
  // Use custom image if it's not a legacy vercel screenshot
  if (app.image && !app.image.includes('screenshot.vercel.app')) {
    return app.image;
  }
  
  // Fallback to real-time screenshot if URL is available
  if (app.url) {
    return getScreenshotUrl(app.url);
  }
  
  // Fallback to GitHub OG image if repo is available
  if (app.repo) {
    return `https://opengraph.githubassets.com/1/${app.repo}`;
  }
  
  return null;
}
