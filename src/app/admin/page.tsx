import Link from "next/link";
import styles from "./admin.module.css";
import { getCurrentRole } from "@/actions/auth";

export default async function AdminPage() {
  const role = await getCurrentRole();
  const isFullAccess = role === "secretary" || role === "representative" || role === "admin" || role === "secy" || role === "rep";
  const isMember = role === "members" || role === "member";

  return (
    <div>
      <h1 className={styles.pageTitle}>Admin Dashboard</h1>
      <p className={styles.pageSubtitle}>
        Welcome to the Iota Cluster Admin Control Panel. Select an option from the sidebar to manage your website content.
      </p>
      
      <div className={styles.grid}>
        {isFullAccess && (
          <div className={`glass-panel ${styles.card}`}>
            <h2 className={styles.cardTitle}>Team Management</h2>
            <p className={styles.cardDesc}>Add, edit, or remove club members.</p>
            <Link href="/admin/team" className={styles.cardLink}>Manage Team &rarr;</Link>
          </div>
        )}
        
        <div className={`glass-panel ${styles.card}`} style={{ borderLeftColor: 'var(--accent-purple)' }}>
          <h2 className={styles.cardTitle}>Projects Showcase</h2>
          <p className={styles.cardDesc}>Upload new technical projects or hackathon submissions.</p>
          <Link href="/admin/projects" className={styles.cardLink}>Manage Projects &rarr;</Link>
        </div>

        {!isMember && (
          <div className={`glass-panel ${styles.card}`} style={{ borderLeftColor: 'var(--accent-cyan)' }}>
            <h2 className={styles.cardTitle}>Resources Roadmap</h2>
            <p className={styles.cardDesc}>Upload learning materials, links, and YouTube videos for the roadmap.</p>
            <Link href="/admin/resources" className={styles.cardLink}>Manage Resources &rarr;</Link>
          </div>
        )}

        {!isMember && (
          <div className={`glass-panel ${styles.card}`} style={{ borderLeftColor: 'var(--accent-pink, #EC4899)' }}>
            <h2 className={styles.cardTitle}>Gallery Management</h2>
            <p className={styles.cardDesc}>Upload photos of events, hackathons, and sessions.</p>
            <Link href="/admin/gallery" className={styles.cardLink}>Manage Gallery &rarr;</Link>
          </div>
        )}

        <div className={`glass-panel ${styles.card}`} style={{ borderLeftColor: 'var(--accent-cyan)' }}>
          <h2 className={styles.cardTitle}>Blog Management</h2>
          <p className={styles.cardDesc}>Write, edit, and publish rich-text articles and tutorials.</p>
          <Link href="/admin/blogs" className={styles.cardLink}>Manage Blogs &rarr;</Link>
        </div>
      </div>
    </div>
  );
}
