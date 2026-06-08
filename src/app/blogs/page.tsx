import styles from "../projects/page.module.css";

export const dynamic = 'force-dynamic';

export default function BlogsPage() {
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

      <div className={`glass-panel ${styles.emptyState}`}>
        <p className="text-[var(--text-secondary)]">The blog is currently being set up. Check back soon for exciting technical deep-dives!</p>
      </div>
    </div>
  );
}
