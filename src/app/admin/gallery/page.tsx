import { getGalleryImages, createGalleryImage, reorderGalleryImage } from "@/actions/gallery";
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
            {images.map((img, i) => (
              <div key={img.id} className="border border-[var(--glass-border)] rounded-md overflow-hidden bg-[var(--glass-bg)] relative group">
                <img src={img.imageUrl} alt={img.title} className="w-full h-48 object-cover" />
                <div className="p-3">
                  <p className="font-bold">{img.title}</p>
                </div>
                
                <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
                  <form action={moveUp.bind(null, img.id)}>
                    <button type="submit" disabled={i === 0} className="p-1.5 bg-black/60 text-white rounded hover:bg-[var(--accent-purple)] disabled:opacity-30 backdrop-blur-sm">
                      ↑
                    </button>
                  </form>
                  <form action={moveDown.bind(null, img.id)}>
                    <button type="submit" disabled={i === images.length - 1} className="p-1.5 bg-black/60 text-white rounded hover:bg-[var(--accent-purple)] disabled:opacity-30 backdrop-blur-sm">
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
