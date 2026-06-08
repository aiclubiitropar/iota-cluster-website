import { getGalleryImages, createGalleryImage } from "@/actions/gallery";
import { revalidatePath } from "next/cache";
import styles from "../admin.module.css";

export default async function AdminGalleryPage() {
  const images = await getGalleryImages();

  async function addImage(formData: FormData) {
    "use server";
    await createGalleryImage({
      title: formData.get("title") as string,
      imageUrl: formData.get("imageUrl") as string,
    });
    revalidatePath("/admin/gallery");
    revalidatePath("/");
  }

  return (
    <div>
      <h1 className={styles.pageTitle}>Manage Gallery</h1>
      
      <div className={`glass-panel ${styles.formSection}`}>
        <h2 className={styles.sectionTitle}>Add New Image</h2>
        <form action={addImage} className={styles.form}>
          <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
            <input type="text" name="title" placeholder="Image Title / Caption *" required className={styles.input} />
            <input type="url" name="imageUrl" placeholder="Image URL *" required className={styles.input} />
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
            {images.map(img => (
              <div key={img.id} className="border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--glass-bg)]">
                <img src={img.imageUrl} alt={img.title} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <p className="font-bold">{img.title}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
