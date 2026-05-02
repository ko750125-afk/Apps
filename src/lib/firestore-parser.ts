import { AppData } from '@/data/apps';

/**
 * Types for the Firestore REST API response.
 */
interface FirestoreValue {
  stringValue?: string;
  booleanValue?: boolean;
  arrayValue?: {
    values?: Array<{ stringValue?: string }>;
  };
}

export interface FirestoreDocument {
  name: string;
  fields: Record<string, FirestoreValue>;
}

/**
 * Parses a raw Firestore REST document into an AppData object.
 * Eliminates duplication between getApps() and getAppById().
 */
export function parseFirestoreDocument(doc: FirestoreDocument): AppData {
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
    tags: fields.tags?.arrayValue?.values?.map(v => v.stringValue || '') || [],
  } as unknown as AppData;
}
