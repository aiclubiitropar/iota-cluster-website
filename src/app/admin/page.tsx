export default function AdminPage() {
  return (
    <div>
      <h1 className="text-3xl font-bold font-outfit mb-4">Admin Dashboard</h1>
      <p className="text-[var(--text-secondary)] mb-8">
        Welcome to the Iota Cluster Admin Control Panel. Select an option from the sidebar to manage your website content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-panel p-6 border-l-4 border-l-[var(--accent-cyan)]">
          <h2 className="text-xl font-bold mb-2">Team Management</h2>
          <p className="text-[var(--text-secondary)] mb-4">Add, edit, or remove club members.</p>
          <a href="/admin/team" className="text-[var(--accent-cyan)] font-medium hover:underline">Manage Team &rarr;</a>
        </div>
        
        <div className="glass-panel p-6 border-l-4 border-l-[var(--accent-purple)]">
          <h2 className="text-xl font-bold mb-2">Projects Showcase</h2>
          <p className="text-[var(--text-secondary)] mb-4">Upload new technical projects or hackathon submissions.</p>
          <a href="/admin/projects" className="text-[var(--accent-cyan)] font-medium hover:underline">Manage Projects &rarr;</a>
        </div>
      </div>
    </div>
  );
}
