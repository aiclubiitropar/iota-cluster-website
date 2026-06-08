import { getGalleryImages, createGalleryImages, reorderGalleryImage, updateGalleryImage, deleteGalleryImage } from "@/actions/gallery";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import Link from "next/link";
import styles from "../admin.module.css";
import SubmitButton from "@/components/SubmitButton";
import DeleteButton from "@/components/DeleteButton";
import ClientAddGalleryForm from "./ClientAddGalleryForm";

export const dynamic = 'force-dynamic';

export default async function AdminGalleryPage({ searchParams }: { searchParams: Promise<{ edit?: string; error?: string }> }) {
  const params = await searchParams;
  const editId = params?.edit;
  const errorMsg = params?.error;
  const images = await getGalleryImages();

  async function addImage(formData: FormData) {
    "use server";
    await createGalleryImages({
      title: formData.get("title") as string,
      imageUrl: formData.get("imageUrl") as string | undefined,
      imageFiles: formData.getAll("imageFiles") as File[],
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

  async function deleteImage(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteGalleryImage(id);
    redirect("/admin/gallery");
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

      <ClientAddGalleryForm />

      <div className="glass-panel p-6">
        <h2 className={styles.sectionTitle}>Current Gallery Images</h2>
        {images.length === 0 ? (
          <p className="text-[var(--text-secondary)]">No images added yet.</p>
        ) : (
          <div className={styles.grid}>
            {images.map((img, i) => {
              if (img.id === editId) {
                const optimizedUrl = img.imageUrl.includes('supabase.co') && img.imageUrl.includes('/object/public/')
                  ? img.imageUrl.replace('/object/public/', '/render/image/public/') + '?width=120&height=120&resize=cover'
                  : img.imageUrl;

                return (
                  <div key={img.id} className="border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--glass-bg)] relative flex flex-col justify-between" style={{ padding: '1rem', minHeight: '300px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                      <img src={optimizedUrl} alt="Preview" style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} loading="lazy" />
                      <span style={{ fontWeight: 'bold', color: 'var(--text-primary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{img.title || "No Title"}</span>
                      
                      <form action={deleteImage} style={{ marginLeft: 'auto' }}>
                        <input type="hidden" name="id" value={img.id} />
                        <DeleteButton />
                      </form>
                    </div>
                    <form action={updateImageAction} className={styles.form} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', height: '100%' }}>
                      <input type="hidden" name="id" value={img.id} />
                      <input type="text" name="title" defaultValue={img.title || ""} placeholder="Image Title / Caption (Optional)" className={styles.input} />
                      <input type="url" name="imageUrl" defaultValue={img.imageUrl} placeholder="Image URL (Or upload below)" className={styles.input} />
                      <input type="file" name="imageFile" accept="image/*" className={styles.input} style={{ padding: '0.4rem' }} />
                      <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                        <SubmitButton defaultText="Save" loadingText="Saving..." className={`btn-primary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, padding: '0.5rem' }} />
                        <Link href="/admin/gallery" className={`btn-secondary ${styles.submitBtn}`} style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}>Cancel</Link>
                      </div>
                    </form>
                  </div>
                );
              }

              const optimizedUrl = img.imageUrl.includes('supabase.co') && img.imageUrl.includes('/object/public/')
                ? img.imageUrl.replace('/object/public/', '/render/image/public/') + '?width=400&height=400&resize=cover'
                : img.imageUrl;

              return (
                <div key={img.id} style={{ display: 'flex', flexDirection: 'column', position: 'relative', border: '1px solid var(--glass-border)', borderRadius: '8px', overflow: 'hidden', background: 'var(--glass-bg)' }}>
                  <div style={{ height: '200px', width: '100%', overflow: 'hidden' }}>
                    <img src={optimizedUrl} alt={img.title || "Gallery Image"} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <p style={{ fontWeight: 'bold', color: 'var(--text-primary)', margin: 0, textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{img.title || "No Title"}</p>
                  </div>
                  
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', display: 'flex', gap: '0.25rem', zIndex: 10 }}>
                    <Link href={`/admin/gallery?edit=${img.id}`} style={{ padding: '0.4rem', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Edit">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <form action={moveUp.bind(null, img.id)}>
                      <button type="submit" disabled={i === 0} style={{ padding: '0.4rem', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === 0 ? 0.3 : 1, cursor: i === 0 ? 'not-allowed' : 'pointer' }} title="Move Up">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>
                      </button>
                    </form>
                    <form action={moveDown.bind(null, img.id)}>
                      <button type="submit" disabled={i === images.length - 1} style={{ padding: '0.4rem', background: 'rgba(0,0,0,0.7)', color: 'white', borderRadius: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: i === images.length - 1 ? 0.3 : 1, cursor: i === images.length - 1 ? 'not-allowed' : 'pointer' }} title="Move Down">
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
