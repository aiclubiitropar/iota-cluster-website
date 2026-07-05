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

  // Resource links state — each entry has a label and a url
  const [resourceLinks, setResourceLinks] = useState<{ label: string; url: string }[]>(
    () => {
      if (initialData?.resourceLinks?.length) {
        return initialData.resourceLinks.map((entry: string) => {
          try {
            return JSON.parse(entry) as { label: string; url: string };
          } catch {
            // Backwards-compat: plain URL string stored before the label feature
            return { label: "", url: entry };
          }
        });
      }
      return [];
    }
  );

  const addLink = () => setResourceLinks(prev => [...prev, { label: "", url: "" }]);
  const removeLink = (i: number) => setResourceLinks(prev => prev.filter((_, idx) => idx !== i));
  const updateLink = (i: number, field: "label" | "url", value: string) =>
    setResourceLinks(prev => prev.map((l, idx) => idx === i ? { ...l, [field]: value } : l));

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

    // Serialize resource links — filter out entirely blank rows
    const validLinks = resourceLinks
      .filter(l => l.url.trim())
      .map(l => JSON.stringify(l));
    formData.set("resourceLinks", JSON.stringify(validLinks));

    startTransition(async () => {
      try {
        if (mode === "add") {
          await addResourceAction(formData);
          formRef.current?.reset();
          setResourceLinks([]);
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

      {/* ── Resource Links ──────────────────────────────────────── */}
      <div style={{ marginTop: '1.2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <label style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            🔗 Resource Links <span style={{ fontWeight: 400, opacity: 0.7 }}>(Optional)</span>
          </label>
          <button
            type="button"
            onClick={addLink}
            title="Add a resource link"
            style={{
              display: 'flex', alignItems: 'center', gap: '0.3rem',
              padding: '0.25rem 0.7rem', fontSize: '0.8rem', borderRadius: '6px',
              background: 'var(--glass-bg)', border: '1px solid var(--accent-cyan)',
              color: 'var(--accent-cyan)', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Link
          </button>
        </div>

        {resourceLinks.length === 0 && (
          <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', opacity: 0.6, marginBottom: '0.2rem' }}>
            No resource links added. Click "Add Link" to attach references like docs, articles, repos, etc.
          </p>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {resourceLinks.map((link, i) => (
            <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <input
                type="text"
                value={link.label}
                onChange={e => updateLink(i, "label", e.target.value)}
                placeholder={`Label (e.g. "Official Docs")`}
                className={styles.input}
                style={{ flex: '0 0 35%', margin: 0 }}
              />
              <input
                type="url"
                value={link.url}
                onChange={e => updateLink(i, "url", e.target.value)}
                placeholder="https://..."
                required={link.label.trim().length > 0}
                className={styles.input}
                style={{ flex: 1, margin: 0 }}
              />
              <button
                type="button"
                onClick={() => removeLink(i)}
                title="Remove this link"
                style={{
                  flexShrink: 0, padding: '0.3rem 0.5rem', borderRadius: '6px',
                  background: 'rgba(255,50,50,0.12)', border: '1px solid rgba(255,50,50,0.4)',
                  color: '#ff6b6b', cursor: 'pointer', lineHeight: 1,
                }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      {/* ── /Resource Links ─────────────────────────────────────── */}

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
