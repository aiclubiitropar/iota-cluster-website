import { getProjects, createProject, reorderProject, updateProject } from "@/actions/projects";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const errorMsg = params?.error;
  const projects = await getProjects();

  async function addProject(formData: FormData) {
    "use server";
    await createProject({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      imageFile: formData.get("imageFile") as File | undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
      liveUrl: formData.get("liveUrl") as string || undefined,
      deploymentUrl: formData.get("deploymentUrl") as string || undefined,
      tags: formData.get("tags") as string,
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }

  async function updateProjectAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const result = await updateProject(id, {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      imageFile: formData.get("imageFile") as File | undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
      liveUrl: formData.get("liveUrl") as string || undefined,
      deploymentUrl: formData.get("deploymentUrl") as string || undefined,
      tags: formData.get("tags") as string,
    });

    if (!result.success) {
      console.error(result.error);
      redirect(`/admin/projects?error=${encodeURIComponent(result.error as string)}`);
    } else {
      revalidatePath("/admin/projects");
      revalidatePath("/projects");
      revalidatePath("/");
      redirect("/admin/projects");
    }
  }

  async function moveUp(id: string) {
    "use server";
    await reorderProject(id, "up");
  }

  async function moveDown(id: string) {
    "use server";
    await reorderProject(id, "down");
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Projects</h1>
      
      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '1rem', color: '#ff8888' }}>
          <strong>Error:</strong> {errorMsg}
          <Link href="/admin/projects" style={{ marginLeft: '1rem', color: 'white', textDecoration: 'underline' }}>Dismiss</Link>
        </div>
      )}

      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Project</h2>
        <form action={addProject} className={styles.form}>
          <input type="text" name="title" placeholder="Project Title *" required className={styles.input} />
          <textarea name="description" placeholder="Project Description *" required rows={3} className={styles.input} />
          <input type="text" name="tags" placeholder="Tags (comma separated) *" required className={styles.input} />
          
          <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="url" name="imageUrl" placeholder="Image URL (Or upload below)" className={styles.input} />
              <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
            </div>
            <input type="url" name="githubUrl" placeholder="GitHub URL (Optional)" className={styles.input} />
            <input type="url" name="liveUrl" placeholder="Live Demo URL (Optional)" className={styles.input} />
            <input type="url" name="deploymentUrl" placeholder="Deployment URL (Optional)" className={styles.input} style={{ gridColumn: '1 / -1' }} />
          </div>
          
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Add Project</button>
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Current Projects</h2>
        {projects.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No projects added yet.</p>
        ) : (
          <div className={styles.list}>
            {projects.map((p, i) => {
              if (p.id === editId) {
                return (
                  <div key={p.id} className={`${styles.listItem} ${styles.formSection}`} style={{ display: 'block', padding: '1.5rem', border: '1px solid var(--accent-purple)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Editing {p.title}</h3>
                    <form action={updateProjectAction} className={styles.form}>
                      <input type="hidden" name="id" value={p.id} />
                      <input type="text" name="title" defaultValue={p.title} placeholder="Project Title *" required className={styles.input} />
                      <textarea name="description" defaultValue={p.description} placeholder="Project Description *" required rows={3} className={styles.input} />
                      <input type="text" name="tags" defaultValue={p.tags} placeholder="Tags (comma separated) *" required className={styles.input} />
                      
                      <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input type="url" name="imageUrl" defaultValue={p.imageUrl || ""} placeholder="Image URL (Or upload below)" className={styles.input} />
                          <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
                        </div>
                        <input type="url" name="githubUrl" defaultValue={p.githubUrl || ""} placeholder="GitHub URL (Optional)" className={styles.input} />
                        <input type="url" name="liveUrl" defaultValue={p.liveUrl || ""} placeholder="Live Demo URL (Optional)" className={styles.input} />
                        <input type="url" name="deploymentUrl" defaultValue={p.deploymentUrl || ""} placeholder="Deployment URL (Optional)" className={styles.input} style={{ gridColumn: '1 / -1' }} />
                      </div>
                      
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className={`btn-primary ${styles.submitBtn}`} style={{ margin: 0, flex: 1 }}>Save Changes</button>
                        <Link href="/admin/projects" className={`btn-secondary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>Cancel</Link>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div key={p.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={styles.itemTitle}>{p.title}</p>
                    <p className={styles.itemDesc}>{p.description}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/admin/projects?edit=${p.id}`} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition flex items-center justify-center text-[var(--text-primary)] hover:text-black" title="Edit" style={{ height: 'fit-content', alignSelf: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <form action={moveUp.bind(null, p.id)}>
                        <button type="submit" disabled={i === 0} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Up">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                      </form>
                      <form action={moveDown.bind(null, p.id)}>
                        <button type="submit" disabled={i === projects.length - 1} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Down">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                      </form>
                    </div>
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
