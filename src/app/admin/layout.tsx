import Link from "next/link";
import styles from "./admin.module.css";
import { getCurrentRole } from "@/actions/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const role = await getCurrentRole();
  return (
    <div className={styles.layoutContainer}>
      <aside className={`glass-panel ${styles.sidebar}`}>
        <h2 className={`text-gradient ${styles.sidebarTitle}`}>Admin Dashboard</h2>
        <nav className={styles.nav}>
          <Link href="/admin" className={styles.navLink}>
            Overview
          </Link>
          {role !== "member" && (
            <Link href="/admin/team" className={styles.navLink}>
              Manage Team
            </Link>
          )}
          <Link href="/admin/projects" className={styles.navLink}>
            Manage Projects
          </Link>
          {role !== "member" && (
            <Link href="/admin/gallery" className={styles.navLink}>
              Manage Gallery
            </Link>
          )}
        </nav>
      </aside>
      <main className={`glass-panel ${styles.mainArea}`}>
        <header style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '2rem' }}>
          <form action="/api/auth/logout" method="POST">
            <button formAction={async () => {
              "use server";
              const { logoutAdmin } = await import("@/actions/auth");
              await logoutAdmin();
            }} className="btn-primary" style={{ padding: '0.5rem 1rem', background: 'rgba(255, 50, 50, 0.2)', border: '1px solid rgba(255, 50, 50, 0.5)', color: '#ff6b6b' }}>
              Logout
            </button>
          </form>
        </header>
        {children}
      </main>
    </div>
  );
}
