import { getProjects, createProject } from "@/actions/projects";
import { revalidatePath } from "next/cache";
import styles from "../admin.module.css";

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
            {projects.map(p => (
              <div key={p.id} className={styles.listItem}>
                <div style={{ overflow: 'hidden' }}>
                  <p className={styles.itemTitle}>{p.title}</p>
                  <p className={styles.itemDesc}>{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
