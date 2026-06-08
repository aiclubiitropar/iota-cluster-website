import Link from "next/link";
import styles from "./admin.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.layoutContainer}>
      <aside className={`glass-panel ${styles.sidebar}`}>
        <h2 className={`text-gradient ${styles.sidebarTitle}`}>Admin Dashboard</h2>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Overview
          </Link>
          <Link href="/admin/team" className={styles.navLink}>
            Manage Team
          </Link>
          <Link href="/admin/projects" className={styles.navLink}>
            Manage Projects
          </Link>
        </nav>
      </aside>
      <main className={`glass-panel ${styles.mainArea}`}>
        {children}
      </main>
    </div>
  );
}
