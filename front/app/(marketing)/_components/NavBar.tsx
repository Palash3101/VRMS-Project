'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import s from '../page.module.css'

const NAV_LINKS = [
  { href: '#features', label: 'Features'      },
  { href: '#how',      label: 'How it works'  },
  { href: '#pricing',  label: 'Pricing'       },
  { href: '#',         label: 'Docs'          },
] as const

export default function NavBar() {
  const [stuck,    setStuck]    = useState(false)
  const [activeId, setActiveId] = useState<string>('features')

  /* ── Sticky on scroll ─────────────────────────────────── */
  useEffect(() => {
    const onScroll = () => setStuck(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  /* ── Active section tracking ──────────────────────────── */
  useEffect(() => {
    const sections = document.querySelectorAll<HTMLElement>('section[id]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActiveId(e.target.id)
        })
      },
      { threshold: 0.4 },
    )
    sections.forEach((s) => obs.observe(s))
    return () => obs.disconnect()
  }, [])

  return (
    <header
      className={[s.nav, stuck ? s.navStuck : ''].join(' ')}
      role="banner"
    >
      <div className={`${s.wrap} ${s.navInner}`}>
        <Link href="/" className={s.navLogo}>
          VRMS<span className={s.accent}>.</span>
        </Link>

        <nav className={s.navPill} aria-label="Primary links">
          {NAV_LINKS.map(({ href, label }) => {
            const id = href.replace('#', '')
            return (
              <Link
                key={href}
                href={href}
                className={activeId === id ? s.navPillActive : ''}
              >
                {label}
              </Link>
            )
          })}
        </nav>

        <div className={s.navRight}>
          <Link href="/login" className={s.navLogin}>
            Sign in
          </Link>
          <Link href="/demo" className={s.navCta}>
            Book a demo
          </Link>
        </div>
      </div>
    </header>
  )
}
