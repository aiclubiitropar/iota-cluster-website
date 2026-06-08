import { getTeamMembers, createTeamMember, reorderTeamMember } from "@/actions/team";
import { revalidatePath } from "next/cache";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage() {
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

  async function moveUp(id: string) {
    "use server";
    await reorderTeamMember(id, "up");
  }

  async function moveDown(id: string) {
    "use server";
    await reorderTeamMember(id, "down");
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Team</h1>
      
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
            {members.map((m, i) => (
              <div key={m.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p className={styles.itemTitle}>{m.name}</p>
                  <p className={styles.itemSubtitle}>{m.position}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
