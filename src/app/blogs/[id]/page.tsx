import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import styles from "./page.module.css";

import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });

  if (!blog) {
    return {
      title: "Blog Not Found",
    };
  }

  return {
    title: blog.title,
    description: blog.summary,
    openGraph: {
      title: blog.title,
      description: blog.summary,
      images: blog.imageUrl ? [blog.imageUrl] : [],
      type: "article",
      authors: [blog.author],
      publishedTime: blog.createdAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: blog.title,
      description: blog.summary,
      images: blog.imageUrl ? [blog.imageUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const blog = await prisma.blog.findUnique({ where: { id } });

  if (!blog) {
    notFound();
  }

  return (
    <div className={styles.container}>
      <Link href="/blogs" className={styles.backLink}>
        &larr; Back to Blogs
      </Link>
      
      <article className={`glass-panel ${styles.article}`}>
        {blog.imageUrl && (
          <div className={styles.heroImageContainer}>
            <img src={blog.imageUrl} alt={blog.title} className={styles.heroImage} />
          </div>
        )}
        
        <div className={styles.articleHeader}>
          <h1 className={styles.title}>{blog.title}</h1>
          <div className={styles.meta}>
            <span className={styles.author}>By {blog.author}</span>
            <span className={styles.date}>{new Date(blog.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>

        <div 
          className={styles.quillContent}
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>
    </div>
  );
}
