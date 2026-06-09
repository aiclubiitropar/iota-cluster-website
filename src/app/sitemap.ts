import { MetadataRoute } from 'next';
import prisma from '@/lib/prisma';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://iota-cluster.vercel.app'; // Change this to your production domain

  // Define static routes
  const staticRoutes = [
    '',
    '/team',
    '/projects',
    '/events',
    '/gallery',
    '/resources',
    '/ai-soc',
    '/blogs',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // Fetch dynamic blog posts
  let blogRoutes: MetadataRoute.Sitemap = [];
  try {
    const blogs = await prisma.blog.findMany({
      select: { id: true, updatedAt: true },
    });
    
    blogRoutes = blogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.id}`,
      lastModified: blog.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    }));
  } catch (error) {
    console.error("Failed to fetch blogs for sitemap", error);
  }

  return [...staticRoutes, ...blogRoutes];
}
