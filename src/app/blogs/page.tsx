import styles from "../projects/page.module.css";
import { getBlogs } from "@/actions/blogs";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export default async function BlogsPage() {
  const blogs = await getBlogs();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Iota <span className="text-gradient">Blogs</span>
        </h1>
        <p className={styles.subtitle}>
          Read the latest articles, tutorials, and insights from the members of Iota Cluster.
        </p>
      </div>

      {blogs.length === 0 ? (
        <div className={`glass-panel ${styles.emptyState}`}>
          <p className="text-[var(--text-secondary)]">The blog is currently being set up. Check back soon for exciting technical deep-dives!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {blogs.map((blog) => (
            <div key={blog.id} className={`glass-panel ${styles.card}`}>
              <div className={styles.imageWrapper}>
                {blog.imageUrl ? (
                  <img src={blog.imageUrl} alt={blog.title} className={styles.image} />
                ) : (
                  <div className={styles.placeholder} style={{ background: 'linear-gradient(45deg, var(--bg-card), var(--glass-border))' }}>
                    <svg width="48" height="48" fill="none" stroke="var(--accent-purple)" strokeWidth="1" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"></path></svg>
                  </div>
                )}
              </div>
              <div className={styles.content}>
                <h3 className={styles.projectTitle} style={{ fontSize: '1.4rem' }}>{blog.title}</h3>
                <p className={styles.description} style={{ color: 'var(--accent-cyan)', fontSize: '0.9rem', marginBottom: '1rem', marginTop: '-0.5rem' }}>By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                <p className={styles.description}>{blog.summary}</p>
                
                <div className={styles.links} style={{ marginTop: 'auto', paddingTop: '1.5rem' }}>
                  <Link href={`/blogs/${blog.id}`} className={styles.link}>
                    <span>Read Full Article</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"></path><path d="M12 5l7 7-7 7"></path></svg>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
