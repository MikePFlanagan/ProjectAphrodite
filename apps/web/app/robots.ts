import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXTAUTH_URL ?? 'http://localhost:3002';

  return {
    rules: {
      userAgent: '*',
      allow: ['/', '/privacy', '/terms'],
      disallow: ['/api/', '/billing', '/chat/', '/creator', '/dashboard', '/settings'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
