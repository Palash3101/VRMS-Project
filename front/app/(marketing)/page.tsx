import Link from 'next/link'
import NavBar      from './_components/NavBar'
import FloatCards  from './_components/FloatCards'
import ScrollReveal from './_components/ScrollReveal'
import s from './page.module.css'

/* ── DATA ────────────────────────────────────────────────── */
const STATS = [
  { num: '500+',  txt: 'Vendors managed daily'    },
  { num: '$2B+',  txt: 'Contract value tracked'   },
  { num: '60%',   txt: 'Faster vendor onboarding' },
  { num: '99.9%', txt: 'Platform uptime SLA'      },
]

const FEATURES_TOP = [
  {
    n: '01',
    name: 'Vendor Hub',
    desc: 'A single source of truth for every vendor relationship. Contacts, contracts, certifications, and performance history — all in one profile, always current.',
    tag: 'Centralized data',
    mini: true,
  },
  {
    n: '02',
    name: 'Contract Intelligence',
    desc: 'Track renewals, obligations, and spend commitments across your entire vendor portfolio. Never miss a deadline again — VRMS alerts you first.',
    tag: 'AI-powered alerts',
    mini: false,
  },
]

const FEATURES_BOT = [
  {
    n: '03',
    name: 'Resource Visibility',
    desc: 'Know exactly where resources are allocated across your vendor network, in real time.',
    tag: 'Live dashboards',
  },
  {
    n: '04',
    name: 'Performance Tracking',
    desc: 'Score every vendor on delivery, quality, and SLA compliance. Make renewal decisions with data, not gut feeling.',
    tag: 'Vendor scorecards',
  },
  {
    n: '05',
    name: 'Team Workflows',
    desc: 'Assign tasks, trigger approval chains, and keep procurement moving without chasing anyone down.',
    tag: 'Automated flows',
  },
]

const STEPS = [
  {
    n: '01',
    title: 'Import your vendors',
    desc: 'Connect existing spreadsheets or onboard vendors directly with guided forms. VRMS normalizes and enriches every record automatically on the way in.',
  },
  {
    n: '02',
    title: 'Track everything centrally',
    desc: 'Contracts, contacts, documents, and performance metrics all live in a unified timeline per vendor. Your team sees one version of the truth.',
  },
  {
    n: '03',
    title: 'Get smarter over time',
    desc: 'AI surfaces renewal risks, spend anomalies, and negotiation opportunities before they become problems. Less firefighting, more strategy.',
  },
]

const TESTIMONIALS = [
  {
    q: 'We cut vendor onboarding from three weeks to two days. The ROI was immediate and the team has not looked back.',
    initials: 'SK',
    name: 'Sarah K.',
    role: 'Director of Operations, Buildcorp',
    avStyle: { background: 'rgba(245,197,24,.2)', color: '#7A6000' },
  },
  {
    q: 'The contract tracking has paid for itself three times over in renewals we caught before they slipped. Worth every cent.',
    initials: 'MT',
    name: 'Marcus T.',
    role: 'Head of Procurement, Meridian Group',
    avStyle: { background: 'rgba(26,26,26,.07)', color: 'var(--color-text)' },
  },
  {
    q: 'Finally a vendor platform that feels human, not like it was built for a Fortune 500 with a dedicated IT team. We were live in a day.',
    initials: 'PM',
    name: 'Priya M.',
    role: 'COO, Nexus Partners',
    avStyle: { background: 'rgba(76,175,80,.14)', color: '#2E7D32' },
  },
]

const PLANS = [
  {
    tier: 'Starter',
    price: '49',
    desc: 'For small teams getting started with vendor management.',
    features: [
      'Up to 25 vendors',
      'Basic contract tracking',
      'Document storage (5 GB)',
      'Email support',
    ],
    cta: 'Get started',
    hot: false,
  },
  {
    tier: 'Pro',
    price: '149',
    desc: 'For teams that need full visibility and intelligent automation.',
    features: [
      'Unlimited vendors',
      'Advanced contract intelligence',
      'AI renewal alerts',
      'Resource dashboards',
      'Priority support',
    ],
    cta: 'Get started',
    hot: true,
  },
  {
    tier: 'Enterprise',
    price: null,
    desc: 'For organizations with complex compliance and scale requirements.',
    features: [
      'Everything in Pro',
      'SSO + SAML',
      'Custom integrations',
      'Dedicated success manager',
      'Uptime SLA guarantees',
    ],
    cta: 'Contact sales',
    hot: false,
  },
]

const TRUST_LOGOS = ['Meridian Group', 'BuildCorp', 'Nexus Partners', 'Axis Capital', 'Solaris Co.']

/* ── PAGE ────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <>
      <a className={s.skipLink} href="#main">
        Skip to main content
      </a>

      {/* Client component — handles sticky + active state */}
      <NavBar />

      <main id="main">
        {/* ── HERO ──────────────────────────────────────── */}
        <section className={s.hero} aria-label="Hero">
          {/* Client component — staggered float + animation */}
          <FloatCards />

          <div className={s.heroInner}>
            <div className={s.heroTag}>
              <span className={s.heroTagDot} />
              Vendor Resource Management Platform
            </div>

            <h1 className={s.heroH1}>
              Build a leaner,
              <br />
              <em>smarter</em> vendor
              <br />
              operation.
            </h1>

            <p className={s.heroSub}>
              VRMS centralizes every vendor, contract, and resource — giving
              your operations team the clarity to move fast and the data to
              negotiate well.
            </p>

            <div className={s.heroBtns}>
              <Link href="/register" className={`${s.btn} ${s.btnDark}`}>
                Start free trial
              </Link>
              <Link href="#how" className={`${s.btn} ${s.btnGhost}`}>
                See how it works &rarr;
              </Link>
            </div>
          </div>
        </section>

        {/* ── TRUST STRIP ───────────────────────────────── */}
        <div className={s.trust} aria-label="Trusted by">
          <div className={`${s.wrap} ${s.trustInner}`}>
            <span className={s.trustLbl}>Trusted by</span>
            <div className={s.trustSep} aria-hidden="true" />
            <div className={s.trustLogos}>
              {TRUST_LOGOS.map((name) => (
                <span key={name} className={s.trustLogo}>
                  {name}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ── STATS ─────────────────────────────────────── */}
        <section className={s.stats} aria-label="Platform statistics">
          <div className={s.wrap}>
            <div className={s.statsGrid}>
              {STATS.map(({ num, txt }, i) => (
                <ScrollReveal
                  key={txt}
                  delay={((i % 2) + 1) as 1 | 2}
                  className={s.statCell}
                  as="div"
                >
                  <div className={s.statNum}>{num}</div>
                  <div className={s.statTxt}>{txt}</div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ──────────────────────────────────── */}
        <section className={s.features} id="features" aria-label="Features">
          <div className={s.wrap}>
            <ScrollReveal className={s.sHead}>
              <p className={s.sLabel}>What VRMS does</p>
              <h2 className={s.sTitle}>
                Every tool your operations team
                <br />
                <strong>actually needs.</strong>
              </h2>
            </ScrollReveal>

            {/* Row 1 */}
            <div className={s.featGridTop}>
              {FEATURES_TOP.map(({ n, name, desc, tag, mini }, i) => (
                <ScrollReveal key={n} delay={((i + 1) as 1 | 2)}>
                  <div className={s.featTile}>
                    <div className={s.featN}>{n}</div>
                    <div className={s.featName}>{name}</div>
                    <p className={s.featDesc}>{desc}</p>
                    <span className={s.featTag}>{tag}</span>
                    {mini && (
                      <div className={s.featUi} aria-hidden="true">
                        {[
                          { init: 'A', bg: 'var(--color-primary)', color: 'var(--color-dark)', name: 'Apex Solutions',    pill: s.pGreen  },
                          { init: 'G', bg: 'var(--color-dark)',    color: '#fff',               name: 'Globex Ltd',        pill: s.pYellow },
                          { init: 'T', bg: '#efefef',              color: 'var(--color-muted)', name: 'TechVendor Inc',    pill: s.pGreen  },
                        ].map(({ init, bg, color, name: vName, pill }) => (
                          <div key={vName} className={s.fuiRow}>
                            <div
                              className={s.fuiAv}
                              style={{ background: bg, color }}
                            >
                              {init}
                            </div>
                            <span className={s.fuiName}>{vName}</span>
                            <span className={`${s.pill} ${pill}`}>
                              {pill === s.pGreen ? 'Active' : 'Review'}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </ScrollReveal>
              ))}
            </div>

            {/* Row 2 */}
            <div className={s.featGridBot}>
              {FEATURES_BOT.map(({ n, name, desc, tag }, i) => (
                <ScrollReveal key={n} delay={((i + 1) as 1 | 2 | 3)}>
                  <div className={s.featTile}>
                    <div className={s.featN}>{n}</div>
                    <div className={s.featName}>{name}</div>
                    <p className={s.featDesc}>{desc}</p>
                    <span className={s.featTag}>{tag}</span>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ──────────────────────────────── */}
        <section className={s.hiw} id="how" aria-label="How it works">
          <div className={s.wrap}>
            <ScrollReveal className={s.sHead}>
              <p className={s.sLabel}>How it works</p>
              <h2 className={s.sTitle}>
                From scattered to streamlined
                <br />
                <strong>in three steps.</strong>
              </h2>
            </ScrollReveal>

            <div className={s.hiwGrid}>
              {STEPS.map(({ n, title, desc }, i) => (
                <ScrollReveal key={n} delay={((i + 1) as 1 | 2 | 3)}>
                  <div className={s.hiwN}>{n}</div>
                  <div className={s.hiwTitle}>{title}</div>
                  <p className={s.hiwDesc}>{desc}</p>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ──────────────────────────────── */}
        <section className={s.testi} aria-label="Customer testimonials">
          <div className={s.wrap}>
            <ScrollReveal className={s.sHead}>
              <p className={s.sLabel}>What teams say</p>
              <h2 className={s.sTitle}>
                Real operations.
                <br />
                <strong>Real results.</strong>
              </h2>
            </ScrollReveal>

            <div className={s.testiGrid}>
              {TESTIMONIALS.map(({ q, initials, name, role, avStyle }, i) => (
                <ScrollReveal key={name} delay={((i + 1) as 1 | 2 | 3)}>
                  <div className={s.testiCard}>
                    <div
                      className={s.testiStars}
                      aria-label="5 stars"
                    >
                      ★★★★★
                    </div>
                    <p className={s.testiQ}>&ldquo;{q}&rdquo;</p>
                    <div className={s.testiAu}>
                      <div
                        className={s.testiAv}
                        style={avStyle}
                        aria-hidden="true"
                      >
                        {initials}
                      </div>
                      <div>
                        <div className={s.testiName}>{name}</div>
                        <div className={s.testiRole}>{role}</div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── PRICING ───────────────────────────────────── */}
        <section className={s.pricing} id="pricing" aria-label="Pricing plans">
          <div className={s.wrap}>
            <ScrollReveal className={s.sHead} style={{ textAlign: 'center' } as React.CSSProperties}>
              <p className={s.sLabel} style={{ textAlign: 'center' }}>
                Pricing
              </p>
              <h2
                className={s.sTitle}
                style={{ margin: '0 auto', textAlign: 'center' }}
              >
                Simple pricing.
                <br />
                <strong>No surprises.</strong>
              </h2>
            </ScrollReveal>

            <div className={s.pricingGrid}>
              {PLANS.map(({ tier, price, desc, features, cta, hot }, i) => (
                <ScrollReveal key={tier} delay={((i + 1) as 1 | 2 | 3)}>
                  <div className={`${s.pCard} ${hot ? s.pCardHot : ''}`}>
                    {hot && <span className={s.pBadge}>Most popular</span>}
                    <p className={s.pTier}>{tier}</p>
                    <div
                      className={`${s.pPrice} ${!price ? s.pPriceCustom : ''}`}
                    >
                      {price ? (
                        <>
                          <sup>$</sup>
                          {price}
                          <small>/mo</small>
                        </>
                      ) : (
                        'Custom'
                      )}
                    </div>
                    <p className={s.pDesc}>{desc}</p>
                    <hr className={s.pHr} />
                    <ul className={s.pList}>
                      {features.map((f) => (
                        <li key={f}>{f}</li>
                      ))}
                    </ul>
                    <Link
                      href={tier === 'Enterprise' ? '/contact' : '/register'}
                      className={`${s.pCta} ${hot ? s.pCtaHot : ''}`}
                    >
                      {cta}
                    </Link>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA BAND ──────────────────────────────────── */}
        <ScrollReveal className={s.ctaBand} as="section">
          <h2>
            Ready to bring order to your{' '}
            <em>vendor relationships?</em>
          </h2>
          <p>
            Join hundreds of operations teams who traded spreadsheet chaos for
            genuine clarity.
          </p>
          <div className={s.ctaBtns}>
            <Link href="/register" className={`${s.btn} ${s.btnDark}`}>
              Start free — no card needed
            </Link>
            <Link href="/contact" className={`${s.btn} ${s.btnGhost}`}>
              Talk to sales &rarr;
            </Link>
          </div>
        </ScrollReveal>
      </main>

      {/* ── FOOTER ────────────────────────────────────── */}
      <footer className={s.footer} role="contentinfo">
        <div className={s.wrap}>
          <div className={s.footerGrid}>
            <div>
              <div className={s.footerLogo}>
                VRMS<span className={s.accent}>.</span>
              </div>
              <p className={s.footerAbout}>
                The vendor resource management platform built for serious
                operations teams. Clear, fast, human.
              </p>
            </div>

            {[
              {
                heading: 'Product',
                links: ['Features', 'Pricing', 'Security', 'Changelog', 'API Docs'],
              },
              {
                heading: 'Company',
                links: ['About', 'Blog', 'Careers', 'Contact'],
              },
              {
                heading: 'Legal',
                links: ['Privacy Policy', 'Terms of Service', 'Cookie Settings'],
              },
            ].map(({ heading, links }) => (
              <div key={heading}>
                <p className={s.footerColH}>{heading}</p>
                <ul className={s.footerUl}>
                  {links.map((l) => (
                    <li key={l}>
                      <Link href="#">{l}</Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className={s.footerBot}>
            <span>© 2025 VRMS. All rights reserved.</span>
            <span>Made for operations teams everywhere.</span>
          </div>
        </div>
      </footer>
    </>
  )
}
