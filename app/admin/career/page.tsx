"use client";

import { useMemo, useState, type FormEvent } from "react";
import ui from "@/app/components/admin/ui.module.css";

interface JobPosting {
  id: string;
  title: string;
  department: string;
  location: string;
  type: "Full-Time" | "Part-Time" | "Internship";
  status: "Open" | "Closed";
  applicants: number;
  postedOn: string;
  description: string;
}

const SEED: JobPosting[] = [
  {
    id: "j1",
    title: "SEO Executive",
    department: "Digital Marketing",
    location: "Dehradun (On-site)",
    type: "Full-Time",
    status: "Open",
    applicants: 12,
    postedOn: "2026-07-10",
    description: "Own on-page/off-page SEO for client websites and report on keyword rankings.",
  },
  {
    id: "j2",
    title: "Graphic Designer",
    department: "Creative",
    location: "Dehradun (On-site)",
    type: "Full-Time",
    status: "Open",
    applicants: 8,
    postedOn: "2026-07-15",
    description: "Design social creatives, branding assets, and marketing collateral for clients.",
  },
  {
    id: "j3",
    title: "Video Editing Intern",
    department: "Photography & Videography",
    location: "Dream Byte Studio",
    type: "Internship",
    status: "Open",
    applicants: 5,
    postedOn: "2026-07-22",
    description: "Assist in editing reels, event footage, and short-form content for clients.",
  },
  {
    id: "j4",
    title: "MERN Stack Developer",
    department: "Web Development",
    location: "Dehradun (On-site)",
    type: "Full-Time",
    status: "Closed",
    applicants: 21,
    postedOn: "2026-06-18",
    description: "Build and maintain client websites and internal tools using the MERN stack.",
  },
];

const EMPTY_FORM: Omit<JobPosting, "id" | "applicants" | "postedOn"> = {
  title: "",
  department: "",
  location: "",
  type: "Full-Time",
  status: "Open",
  description: "",
};

export default function CareerAdminPage() {
  const [jobs, setJobs] = useState<JobPosting[]>(SEED);
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);

  const filtered = useMemo(
    () =>
      jobs.filter(
        (j) =>
          j.title.toLowerCase().includes(query.toLowerCase()) ||
          j.department.toLowerCase().includes(query.toLowerCase())
      ),
    [jobs, query]
  );

  function openAddModal() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setModalOpen(true);
  }

  function openEditModal(job: JobPosting) {
    setEditingId(job.id);
    setForm({
      title: job.title,
      department: job.department,
      location: job.location,
      type: job.type,
      status: job.status,
      description: job.description,
    });
    setModalOpen(true);
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    // TODO: replace with POST/PUT to your Express /api/careers endpoint
    if (editingId) {
      setJobs((prev) => prev.map((j) => (j.id === editingId ? { ...j, ...form } : j)));
    } else {
      const newJob: JobPosting = {
        ...form,
        id: `j${Date.now()}`,
        applicants: 0,
        postedOn: new Date().toISOString().slice(0, 10),
      };
      setJobs((prev) => [newJob, ...prev]);
    }
    setModalOpen(false);
  }

  function handleDelete(id: string) {
    // TODO: DELETE /api/careers/:id
    if (window.confirm("Delete this job posting?")) {
      setJobs((prev) => prev.filter((j) => j.id !== id));
    }
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Career</h1>
      <p className={ui.pageSubtitle}>Manage open positions and applicants</p>

      <div className={ui.pageHeadRow}>
        <div className={ui.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search positions..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <button type="button" className={ui.btnPrimary} onClick={openAddModal}>
          + Add Position
        </button>
      </div>

      <div className={ui.panel}>
        <div className={ui.tableWrap}>
          <table className={ui.table}>
            <thead>
              <tr>
                <th>Position</th>
                <th>Department</th>
                <th>Type</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Posted</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr key={job.id}>
                  <td>
                    <div className={ui.cellMain}>{job.title}</div>
                    <div className={ui.cellSub}>{job.location}</div>
                  </td>
                  <td>{job.department}</td>
                  <td>{job.type}</td>
                  <td>{job.applicants}</td>
                  <td>
                    <span className={`${ui.badge} ${job.status === "Open" ? ui.badgeGreen : ui.badgeRed}`}>
                      <span className={ui.badgeDot} />
                      {job.status}
                    </span>
                  </td>
                  <td className={ui.cellSub}>{job.postedOn}</td>
                  <td>
                    <div className={ui.rowActions}>
                      <button className={ui.iconBtn} onClick={() => openEditModal(job)} aria-label="Edit">
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                          <path d="M12 20h9M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z" />
                        </svg>
                      </button>
                      <button className={ui.iconBtn} onClick={() => handleDelete(job.id)} aria-label="Delete">
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
          {filtered.length === 0 && <div className={ui.emptyState}>No positions match your search.</div>}
        </div>
      </div>

      {modalOpen && (
        <div className={ui.modalOverlay} onClick={() => setModalOpen(false)}>
          <div className={ui.modal} onClick={(e) => e.stopPropagation()}>
            <div className={ui.modalHead}>
              <h2>{editingId ? "Edit Position" : "Add New Position"}</h2>
              <button className={ui.iconBtn} onClick={() => setModalOpen(false)} aria-label="Close">
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={ui.formGrid}>
                <div className={ui.field}>
                  <label htmlFor="title">Job Title</label>
                  <input id="title" name="title" required value={form.title} onChange={handleChange} />
                </div>
                <div className={ui.field}>
                  <label htmlFor="department">Department</label>
                  <input
                    id="department"
                    name="department"
                    required
                    value={form.department}
                    onChange={handleChange}
                  />
                </div>
                <div className={ui.field}>
                  <label htmlFor="location">Location</label>
                  <input
                    id="location"
                    name="location"
                    required
                    value={form.location}
                    onChange={handleChange}
                  />
                </div>
                <div className={ui.field}>
                  <label htmlFor="type">Employment Type</label>
                  <select id="type" name="type" value={form.type} onChange={handleChange}>
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Internship</option>
                  </select>
                </div>
                <div className={ui.field}>
                  <label htmlFor="status">Status</label>
                  <select id="status" name="status" value={form.status} onChange={handleChange}>
                    <option>Open</option>
                    <option>Closed</option>
                  </select>
                </div>
                <div className={`${ui.field} ${ui.formGridFull}`}>
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    rows={4}
                    value={form.description}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className={ui.modalActions}>
                <button type="button" className={ui.btnGhost} onClick={() => setModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className={ui.btnPrimary}>
                  {editingId ? "Save Changes" : "Publish Position"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}