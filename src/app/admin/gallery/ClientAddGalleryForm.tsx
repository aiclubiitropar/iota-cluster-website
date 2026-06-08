"use client";

import { useState } from "react";
import styles from "../admin.module.css";
import SubmitButton from "@/components/SubmitButton";
import { createGalleryImages } from "@/actions/gallery";

export default function ClientAddGalleryForm() {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [total, setTotal] = useState(0);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const files = formData.getAll("imageFiles") as File[];
    const title = formData.get("title") as string;
    const imageUrl = formData.get("imageUrl") as string;

    const validFiles = files.filter(f => f.size > 0);
    const totalItems = validFiles.length + (imageUrl ? 1 : 0);
    
    if (totalItems === 0) return;

    setIsUploading(true);
    setTotal(totalItems);
    setProgress(0);

    try {
      if (imageUrl) {
        await createGalleryImages({ title, imageUrl });
        setProgress(p => p + 1);
      }

      for (const file of validFiles) {
        await createGalleryImages({ title, imageFiles: [file] });
        setProgress(p => p + 1);
      }

      e.currentTarget.reset();
    } catch (error) {
      console.error("Upload error", error);
      alert("An error occurred during upload. Please try again.");
    } finally {
      setIsUploading(false);
      setProgress(0);
    }
  };

  return (
    <div className={`glass-panel ${styles.formSection}`}>
      <h2 className={styles.sectionTitle}>Add New Image(s)</h2>
      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={`${styles.inputGrid} ${styles.inputGrid2}`}>
          <input type="text" name="title" placeholder="Image Title / Caption (Optional)" className={styles.input} disabled={isUploading} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <input type="url" name="imageUrl" placeholder="Image URL (Or upload below)" className={styles.input} disabled={isUploading} />
            <input type="file" name="imageFiles" accept="image/*" multiple className={styles.input} style={{ padding: '0.4rem' }} disabled={isUploading} />
          </div>
        </div>
        
        {isUploading ? (
          <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              <span>Uploading...</span>
              <span>{progress} / {total}</span>
            </div>
            <div style={{ width: '100%', height: '8px', background: 'var(--glass-border)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{ width: `${Math.max(5, (progress / total) * 100)}%`, height: '100%', background: 'var(--accent-cyan)', transition: 'width 0.3s ease' }}></div>
            </div>
          </div>
        ) : (
          <button type="submit" className={`btn-primary ${styles.submitBtn}`}>
            Add Image(s)
          </button>
        )}
      </form>
    </div>
  );
}
