

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./login.module.css";

export default function LoginPage() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: wire up auth logic
    console.log({ identifier, password });
  };

  return (
    <div className={styles.page}>
      {/* ── Left Panel: Form ── */}
      <div className={styles.formPanel}>
        <div className={styles.formInner}>
          {/* Logo */}
          <Link href="/" className={styles.logo}>
            <span className={styles.logoMark}>V</span>
            <span className={styles.logoText}>VRMS</span>
          </Link>

          {/* Heading */}
          <div className={styles.heading}>
            <p className={styles.eyebrow}>Welcome back</p>
            <h1 className={styles.title}>Sign in to<br />your workspace</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="identifier">
                Email or Username
              </label>
              <input
                id="identifier"
                type="text"
                className={styles.input}
                placeholder="you@company.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <div className={styles.labelRow}>
                <label className={styles.label} htmlFor="password">
                  Password
                </label>
                <Link href="/forgot-password" className={styles.forgotLink}>
                  Forgot password?
                </Link>
              </div>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className={styles.eyeBtn}
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            <button type="submit" className={styles.submitBtn}>
              Sign In
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Footer */}
          <p className={styles.switchText}>
            Don&apos;t have an account?{" "}
            <Link href="/register" className={styles.switchLink}>
              Get started
            </Link>
          </p>

          <p className={styles.terms}>
            By continuing, you agree to our{" "}
            <Link href="/terms" className={styles.termsLink}>Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className={styles.termsLink}>Privacy Policy</Link>
          </p>
        </div>
      </div>

      {/* ── Right Panel: Editorial Visual ── */}
      <div className={styles.visualPanel}>
        <div className={styles.visualContent}>
          <div className={styles.accentBar} />
          <blockquote className={styles.quote}>
            "The right vendor, at the right time, makes everything possible."
          </blockquote>
          <p className={styles.quoteAttr}>— Built for modern procurement teams</p>

          {/* Floating stat cards */}
          <div className={styles.statCards}>
            <div className={styles.statCard}>
              <span className={styles.statNum}>4,200+</span>
              <span className={styles.statLabel}>Verified Vendors</span>
            </div>
            <div className={`${styles.statCard} ${styles.statCardAccent}`}>
              <span className={styles.statNum}>98%</span>
              <span className={styles.statLabel}>Fulfilment Rate</span>
            </div>
            <div className={styles.statCard}>
              <span className={styles.statNum}>$2.4B</span>
              <span className={styles.statLabel}>GMV Managed</span>
            </div>
          </div>
        </div>

        {/* Decorative grid lines */}
        <div className={styles.gridLines} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.gridLine} />
          ))}
        </div>
      </div>
    </div>
  );
}