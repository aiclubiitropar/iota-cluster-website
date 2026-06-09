import { getEvents, createEvent, reorderEvent, updateEvent, deleteEvent } from "@/actions/events";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";
import SubmitButton from "@/components/SubmitButton";
import { getCurrentRole } from "@/actions/auth";

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const errorMsg = params?.error;
  const events = await getEvents();
  const role = await getCurrentRole();
  const isMember = role === "members" || role === "member";
  
  if (isMember) {
    redirect("/admin");
  }

  async function addEvent(formData: FormData) {
    "use server";
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;

    await createEvent({
      title: formData.get("title") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      imageFile: formData.get("imageFile") as File | undefined,
      unstopUrl: formData.get("unstopUrl") as string || undefined,
      deploymentUrl: formData.get("deploymentUrl") as string || undefined,
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
    });
  }

  async function updateEventAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const startDateStr = formData.get("startDate") as string;
    const endDateStr = formData.get("endDate") as string;

    const result = await updateEvent(id, {
      title: formData.get("title") as string,
      imageUrl: formData.get("imageUrl") as string || undefined,
      imageFile: formData.get("imageFile") as File | undefined,
      unstopUrl: formData.get("unstopUrl") as string || undefined,
      deploymentUrl: formData.get("deploymentUrl") as string || undefined,
      startDate: startDateStr ? new Date(startDateStr) : undefined,
      endDate: endDateStr ? new Date(endDateStr) : undefined,
    });

    if (!result.success) {
      console.error(result.error);
      redirect(`/admin/events?error=${encodeURIComponent(result.error as string)}`);
    } else {
      redirect("/admin/events");
    }
  }

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteEvent(id);
  }

  async function moveUp(id: string) {
    "use server";
    await reorderEvent(id, "up");
  }

  async function moveDown(id: string) {
    "use server";
    await reorderEvent(id, "down");
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Events</h1>

      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '1rem', color: '#ff8888' }}>
          <strong>Error:</strong> {errorMsg}
          <Link href="/admin/events" style={{ marginLeft: '1rem', color: 'white', textDecoration: 'underline' }}>Dismiss</Link>
        </div>
      )}

      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Event</h2>
        <form action={addEvent} className={styles.form}>
          <input type="text" name="title" placeholder="Event Title *" required className={styles.input} />

          <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Start Date (Optional)</label>
              <input type="date" name="startDate" className={styles.input} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>End Date (Optional)</label>
              <input type="date" name="endDate" className={styles.input} />
            </div>
          </div>

          <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="url" name="imageUrl" placeholder="Image URL (Or upload below)" className={styles.input} />
              <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
            </div>
            <input type="url" name="unstopUrl" placeholder="Unstop URL (Optional)" className={styles.input} />
            <input type="url" name="deploymentUrl" placeholder="Deployment URL (Optional)" className={styles.input} />
          </div>

          <SubmitButton defaultText="Add Event" loadingText="Adding Event..." className={`btn-primary ${styles.submitBtn}`} />
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Current Events</h2>
        {events.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No events added yet.</p>
        ) : (
          <div className={styles.list}>
            {events.map((e, i) => {
              if (e.id === editId) {
                return (
                  <div key={e.id} className={`${styles.listItem} ${styles.formSection}`} style={{ display: 'block', padding: '1.5rem', border: '1px solid var(--accent-purple)' }}>
                    <h3 style={{ marginBottom: '1rem', color: 'var(--text-primary)', fontWeight: 'bold' }}>Editing {e.title}</h3>
                    <form action={updateEventAction} className={styles.form}>
                      <input type="hidden" name="id" value={e.id} />
                      <input type="text" name="title" defaultValue={e.title} placeholder="Event Title *" required className={styles.input} />

                      <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Start Date (Optional)</label>
                          <input type="date" name="startDate" defaultValue={e.startDate ? e.startDate.toISOString().split('T')[0] : ''} className={styles.input} />
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <label style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>End Date (Optional)</label>
                          <input type="date" name="endDate" defaultValue={e.endDate ? e.endDate.toISOString().split('T')[0] : ''} className={styles.input} />
                        </div>
                      </div>

                      <div className={`${styles.inputGrid} ${styles.inputGrid3}`}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                          <input type="url" name="imageUrl" defaultValue={e.imageUrl || ""} placeholder="Image URL (Or upload below)" className={styles.input} />
                          <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
                        </div>
                        <input type="url" name="unstopUrl" defaultValue={e.unstopUrl || ""} placeholder="Unstop URL (Optional)" className={styles.input} />
                        <input type="url" name="deploymentUrl" defaultValue={e.deploymentUrl || ""} placeholder="Deployment URL (Optional)" className={styles.input} />
                      </div>

                      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                        <SubmitButton defaultText="Save Changes" loadingText="Saving..." className={`btn-primary ${styles.submitBtn}`} style={{ margin: 0, flex: 1 }} />
                        <Link href="/admin/events" scroll={false} className={`btn-secondary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>Cancel</Link>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div key={e.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p className={styles.itemTitle}>{e.title}</p>
                    <p className={styles.itemDesc}>
                      {e.startDate && new Date(e.startDate).toLocaleDateString()}
                      {e.startDate && e.endDate ? ' - ' : ''}
                      {e.endDate && new Date(e.endDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/admin/events?edit=${e.id}`} scroll={false} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition flex items-center justify-center text-[var(--text-primary)] hover:text-black" title="Edit" style={{ height: 'fit-content', alignSelf: 'center' }}>
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <form action={moveUp.bind(null, e.id)}>
                        <button type="submit" disabled={i === 0} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Up">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                        </button>
                      </form>
                      <form action={moveDown.bind(null, e.id)}>
                        <button type="submit" disabled={i === events.length - 1} className="p-1 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-purple)] hover:border-[var(--accent-purple)] hover:text-white transition disabled:opacity-30 flex items-center justify-center text-[var(--text-secondary)]" title="Move Down">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </button>
                      </form>
                    </div>
                    <form action={handleDelete} style={{ alignSelf: 'center' }}>
                      <input type="hidden" name="id" value={e.id} />
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
