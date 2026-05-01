import { MetadataRoute } from 'next';
import { getApps } from '@/lib/server-apps';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://rapidforge.io';
  
  // Basic pages
  const routes = ['', '/about'].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Dynamic app pages
  try {
    const apps = await getApps();
    const appRoutes = apps.map((app) => ({
      url: `${baseUrl}/app/${app.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));

    return [...routes, ...appRoutes];
  } catch {
    return routes;
  }
}
