'use client'

import { useEffect, useRef } from 'react'
import s from '../page.module.css'

/* ── Each card's configuration ───────────────────────────── */
const STAGGER_MS = 220
const INITIAL_DELAY_MS = 700

export default function FloatCards() {
  const refs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    refs.current.forEach((card, i) => {
      if (!card) return
      const timer = setTimeout(
        () => card.classList.add(s.fcShown),
        INITIAL_DELAY_MS + i * STAGGER_MS,
      )
      return () => clearTimeout(timer)
    })
  }, [])

  const ref = (i: number) => (el: HTMLDivElement | null) => {
    refs.current[i] = el
  }

  return (
    <div className={s.floatField} aria-hidden="true">

      {/* Card 1 — Vendor Profile */}
      <div ref={ref(0)} className={`${s.fc} ${s.fc1}`}>
        <div className={s.fcHd}>
          <div className={`${s.fcAv} ${s.avY}`}>A</div>
          <div>
            <div className={s.fcN}>Apex Solutions</div>
            <div className={s.fcS}>Logistics &amp; Freight</div>
          </div>
          <span className={`${s.pill} ${s.pGreen}`} style={{ marginLeft: 'auto' }}>Active</span>
        </div>
        <div className={s.fcBd}>
          <div className={s.fcLbl}>Allocation</div>
          {[
            { label: 'Contracts', pct: 78,  accent: false },
            { label: 'Spend',     pct: 62,  accent: true  },
            { label: 'SLA score', pct: 95,  accent: false },
          ].map(({ label, pct, accent }) => (
            <div key={label} className={s.mr}>
              <span className={s.mrLbl}>{label}</span>
              <div className={s.mrTrack}>
                <div
                  className={`${s.mrFill} ${accent ? s.mrFillY : ''}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={s.mrPct}>{pct}%</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 2 — Contract Value */}
      <div ref={ref(1)} className={`${s.fc} ${s.fc2}`}>
        <div className={s.fcHd}>
          <div className={`${s.fcAv} ${s.avK}`}>$</div>
          <div>
            <div className={s.fcN}>Contract Overview</div>
            <div className={s.fcS}>Q3 · 2025</div>
          </div>
        </div>
        <div className={s.fcBd}>
          <div className={s.fcLbl}>Total value</div>
          <div className={s.fcBig}>$4.2M</div>
          <div className={s.fcUp}>↑ 23% from last quarter</div>
          <div className={s.mbar}>
            <div className={s.mbarF} style={{ width: '72%' }} />
          </div>
          <div className={s.mbarMeta}>
            <span>Active: 38</span>
            <span>Expiring: 7</span>
          </div>
        </div>
      </div>

      {/* Card 3 — Renewals Alert */}
      <div ref={ref(2)} className={`${s.fc} ${s.fc3}`}>
        <div className={s.fcBd} style={{ padding: '14px' }}>
          <div className={s.alHd}>
            <span className={s.alIco}>⚡</span>
            <span className={s.alTitle}>3 Renewals Due Soon</span>
          </div>
          {[
            { name: 'Acme Corp',      days: '18 days', color: s.pRed    },
            { name: 'TechVendor Inc', days: '24 days', color: s.pYellow },
            { name: 'Globex Ltd',     days: '31 days', color: s.pYellow },
          ].map(({ name, days, color }) => (
            <div key={name} className={s.alRow}>
              <span className={s.alName}>{name}</span>
              <span className={`${s.pill} ${color}`}>{days}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Card 4 — Resource Health */}
      <div ref={ref(3)} className={`${s.fc} ${s.fc4}`}>
        <div className={s.fcHd}>
          <div className={`${s.fcAv} ${s.avG}`}>R</div>
          <div>
            <div className={s.fcN}>Resource Health</div>
            <div className={s.fcS}>All vendors</div>
          </div>
        </div>
        <div className={s.fcBd}>
          <div className={s.circWrap}>
            <div className={s.circ}>
              <svg width="64" height="64" viewBox="0 0 64 64" aria-hidden="true">
                <circle className={s.circBg} cx="32" cy="32" r="24" />
                <circle className={s.circFg} cx="32" cy="32" r="24" />
              </svg>
              <div className={s.circNum}>87%</div>
            </div>
            <div className={s.circLbl}>
              Resources allocated<br />
              <strong>On track</strong>
            </div>
          </div>
        </div>
      </div>

    </div>
  )
}
