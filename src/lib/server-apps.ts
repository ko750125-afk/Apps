import { AppData, apps as staticApps } from '@/data/apps';

const PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
const COLLECTION = '18_apps_list';

interface FirestoreValue {
  stringValue?: string;
  booleanValue?: boolean;
  arrayValue?: {
    values?: Array<{ stringValue?: string }>;
  };
}

interface FirestoreDocument {
  name: string;
  fields: Record<string, FirestoreValue>;
}

export async function getApps(): Promise<AppData[]> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}?orderBy=name%20asc`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) throw new Error('Failed to fetch from Firestore');
    
    const data = await res.json();
    if (!data.documents) return staticApps;
    
    return data.documents.map((doc: FirestoreDocument) => {
      const fields = doc.fields;
      const id = doc.name.split('/').pop() || '';
      
      return {
        id,
        name: fields.name?.stringValue || '',
        description: fields.description?.stringValue || '',
        image: fields.image?.stringValue || '',
        url: fields.url?.stringValue || '',
        repo: fields.repo?.stringValue || '',
        date: fields.date?.stringValue || '',
        category: fields.category?.stringValue || 'Other',
        status: fields.status?.stringValue || 'Active',
        featured: fields.featured?.booleanValue || false,
        memo: fields.memo?.stringValue || '',
        tags: fields.tags?.arrayValue?.values?.map((v: { stringValue?: string }) => v.stringValue || '') || []
      } as unknown as AppData;
    }) as AppData[];
  } catch {
    return staticApps;
  }
}

export async function getAppById(id: string): Promise<AppData | null> {
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${PROJECT_ID}/databases/(default)/documents/${COLLECTION}/${id}`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!res.ok) {
      return staticApps.find(a => a.id === id) || null;
    }
    
    const doc: FirestoreDocument = await res.json();
    const fields = doc.fields;
    
    return {
      id,
      name: fields.name?.stringValue || '',
      description: fields.description?.stringValue || '',
      image: fields.image?.stringValue || '',
      url: fields.url?.stringValue || '',
      repo: fields.repo?.stringValue || '',
      date: fields.date?.stringValue || '',
      category: fields.category?.stringValue || 'Other',
      status: fields.status?.stringValue || 'Active',
      featured: fields.featured?.booleanValue || false,
      memo: fields.memo?.stringValue || '',
      tags: fields.tags?.arrayValue?.values?.map((v: { stringValue?: string }) => v.stringValue || '') || []
    } as unknown as AppData;
  } catch {
    return staticApps.find(a => a.id === id) || null;
  }
}
