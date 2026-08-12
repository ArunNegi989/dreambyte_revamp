"use client";

import React, { useState } from "react";
import styles from "./Contactpage.module.css";
import { submitContactForm } from "@/lib/api/contact";
import { subscribeNewsletter } from "@/lib/api/newsletter";

interface ContactItem {
  icon: "phone" | "mail" | "pin";
  title: string;
  value: string;
  href?: string;
}

interface ContactPageProps {
  heroTitle?: string;
  heroSubtitle?: string;
  introHeading?: string;
  introText?: string;
  contactItems?: ContactItem[];
  mapEmbedSrc?: string;
  mapLabel?: string;
  newsletterHeading?: string;
  newsletterSub?: string;
  onNewsletterSubmit?: (email: string) => Promise<void> | void;
}

const DEFAULT_ITEMS: ContactItem[] = [
  {
    icon: "phone",
    title: "Call Us",
    value: "+91 8278720490",
    href: "tel:+918278720490",
  },
  {
    icon: "mail",
    title: "Email Us",
    value: "hr@dreambytesolution.com",
    href: "mailto:hr@dreambytesolution.com",
  },
  {
    icon: "pin",
    title: "Visit Us",
    value:
      "3rd Floor, above Bank of India, Sahastradhara Road, Near IT Park, Dehradun, Uttarakhand",
  },
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
};

const ContactPage: React.FC<ContactPageProps> = ({
  heroTitle = "Contact Us",
  heroSubtitle = "We'd love to hear about your project — reach out and let's build something great together.",
  introHeading = "Get In Touch",
  introText = "Have a project in mind or just want to say hello? Fill out the form and our team will get back to you within 24 hours.",
  contactItems = DEFAULT_ITEMS,
  mapEmbedSrc = "https://www.google.com/maps?q=Dream+Byte+Solutions+Sahastradhara+Road+Dehradun&output=embed",
  mapLabel = "Dream Byte Solutions, Dehradun",
  newsletterHeading = "Keep Updated About Our Services",
  newsletterSub = "Subscribe to get the latest updates, offers and news from Dream Byte Solutions.",
  onNewsletterSubmit,
}) => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [newsEmail, setNewsEmail] = useState("");
  const [newsStatus, setNewsStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle"
  );
  const [newsErrorMsg, setNewsErrorMsg] = useState("");

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
    if (!form.subject.trim()) next.subject = "Please add a subject.";
    if (!form.message.trim()) next.message = "Please add a short message.";
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setStatus("sending");
    setErrorMsg("");
    try {
      await submitContactForm(form);
      setStatus("sent");
      setForm({ name: "", email: "", subject: "", message: "" });
      window.setTimeout(() => setStatus("idle"), 5000);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Failed to send message. Please try again.");
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!newsEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newsEmail)) {
      setNewsStatus("error");
      setNewsErrorMsg("Please enter a valid email address.");
      window.setTimeout(() => setNewsStatus("idle"), 4000);
      return;
    }

    setNewsStatus("sending");
    setNewsErrorMsg("");

    try {
      if (onNewsletterSubmit) {
        await onNewsletterSubmit(newsEmail);
      } else {
        await subscribeNewsletter(newsEmail);
      }
      setNewsStatus("sent");
      setNewsEmail("");
      window.setTimeout(() => setNewsStatus("idle"), 4000);
    } catch (err) {
      setNewsStatus("error");
      setNewsErrorMsg(
        err instanceof Error ? err.message : "Failed to subscribe. Please try again."
      );
      window.setTimeout(() => setNewsStatus("idle"), 4000);
    }
  };

  return (
    <div className={styles.page}>
      {/* ---------------- Hero ---------------- */}
      <header className={styles.hero}>
        <span className={styles.heroDots} aria-hidden="true" />
        <span className={`${styles.orb} ${styles.orb1}`} aria-hidden="true" />
        <span className={`${styles.orb} ${styles.orb2}`} aria-hidden="true" />
        <span className={styles.heroTag}>We&apos;re here to help</span>
        <h1 className={styles.heroTitle}>{heroTitle}</h1>
        <p className={styles.heroSubtitle}>{heroSubtitle}</p>
      </header>

      {/* ---------------- Get In Touch ---------------- */}
      <section className={styles.getInTouch}>
        {/* LEFT: info */}
        <div className={styles.infoCol}>
          <span className={styles.infoTag}>Contact</span>
          <h2 className={styles.infoHeading}>{introHeading}</h2>
          <p className={styles.infoText}>{introText}</p>

          <ul className={styles.itemList}>
            {contactItems.map((item, i) => {
              const content = (
                <>
                  <span className={styles.itemIcon}>{ICONS[item.icon]}</span>
                  <span className={styles.itemText}>
                    <span className={styles.itemTitle}>{item.title}</span>
                    <span className={styles.itemValue}>{item.value}</span>
                  </span>
                </>
              );
              return (
                <li
                  key={`${item.title}-${i}`}
                  className={styles.itemRow}
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  {item.href ? (
                    <a href={item.href} className={styles.itemLink}>
                      {content}
                    </a>
                  ) : (
                    <div className={styles.itemLink}>{content}</div>
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* RIGHT: form */}
        <div className={styles.formCard}>
          {status === "sent" ? (
            <div className={styles.successState} role="status">
              <div className={styles.successIconWrap}>
                <svg className={styles.successCircle} viewBox="0 0 52 52">
                  <circle className={styles.successCircleBg} cx="26" cy="26" r="24" fill="none" />
                  <path className={styles.successCheck} fill="none" d="M14 27l7 7 16-16" />
                </svg>
                <span className={styles.successPulse} aria-hidden="true" />
              </div>
              <h3 className={styles.successStateTitle}>Message sent!</h3>
              <p className={styles.successStateBody}>
                Thanks for reaching out — our team will get back to you within 24 hours.
              </p>
              <button
                type="button"
                className={styles.sendAnotherBtn}
                onClick={() => setStatus("idle")}
              >
                Send another message
              </button>
            </div>
          ) : (
            <>
              <h3 className={styles.formTitle}>Your Details</h3>

              <form onSubmit={handleSubmit} noValidate>
                {status === "error" && (
                  <p className={styles.formErrorBanner} role="alert">
                    {errorMsg}
                  </p>
                )}

                <div className={styles.row2}>
                  <div className={styles.field}>
                    <label htmlFor="cf-name">Name *</label>
                    <input
                      id="cf-name"
                      name="name"
                      type="text"
                      placeholder="Your Name"
                      value={form.name}
                      onChange={handleChange}
                      aria-invalid={!!errors.name}
                    />
                    {errors.name && (
                      <span className={styles.error}>{errors.name}</span>
                    )}
                  </div>

                  <div className={styles.field}>
                    <label htmlFor="cf-email">Email Address *</label>
                    <input
                      id="cf-email"
                      name="email"
                      type="email"
                      placeholder="Your Email"
                      value={form.email}
                      onChange={handleChange}
                      aria-invalid={!!errors.email}
                    />
                    {errors.email && (
                      <span className={styles.error}>{errors.email}</span>
                    )}
                  </div>
                </div>

                <div className={styles.field}>
                  <label htmlFor="cf-subject">Subject *</label>
                  <input
                    id="cf-subject"
                    name="subject"
                    type="text"
                    placeholder="Message Subject"
                    value={form.subject}
                    onChange={handleChange}
                    aria-invalid={!!errors.subject}
                  />
                  {errors.subject && (
                    <span className={styles.error}>{errors.subject}</span>
                  )}
                </div>

                <div className={styles.field}>
                  <label htmlFor="cf-message">Comments / Questions *</label>
                  <textarea
                    id="cf-message"
                    name="message"
                    rows={4}
                    placeholder="Your Message"
                    value={form.message}
                    onChange={handleChange}
                    aria-invalid={!!errors.message}
                  />
                  {errors.message && (
                    <span className={styles.error}>{errors.message}</span>
                  )}
                </div>

                <button
                  type="submit"
                  className={styles.submitBtn}
                  disabled={status === "sending"}
                >
                  {status === "sending" ? "Sending..." : "Send Message"}
                  {status !== "sending" && (
                    <svg
                      viewBox="0 0 24 24"
                      className={styles.submitArrow}
                      aria-hidden="true"
                    >
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </section>

      {/* ---------------- Map (padded card, not edge-to-edge) ---------------- */}
      <section className={styles.mapSection}>
        <div className={styles.mapCard}>
          <iframe
            src={mapEmbedSrc}
            title="Office location map"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className={styles.map}
          />
          <div className={styles.mapBadge}>
            <span className={styles.mapPulse} aria-hidden="true" />
            <span className={styles.mapBadgeText}>{mapLabel}</span>
          </div>
        </div>
      </section>

      {/* ---------------- Newsletter ---------------- */}
      <section className={styles.newsletterWrap}>
        <div className={styles.newsletter}>
          <span className={styles.newsletterDots} aria-hidden="true" />
          <div className={styles.newsletterInner}>
            <div className={styles.newsletterText}>
              <h3>{newsletterHeading}</h3>
              <p>{newsletterSub}</p>
            </div>

            <div className={styles.newsletterFormWrap}>
              <form
                className={styles.newsletterForm}
                onSubmit={handleNewsletterSubmit}
                noValidate
              >
                <input
                  type="email"
                  placeholder="Your email address"
                  value={newsEmail}
                  onChange={(e) => setNewsEmail(e.target.value)}
                  aria-label="Email address"
                  aria-invalid={newsStatus === "error"}
                />
                <button type="submit" disabled={newsStatus === "sending"}>
                  {newsStatus === "sending"
                    ? "..."
                    : newsStatus === "sent"
                    ? "Subscribed ✓"
                    : "Submit"}
                </button>
              </form>
              {newsStatus === "error" && (
                <span className={styles.newsletterError} role="alert">
                  {newsErrorMsg}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;