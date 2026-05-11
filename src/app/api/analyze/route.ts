import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const targetUrl = url.startsWith('http') ? url : `https://${url}`;
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error('Failed to fetch target URL');
    }

    const html = await response.text();

    // Extract Title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : '';

    // Extract Meta Description
    const descMatch = html.match(/<meta[^>]*name="description"[^>]*content="([^"]*)"/i) || 
                     html.match(/<meta[^>]*content="([^"]*)"[^>]*name="description"/i);
    const description = descMatch ? descMatch[1].trim() : '';

    // Extract OG Image
    const ogImageMatch = html.match(/<meta[^>]*property="og:image"[^>]*content="([^"]*)"/i) ||
                        html.match(/<meta[^>]*content="([^"]*)"[^>]*property="og:image"/i);
    const ogImage = ogImageMatch ? ogImageMatch[1].trim() : '';

    // Extract OG Title
    const ogTitleMatch = html.match(/<meta[^>]*property="og:title"[^>]*content="([^"]*)"/i);
    const ogTitle = ogTitleMatch ? ogTitleMatch[1].trim() : '';

    return NextResponse.json({
      title: ogTitle || title,
      description,
      image: ogImage,
      url: targetUrl
    });
  } catch (error) {
    console.error('Metadata fetch error:', error);
    return NextResponse.json({ error: 'Failed to analyze URL' }, { status: 500 });
  }
}
