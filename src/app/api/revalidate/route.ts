import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path');
  const appId = request.nextUrl.searchParams.get('appId');

  // 1. 단일 통합 일괄 갱신 모드 (가장 안전하고 권장되는 파이프라인)
  if (appId) {
    revalidateTag('apps');
    revalidateTag(`app-${appId}`);
    revalidatePath('/');
    revalidatePath('/projects');
    revalidatePath(`/projects/${appId}`, 'page');
    revalidatePath('/admin');
    
    return NextResponse.json({ 
      revalidated: true, 
      mode: 'batch',
      appId, 
      now: Date.now() 
    });
  }

  // 2. 개별 태그/경로 갱신 모드 (하위 호환성)
  if (tag) {
    revalidateTag(tag);
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  // 3. 기본 전체 갱신
  revalidateTag('apps');
  revalidatePath('/');
  revalidatePath('/projects');
  revalidatePath('/admin');
  
  return NextResponse.json({ 
    revalidated: true, 
    message: 'Full revalidation triggered', 
    now: Date.now() 
  });
}
