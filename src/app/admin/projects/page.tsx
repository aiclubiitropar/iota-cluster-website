import { getProjects, createProject, reorderProject } from "@/actions/projects";
import { revalidatePath } from "next/cache";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

export default async function AdminProjectsPage() {
  const projects = await getProjects();

  async function addProject(formData: FormData) {
    "use server";
    await createProject({
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
      liveUrl: formData.get("liveUrl") as string || undefined,
      deploymentUrl: formData.get("deploymentUrl") as string || undefined,
      tags: formData.get("tags") as string,
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
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
      
      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Project</h2>
        <form action={addProject} className={styles.form}>
          <input type="text" name="title" placeholder="Project Title *" required className={styles.input} />
          <textarea name="description" placeholder="Project Description *" required rows={3} className={styles.input} />
          <input type="text" name="tags" placeholder="Tags (comma separated) *" required className={styles.input} />
          
          <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
            <input type="url" name="imageUrl" placeholder="Image URL (Optional)" className={styles.input} />
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
            {projects.map((p, i) => (
              <div key={p.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ overflow: 'hidden' }}>
                  <p className={styles.itemTitle}>{p.title}</p>
                  <p className={styles.itemDesc}>{p.description}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0, marginLeft: '1rem' }}>
                  <form action={moveUp.bind(null, p.id)}>
                    <button type="submit" disabled={i === 0} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] transition disabled:opacity-30">
                      ↑
                    </button>
                  </form>
                  <form action={moveDown.bind(null, p.id)}>
                    <button type="submit" disabled={i === projects.length - 1} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] transition disabled:opacity-30">
                      ↓
                    </button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
