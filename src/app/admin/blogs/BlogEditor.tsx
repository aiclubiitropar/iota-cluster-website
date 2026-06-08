"use client";

import { useState, useRef, useMemo } from "react";
import dynamic from "next/dynamic";
import "react-quill-new/dist/quill.snow.css";
import SubmitButton from "@/components/SubmitButton";
import { createBlog, updateBlog } from "@/actions/blogs";
import { useRouter } from "next/navigation";

// Dynamically import react-quill-new to prevent SSR issues and fix React 19 findDOMNode errors
const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function BlogEditor({ 
  existingBlog = null 
}: { 
  existingBlog?: any 
}) {
  const router = useRouter();
  const [content, setContent] = useState(existingBlog?.content || "");
  const [title, setTitle] = useState(existingBlog?.title || "");
  const [author, setAuthor] = useState(existingBlog?.author || "");
  const [summary, setSummary] = useState(existingBlog?.summary || "");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState(existingBlog?.imageUrl || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const modules = useMemo(() => ({
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ font: [] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ color: [] }, { background: [] }],
      ["link"],
      ["clean"],
    ]
  }), []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    if (!title || !author || !summary || !content) {
      setError("Please fill out all text fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      if (existingBlog) {
        const res = await updateBlog(existingBlog.id, {
          title, author, summary, content, imageUrl, imageFile: imageFile || undefined
        });
        if (!res.success) setError(res.error || "Failed to update blog");
        else {
          router.push("/admin/blogs");
          router.refresh();
        }
      } else {
        const res = await createBlog({
          title, author, summary, content, imageFile: imageFile || undefined
        });
        if (!res.success) setError(res.error || "Failed to create blog");
        else {
          router.push("/admin/blogs");
          router.refresh();
        }
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {error && <div style={{ color: 'red', padding: '1rem', border: '1px solid red', borderRadius: '8px' }}>{error}</div>}
      
      <div style={{ display: 'flex', gap: '1rem', flexDirection: 'column' }}>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Blog Title *" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', width: '100%', fontSize: '1.2rem' }} />
        <input type="text" value={author} onChange={e => setAuthor(e.target.value)} placeholder="Author Name *" required style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', width: '100%' }} />
        <textarea value={summary} onChange={e => setSummary(e.target.value)} placeholder="Short Summary (Max 200 chars) *" maxLength={200} required rows={3} style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--glass-border)', background: 'var(--glass-bg)', color: 'white', width: '100%', resize: 'vertical' }} />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', border: '1px solid var(--glass-border)' }}>
        <label style={{ color: 'var(--text-secondary)' }}>Cover Image</label>
        {imageUrl && <div style={{ marginBottom: '0.5rem' }}><img src={imageUrl} alt="Cover" style={{ maxWidth: '200px', borderRadius: '8px' }} /></div>}
        <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files?.[0] || null)} style={{ color: 'white' }} />
      </div>

      <div style={{ background: 'white', color: 'black', borderRadius: '8px', overflow: 'hidden' }}>
        <ReactQuill 
          theme="snow" 
          value={content} 
          onChange={setContent} 
          modules={modules}
          style={{ minHeight: '400px' }}
        />
      </div>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => router.push("/admin/blogs")} className="btn-secondary" style={{ padding: '0.8rem 2rem', background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', color: 'white', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
        <button type="submit" disabled={isSubmitting} className="btn-primary" style={{ padding: '0.8rem 2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
          {isSubmitting ? "Saving..." : "Publish Blog"}
        </button>
      </div>
    </form>
  );
}
