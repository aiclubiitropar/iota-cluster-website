import { getGalleryImages } from "@/actions/gallery";
import Image from "next/image";
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
          {images.map((img) => (
            <div key={img.id} className={`glass-panel ${styles.card}`}>
              <Image 
                src={img.imageUrl} 
                alt={img.title || "Gallery Image"} 
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                className={styles.image} 
              />
              {img.title && (
                <div className={styles.overlay}>
                  <p className={styles.imageTitle}>{img.title}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
