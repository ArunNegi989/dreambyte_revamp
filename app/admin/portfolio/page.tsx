"use client";

import { useMemo, useState, type FormEvent } from "react";
import ui from "@/app/components/admin/ui.module.css";
import styles from "./portfolio.module.css";

interface Project {
  id: string;
  title: string;
  client: string;
  category: string;
  link: string;
  image: string;
}

const SEED: Project[] = [
  {
    id: "p1",
    title: "Erika Henna Herbal",
    client: "Erika",
    category: "Branding & Web",
    link: "https://dreambytesolution.com/erika",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "p2",
    title: "Gauraaj",
    client: "Gauraaj",
    category: "Web Development",
    link: "https://dreambytesolution.com/gauraaj",
    image: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "p3",
    title: "House Of Intimacy",
    client: "House Of Intimacy",
    category: "E-Commerce",
    link: "https://dreambytesolution.com/house-of-intimacy",
    image: "https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?q=80&w=800&auto=format&fit=crop",
  },
  {
    id: "p4",
    title: "Balaji Furniture",
    client: "Balaji",
    category: "Web Development",
    link: "https://decorwithbalajifurniture.in",
    image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800&auto=format&fit=crop",
  },
];

const EMPTY_FORM: Omit<Project, "id"> = {
  title: "",
  client: "",
  category: "",
  link: "",
  image: "",
};

export default function PortfolioAdminPage() {
  const [projects, setProjects] = useState<Project[]>(SEED);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(
    () => projects.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())),
    [projects, query]
  );

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(p: Project) {
    setEditingId(p.id);
    setForm({ title: p.title, client: p.client, category: p.category, link: p.link, image: p.image });
    setModalOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: replace with POST/PUT to your Express /api/portfolio endpoint
    if (editingId) {
      setProjects((prev) => prev.map((p) => (p.id === editingId ? { ...p, ...form } : p)));
    } else {
      setProjects((prev) => [{ ...form, id: `p${Date.now()}` }, ...prev]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    if (window.confirm("Remove this project from the portfolio?")) {
      setProjects((prev) => prev.filter((p) => p.id !== id));
    }
  }

  return (
    <div>
      <div className={ui.pageHeadRow}>
        <div className={ui.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input placeholder="Search projects..." value={query} onChange={(e) => setQuery(e.target.value)} />
        </div>
        <button type="button" className={ui.btnPrimary} onClick={openAddModal}>
          + Add Project
        </button>
      </div>

      <div className={styles.grid}>
        {filtered.map((p) => (
          <div className={styles.card} key={p.id}>
            <div className={styles.thumb}>
              <img src={p.image} alt={p.title} />
            </div>
            <div className={styles.cardBody}>
              <span className={styles.category}>{p.category}</span>
              <h3>{p.title}</h3>
              <p>{p.client}</p>
              <div className={styles.cardActions}>
                <a href={p.link} target="_blank" rel="noreferrer" className={ui.btnGhost}>
                  Visit
                </a>
                <button className={ui.iconBtn} onClick={() => openEditModal(p)} aria-label="Edit">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                  </svg>
                </button>
                <button className={ui.iconBtn} onClick={() => handleDelete(p.id)} aria-label="Delete">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className={ui.emptyState}>No projects match your search.</div>}
      </div>

      {modalOpen && (
        <div className={ui.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHead}>
              <h2>{editingId ? "Edit Project" : "Add New Project"}</h2>
              <button className={ui.iconBtn} onClick={() => setModalOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={ui.formGrid}>
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="title">Project Title</label>
                  <input id="title" name="title" required value={form.title} onChange={handleChange} />
                </div>
                <div className={ui.field}>
                  <label htmlFor="client">Client Name</label>
                  <input id="client" name="client" required value={form.client} onChange={handleChange} />
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
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="link">Project Link</label>
                  <input
                    id="link"
                    name="link"
                    placeholder="https://..."
                    value={form.link}
                    onChange={handleChange}
                  />
                </div>
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="image">Thumbnail Image URL</label>
                  <input
                    id="image"
                    name="image"
                    placeholder="https://..."
                    value={form.image}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={ui.modalActions}>
                <button type="button" className={ui.btnGhost} onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={ui.btnPrimary}>
                  {editingId ? "Save Changes" : "Add Project"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}