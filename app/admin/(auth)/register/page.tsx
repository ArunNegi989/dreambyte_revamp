"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiUser,
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheck,
  FiShield,
} from "react-icons/fi";
import styles from "../Authpage.module.css";
import { checkRegisterStatus, registerAdmin } from "@/lib/api/auth";

export default function RegisterPage() {
  const router = useRouter();

  const [checkingStatus, setCheckingStatus] = useState(true);
  const [adminExists, setAdminExists] = useState<boolean | null>(null); // null = not known yet
  const [statusError, setStatusError] = useState(false);
  const [success, setSuccess] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    checkRegisterStatus()
      .then((exists) => {
        setAdminExists(exists);
        setStatusError(false);
      })
      .catch((err) => {
        console.error("Failed to check register status:", err);
        setStatusError(true);
      })
      .finally(() => setCheckingStatus(false));
  }, []);

  function validate() {
    const newErrors: Record<string, string> = {};
    if (!name.trim()) newErrors.name = "Name is required";
    if (!email.trim()) newErrors.email = "Email is required";
    if (password.length < 8) newErrors.password = "Minimum 8 characters required";
    else if (!/\d/.test(password) || !/[A-Z]/.test(password))
      newErrors.password = "Include 1 uppercase letter & 1 number";
    if (password !== confirmPassword) newErrors.confirmPassword = "Passwords do not match";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setSubmitting(true);
    try {
      await registerAdmin({ name, email, password });
      setSuccess(true);
      // after registering, send to login page — not straight to dashboard
      setTimeout(() => router.push("/admin/login"), 1200);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : "Registration failed" });
    } finally {
      setSubmitting(false);
    }
  }

  const BrandSide = (
    <div className={styles.brandPanel}>
      <div className={styles.brandGrid} aria-hidden="true" />
      <span className={`${styles.floatShape} ${styles.floatShapeOne}`}>{"{ }"}</span>
      <span className={`${styles.floatShape} ${styles.floatShapeTwo}`}>{"</>"}</span>
      <span className={`${styles.floatShape} ${styles.floatShapeThree}`}>✦</span>

      <div className={styles.brandContent}>
        <Link href="/" className={styles.logoLink}>
          <Image
            src="/assets/logo.png"
            alt="Dream Byte Solutions"
            width={36}
            height={36}
            className={styles.logoMark}
          />
          <span className={styles.logoText}>
            Dream Byte
            <br />
            Solutions
          </span>
        </Link>

        <div className={styles.brandImageWrap}>
          <Image
            src="/assets/admin-illustration.jpg"
            alt="Admin dashboard preview"
            fill
            className={styles.brandImage}
          />
        </div>

        <div className={styles.brandCopy}>
          <h1 className={styles.brandTitle}>
            One-time setup for your <span className={styles.brandAccent}>admin account</span>
          </h1>
          <p className={styles.brandSub}>
            This registration is available only once. After this, all further logins go through
            the secure login page.
          </p>
        </div>

        <dl className={styles.brandStats}>
          <div>
            <dt>1</dt>
            <dd>Admin Only</dd>
          </div>
          <div>
            <dt>JWT</dt>
            <dd>Secure Sessions</dd>
          </div>
          <div>
            <dt>100%</dt>
            <dd>Encrypted</dd>
          </div>
        </dl>
      </div>
    </div>
  );

  if (checkingStatus) {
    return (
      <div className={styles.page}>
        {BrandSide}
        <div className={styles.formPanel}>
          <p style={{ color: "var(--text-muted)" }}>Checking registration status...</p>
        </div>
      </div>
    );
  }

  // Network/API error case — we don't actually know if an admin exists,
  // so don't show "closed", show an error so it's easy to debug
  if (statusError) {
    return (
      <div className={styles.page}>
        {BrandSide}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <FiShield size={26} />
              </div>
              <h2 className={styles.formTitle}>Couldn&apos;t reach server</h2>
              <p className={styles.formSub}>
                Could not connect to the backend. Check that NEXT_PUBLIC_API_URL is set
                correctly and the backend is running, then reload the page.
              </p>
              <button className={styles.submitBtn} onClick={() => window.location.reload()}>
                Retry <FiArrowRight className={styles.btnArrow} size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (adminExists) {
    return (
      <div className={styles.page}>
        {BrandSide}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <FiShield size={26} />
              </div>
              <h2 className={styles.formTitle}>Registration Closed</h2>
              <p className={styles.formSub}>
                An admin account already exists for this workspace. Please sign in instead.
              </p>
              <button className={styles.submitBtn} onClick={() => router.push("/admin/login")}>
                Go to Login <FiArrowRight className={styles.btnArrow} size={17} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.page}>
        {BrandSide}
        <div className={styles.formPanel}>
          <div className={styles.formCard}>
            <div className={styles.successState}>
              <div className={styles.successIcon}>
                <FiCheck size={26} />
              </div>
              <h2 className={styles.formTitle}>Account Created</h2>
              <p className={styles.formSub}>Redirecting you to login...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      {BrandSide}

      <div className={styles.formPanel}>
        <div className={styles.formCard}>
          <div className={styles.mobileLogo}>
            <Image
              src="/assets/logo.png"
              alt="Dream Byte Solutions"
              width={30}
              height={30}
              className={styles.logoMark}
            />
            <span className={styles.mobileLogoText}>
              Dream Byte
              <br />
              Solutions
            </span>
          </div>

          <h2 className={styles.formTitle}>Create Admin Account</h2>
          <p className={styles.formSub}>This is a one-time setup for your workspace.</p>

          {errors.form && <div className={styles.errorText} style={{ marginBottom: "16px" }}>{errors.form}</div>}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label className={styles.fieldLabel}>Full Name</label>
              </div>
              <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ""}`}>
                <span className={styles.inputIcon}>
                  <FiUser size={17} />
                </span>
                <input
                  type="text"
                  className={styles.input}
                  placeholder="Arun Negi"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  autoComplete="name"
                />
              </div>
              {errors.name && <span className={styles.errorText}>{errors.name}</span>}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label className={styles.fieldLabel}>Email</label>
              </div>
              <div className={`${styles.inputWrap} ${errors.email ? styles.inputError : ""}`}>
                <span className={styles.inputIcon}>
                  <FiMail size={17} />
                </span>
                <input
                  type="email"
                  className={styles.input}
                  placeholder="admin@dreambytesolution.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label className={styles.fieldLabel}>Password</label>
              </div>
              <div className={`${styles.inputWrap} ${errors.password ? styles.inputError : ""}`}>
                <span className={styles.inputIcon}>
                  <FiLock size={17} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="Min 8 chars, 1 uppercase, 1 number"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className={styles.eyeToggle}
                  onClick={() => setShowPassword((p) => !p)}
                  tabIndex={-1}
                >
                  {showPassword ? <FiEyeOff size={17} /> : <FiEye size={17} />}
                </button>
              </div>
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabelRow}>
                <label className={styles.fieldLabel}>Confirm Password</label>
              </div>
              <div className={`${styles.inputWrap} ${errors.confirmPassword ? styles.inputError : ""}`}>
                <span className={styles.inputIcon}>
                  <FiLock size={17} />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              {errors.confirmPassword && (
                <span className={styles.errorText}>{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Create Admin <FiArrowRight className={styles.btnArrow} size={17} />
                </>
              )}
            </button>
          </form>

          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link href="/admin/login" className={styles.switchLink}>
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}