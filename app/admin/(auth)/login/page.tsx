"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiShield,
} from "react-icons/fi";
import styles from "../Authpage.module.css";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    const newErrors: typeof errors = {};
    if (!email.trim()) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login(email, password);
      router.push("/admin");
    } catch (err) {
      setErrors({
        form: err instanceof Error ? err.message : "Login failed. Please try again.",
      });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.page}>
      {/* Left brand panel */}
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
              Manage your <span className={styles.brandAccent}>digital presence</span> from one place
            </h1>
            <p className={styles.brandSub}>
              Sign in to the admin dashboard to manage brands, careers, blogs, and client messages.
            </p>
          </div>

          <dl className={styles.brandStats}>
            <div>
              <dt>15+</dt>
              <dd>Live Projects</dd>
            </div>
            <div>
              <dt>3+</dt>
              <dd>Years Experience</dd>
            </div>
            <div>
              <dt>100%</dt>
              <dd>Secure Access</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Right form panel */}
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

          <h2 className={styles.formTitle}>Admin Login</h2>
          <p className={styles.formSub}>Enter your credentials to access the dashboard.</p>

          {errors.form && (
            <div className={styles.errorText} style={{ marginBottom: "16px" }}>
              <FiShield style={{ marginRight: "6px", verticalAlign: "middle" }} />
              {errors.form}
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form} noValidate>
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
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
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

            <button type="submit" className={styles.submitBtn} disabled={submitting}>
              {submitting ? (
                <span className={styles.spinner} />
              ) : (
                <>
                  Sign In <FiArrowRight className={styles.btnArrow} size={17} />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}