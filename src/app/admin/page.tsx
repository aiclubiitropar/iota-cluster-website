import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminPage() {
  return (
    <div>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <p className={styles.pageSubtitle}>
        Welcome to the Iota Cluster Admin Control Panel. Select an option from the sidebar to manage your website content.
      </p>
      
      <div className={styles.grid}>
        <div className={`glass-panel ${styles.card}`}>
          <h2 className={styles.cardTitle}>Team Management</h2>
          <p className={styles.cardDesc}>Add, edit, or remove club members.</p>
          <Link href="/admin/team" className={styles.cardLink}>Manage Team &rarr;</Link>
        </div>
        
        <div className={`glass-panel ${styles.card}`} style={{ borderLeftColor: 'var(--accent-purple)' }}>
          <h2 className={styles.cardTitle}>Projects Showcase</h2>
          <p className={styles.cardDesc}>Upload new technical projects or hackathon submissions.</p>
          <Link href="/admin/projects" className={styles.cardLink}>Manage Projects &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
