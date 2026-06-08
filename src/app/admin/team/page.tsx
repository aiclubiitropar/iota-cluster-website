import { getTeamMembers, createTeamMember } from "@/actions/team";
import { revalidatePath } from "next/cache";
import styles from "../admin.module.css";

export default async function AdminTeamPage() {
  const members = await getTeamMembers();

  async function addMember(formData: FormData) {
    "use server";
    await createTeamMember({
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      linkedinUrl: formData.get("linkedinUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
    });
    revalidatePath("/admin/team");
    revalidatePath("/team");
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Team</h1>
      
      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Member</h2>
        <form action={addMember} className={styles.form}>
          <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
            <input type="text" name="name" placeholder="Full Name *" required className={styles.input} />
            <input type="text" name="position" placeholder="Position *" required className={styles.input} />
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
            {members.map(m => (
              <div key={m.id} className={styles.listItem}>
                <div>
                  <p className={styles.itemTitle}>{m.name}</p>
                  <p className={styles.itemSubtitle}>{m.position}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
