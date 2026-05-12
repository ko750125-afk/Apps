/**
 * Client-side utility to trigger Next.js cache revalidation via API route.
 * Used by both useAdminDashboard (delete) and useAppForm (create/update).
 */
export async function triggerRevalidate(params: { tag?: string; path?: string; appId?: string } = {}) {
  try {
    const searchParams = new URLSearchParams();
    if (params.appId) {
      searchParams.set('appId', params.appId);
    } else {
      if (params.tag) searchParams.set('tag', params.tag);
      if (params.path) searchParams.set('path', params.path);
    }
    
    const url = `/api/revalidate?${searchParams.toString()}`;
    // 캐시 무효화 요청 자체가 브라우저나 중간 프록시에 캐시되지 않도록 강제
    const res = await fetch(url, { method: 'GET', cache: 'no-store' });
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
  // 여러 번의 동시 fetch로 인한 서버리스 캐시 누락 및 충돌을 방지하기 위해,
  // 서버측 단일 통합 갱신 파이프라인을 호출합니다.
  if (appId) {
    await triggerRevalidate({ appId });
  } else {
    // appId가 없는 신규 생성 등의 경우 전체 갱신 트리거
    await triggerRevalidate();
  }
}
