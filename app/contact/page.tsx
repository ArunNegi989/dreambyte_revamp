"use client";

import React, { useState } from "react";
import styles from "./Contactpage.module.css";

interface ContactDetail {
  icon: "phone" | "mail" | "pin";
  label: string;
  href?: string;
}

interface SocialLink {
  icon: "youtube" | "linkedin" | "instagram" | "whatsapp";
  href: string;
  label: string;
}

interface ContactPageProps {
  heading?: string;
  subheading?: string;
  phones?: string[];
  email?: string;
  address?: string;
  mapEmbedSrc?: string;
  socials?: SocialLink[];
  onSubmit?: (data: {
    name: string;
    email: string;
    phone: string;
    message: string;
  }) => Promise<void> | void;
}

const DEFAULT_SOCIALS: SocialLink[] = [
  { icon: "youtube", href: "#", label: "YouTube" },
  { icon: "linkedin", href: "#", label: "LinkedIn" },
  { icon: "instagram", href: "#", label: "Instagram" },
  { icon: "whatsapp", href: "#", label: "WhatsApp" },
];

const ICONS: Record<string, React.ReactNode> = {
  phone: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.2 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.5.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1C10.5 21 3 13.5 3 4.1c0-.6.4-1 1-1h3.4c.6 0 1 .4 1 1 0 1.2.2 2.4.6 3.5.1.4 0 .8-.2 1L6.6 10.8z" />
    </svg>
  ),
  mail: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  ),
  pin: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M12 21s-7-6.1-7-11a7 7 0 0 1 14 0c0 4.9-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.4" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M22 12s0-3.2-.4-4.7a2.9 2.9 0 0 0-2-2C17.9 5 12 5 12 5s-5.9 0-7.6.3a2.9 2.9 0 0 0-2 2C2 8.8 2 12 2 12s0 3.2.4 4.7a2.9 2.9 0 0 0 2 2C6.1 19 12 19 12 19s5.9 0 7.6-.3a2.9 2.9 0 0 0 2-2C22 15.2 22 12 22 12zM10 15.5v-7l6 3.5-6 3.5z" />
    </svg>
  ),
  linkedin: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M6.94 8.5H3.56V20h3.38V8.5zM5.25 3a1.97 1.97 0 1 0 0 3.94 1.97 1.97 0 0 0 0-3.94zM20.45 20h-3.37v-5.6c0-1.34-.03-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 2.96V20H9.68V8.5h3.24v1.57h.05c.45-.85 1.55-1.75 3.19-1.75 3.41 0 4.04 2.25 4.04 5.17V20z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
    </svg>
  ),
  whatsapp: (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5.1-1.3A10 10 0 1 0 12 2zm5.8 14.2c-.2.7-1.4 1.3-2 1.4-.5.1-1.1.1-1.8-.1-.4-.1-1-.3-1.7-.6-3-1.3-4.9-4.3-5.1-4.5-.1-.2-1.2-1.6-1.2-3s.7-2.1 1-2.4c.3-.3.6-.3.8-.3h.6c.2 0 .4 0 .6.5.2.5.7 1.8.8 1.9.1.2.1.3 0 .5-.1.2-.1.3-.3.5l-.4.5c-.1.2-.3.3-.1.6.2.3.9 1.5 1.9 2.4 1.3 1.2 2.4 1.5 2.7 1.7.3.1.5.1.6-.1.2-.2.7-.8.9-1.1.2-.3.4-.2.6-.1l1.7.8c.2.1.4.2.5.3.1.2.1.9-.1 1.6z" />
    </svg>
  ),
};

const ContactPage: React.FC<ContactPageProps> = ({
  heading = "Get in Touch with Us",
  subheading = "Questions, project ideas, or just a hello — our team replies personally, always.",
  phones = ["+91 8278720490", "+91 9958333639"],
  email = "hr@dreambytesolution.com",
  address = "3rd Floor, above Bank of India, Sahastradhara Road, Near IT Park, Dehradun, Uttarakhand",
  mapEmbedSrc = "https://www.google.com/maps?q=Dream+Byte+Solutions+Sahastradhara+Road+Dehradun&output=embed",
  socials = DEFAULT_SOCIALS,
  onSubmit,
}) => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = "Please enter your name.";
    if (!form.email.trim()) {
      next.email = "Please enter your email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      next.email = "Enter a valid email address.";
    }
    if (!form.message.trim()) next.message = "Please add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    try {
      await onSubmit?.(form);
      setStatus("sent");
      setForm({ name: "", email: "", phone: "", message: "" });
      window.setTimeout(() => setStatus("idle"), 4000);
    } catch {
      setStatus("idle");
    }
  };

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <span className={styles.heroFacet} aria-hidden="true" />
        <span className={`${styles.orb} ${styles.orb1}`} aria-hidden="true" />
        <span className={`${styles.orb} ${styles.orb2}`} aria-hidden="true" />
        <span className={`${styles.orb} ${styles.orb3}`} aria-hidden="true" />
        <h1 className={styles.heroHeading}>{heading}</h1>
        <p className={styles.heroSub}>{subheading}</p>
      </header>

      <section className={styles.contentGrid}>
        {/* LEFT: form */}
        <div className={`${styles.formCard} ${styles.reveal}`}>
          <h2 className={styles.cardTitle}>Contact Form</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.row2}>
              <div className={styles.field}>
                <label htmlFor="cf-name">Name</label>
                <input
                  id="cf-name"
                  name="name"
                  type="text"
                  placeholder="Your name"
                  value={form.name}
                  onChange={handleChange}
                  aria-invalid={!!errors.name}
                />
                {errors.name && <span className={styles.error}>{errors.name}</span>}
              </div>

              <div className={styles.field}>
                <label htmlFor="cf-email">Email</label>
                <input
                  id="cf-email"
                  name="email"
                  type="email"
                  placeholder="Your email"
                  value={form.email}
                  onChange={handleChange}
                  aria-invalid={!!errors.email}
                />
                {errors.email && <span className={styles.error}>{errors.email}</span>}
              </div>
            </div>

            <div className={styles.field}>
              <label htmlFor="cf-phone">Phone (optional)</label>
              <input
                id="cf-phone"
                name="phone"
                type="tel"
                placeholder="Your phone"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className={styles.field}>
              <label htmlFor="cf-message">Message</label>
              <textarea
                id="cf-message"
                name="message"
                rows={6}
                placeholder="Type your message..."
                value={form.message}
                onChange={handleChange}
                aria-invalid={!!errors.message}
              />
              {errors.message && <span className={styles.error}>{errors.message}</span>}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={status === "sending"}>
              {status === "sending" ? "Sending" : status === "sent" ? "Sent" : "Submit"}
              {status !== "sending" && (
                <svg viewBox="0 0 24 24" className={styles.submitArrow} aria-hidden="true">
                  <path d="M5 12h14M13 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              )}
            </button>

            {status === "sent" && (
              <p className={styles.successNote} role="status">
                <span className={styles.successIcon} aria-hidden="true">
                  <svg viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M7 12.5l3.2 3.2L17 9" />
                  </svg>
                </span>
                Thanks! Your message is in — we'll get back to you soon.
              </p>
            )}
          </form>

          <div className={styles.noteBox}>
            <p>We aim to respond to all inquiries within 24 hours.</p>
            <p>Looking forward to connecting with you!</p>
          </div>
        </div>

        {/* RIGHT: map on top, details + socials below */}
        <aside className={styles.mapSide}>
          <div className={`${styles.mapCard} ${styles.reveal} ${styles.revealDelay1}`}>
            <iframe
              src={mapEmbedSrc}
              title="Office location map"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className={styles.map}
            />
            <span className={styles.mapPulse} aria-hidden="true" />
          </div>

          <div className={`${styles.detailsCard} ${styles.reveal} ${styles.revealDelay2}`}>
            <h2 className={styles.cardTitle}>Our Contact Details</h2>

            <ul className={styles.detailsList}>
              {phones.map((phone, i) => (
                <li key={phone} style={{ animationDelay: `${0.35 + i * 0.08}s` }}>
                  <a href={`tel:${phone.replace(/\s+/g, "")}`} className={styles.detailRow}>
                    <span className={styles.detailIcon}>{ICONS.phone}</span>
                    {phone}
                  </a>
                </li>
              ))}
              <li style={{ animationDelay: `${0.35 + phones.length * 0.08}s` }}>
                <a href={`mailto:${email}`} className={styles.detailRow}>
                  <span className={styles.detailIcon}>{ICONS.mail}</span>
                  {email}
                </a>
              </li>
              <li style={{ animationDelay: `${0.35 + (phones.length + 1) * 0.08}s` }}>
                <span className={`${styles.detailRow} ${styles.address}`}>
                  <span className={styles.detailIcon}>{ICONS.pin}</span>
                  {address}
                </span>
              </li>
            </ul>

            <div className={styles.socialRow}>
              {socials.map((social, i) => (
                <a
                  key={social.icon}
                  href={social.href}
                  aria-label={social.label}
                  className={styles.socialBtn}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ animationDelay: `${0.6 + i * 0.08}s` }}
                >
                  {ICONS[social.icon]}
                </a>
              ))}
            </div>
          </div>
        </aside>
      </section>
    </div>
  );
};

export default ContactPage;