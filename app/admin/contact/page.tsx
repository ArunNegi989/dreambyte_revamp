"use client";

import { useMemo, useState } from "react";
import ui from "@/app/components/admin/ui.module.css";
import styles from "./contact.module.css";

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  date: string;
  read: boolean;
}

const SEED: ContactMessage[] = [
  {
    id: "m1",
    name: "Prachi Pant",
    email: "prachi.pant@example.com",
    phone: "+91 98765 43210",
    message:
      "Hi, I run a small boutique in Rajpur Road and I'm looking to redesign my website along with a monthly SEO plan. Could you share a quote?",
    date: "2026-07-30 10:12 AM",
    read: false,
  },
  {
    id: "m2",
    name: "Vikas Manral",
    email: "vikas.m@example.com",
    phone: "+91 98123 45670",
    message: "Interested in your SEO packages for a real estate business. Please share pricing details.",
    date: "2026-07-30 07:40 AM",
    read: false,
  },
  {
    id: "m3",
    name: "Manish Rathore",
    email: "manish.rathore@example.com",
    phone: "+91 90123 45678",
    message: "We'd like to explore a collaboration for our upcoming resort launch — photography + branding.",
    date: "2026-07-29 06:05 PM",
    read: false,
  },
  {
    id: "m4",
    name: "Jyoti Pandey",
    email: "jyoti.pandey@example.com",
    phone: "+91 91234 56789",
    message: "Can you help manage Instagram and Facebook for a healthcare clinic in Dehradun?",
    date: "2026-07-28 02:15 PM",
    read: false,
  },
  {
    id: "m5",
    name: "Akhil Nautiyal",
    email: "akhil.n@example.com",
    phone: "+91 99887 66554",
    message: "Loved your portfolio! Wanted to discuss a performance marketing campaign for our e-commerce store.",
    date: "2026-07-26 11:50 AM",
    read: true,
  },
];

export default function ContactAdminPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(SEED);
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(SEED[0]?.id ?? null);

  const filtered = useMemo(
    () =>
      messages.filter(
        (m) =>
          m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.message.toLowerCase().includes(query.toLowerCase())
      ),
    [messages, query]
  );

  const active = messages.find((m) => m.id === activeId) ?? null;
  const unreadCount = messages.filter((m) => !m.read).length;

  function openMessage(id: string) {
    setActiveId(id);
    // TODO: PATCH /api/contact/:id { read: true }
    setMessages((prev) => prev.map((m) => (m.id === id ? { ...m, read: true } : m)));
  }

  function handleDelete(id: string) {
    if (!window.confirm("Delete this message?")) return;
    setMessages((prev) => prev.filter((m) => m.id !== id));
    if (activeId === id) setActiveId(null);
  }

  return (
    <div>
      <h1 className={ui.pageTitle}>Contact Messages</h1>
      <p className={ui.pageSubtitle}>Enquiries submitted from the website</p>

      <div className={ui.pageHeadRow}>
        <div className={ui.searchBox}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
          </svg>
          <input
            placeholder="Search messages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <span className={`${ui.badge} ${ui.badgeAmber}`}>
          <span className={ui.badgeDot} />
          {unreadCount} Unread
        </span>
      </div>

      <div className={styles.inbox}>
        <div className={`${ui.panel} ${styles.listPanel}`}>
          <ul className={styles.msgList}>
            {filtered.map((m) => (
              <li
                key={m.id}
                className={`${styles.msgRow} ${activeId === m.id ? styles.msgRowActive : ""}`}
                onClick={() => openMessage(m.id)}
              >
                <span className={`${styles.unreadDot} ${!m.read ? styles.unreadDotOn : ""}`} />
                <div className={styles.msgMain}>
                  <div className={styles.msgTop}>
                    <strong>{m.name}</strong>
                    <span className={styles.msgTime}>{m.date.split(" ")[0]}</span>
                  </div>
                  <p>{m.message}</p>
                </div>
              </li>
            ))}
            {filtered.length === 0 && <div className={ui.emptyState}>No messages found.</div>}
          </ul>
        </div>

        <div className={`${ui.panel} ${styles.detailPanel}`}>
          {active ? (
            <>
              <div className={styles.detailHead}>
                <div>
                  <h2>{active.name}</h2>
                  <p className={styles.detailMeta}>
                    <a href={`mailto:${active.email}`}>{active.email}</a> &middot;{" "}
                    <a href={`tel:${active.phone.replace(/\s/g, "")}`}>{active.phone}</a>
                  </p>
                </div>
                <button className={ui.iconBtn} onClick={() => handleDelete(active.id)} aria-label="Delete">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                    <path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m3 0l-1 14a2 2 0 01-2 2H7a2 2 0 01-2-2L4 6h16z" />
                  </svg>
                </button>
              </div>
              <p className={styles.detailDate}>{active.date}</p>
              <p className={styles.detailBody}>{active.message}</p>
              <a href={`mailto:${active.email}`} className={ui.btnPrimary}>
                Reply by Email
              </a>
            </>
          ) : (
            <div className={ui.emptyState}>Select a message to view details.</div>
          )}
        </div>
      </div>
    </div>
  );
}