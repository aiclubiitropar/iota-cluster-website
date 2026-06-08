import styles from "../projects/page.module.css";

export const dynamic = 'force-dynamic';

export default function AISocPage() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <span className="text-gradient">AI Soc</span>
        </h1>
        <p className={styles.subtitle}>
          Discover the AI Society at IIT Ropar - our mission, our members, and our impact.
        </p>
      </div>

      <div className={`glass-panel ${styles.emptyState}`}>
        <p className="text-[var(--text-secondary)]">Information about the AI Society is currently being updated. Check back soon!</p>
      </div>
    </div>
  );
}
