/**
 * Client-side utility to trigger Next.js cache revalidation via API route.
 * Used by both useAdminDashboard (delete) and useAppForm (create/update).
 */
export async function triggerRevalidate(params: { tag?: string; path?: string } = {}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.tag) searchParams.set('tag', params.tag);
    if (params.path) searchParams.set('path', params.path);
    
    const url = `/api/revalidate?${searchParams.toString()}`;
    const res = await fetch(url);
    const data = await res.json();
    
    console.log('[Revalidation]', data);
    return data;
  } catch (error) {
    console.error('[Revalidation Error]', error);
    return { revalidated: false, error };
  }
}

/**
 * Batch revalidation helper — invalidates all standard app-related caches.
 * Consolidates the duplicated revalidation logic from hooks.
 */
export async function revalidateAppCaches(appId?: string) {
  const tags = ['apps'];
  if (appId) tags.push(`app-${appId}`);

  const paths = ['/', '/admin'];

  await Promise.all([
    ...tags.map(tag => triggerRevalidate({ tag })),
    ...paths.map(path => triggerRevalidate({ path })),
  ]);
}
