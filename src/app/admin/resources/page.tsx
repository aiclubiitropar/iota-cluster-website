import { getResources, addResourceAction, editResourceAction, deleteResourceAction, moveUpAction, moveDownAction } from "@/actions/resources";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";
import ResourceForm from "./ResourceForm";
import { getCurrentRole } from "@/actions/auth";

export const dynamic = 'force-dynamic';

export default async function AdminResourcesPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const errorMsg = params?.error;
  
  const role = await getCurrentRole();
  const isMember = role === "members" || role === "member";
  
  if (isMember) {
    redirect("/admin");
  }

  const resources = await getResources();

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Resources Roadmap</h1>

      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '1rem', color: '#ff8888' }}>
          <strong>Error:</strong> {errorMsg}
          <Link href="/admin/resources" style={{ marginLeft: '1rem', color: 'white', textDecoration: 'underline' }}>Dismiss</Link>
        </div>
      )}

      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Node</h2>
        <ResourceForm mode="add" />
      </div>

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Roadmap Timeline</h2>
        {resources.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No resources added yet.</p>
        ) : (
          <div className={styles.list}>
            {resources.map((r, i) => {
              if (r.id === editId) {
                return (
                  <div key={r.id} className={`${styles.listItem} ${styles.formSection}`} style={{ display: 'block', padding: '1.5rem', border: '1px solid var(--accent-cyan)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Editing {r.title}</h3>
                    <ResourceForm mode="edit" initialData={r} />
                  </div>
                );
              }

              return (
                <div key={r.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={styles.itemTitle}>Step {i + 1}: {r.title}</p>
                    <p className={styles.itemDesc}>{r.description}</p>
                    {(r.fileUrls?.length > 0 || r.youtubeUrl) && (
                      <p className={styles.itemSubtitle} style={{ marginTop: '0.5rem', color: 'var(--accent-cyan)' }}>
                        {r.youtubeUrl && "▶ Video Included  "}
                        {r.fileUrls?.length > 0 && `📎 ${r.fileUrls.length} File(s)`}
                      </p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/admin/resources?edit=${r.id}`} scroll={false} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition flex items-center justify-center text-[var(--text-primary)] hover:text-black" title="Edit" style={{ height: 'fit-content', alignSelf: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <form action={moveUpAction.bind(null, r.id)}>
                        <button type="submit" disabled={i === 0} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Up">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                      </form>
                      <form action={moveDownAction.bind(null, r.id)}>
                        <button type="submit" disabled={i === resources.length - 1} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Down">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                      </form>
                    </div>
                    <form action={deleteResourceAction} style={{ alignSelf: 'center' }}>
                      <input type="hidden" name="id" value={r.id} />
                      <button type="submit" className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[rgba(255,50,50,0.8)] hover:border-[rgba(255,50,50,0.8)] transition flex items-center justify-center text-[var(--text-secondary)] hover:text-white" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </form>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
