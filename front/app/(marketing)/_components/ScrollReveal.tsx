'use client'

import { useEffect, useRef } from 'react'
import s from '../page.module.css'

type Delay = 1 | 2 | 3

interface ScrollRevealProps {
  children: React.ReactNode
  delay?: Delay
  /** Extra class names to merge onto the wrapper */
  className?: string
  as?: keyof JSX.IntrinsicElements
}

const delayClass: Record<Delay, string> = {
  1: s.srD1,
  2: s.srD2,
  3: s.srD3,
}

/**
 * Wraps children in a div that fades + slides up once it enters
 * the viewport. Uses IntersectionObserver; fires only once.
 */
export default function ScrollReveal({
  children,
  delay,
  className = '',
  as: Tag = 'div',
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add(s.srOn)
          obs.unobserve(el)
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -36px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const classes = [
    s.sr,
    delay ? delayClass[delay] : '',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  /* Render as the specified tag (div by default) */
  return (
    <Tag ref={ref as React.RefObject<any>} className={classes}>
      {children}
    </Tag>
  )
}
