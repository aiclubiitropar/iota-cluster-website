import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = 'https://iota-cluster-website.vercel.app'; // Change this to your production domain

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/admin/', '/api/'], // Protect admin panel and API routes from indexing
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
