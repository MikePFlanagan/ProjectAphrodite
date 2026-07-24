import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';

  return ['', '/privacy', '/terms', '/login', '/signup'].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path ? ('monthly' as const) : ('weekly' as const),
    priority: path ? 0.6 : 1,
  }));
}
