'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '../Authpage.module.css';

/* ------------------------------------------------------------------ */
/*  Icons                                                               */
/* ------------------------------------------------------------------ */

function EyeIcon({ off }: { off: boolean }) {
  return off ? (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M3 3l18 18M10.6 10.6a2.5 2.5 0 0 0 3.5 3.5M9.5 5.2C10.3 5.06 11.13 5 12 5c5 0 8.5 4 9.9 7-.5 1.08-1.2 2.2-2.1 3.2M6.6 6.6C4.6 8 3.1 9.9 2.1 12c1.4 3 4.9 7 9.9 7 1.13 0 2.19-.15 3.17-.44" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  ) : (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M2.1 12S5.6 5 12 5s9.9 7 9.9 7-3.5 7-9.9 7-9.9-7-9.9-7Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.6"/>
    </svg>
  );
}

function MailIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="5" width="18" height="14" rx="2.5" stroke="currentColor" strokeWidth="1.6"/>
      <path d="m4 6.5 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
  );
}

function LockIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.2" stroke="currentColor" strokeWidth="1.6"/>
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Validation                                                          */
/* ------------------------------------------------------------------ */

interface Errors {
  email?: string;
  password?: string;
}

function validate(email: string, password: string): Errors {
  const errors: Errors = {};
  if (!email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.email = 'Enter a valid email address.';
  }
  if (!password) {
    errors.password = 'Password is required.';
  } else if (password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
}

/* ------------------------------------------------------------------ */
/*  Page                                                                */
/* ------------------------------------------------------------------ */

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(false);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const nextErrors = validate(email, password);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setStatus('loading');
    // Wire this up to your real auth endpoint.
    setTimeout(() => {
      setStatus('success');
    }, 1200);
  };

  return (
    <div className={styles.page}>
      {/* -------- Brand panel -------- */}
      <aside className={styles.brandPanel}>
        <div className={styles.brandGrid} aria-hidden="true" />
        <span className={`${styles.floatShape} ${styles.floatShapeOne}`} aria-hidden="true">✦</span>
        <span className={`${styles.floatShape} ${styles.floatShapeTwo}`} aria-hidden="true">◍</span>
        <span className={`${styles.floatShape} ${styles.floatShapeThree}`} aria-hidden="true">❖</span>

        <div className={styles.brandContent}>
          <Link href="/" className={styles.logoLink}>
            <Image
              src="https://ui-avatars.com/api/?name=Dream+Byte&background=ffc145&color=050505&bold=true&size=128"
              alt="Dream Byte Solutions"
              width={40}
              height={40}
              className={styles.logoMark}
            />
            <span className={styles.logoText}>Dream Byte Solutions</span>
          </Link>

          <div className={styles.brandImageWrap}>
            <Image
              src="https://images.unsplash.com/photo-1763386599808-276b60c4bc76?fm=jpg&q=80&w=1200&auto=format&fit=crop"
              alt="Dream Byte Solutions"
              fill
              sizes="(max-width: 860px) 0px, 42vw"
              className={styles.brandImage}
              priority
            />
          </div>

          <div className={styles.brandCopy}>
            <h1 className={styles.brandTitle}>
              Your imagination. <span className={styles.brandAccent}>Our innovation.</span>
            </h1>
            <p className={styles.brandSub}>
              Sign in to manage your campaigns, projects, and everything else we&rsquo;re building
              together.
            </p>
          </div>

          <div className={styles.brandStats}>
            <div>
              <dt>50+</dt>
              <dd>Clients</dd>
            </div>
            <div>
              <dt>200+</dt>
              <dd>Projects</dd>
            </div>
          </div>
        </div>
      </aside>

      {/* -------- Form panel -------- */}
      <main className={styles.formPanel}>
        <div className={styles.formCard}>
          {status === 'success' ? (
            <div className={styles.successState}>
              <span className={styles.successIcon}>✓</span>
              <h2 className={styles.formTitle}>Welcome back!</h2>
              <p className={styles.formSub}>You&rsquo;ve signed in successfully.</p>
            </div>
          ) : (
            <>
              <div className={styles.mobileLogo}>
                <Image src="https://ui-avatars.com/api/?name=Dream+Byte&background=ffc145&color=050505&bold=true&size=128" alt="Dream Byte Solutions" width={34} height={34} className={styles.logoMark} />
                <span className={styles.mobileLogoText}>Dream Byte Solutions</span>
              </div>
              <h2 className={styles.formTitle}>Welcome back</h2>
              <p className={styles.formSub}>Log in to continue to your dashboard.</p>

              <form className={styles.form} onSubmit={handleSubmit} noValidate>
                <label className={styles.field}>
                  <span className={styles.fieldLabel}>Email address</span>
                  <span className={`${styles.inputWrap} ${errors.email ? styles.inputError : ''}`}>
                    <span className={styles.inputIcon}><MailIcon /></span>
                    <input
                      type="email"
                      name="email"
                      autoComplete="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={styles.input}
                    />
                  </span>
                  {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </label>

                <label className={styles.field}>
                  <span className={styles.fieldLabelRow}>
                    <span className={styles.fieldLabel}>Password</span>
                    <a href="#" className={styles.forgotLink}>Forgot password?</a>
                  </span>
                  <span className={`${styles.inputWrap} ${errors.password ? styles.inputError : ''}`}>
                    <span className={styles.inputIcon}><LockIcon /></span>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      autoComplete="current-password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={styles.input}
                    />
                    <button
                      type="button"
                      className={styles.eyeToggle}
                      onClick={() => setShowPassword((v) => !v)}
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <EyeIcon off={showPassword} />
                    </button>
                  </span>
                  {errors.password && <span className={styles.errorText}>{errors.password}</span>}
                </label>

                <label className={styles.checkboxRow}>
                  <input
                    type="checkbox"
                    checked={remember}
                    onChange={(e) => setRemember(e.target.checked)}
                    className={styles.checkbox}
                  />
                  <span>Remember me on this device</span>
                </label>

                <button type="submit" className={styles.submitBtn} disabled={status === 'loading'}>
                  {status === 'loading' ? (
                    <span className={styles.spinner} aria-hidden="true" />
                  ) : (
                    <>
                      Log in
                      <span className={styles.btnArrow}>→</span>
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <p className={styles.switchText}>
            New here?{' '}
            <Link href="/signup" className={styles.switchLink}>
              Create an account
            </Link>
          </p>
        </div>
      </main>
    </div>
  );
}