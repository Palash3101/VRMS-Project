'use client'

/**
 * TopBar.tsx — Shared dashboard navigation bar.
 * Week 5: promoted to 'use client' to support hamburger drawer state.
 * Layouts (admin/vendor/customer) remain server components, they just pass props.
 *
 * Props:
 *   navItems     NavItem[]   — role-specific links, NEVER hardcoded here
 *   userName?    string      — display name shown in avatar tooltip
 *   userInitial? string      — single char for avatar circle (default 'A')
 */

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './TopBar.module.css'

export interface NavItem {
  label: string
  href: string
}

interface TopBarProps {
  navItems: NavItem[]
  userName?: string
  userInitial?: string
}

export default function TopBar({
  navItems,
  userName,
  userInitial = 'A',
}: TopBarProps) {
  const pathname = usePathname()
  const [drawerOpen, setDrawerOpen] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Rule #10 — exact-match for portal roots (e.g. /admin must not be active on /admin/vendors)
  const isActive = (href: string) =>
    href.split('/').filter(Boolean).length <= 1
      ? pathname === href
      : pathname === href || pathname.startsWith(href + '/')

  // Close drawer when route changes (link was followed)
  useEffect(() => {
    setDrawerOpen(false)
  }, [pathname])

  // Prevent body scroll when drawer is open
  useEffect(() => {
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen])

  // Close on outside click (the hamburger button uses e.stopPropagation to avoid
  // immediately re-triggering this listener)
  useEffect(() => {
    if (!drawerOpen) return

    const handleOutsideClick = (e: MouseEvent) => {
      if (drawerRef.current && !drawerRef.current.contains(e.target as Node)) {
        setDrawerOpen(false)
      }
    }

    // Small delay so the same click that opened the drawer doesn't close it
    const timer = setTimeout(
      () => document.addEventListener('click', handleOutsideClick),
      10,
    )

    return () => {
      clearTimeout(timer)
      document.removeEventListener('click', handleOutsideClick)
    }
  }, [drawerOpen])

  // Close when resizing back to desktop
  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) setDrawerOpen(false)
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  return (
    <>
      {/* ── Top Bar ── */}
      <header className={styles.topBar}>
        <div className={styles.inner}>
          {/* Logo */}
          <Link href="/" className={styles.logo} aria-label="VRMS home">
            <span className={styles.logoMark}>V</span>
            <span className={styles.logoWordmark}>RMS</span>
          </Link>

          {/* Desktop nav — hidden on mobile */}
          <nav className={styles.nav} aria-label="Main navigation">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${
                  isActive(item.href) ? styles.navLinkActive : ''
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right cluster */}
          <div className={styles.rightCluster}>
            {/* Notification bell */}
            <button className={styles.iconBtn} aria-label="Notifications">
              <BellIcon />
              <span className={styles.bellDot} aria-hidden="true" />
            </button>

            {/* User avatar */}
            <div
              className={styles.avatar}
              title={userName}
              aria-label={`User: ${userName ?? 'Account'}`}
              role="img"
            >
              {userInitial}
            </div>

            {/* Hamburger — visible only on mobile (≤ 767px) */}
            <button
              className={styles.hamburger}
              onClick={(e) => {
                e.stopPropagation() // prevent outside-click listener from firing immediately
                setDrawerOpen((prev) => !prev)
              }}
              aria-label={drawerOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={drawerOpen}
              aria-controls="mobile-nav-drawer"
            >
              ☰
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile Drawer — slides from top ── */}
      {drawerOpen && (
        <div
          id="mobile-nav-drawer"
          ref={drawerRef}
          className={styles.drawer}
          role="navigation"
          aria-label="Mobile navigation"
        >
          {navItems.map((item, i) => (
            <Link
              key={item.href}
              href={item.href}
              className={`${styles.drawerLink} ${
                isActive(item.href) ? styles.drawerLinkActive : ''
              }`}
              style={{
                borderBottom:
                  i < navItems.length - 1
                    ? '1px solid var(--color-border)'
                    : 'none',
              }}
              onClick={() => setDrawerOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}

/* ── Inline SVG icons — no external deps ── */

function BellIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  )
}