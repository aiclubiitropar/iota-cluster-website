import { getTeamMembers, createTeamMember, reorderTeamMember, updateTeamMember } from "@/actions/team";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";
import SubmitButton from "@/components/SubmitButton";

export const dynamic = 'force-dynamic';

export default async function AdminTeamPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const members = await getTeamMembers();

  async function addMember(formData: FormData) {
    "use server";
    const result = await createTeamMember({
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      email: formData.get("email") as string || undefined,
      password: formData.get("password") as string || undefined,
      imageUrl: formData.get("imageUrl") as string || undefined,
      imageFile: formData.get("imageFile") as File | undefined,
      linkedinUrl: formData.get("linkedinUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
    });

    if (!result.success) {
      redirect(`/admin/team?error=${encodeURIComponent(result.error as string)}`);
    } else {
      revalidatePath("/admin/team");
      revalidatePath("/team");
      revalidatePath("/");
      redirect("/admin/team");
    }
  }

  async function updateMemberAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const result = await updateTeamMember(id, {
      name: formData.get("name") as string,
      position: formData.get("position") as string,
      email: formData.get("email") as string || undefined,
      password: formData.get("password") as string || undefined,
      imageUrl: formData.get("imageUrl") as string || undefined,
      imageFile: formData.get("imageFile") as File | undefined,
      linkedinUrl: formData.get("linkedinUrl") as string || undefined,
      githubUrl: formData.get("githubUrl") as string || undefined,
    });

    if (!result.success) {
      redirect(`/admin/team?error=${encodeURIComponent(result.error as string)}`);
    } else {
      revalidatePath("/admin/team");
      revalidatePath("/team");
      revalidatePath("/");
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
        <h2 className={styles.sectionTitle}>Add New Team Member</h2>
        <form action={addMember} className={styles.form}>
          <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
            <input type="text" name="name" placeholder="Full Name *" required className={styles.input} />
            <select name="position" required className={styles.input} style={{ appearance: 'auto' }}>
              <option value="" disabled selected>Select Position *</option>
              <option value="Secretary">Secretary</option>
              <option value="Representative">Representative</option>
              <option value="Mentors">Mentors</option>
              <option value="Coordinators">Coordinators</option>
              <option value="Members">Members</option>
            </select>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="url" name="imageUrl" placeholder="Image URL (Or upload below)" className={styles.input} />
              <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
            </div>
            <input type="url" name="linkedinUrl" placeholder="LinkedIn URL (Optional)" className={styles.input} />
            <input type="url" name="githubUrl" placeholder="GitHub URL (Optional)" className={styles.input} />
            <input type="email" name="email" placeholder="Login Email (Optional)" className={styles.input} />
            <input type="password" name="password" placeholder="Login Password (Optional)" className={styles.input} />
          </div>
          <SubmitButton defaultText="Add Member" loadingText="Adding Member..." className={`btn-primary ${styles.submitBtn}`} />
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Current Team Members</h2>
        {members.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No team members added yet.</p>
        ) : (
          <div className={styles.list}>
            {members.map((m, i) => {
              if (m.id === editId) {
                return (
                  <div key={m.id} className={`${styles.listItem} ${styles.formSection}`} style={{ display: 'block', padding: '1.5rem', border: '1px solid var(--accent-cyan)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Editing {m.name}</h3>
                    <form action={updateMemberAction} className={styles.form}>
                      <input type="hidden" name="id" value={m.id} />
                      <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
                        <input type="text" name="name" defaultValue={m.name} placeholder="Full Name *" required className={styles.input} />
                        <select name="position" defaultValue={m.position} required className={styles.input} style={{ appearance: 'auto' }}>
                          <option value="" disabled>Select Position *</option>
                          <option value="Secretary">Secretary</option>
                          <option value="Representative">Representative</option>
                          <option value="Mentors">Mentors</option>
                          <option value="Coordinators">Coordinators</option>
                          <option value="Members">Members</option>
                        </select>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input type="url" name="imageUrl" defaultValue={m.imageUrl || ""} placeholder="Image URL (Or upload below)" className={styles.input} />
                          <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
                        </div>
                        <input type="url" name="linkedinUrl" defaultValue={m.linkedinUrl || ""} placeholder="LinkedIn URL (Optional)" className={styles.input} />
                        <input type="url" name="githubUrl" defaultValue={m.githubUrl || ""} placeholder="GitHub URL (Optional)" className={styles.input} />
                        <input type="email" name="email" defaultValue={m.email || ""} placeholder="Login Email (Optional)" className={styles.input} />
                        <input type="password" name="password" placeholder="New Password (Leave blank to keep current)" className={styles.input} />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <SubmitButton defaultText="Save Changes" loadingText="Saving..." className={`btn-primary ${styles.submitBtn}`} style={{ margin: 0, flex: 1 }} />
                        <Link href="/admin/team" scroll={false} className={`btn-secondary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>Cancel</Link>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div key={m.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={styles.itemTitle}>{m.name}</p>
                    <p className={styles.itemSubtitle}>{m.position}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/admin/team?edit=${m.id}`} scroll={false} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition flex items-center justify-center text-[var(--text-primary)] hover:text-black" title="Edit" style={{ height: 'fit-content', alignSelf: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <form action={moveUp.bind(null, m.id)}>
                        <button type="submit" disabled={i === 0} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Up">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                      </form>
                      <form action={moveDown.bind(null, m.id)}>
                        <button type="submit" disabled={i === members.length - 1} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Down">
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
