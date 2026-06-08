import { getGalleryImages } from "@/actions/gallery";
import styles from "./page.module.css";

export const dynamic = 'force-dynamic';

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Image <span className="text-gradient">Gallery</span>
        </h1>
        <p className={styles.subtitle}>
          Memories, events, and highlights from the Iota Cluster community.
        </p>
      </div>

      {images.length === 0 ? (
        <div className={`glass-panel ${styles.emptyState}`}>
          <p className="text-[var(--text-secondary)]">The gallery is currently empty. Check back soon!</p>
        </div>
      ) : (
        <div className={styles.grid}>
          {images.map((img) => {
            // Use Supabase built-in image optimization to prevent local Next.js timeout errors
            const optimizedUrl = img.imageUrl.includes('supabase.co') && img.imageUrl.includes('/object/public/') 
              ? img.imageUrl.replace('/object/public/', '/render/image/public/') + '?width=600&height=600&resize=cover'
              : img.imageUrl;

            return (
              <div key={img.id} className={`glass-panel ${styles.card}`}>
                <img 
                  src={optimizedUrl} 
                  alt={img.title || "Gallery Image"} 
                  className={styles.image} 
                  loading="lazy"
                />
                {img.title && (
                  <div className={styles.overlay}>
                    <p className={styles.imageTitle}>{img.title}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
