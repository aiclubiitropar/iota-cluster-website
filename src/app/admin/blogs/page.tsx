import { deleteBlog } from "@/actions/blogs";
import prisma from "@/lib/prisma";
import Link from "next/link";
import styles from "../admin.module.css";
import BlogEditor from "./BlogEditor";
import { revalidatePath } from "next/cache";

export const dynamic = 'force-dynamic';

export default async function AdminBlogsPage({ searchParams }: { searchParams: Promise<{ edit?: string; new?: string }> }) {
  const params = await searchParams;
  const isNew = params?.new === "true";
  const editId = params?.edit;

  const blogs = await prisma.blog.findMany({ orderBy: { createdAt: "desc" } });
  const editBlog = editId ? blogs.find(b => b.id === editId) : null;

  async function handleDelete(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    await deleteBlog(id);
    revalidatePath("/admin/blogs");
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className={styles.pageTitle} style={{ marginBottom: 0 }}>Manage Blogs</h1>
        {!isNew && !editBlog && (
          <Link href="/admin/blogs?new=true" className="btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
            + Create New Blog
          </Link>
        )}
      </div>

      {(isNew || editBlog) ? (
        <div className={`glass-panel ${styles.formSection}`} style={{ padding: '2rem' }}>
          <h2 className={styles.sectionTitle}>{editBlog ? `Editing: ${editBlog.title}` : "Write a New Blog"}</h2>
          <BlogEditor existingBlog={editBlog} />
        </div>
      ) : (
        <div className="glass-panel p-6">
          <h2 className={styles.sectionTitle}>Published Blogs</h2>
          {blogs.length === 0 ? (
            <p className="text-[var(--text-secondary)]">No blogs published yet.</p>
          ) : (
            <div className={styles.list}>
              {blogs.map(blog => (
                <div key={blog.id} className={styles.listItem} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {blog.imageUrl && (
                      <img src={blog.imageUrl} alt={blog.title} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }} />
                    )}
                    <div>
                      <p className={styles.itemTitle}>{blog.title}</p>
                      <p className={styles.itemSubtitle}>By {blog.author} • {new Date(blog.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                    <Link href={`/admin/blogs?edit=${blog.id}`} scroll={false} className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] transition flex items-center justify-center text-[var(--text-primary)] hover:text-black" title="Edit">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                    </Link>
                    <form action={handleDelete} onSubmit={(e) => { if(!confirm("Are you sure you want to delete this blog?")) e.preventDefault(); }}>
                      <input type="hidden" name="id" value={blog.id} />
                      <button type="submit" className="p-2 bg-[var(--glass-bg)] border border-[var(--glass-border)] rounded hover:bg-[rgba(255,50,50,0.8)] hover:border-[rgba(255,50,50,0.8)] transition flex items-center justify-center text-[var(--text-secondary)] hover:text-white" title="Delete">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"></path><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                      </button>
                    </form>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
