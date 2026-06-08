import { getProjects, createProject } from "@/actions/projects";
import { revalidatePath } from "next/cache";

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
      tags: formData.get("tags") as string,
    });
    revalidatePath("/admin/projects");
    revalidatePath("/projects");
    revalidatePath("/");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold font-outfit mb-6">Manage Projects</h1>
      
      <div className="glass-panel p-6 mb-8">
        <h2 className="text-lg font-bold mb-4">Add New Project</h2>
        <form action={addProject} className="flex flex-col gap-4">
          <input type="text" name="title" placeholder="Project Title *" required className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
          <textarea name="description" placeholder="Project Description *" required rows={3} className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
          <input type="text" name="tags" placeholder="Tags (comma separated) *" required className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <input type="url" name="imageUrl" placeholder="Image URL (Optional)" className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
            <input type="url" name="githubUrl" placeholder="GitHub URL (Optional)" className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
            <input type="url" name="liveUrl" placeholder="Live Demo URL (Optional)" className="p-2 rounded bg-[var(--bg-primary)] border border-[var(--glass-border)] text-white" />
          </div>
          
          <button type="submit" className="btn-primary mt-2 self-start">Add Project</button>
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className="text-lg font-bold mb-4">Current Projects</h2>
        {projects.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No projects added yet.</p>
        ) : (
          <ul className="divide-y divide-[var(--glass-border)]">
            {projects.map(p => (
              <li key={p.id} className="py-3">
                <p className="font-bold">{p.title}</p>
                <p className="text-sm text-[var(--text-secondary)] truncate">{p.description}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
