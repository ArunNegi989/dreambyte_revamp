'use client';

import React, { useState, useRef } from 'react';
import Link from 'next/link';
import styles from './JobDetail.module.css';
import type { Career } from '@/types/career';
import { submitApplication } from '@/lib/api/applications';
import { formatDisplayDate } from '@/lib/formatDate';

const HR_EMAIL = 'hr@dreambytesolution.com';
const PHONES = ['+91 8279720490', '+91 9258332639'];
const ADDRESS = '3rd Floor, above Bank of India, Sahastradhara Road, Near IT Park, Dehradun, Uttarakhand';

interface JobDetailProps {
  role: Career;
}

function OverviewIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16M4 12h16M4 18h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}
function TasksIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 6h11M9 12h11M9 18h11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M4 6l.01.01M4 12l.01.01M4 18l.01.01" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
function CheckBadgeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M9 12.5l2 2 4-4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}
function UploadIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
      <path d="M12 15V4M12 4l-4 4M12 4l4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 16v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export default function JobDetail({ role }: JobDetailProps) {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>('');
  const [isDragging, setIsDragging] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToForm = () => {
    document.getElementById('apply-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const acceptFile = (file: File | null | undefined) => {
    if (!file) return;
    if (file.type !== 'application/pdf') {
      setError('Please upload a PDF file only');
      return;
    }
    setError('');
    setResumeFile(file);
    setFileName(file.name);
    if (fileInputRef.current) {
      const dt = new DataTransfer();
      dt.items.add(file);
      fileInputRef.current.files = dt.files;
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    acceptFile(e.target.files?.[0]);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    acceptFile(e.dataTransfer.files?.[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!resumeFile) {
      setError('Please upload your resume (PDF)');
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication({
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.message,
        slug: role.slug,
        jobTitle: role.title,
        resume: resumeFile,
      });
      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className={`${styles.page} ${styles[`dept${role.dept}`]}`}>
      {/* ---------------- BREADCRUMB ---------------- */}
      <div className={styles.breadcrumbBar}>
        <Link href="/career" className={styles.breadcrumbLink}>
          <span className={styles.breadcrumbArrow}>←</span> Back to all roles
        </Link>
      </div>

      {/* ---------------- HERO ---------------- */}
      <section className={styles.hero}>
        <div className={styles.heroGrid} aria-hidden="true" />
        <div className={styles.heroInner}>
          <span className={styles.deptPill}>{role.dept}</span>
          <h1 className={styles.title}>{role.title}</h1>
          <p className={styles.tagline}>{role.tagline}</p>
          <div className={styles.metaRow}>
            <span className={styles.metaChip}>{role.type}</span>
            <span className={styles.metaChip}>{role.location}</span>
            <span className={styles.metaChip}>Posted {formatDisplayDate(role.date)}</span>
          </div>
          <button className={styles.primaryBtn} onClick={scrollToForm}>
            Apply for this role<span className={styles.btnArrow}>↓</span>
          </button>
        </div>
      </section>

      {/* ---------------- BODY ---------------- */}
      <div className={styles.layout}>
        <main className={styles.main}>
          <section className={styles.card}>
            <h2 className={styles.cardTitle}><span className={styles.iconChip}><OverviewIcon /></span>Position Overview</h2>
            <p className={styles.cardBody}>{role.overview}</p>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}><span className={styles.iconChip}><TasksIcon /></span>Key Responsibilities</h2>
            <ul className={styles.list}>
              {role.responsibilities.map((item, i) => (<li key={i} className={styles.listItem}>{item}</li>))}
            </ul>
          </section>

          <section className={styles.card}>
            <h2 className={styles.cardTitle}><span className={styles.iconChip}><CheckBadgeIcon /></span>Qualifications &amp; Experience</h2>
            <ul className={styles.list}>
              {role.qualifications.map((item, i) => (<li key={i} className={styles.listItem}>{item}</li>))}
            </ul>
          </section>

          <div className={styles.jdFooterCta}>
            <p className={styles.jdFooterText}>Like what you read?</p>
            <button className={styles.primaryBtnSmall} onClick={scrollToForm}>
              Apply now<span className={styles.btnArrow}>→</span>
            </button>
          </div>
        </main>

        <aside className={styles.aside}>
          <div className={styles.stickyStack}>
            <div className={styles.ticketCard}>
              <div className={styles.ticketTop}>
                <h3 className={styles.factsTitle}>Quick facts</h3>
                <dl className={styles.factsList}>
                  <div className={styles.factRow}><dt>Department</dt><dd>{role.dept}</dd></div>
                  <div className={styles.factRow}><dt>Type</dt><dd>{role.type}</dd></div>
                  <div className={styles.factRow}><dt>Location</dt><dd>{role.location}</dd></div>
                  <div className={styles.factRow}><dt>Posted</dt><dd>{formatDisplayDate(role.date)}</dd></div>
                </dl>
              </div>
              <div className={styles.ticketPerforation} aria-hidden="true">
                <span className={styles.ticketNotchLeft} />
                <span className={styles.ticketNotchRight} />
              </div>
              <div className={styles.ticketBottom}>
                <span className={styles.ticketLabel}>Ready when you are</span>
                <button className={styles.primaryBtn} onClick={scrollToForm} style={{ width: '100%' }}>
                  Apply now<span className={styles.btnArrow}>↓</span>
                </button>
              </div>
            </div>

            <div className={styles.contactCard}>
              <h3 className={styles.factsTitle}>Get In Touch</h3>
              <p className={styles.contactBlurb}>Questions about this role? Reach out directly and our HR team will get back to you.</p>
              <ul className={styles.contactList}>
                {PHONES.map((phone) => (
                  <li key={phone}>
                    <a href={`tel:${phone.replace(/\s+/g, '')}`}>
                      <span className={styles.contactIcon} aria-hidden="true">📞</span>{phone}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={`mailto:${HR_EMAIL}`}>
                    <span className={styles.contactIcon} aria-hidden="true">✉️</span>{HR_EMAIL}
                  </a>
                </li>
                <li className={styles.contactAddress}>
                  <span className={styles.contactIcon} aria-hidden="true">📍</span>{ADDRESS}
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>

      {/* ---------------- APPLICATION FORM ---------------- */}
      <section id="apply-form" className={styles.formSection}>
        <div className={styles.formHead}>
          <h2 className={styles.sectionTitle}>Apply for {role.title}</h2>
          <p className={styles.sectionSub}>Takes less than five minutes. We review every application.</p>
        </div>

        {submitted ? (
          <div className={styles.successCard} role="status">
            <div className={styles.successIconWrap}>
              <svg className={styles.successCircle} viewBox="0 0 52 52">
                <circle className={styles.successCircleBg} cx="26" cy="26" r="24" fill="none" />
                <path className={styles.successCheck} fill="none" d="M14 27l7 7 16-16" />
              </svg>
              <span className={styles.successPulse} aria-hidden="true" />
            </div>
            <h3 className={styles.successTitle}>Application received!</h3>
            <p className={styles.successBody}>
              Thanks for applying to {role.title}. Our team will reach out at {form.email || 'the email you shared'} if it&rsquo;s a fit.
            </p>
            <Link href="/career" className={styles.successBackBtn}>
              <span className={styles.breadcrumbArrow}>←</span> Back to all roles
            </Link>
          </div>
        ) : (
          <form className={styles.form} onSubmit={handleSubmit}>
            {error && (
              <div style={{ color: '#ff6b6b', fontSize: '0.85rem', gridColumn: '1 / -1' }}>{error}</div>
            )}

            <div className={styles.field}>
              <label htmlFor="name">Name</label>
              <input id="name" type="text" placeholder="Your name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label htmlFor="email">Email</label>
              <input id="email" type="email" placeholder="Your email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label htmlFor="phone">Phone</label>
              <input id="phone" type="tel" placeholder="Your phone" required value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>

            <div className={styles.field}>
              <label htmlFor="jobTitle">Job title</label>
              <input id="jobTitle" type="text" value={role.title} readOnly className={styles.readonlyField} />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor="message">About yourself*</label>
              <textarea id="message" placeholder="Tell us why you're a great fit for this role..." required rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
            </div>

            <div className={`${styles.field} ${styles.fieldFull}`}>
              <label htmlFor="resume">Upload resume (PDF only)*</label>
              <div
                className={`${styles.dropzone} ${isDragging ? styles.dropzoneActive : ''} ${fileName ? styles.dropzoneFilled : ''}`}
                onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
              >
                <span className={styles.dropzoneIcon} aria-hidden="true"><UploadIcon /></span>
                <span className={styles.dropzoneText}>
                  {fileName ? (<><strong>{fileName}</strong> selected — click to replace</>) : (<><strong>Drag &amp; drop</strong> your resume here, or click to browse</>)}
                </span>
                <input ref={fileInputRef} id="resume" type="file" accept="application/pdf" required className={styles.fileInputHidden} onChange={handleFileChange} />
              </div>
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? 'Submitting...' : (<>Submit application<span className={styles.btnArrow}>→</span></>)}
            </button>
          </form>
        )}
      </section>

      {/* ---------------- MOBILE STICKY APPLY BAR ---------------- */}
      <div className={styles.mobileBar}>
        <div className={styles.mobileBarText}>
          <span className={styles.mobileBarTitle}>{role.title}</span>
          <span className={styles.mobileBarMeta}>{role.type} · {role.location}</span>
        </div>
        <button className={styles.mobileBarBtn} onClick={scrollToForm}>
          Apply<span className={styles.btnArrow}>→</span>
        </button>
      </div>
    </div>
  );
}