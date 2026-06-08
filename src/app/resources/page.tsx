import styles from "../projects/page.module.css";

export const dynamic = 'force-dynamic';

export default function ResourcesPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Curated <span className="text-gradient">Resources</span>
        </h1>
        <p className={styles.subtitle}>
          A collection of guides, tutorials, and materials compiled by the Iota Cluster to help you master AI and ML.
        </p>
      </div>

      <div className={`glass-panel ${styles.emptyState}`}>
        <p className="text-[var(--text-secondary)]">Resource materials are currently being compiled. Check back soon!</p>
      </div>
    </div>
  );
}
