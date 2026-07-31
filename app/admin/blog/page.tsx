"use client";

import { useMemo, useState, type FormEvent } from "react";
import ui from "@/app/components/admin/ui.module.css";

interface BlogPost {
  id: string;
  title: string;
  category: string;
  author: string;
  status: "Published" | "Draft";
  date: string;
  excerpt: string;
  coverImage: string;
}

const SEED: BlogPost[] = [
  {
    id: "b1",
    title: "Top 10 SEO Trends for Dehradun Businesses in 2026",
    category: "SEO",
    author: "Pooja Sakta",
    status: "Published",
    date: "2026-07-24",
    excerpt: "How local businesses in Dehradun can stay ahead with the latest search trends.",
    coverImage:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "b2",
    title: "Why Every Startup Needs a Performance Marketing Plan",
    category: "Performance Marketing",
    author: "Lalit Kushwaha",
    status: "Draft",
    date: "2026-07-20",
    excerpt: "A data-driven approach to ad spend that actually moves the needle for new brands.",
    coverImage:
      "https://images.unsplash.com/photo-1533750349088-cd871a92f312?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "b3",
    title: "Behind the Scenes: Erika Henna Herbal Rebrand",
    category: "Case Study",
    author: "Pooja Sakta",
    status: "Published",
    date: "2026-07-12",
    excerpt: "A look at how we rebuilt Erika's visual identity and grew their online presence.",
    coverImage:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop",
  },
];

const EMPTY_FORM: Omit<BlogPost, "id" | "date"> = {
  title: "",
  category: "",
  author: "",
  status: "Draft",
  excerpt: "",
  coverImage: "",
};

export default function BlogAdminPage() {
  const [posts, setPosts] = useState<BlogPost[]>(SEED);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(
    () => posts.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [posts, query]
  );

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(post: BlogPost) {
    setEditingId(post.id);
    setForm({
      title: post.title,
      category: post.category,
      author: post.author,
      status: post.status,
      excerpt: post.excerpt,
      coverImage: post.coverImage,
    });
    setModalOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: replace with POST/PUT to your Express /api/blogs endpoint
    if (editingId) {
      setPosts((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
    } else {
      const newPost: BlogPost = {
        ...form,
        id: `b${Date.now()}`,
        date: new Date().toISOString().slice(0, 10),
      };
      setPosts((prev) => [newPost, ...prev]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (window.confirm("Delete this blog post?")) {
      setPosts((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Blog</h1>
      <p className={ui.pageSubtitle}>Write, edit and publish articles</p>

      <div className={ui.pageHeadRow}>
        <div className={ui.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input placeholder="Search posts..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button type="button" className={ui.btnPrimary} onClick={openAddModal}>
          + New Post
        </button>
      </div>

      <div className={ui.panel}>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Title</th>
                <th>Category</th>
                <th>Author</th>
                <th>Status</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td>
                    <div className={ui.cellMain}>{post.title}</div>
                    <div className={ui.cellSub}>{post.excerpt.slice(0, 60)}...</div>
                  </td>
                  <td>{post.category}</td>
                  <td>{post.author}</td>
                  <td>
                    <span
                      className={`${ui.badge} ${post.status === "Published" ? ui.badgeGreen : ui.badgeMuted}`}
                    >
                      <span className={ui.badgeDot} />
                      {post.status}
                    </span>
                  </td>
                  <td className={ui.cellSub}>{post.date}</td>
                  <td>
                    <div className={ui.rowActions}>
                      <button className={ui.iconBtn} onClick={() => openEditModal(post)} aria-label="Edit">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                        </svg>
                      </button>
                      <button className={ui.iconBtn} onClick={() => handleDelete(post.id)} aria-label="Delete">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && <div className={ui.emptyState}>No posts match your search.</div>}
        </div>
      </div>

      {modalOpen && (
        <div className={ui.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHead}>
              <h2>{editingId ? "Edit Post" : "New Blog Post"}</h2>
              <button className={ui.iconBtn} onClick={() => setModalOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={ui.formGrid}>
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="title">Title</label>
                  <input id="title" name="title" required value={form.title} onChange={handleChange} />
                </div>
                <div className={ui.field}>
                  <label htmlFor="category">Category</label>
                  <input
                    id="category"
                    name="category"
                    required
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>
                <div className={ui.field}>
                  <label htmlFor="author">Author</label>
                  <input id="author" name="author" required value={form.author} onChange={handleChange} />
                </div>
                <div className={ui.field}>
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" value={form.status} onChange={handleChange}>
                    <option>Draft</option>
                    <option>Published</option>
                  </select>
                </div>
                <div className={ui.field}>
                  <label htmlFor="coverImage">Cover Image URL</label>
                  <input
                    id="coverImage"
                    name="coverImage"
                    placeholder="https://..."
                    value={form.coverImage}
                    onChange={handleChange}
                  />
                </div>
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="excerpt">Excerpt / Content</label>
                  <textarea
                    id="excerpt"
                    name="excerpt"
                    rows={5}
                    value={form.excerpt}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={ui.modalActions}>
                <button type="button" className={ui.btnGhost} onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={ui.btnPrimary}>
                  {editingId ? "Save Changes" : "Create Post"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}