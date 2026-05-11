import { AppData, apps as staticApps } from '@/data/apps';
import { parseFirestoreDocument, FirestoreDocument } from './firestore-parser';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const COLLECTION = '18_apps_list';
const BASE_URL = PROJECT_ID 
  ? `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`
  : null;

export async function getApps(): Promise<AppData[]> {
  if (!BASE_URL) {
    console.warn("📡 Firestore: PROJECT_ID is missing. Using static fallback.");
    return staticApps;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    console.log("📡 Firestore: Fetching from", BASE_URL);
    const res = await fetch(`${BASE_URL}?orderBy=name%20asc`, {
      next: { revalidate: 3600, tags: ['apps'] },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    console.log("📡 Firestore: Response received", res.status);

    if (!res.ok) throw new Error('Failed to fetch from Firestore');

    const data = await res.json();
    if (!data.documents) return staticApps;

    return (data.documents as FirestoreDocument[]).map(parseFirestoreDocument);
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn('📡 Firestore: Fetch failed or timed out. Using static fallback.', error);
    return staticApps;
  }
}

export async function getAppById(id: string): Promise<AppData | null> {
  if (!BASE_URL) {
    return staticApps.find(a => a.id === id) || null;
  }
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 3000);

  try {
    console.log("📡 Firestore: Fetching single app", id);
    const res = await fetch(`${BASE_URL}/${id}`, {
      next: { revalidate: 3600, tags: ['apps', `app-${id}`] },
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    console.log("📡 Firestore: Single app response", res.status);

    if (!res.ok) {
      return staticApps.find(a => a.id === id) || null;
    }

    return parseFirestoreDocument(await res.json());
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`📡 Firestore: Single fetch failed for ${id}. Using static fallback.`, error);
    return staticApps.find(a => a.id === id) || null;
  }
}
