import { AppData, apps as staticApps } from '@/data/apps';
import { parseFirestoreDocument, FirestoreDocument } from './firestore-parser';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const COLLECTION = '18_apps_list';
const BASE_URL = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}`;

export async function getApps(): Promise<AppData[]> {
  try {
    const res = await fetch(`${BASE_URL}?orderBy=name%20asc`, {
      next: { revalidate: 3600, tags: ['apps'] },
    });

    if (!res.ok) throw new Error('Failed to fetch from Firestore');

    const data = await res.json();
    if (!data.documents) return staticApps;

    return (data.documents as FirestoreDocument[]).map(parseFirestoreDocument);
  } catch {
    return staticApps;
  }
}

export async function getAppById(id: string): Promise<AppData | null> {
  try {
    const res = await fetch(`${BASE_URL}/${id}`, {
      next: { revalidate: 3600, tags: ['apps', `app-${id}`] },
    });

    if (!res.ok) {
      return staticApps.find(a => a.id === id) || null;
    }

    return parseFirestoreDocument(await res.json());
  } catch {
    return staticApps.find(a => a.id === id) || null;
  }
}
