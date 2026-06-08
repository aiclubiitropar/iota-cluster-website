import { getTeamMembers, createTeamMember, reorderTeamMember, updateTeamMember } from "@/actions/team";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ edit?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const members = await getTeamMembers();

  async function addMember(formData: FormData) {
    "use server";
    await createTeamMember({
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      email: formData.get("email") as string || undefined,
      password: formData.get("password") as string || undefined,
      imageUrl: formData.get("imageUrl") as string || undefined,
      linkedinUrl: formData.get("linkedinUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
    });
    revalidatePath("/admin/team");
    revalidatePath("/team");
  }

  async function updateMember(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const result = await updateTeamMember(id, {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      email: formData.get("email") as string || undefined,
      password: formData.get("password") as string || undefined,
      imageUrl: formData.get("imageUrl") as string || undefined,
      linkedinUrl: formData.get("linkedinUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
    });
    
    if (!result.success) {
      console.error(result.error);
      // Optional: Add URL parameter to show error
      redirect(`/admin/team?error=${encodeURIComponent(result.error as string)}`);
    } else {
      revalidatePath("/admin/team");
      revalidatePath("/team");
      redirect("/admin/team");
    }
  }

  async function moveUp(id: string) {
    "use server";
    await reorderTeamMember(id, "up");
  }

  async function moveDown(id: string) {
    "use server";
    await reorderTeamMember(id, "down");
  }

  const errorMsg = (await searchParams)?.error;

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Team</h1>
      
      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '1rem', color: '#ff8888' }}>
          <strong>Error:</strong> {errorMsg}
          <Link href="/admin/team" style={{ marginLeft: '1rem', color: 'white', textDecoration: 'underline' }}>Dismiss</Link>
        </div>
      )}

      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Member</h2>
        <form action={addMember} className={styles.form}>
          <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
            <input type="text" name="name" placeholder="Full Name *" required className={styles.input} />
            <select name="position" required className={styles.input}>
              <option value="">Select Position *</option>
              <option value="Secretary">Secretary</option>
              <option value="Representative">Representative</option>
              <option value="Mentors">Mentors</option>
              <option value="Coordinators">Coordinators</option>
            </select>
            <input type="email" name="email" placeholder="Email (@iitrpr.ac.in) *" required className={styles.input} />
            <input type="password" name="password" placeholder="Password *" required className={styles.input} />
            <input type="url" name="imageUrl" placeholder="Image URL (Optional)" className={styles.input} />
            <input type="url" name="linkedinUrl" placeholder="LinkedIn URL (Optional)" className={styles.input} />
            <input type="url" name="githubUrl" placeholder="GitHub URL (Optional)" className={styles.input} />
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Add Member</button>
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Current Members</h2>
        {members.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No members added yet.</p>
        ) : (
          <div className={styles.list}>
            {members.map((m, i) => {
              if (m.id === editId) {
                return (
                  <div key={m.id} className={`${styles.listItem} ${styles.formSection}`} style={{ display: 'block', padding: '1.5rem', border: '1px solid var(--accent-purple)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Editing {m.name}</h3>
                    <form action={updateMember} className={styles.form}>
                      <input type="hidden" name="id" value={m.id} />
                      <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
                        <input type="text" name="name" defaultValue={m.name} placeholder="Full Name *" required className={styles.input} />
                        <select name="position" defaultValue={m.position} required className={styles.input}>
                          <option value="Secretary">Secretary</option>
                          <option value="Representative">Representative</option>
                          <option value="Mentors">Mentors</option>
                          <option value="Coordinators">Coordinators</option>
                        </select>
                        <input type="email" name="email" defaultValue={m.email || ""} placeholder="Email (@iitrpr.ac.in) *" required className={styles.input} />
                        <input type="password" name="password" placeholder="New Password (Leave blank to keep current)" className={styles.input} />
                        <input type="url" name="imageUrl" defaultValue={m.imageUrl || ""} placeholder="Image URL (Optional)" className={styles.input} />
                        <input type="url" name="linkedinUrl" defaultValue={m.linkedinUrl || ""} placeholder="LinkedIn URL (Optional)" className={styles.input} />
                        <input type="url" name="githubUrl" defaultValue={m.githubUrl || ""} placeholder="GitHub URL (Optional)" className={styles.input} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <button type="submit" className={`btn-primary ${styles.submitBtn}`} style={{ margin: 0, flex: 1 }}>Save Changes</button>
                        <Link href="/admin/team" className={`btn-secondary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>Cancel</Link>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div key={m.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p className={styles.itemTitle}>{m.name}</p>
                    <p className={styles.itemSubtitle}>{m.position}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link href={`/admin/team?edit=${m.id}`} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] transition text-sm flex items-center justify-center text-white" style={{ textDecoration: 'none' }}>
                      Edit
                    </Link>
                    <form action={moveUp.bind(null, m.id)}>
                      <button type="submit" disabled={i === 0} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] transition disabled:opacity-30">
                        ↑
                      </button>
                    </form>
                    <form action={moveDown.bind(null, m.id)}>
                      <button type="submit" disabled={i === members.length - 1} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] transition disabled:opacity-30">
                        ↓
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
