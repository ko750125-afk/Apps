import { NextRequest, NextResponse } from 'next/server';
import { revalidateTag, revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const tag = request.nextUrl.searchParams.get('tag');
  const path = request.nextUrl.searchParams.get('path');

  if (tag) {
    revalidateTag(tag, 'max');
    return NextResponse.json({ revalidated: true, tag, now: Date.now() });
  }

  if (path) {
    revalidatePath(path);
    return NextResponse.json({ revalidated: true, path, now: Date.now() });
  }

  // Default: revalidate all apps
  revalidateTag('apps', 'max');
  revalidatePath('/');
  
  return NextResponse.json({ 
    revalidated: true, 
    message: 'Default revalidation triggered', 
    now: Date.now() 
  });
}
