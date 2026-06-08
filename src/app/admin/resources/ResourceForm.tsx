"use client";

import { useRef, useState, useTransition } from "react";
import styles from "../admin.module.css";
import { addResourceAction, editResourceAction } from "@/actions/resources";

interface Props {
  mode: "add" | "edit";
  initialData?: any;
}

export default function ResourceForm({ mode, initialData }: Props) {
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    
    const formData = new FormData(e.currentTarget);
    
    // FIX: Turbopack crashes with "Unexpected end of form" if file inputs are completely empty.
    // We strip empty files from the FormData before sending to the Server Action.
    const files = formData.getAll("files");
    let hasFiles = false;
    for (const file of files) {
      if (file instanceof File && file.size > 0) {
        hasFiles = true;
        break;
      }
    }
    
    if (!hasFiles) {
      formData.delete("files");
    }

    startTransition(async () => {
      try {
        if (mode === "add") {
          await addResourceAction(formData);
          formRef.current?.reset();
        } else {
          await editResourceAction(formData);
        }
      } catch (err: any) {
        setError(err.message || "An error occurred");
      }
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className={styles.form}>
      {error && <p style={{ color: "red", marginBottom: "1rem" }}>{error}</p>}
      
      {mode === "edit" && (
        <>
          <input type="hidden" name="id" value={initialData.id} />
          <input type="hidden" name="existingFiles" value={JSON.stringify(initialData.fileUrls || [])} />
        </>
      )}
      
      <input 
        type="text" 
        name="title" 
        defaultValue={initialData?.title} 
        placeholder="Resource Title *" 
        required 
        className={styles.input} 
      />
      <textarea 
        name="description" 
        defaultValue={initialData?.description || ""} 
        placeholder="Short Description / Objectives" 
        rows={3} 
        className={styles.input} 
      />
      
      <div className={styles.inputGrid}>
        <input 
          type="url" 
          name="youtubeUrl" 
          defaultValue={initialData?.youtubeUrl || ""} 
          placeholder="YouTube Video URL (Optional)" 
          className={styles.input} 
        />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
          <label style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
            {mode === "add" ? "Upload Attachments (Multiple allowed)" : `Add More Attachments (Existing: ${initialData?.fileUrls?.length || 0})`}
          </label>
          <input type="file" name="files" multiple className={styles.input} style={{ padding: '0.4rem' }} />
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
        <button 
          type="submit" 
          disabled={isPending}
          className={`btn-primary ${styles.submitBtn}`} 
          style={{ margin: 0, flex: 1, opacity: isPending ? 0.7 : 1, cursor: isPending ? 'not-allowed' : 'pointer' }}
        >
          {isPending ? (mode === "add" ? "Adding..." : "Saving...") : (mode === "add" ? "Add to Roadmap" : "Save Changes")}
        </button>
        {mode === "edit" && (
          <a 
            href="/admin/resources" 
            className={`btn-secondary ${styles.submitBtn}`} 
            style={{ margin: 0, flex: 1, textAlign: 'center', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)' }}
          >
            Cancel
          </a>
        )}
      </div>
    </form>
  );
}
