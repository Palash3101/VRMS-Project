import Link from 'next/link';

// Static — no state, no mock data
export default function VendorPendingPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-bg)',
        padding: '24px',
      }}
    >
      <div
        style={{
          maxWidth: '480px',
          width: '100%',
          padding: '48px',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-lg)',
          background: 'var(--color-bg)',
          textAlign: 'center',
          // No shadow — editorial restraint
        }}
      >
        {/* ── Pending icon ──────────────────────────────────────────────────── */}
        <div
          style={{
            width: '56px',
            height: '56px',
            borderRadius: 'var(--radius-full)',
            background: 'rgba(245, 197, 24, 0.12)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 28px',
          }}
        >
          {/* Clock SVG — cleaner than emoji, respects the design system */}
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--color-primary)"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </div>

        {/* ── Heading ───────────────────────────────────────────────────────── */}
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '28px',
            fontWeight: '700',
            color: 'var(--color-text)',
            letterSpacing: '-0.02em',
            margin: '0 0 14px',
            lineHeight: '1.2',
          }}
        >
          Application Submitted
        </h1>

        {/* ── Body copy ─────────────────────────────────────────────────────── */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '15px',
            color: 'var(--color-muted)',
            lineHeight: '1.6',
            margin: '0 0 28px',
          }}
        >
          Your vendor application is under review. You&apos;ll receive an email
          at{' '}
          <span style={{ color: 'var(--color-text)', fontWeight: 500 }}>
            your registered address
          </span>{' '}
          once our team approves your account — usually within 1–2 business
          days.
        </p>

        {/* ── Application reference mono chip ───────────────────────────────── */}
        <div style={{ marginBottom: '32px' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '11px',
              fontWeight: '600',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
              color: 'var(--color-muted)',
              margin: '0 0 8px',
            }}
          >
            Application Reference
          </p>
          {/* TODO: API — replace APP-2024-3847 with real reference from server response */}
          <code
            style={{
              fontFamily: 'ui-monospace, "Cascadia Code", "Source Code Pro", monospace',
              fontSize: '15px',
              fontWeight: '600',
              padding: '6px 14px',
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: 'var(--radius-sm)',
              color: 'var(--color-text)',
              letterSpacing: '0.04em',
            }}
          >
            APP-2024-3847
          </code>
        </div>

        {/* ── Back to Login ghost button ─────────────────────────────────────── */}
        <Link
          href="/login"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: '44px',
            padding: '0 28px',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-sm)',
            background: 'transparent',
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            fontWeight: '600',
            color: 'var(--color-muted)',
            textDecoration: 'none',
            transition: 'border-color 0.15s, color 0.15s',
            // Hover handled via global CSS below — inline style can't do :hover
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-dark)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-text)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLAnchorElement).style.borderColor = 'var(--color-border)';
            (e.currentTarget as HTMLAnchorElement).style.color = 'var(--color-muted)';
          }}
        >
          ← Back to Login
        </Link>

        {/* ── Support footer note ───────────────────────────────────────────── */}
        <p
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: 'var(--color-muted)',
            margin: '28px 0 0',
            lineHeight: '1.5',
          }}
        >
          Questions?{' '}
          <a
            href="mailto:support@vrms.in"
            style={{
              color: 'var(--color-muted)',
              textDecoration: 'underline',
              textUnderlineOffset: '2px',
            }}
          >
            support@vrms.in
          </a>
        </p>
      </div>
    </div>
  );
}