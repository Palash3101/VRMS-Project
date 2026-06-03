'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './TopBar.module.css';

export interface NavItem {
  label: string;
  href: string;
}

interface TopBarProps {
  navItems: NavItem[];
  userName?: string;
  userInitial?: string;
}

export default function TopBar({
  navItems,
  userName = 'User',
  userInitial = 'U',
}: TopBarProps) {
  const pathname = usePathname();

  return (
    <header className={styles.bar}>
      <div className={styles.inner}>

        {/* Left — wordmark + nav */}
        <div className={styles.left}>
          <Link href="/" className={styles.wordmark} aria-label="VRMS home">
            <span className={styles.accent}>V</span>RMS
          </Link>

          <nav className={styles.nav} aria-label="Primary navigation">
            {navItems.map((item) => {
              // exact match for root portal pages (e.g. /admin), prefix match for children
              const isActive =
                item.href.split('/').length <= 2
                  ? pathname === item.href
                  : pathname === item.href || pathname.startsWith(item.href + '/');

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Right — bell + avatar */}
        <div className={styles.right}>
          <button className={styles.iconBtn} aria-label="Notifications">
            <BellIcon />
            {/* TODO: API — replace count with /api/notifications/unread-count */}
            <span className={styles.notifBadge} aria-label="3 unread notifications">3</span>
          </button>

          <button className={styles.avatar} aria-label={`Account: ${userName}`}>
            {userInitial}
          </button>
        </div>

      </div>
    </header>
  );
}

function BellIcon() {
  return (
    <svg
      width="17"
      height="17"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}