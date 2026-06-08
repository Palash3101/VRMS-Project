

"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "./register.module.css";
import { useRouter } from "next/navigation";

type Role = "vendor" | "customer" | null;

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<Role>(null);
  const router = useRouter();
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!role) return;

    if (role === "vendor") {
      // Pass basic details via URL so vendor form can pre-fill email
      router.push(
        `/register/vendor?email=${encodeURIComponent(email)}&username=${encodeURIComponent(username)}`
      );
      return;
    }

    // Customer registration — TODO: wire API
    console.log({ email, username, password, role });
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
            <p className={styles.eyebrow}>Create your account</p>
            <h1 className={styles.title}>Get started<br />with VRMS</h1>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
              <label className={styles.label} htmlFor="email">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                className={styles.input}
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="username">
                Username
              </label>
              <input
                id="username"
                type="text"
                className={styles.input}
                placeholder="your_handle"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                autoComplete="username"
              />
            </div>

            <div className={styles.field}>
              <label className={styles.label} htmlFor="password">
                Password
              </label>
              <div className={styles.passwordWrapper}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.input}
                  placeholder="Min. 8 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  minLength={8}
                  autoComplete="new-password"
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

            {/* Role selector */}
            <div className={styles.field}>
              <label className={styles.label}>I am a&hellip;</label>
              <div className={styles.roleGrid}>
                <button
                  type="button"
                  className={`${styles.roleCard} ${role === "vendor" ? styles.roleCardActive : ""}`}
                  onClick={() => setRole("vendor")}
                >
                  <div className={styles.roleIcon}>
                    {/* Vendor: building/store icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <polyline points="9 22 9 12 15 12 15 22" />
                    </svg>
                  </div>
                  <span className={styles.roleTitle}>Vendor</span>
                  <span className={styles.roleDesc}>List &amp; manage your services</span>
                  {role === "vendor" && (
                    <span className={styles.roleCheck}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>

                <button
                  type="button"
                  className={`${styles.roleCard} ${role === "customer" ? styles.roleCardActive : ""}`}
                  onClick={() => setRole("customer")}
                >
                  <div className={styles.roleIcon}>
                    {/* Customer: person/user icon */}
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
                      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                      <circle cx="12" cy="7" r="4" />
                    </svg>
                  </div>
                  <span className={styles.roleTitle}>Customer</span>
                  <span className={styles.roleDesc}>Browse &amp; procure resources</span>
                  {role === "customer" && (
                    <span className={styles.roleCheck}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                    </span>
                  )}
                </button>
              </div>
              {!role && (
                <p className={styles.roleHint}>Select your account type to continue</p>
              )}
            </div>

            <button
              type="submit"
              className={`${styles.submitBtn} ${!role ? styles.submitBtnDisabled : ""}`}
              disabled={!role}
            >
              Create Account
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </button>
          </form>

          {/* Footer */}
          <p className={styles.switchText}>
            Already have an account?{" "}
            <Link href="/login" className={styles.switchLink}>
              Sign in
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
          <h2 className={styles.panelHeading}>
            One platform.<br />Every resource.
          </h2>
          <p className={styles.panelSub}>
            Whether you&apos;re sourcing or supplying, VRMS connects procurement teams with verified vendors at scale.
          </p>

          {/* Feature list */}
          <ul className={styles.featureList}>
            {[
              "Real-time vendor availability tracking",
              "End-to-end contract management",
              "Automated compliance verification",
              "Smart procurement workflows",
            ].map((item, i) => (
              <li key={i} className={styles.featureItem}>
                <span className={styles.featureDot} />
                {item}
              </li>
            ))}
          </ul>
        </div>

        {/* Decorative grid lines */}
        <div className={styles.gridLines} aria-hidden="true">
          {[...Array(6)].map((_, i) => (
            <div key={i} className={styles.gridLine} />
          ))}
        </div>

        {/* Bottom corner accent */}
        <div className={styles.cornerAccent} aria-hidden="true" />
      </div>
    </div>
  );
}