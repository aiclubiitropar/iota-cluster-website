import { getGalleryImages, createGalleryImage, reorderGalleryImage, updateGalleryImage } from "@/actions/gallery";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const errorMsg = params?.error;
  const images = await getGalleryImages();

  async function addImage(formData: FormData) {
    "use server";
    await createGalleryImage({
      title: formData.get("title") as string,
      imageUrl: formData.get("imageUrl") as string | undefined,
      imageFile: formData.get("imageFile") as File | undefined,
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
  }

  async function updateImageAction(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const result = await updateGalleryImage(id, {
      title: formData.get("title") as string,
      imageUrl: formData.get("imageUrl") as string | undefined,
      imageFile: formData.get("imageFile") as File | undefined,
    });

    if (!result.success) {
      console.error(result.error);
      redirect(`/admin/gallery?error=${encodeURIComponent(result.error as string)}`);
    } else {
      revalidatePath("/admin/gallery");
      revalidatePath("/");
      redirect("/admin/gallery");
    }
  }

  async function moveUp(id: string) {
    "use server";
    await reorderGalleryImage(id, "up");
  }

  async function moveDown(id: string) {
    "use server";
    await reorderGalleryImage(id, "down");
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Gallery</h1>
      
      {errorMsg && (
        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,0,0,0.1)', border: '1px solid red', borderRadius: '8px', marginBottom: '1rem', color: '#ff8888' }}>
          <strong>Error:</strong> {errorMsg}
          <Link href="/admin/gallery" style={{ marginLeft: '1rem', color: 'white', textDecoration: 'underline' }}>Dismiss</Link>
        </div>
      )}

      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Image</h2>
        <form action={addImage} className={styles.form}>
          <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
            <input type="text" name="title" placeholder="Image Title / Caption *" required className={styles.input} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input type="url" name="imageUrl" placeholder="Image URL (Or upload below)" className={styles.input} />
              <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
            </div>
          </div>
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>Add Image</button>
        </form>
      </div>

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Current Gallery Images</h2>
        {images.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No images added yet.</p>
        ) : (
          <div className={styles.grid}>
            {images.map((img, i) => {
              if (img.id === editId) {
                return (
                  <div key={img.id} className="border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--glass-bg)] relative flex flex-col justify-between" style={{ padding: '1rem', minHeight: '300px' }}>
                    <form action={updateImageAction} className={styles.form} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="text" name="title" defaultValue={img.title} placeholder="Image Title / Caption *" required className={styles.input} />
                      <input type="url" name="imageUrl" defaultValue={img.imageUrl} placeholder="Image URL (Or upload below)" className={styles.input} />
                      <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <button type="submit" className={`btn-primary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, padding: '0.5rem' }}>Save</button>
                        <Link href="/admin/gallery" className={`btn-secondary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>Cancel</Link>
                      </div>
                    </form>
                  </div>
                );
              }

              return (
                <div key={img.id} className="border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--glass-bg)] relative group">
                  <img src={img.imageUrl} alt={img.title} className="w-full h-48 object-cover" />
                  <div className="p-3">
                    <p className="font-bold">{img.title}</p>
                  </div>
                  
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <Link href={`/admin/gallery?edit=${img.id}`} className="p-1.5 bg-black/60 text-white rounded hover:bg-[var(--accent-cyan)] backdrop-blur-sm flex items-center justify-center" title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <form action={moveUp.bind(null, img.id)}>
                      <button type="submit" disabled={i === 0} className="p-1.5 bg-black/60 text-white rounded hover:bg-[var(--accent-purple)] disabled:opacity-30 backdrop-blur-sm flex items-center justify-center" title="Move Up">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                      </button>
                    </form>
                    <form action={moveDown.bind(null, img.id)}>
                      <button type="submit" disabled={i === images.length - 1} className="p-1.5 bg-black/60 text-white rounded hover:bg-[var(--accent-purple)] disabled:opacity-30 backdrop-blur-sm flex items-center justify-center" title="Move Down">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
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
