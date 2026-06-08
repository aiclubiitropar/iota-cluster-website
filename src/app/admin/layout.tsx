import Link from "next/link";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 gap-8">
      <aside className="w-full md:w-64 glass-panel p-6 h-fit shrink-0">
        <h2 className="text-xl font-bold font-outfit mb-6 text-gradient">Admin Dashboard</h2>
        <nav className="flex flex-col gap-2">
          <Link href="/admin" className="px-4 py-2 rounded-md hover:bg-[var(--glass-bg)] transition-colors">
            Overview
          </Link>
          <Link href="/admin/team" className="px-4 py-2 rounded-md hover:bg-[var(--glass-bg)] transition-colors">
            Manage Team
          </Link>
          <Link href="/admin/projects" className="px-4 py-2 rounded-md hover:bg-[var(--glass-bg)] transition-colors">
            Manage Projects
          </Link>
        </nav>
      </aside>
      <main className="flex-grow glass-panel p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
