import type { Metadata } from 'next'
import { Fraunces, DM_Sans } from 'next/font/google'
import './globals.css'

/* ── FONTS ──────────────────────────────────────────────────
   next/font self-hosts and injects CSS variables used in
   globals.css --font-display / --font-body via @theme.
──────────────────────────────────────────────────────────── */
const fraunces = Fraunces({
  subsets:  ['latin'],
  variable: '--font-fraunces',
  display:  'swap',
  weight:   ['300', '400', '600', '700', '800'],
})

const dmSans = DM_Sans({
  subsets:  ['latin'],
  variable: '--font-dm-sans',
  display:  'swap',
  weight:   ['300', '400', '500', '600'],
})

/* ── METADATA ───────────────────────────────────────────── */
export const metadata: Metadata = {
  title:       'VRMS — Vendor Resource Management',
  description:
    'The vendor resource management platform built for serious operations teams. Clear, fast, human.',
  openGraph: {
    title:       'VRMS — Vendor Resource Management',
    description: 'Centralize every vendor, contract, and resource in one place.',
    type:        'website',
  },
}

/* ── ROOT LAYOUT ────────────────────────────────────────── */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${dmSans.variable}`}
    >
      <body>{children}</body>
    </html>
  )
}
