'use client';

import { useState } from 'react';
import styles from './feedback.module.css';

/* ─────────────────────────────────────────────────────────────
   Types
───────────────────────────────────────────────────────────── */

type FilterTab = 'all' | 'submitted' | 'pending';

interface Order {
  id: number;
  orderNo: string;
  vendor: string;
  vendorInitial: string;
  product: string;
  orderDate: string;
  existingRating?: number;
  existingComment?: string;
  status: 'submitted' | 'pending';
}

/* ─────────────────────────────────────────────────────────────
   Mock data
   TODO: API — replace with GET /api/customer/feedback
───────────────────────────────────────────────────────────── */

const MOCK_ORDERS: Order[] = [
  {
    id: 1,
    orderNo: 'ORD-2024-0087',
    vendor: 'TechSupply Co.',
    vendorInitial: 'T',
    product: 'Laptop Stand Pro',
    orderDate: '2024-11-18',
    status: 'pending',
  },
  {
    id: 2,
    orderNo: 'ORD-2024-0081',
    vendor: 'OfficeWorld',
    vendorInitial: 'O',
    product: 'Ergonomic Chair',
    orderDate: '2024-11-10',
    status: 'pending',
  },
  {
    id: 3,
    orderNo: 'ORD-2024-0061',
    vendor: 'CleanPro',
    vendorInitial: 'C',
    product: 'Office Cleaning Kit',
    orderDate: '2024-10-28',
    existingRating: 4,
    existingComment: 'Good quality, fast delivery. The kit had everything we needed.',
    status: 'submitted',
  },
  {
    id: 4,
    orderNo: 'ORD-2024-0055',
    vendor: 'BuildMart',
    vendorInitial: 'B',
    product: 'Tool Set (12-pc)',
    orderDate: '2024-10-15',
    existingRating: 5,
    existingComment: 'Excellent! Well packaged and arrived ahead of schedule.',
    status: 'submitted',
  },
  {
    id: 5,
    orderNo: 'ORD-2024-0098',
    vendor: 'NetGear India',
    vendorInitial: 'N',
    product: 'WiFi Mesh Router',
    orderDate: '2024-11-22',
    status: 'pending',
  },
];

/* ─────────────────────────────────────────────────────────────
   Sub-components
───────────────────────────────────────────────────────────── */

/** Interactive 5-star click-to-rate input */
function StarRatingInput({
  orderId,
  rating,
  hoverRating,
  onRate,
  onHover,
  onLeave,
}: {
  orderId: number;
  rating: number;
  hoverRating: number;
  onRate: (id: number, r: number) => void;
  onHover: (id: number, r: number) => void;
  onLeave: (id: number) => void;
}) {
  const display = hoverRating || rating;
  return (
    <div className={styles.starRatingInput}>
      {Array.from({ length: 5 }, (_, i) => (
        <button
          key={i}
          type="button"
          className={styles.starBtn}
          style={{ color: display > i ? 'var(--color-primary)' : 'var(--color-border)' }}
          onMouseEnter={() => onHover(orderId, i + 1)}
          onMouseLeave={() => onLeave(orderId)}
          onClick={(e) => {
            e.stopPropagation();
            onRate(orderId, i + 1);
          }}
          aria-label={`Rate ${i + 1} star${i !== 0 ? 's' : ''}`}
        >
          ★
        </button>
      ))}
    </div>
  );
}

/** Read-only star display — pointer-events none */
function StarDisplay({ rating, size = 18 }: { rating: number; size?: number }) {
  return (
    <div className={styles.ratingDisplay}>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={styles.ratingDisplayStar}
          style={{
            color: rating > i ? 'var(--color-primary)' : 'var(--color-border)',
            fontSize: size,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Status badge helpers
───────────────────────────────────────────────────────────── */

function getStatusStyle(status: 'submitted' | 'pending') {
  if (status === 'submitted') {
    return {
      background: 'rgba(76, 175, 80, 0.08)',
      color: '#2e7d32',
      dotColor: '#4CAF50',
      label: 'Submitted',
    };
  }
  return {
    background: 'rgba(245, 197, 24, 0.12)',
    color: '#B8940A',
    dotColor: '#F5C518',
    label: 'Pending',
  };
}

/* ─────────────────────────────────────────────────────────────
   Page
───────────────────────────────────────────────────────────── */

export default function FeedbackPage() {
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Per-order draft state
  const [ratingDraft, setRatingDraft] = useState<Record<number, number>>({});
  const [commentDraft, setCommentDraft] = useState<Record<number, string>>({});
  const [hoverRating, setHoverRating] = useState<Record<number, number>>({});

  // Optimistic submitted feedback
  // TODO: API — POST /api/customer/feedback
  const [submittedFeedback, setSubmittedFeedback] = useState<
    Record<number, { rating: number; comment: string }>
  >({});

  /* ── Derived helpers ── */

  const effectiveStatus = (o: Order): 'submitted' | 'pending' =>
    submittedFeedback[o.id] ? 'submitted' : o.status;

  const effectiveRating = (o: Order): number =>
    submittedFeedback[o.id]?.rating ?? o.existingRating ?? 0;

  const effectiveComment = (o: Order): string =>
    submittedFeedback[o.id]?.comment ?? o.existingComment ?? '';

  /* ── Stat counts (reflect optimistic state) ── */
  const submittedCount = MOCK_ORDERS.filter((o) => effectiveStatus(o) === 'submitted').length;
  const pendingCount = MOCK_ORDERS.filter((o) => effectiveStatus(o) === 'pending').length;

  /* ── Filter + search ── */
  const filtered = MOCK_ORDERS.filter((o) => {
    const statusMatch = filter === 'all' || effectiveStatus(o) === filter;
    const q = search.toLowerCase();
    const searchMatch =
      !q ||
      o.orderNo.toLowerCase().includes(q) ||
      o.vendor.toLowerCase().includes(q) ||
      o.product.toLowerCase().includes(q);
    return statusMatch && searchMatch;
  });

  /* ── Event handlers ── */

  const handleFilterChange = (f: FilterTab) => {
    setFilter(f);
    setSearch('');
    setExpandedId(null);
  };

  const handleSearchChange = (v: string) => {
    setSearch(v);
    setExpandedId(null);
  };

  const handleExpand = (id: number) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleSubmit = (order: Order) => {
    const rating = ratingDraft[order.id] ?? 0;
    if (rating === 0) return; // rating required
    const comment = commentDraft[order.id] ?? '';
    // TODO: API — POST /api/customer/feedback { orderId: order.id, rating, comment }
    setSubmittedFeedback((prev) => ({ ...prev, [order.id]: { rating, comment } }));
  };

  /* ── Context-aware empty state hint ── */
  const emptyHint = search
    ? `No orders matching "${search}"`
    : filter !== 'all'
    ? `No ${filter} feedback yet`
    : 'No completed orders available for feedback';

  /* ── Table footer ── */
  const footerText = (() => {
    let t = `${filtered.length} order(s)`;
    if (filter !== 'all') t += ` · filtered by ${filter}`;
    if (search) t += ` · matching "${search}"`;
    return t;
  })();

  /* ─────────────────────────────────────────────────────────
     Build rows with flatMap — detail panel injected inline
  ───────────────────────────────────────────────────────── */

  const rows = filtered.flatMap((order, idx) => {
    const isExpanded = expandedId === order.id;
    const isLastItem = idx === filtered.length - 1;
    const isLastDataRow = isLastItem && !isExpanded;

    const effStatus = effectiveStatus(order);
    const effRating = effectiveRating(order);
    const effComment = effectiveComment(order);
    const badge = getStatusStyle(effStatus);
    const truncComment =
      effComment.length > 36 ? effComment.slice(0, 36) + '…' : effComment || '—';
    const hasRating = effRating > 0;

    /* ── Data row ── */
    const dataRow = (
      <tr
        key={`row-${order.id}`}
        className={`${styles.row}${isLastDataRow ? ' ' + styles.lastRow : ''}`}
        onClick={() => handleExpand(order.id)}
      >
        {/* Order No */}
        <td className={styles.td}>
          <code className={styles.monoChip}>{order.orderNo}</code>
        </td>

        {/* Vendor */}
        <td className={styles.td}>
          <div className={styles.avatarCell}>
            <div className={styles.avatarCircle}>{order.vendorInitial}</div>
            <span className={styles.avatarName}>{order.vendor}</span>
          </div>
        </td>

        {/* Product */}
        <td className={styles.td} style={{ maxWidth: 200 }}>
          {order.product}
        </td>

        {/* Rating */}
        <td className={styles.td}>
          {hasRating ? (
            <StarDisplay rating={effRating} size={16} />
          ) : (
            <span style={{ color: 'var(--color-muted)', fontSize: 14 }}>—</span>
          )}
        </td>

        {/* Comment (truncated) */}
        <td
          className={styles.td}
          style={{
            color: effComment ? 'var(--color-text)' : 'var(--color-muted)',
            maxWidth: 220,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {truncComment}
        </td>

        {/* Status */}
        <td className={styles.td}>
          <span
            className={styles.statusBadge}
            style={{ background: badge.background, color: badge.color }}
          >
            <span className={styles.statusDot} style={{ background: badge.dotColor }} />
            {badge.label}
          </span>
        </td>

        {/* Expand toggle */}
        <td
          className={styles.td}
          onClick={(e) => e.stopPropagation()}
          style={{ width: 48, textAlign: 'right' }}
        >
          <button
            type="button"
            className={styles.expandToggle}
            onClick={() => handleExpand(order.id)}
            aria-label={isExpanded ? 'Collapse row' : 'Expand row'}
          >
            {isExpanded ? '↑' : '↓'}
          </button>
        </td>
      </tr>
    );

    if (!isExpanded) return [dataRow];

    /* ── Detail row ── */
    const detailRow = (
      <tr
        key={`detail-${order.id}`}
        className={`${styles.detailRow}${isLastItem ? ' ' + styles.detailRowLast : ''}`}
      >
        <td colSpan={7} className={styles.detailPanelTd}>
          <div className={styles.detailPanelInner}>

            {/* Section 1 — Order Info */}
            <div className={styles.detailSection}>
              <div className={styles.detailSectionTitle}>Order Info</div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Order No.</span>
                <code className={styles.monoChip}>{order.orderNo}</code>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Vendor</span>
                <span className={styles.detailValue}>{order.vendor}</span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Product</span>
                <span className={styles.detailValue}>{order.product}</span>
              </div>

              <div className={styles.detailField}>
                <span className={styles.detailLabel}>Order Date</span>
                <span className={styles.detailValue}>{order.orderDate}</span>
              </div>
            </div>

            {/* Divider */}
            <div className={styles.detailDivider} />

            {/* Section 2 — Feedback Form OR Read-only */}
            <div className={styles.detailSection}>
              <div className={styles.detailSectionTitle}>
                {effStatus === 'submitted' ? 'Your Feedback' : 'Leave Feedback'}
              </div>

              {effStatus === 'submitted' ? (
                /* ── Read-only submitted view ── */
                <div className={styles.ratingSubmitSection}>
                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>Rating</span>
                    <StarDisplay rating={effRating} size={20} />
                  </div>

                  {effComment && (
                    <div className={styles.detailField}>
                      <span className={styles.detailLabel}>Comment</span>
                      <p className={styles.descriptionText}>{effComment}</p>
                    </div>
                  )}

                  <div>
                    <span className={styles.submittedChip}>✓&nbsp;Submitted</span>
                  </div>
                </div>
              ) : (
                /* ── Interactive feedback form ── */
                <div className={styles.ratingSubmitSection}>
                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>Your Rating</span>
                    <StarRatingInput
                      orderId={order.id}
                      rating={ratingDraft[order.id] ?? 0}
                      hoverRating={hoverRating[order.id] ?? 0}
                      onRate={(id, r) =>
                        setRatingDraft((prev) => ({ ...prev, [id]: r }))
                      }
                      onHover={(id, r) =>
                        setHoverRating((prev) => ({ ...prev, [id]: r }))
                      }
                      onLeave={(id) =>
                        setHoverRating((prev) => ({ ...prev, [id]: 0 }))
                      }
                    />
                    {(ratingDraft[order.id] ?? 0) === 0 && (
                      <span className={styles.ratingHint}>Click a star to rate</span>
                    )}
                  </div>

                  <div className={styles.detailField}>
                    <span className={styles.detailLabel}>Comment (optional)</span>
                    <textarea
                      className={styles.feedbackTextarea}
                      placeholder="Share your experience with this product and vendor…"
                      value={commentDraft[order.id] ?? ''}
                      onChange={(e) =>
                        setCommentDraft((prev) => ({ ...prev, [order.id]: e.target.value }))
                      }
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>

                  <button
                    type="button"
                    className={styles.feedbackSubmitBtn}
                    disabled={(ratingDraft[order.id] ?? 0) === 0}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSubmit(order);
                    }}
                  >
                    Submit Feedback
                  </button>
                </div>
              )}
            </div>

          </div>
        </td>
      </tr>
    );

    return [dataRow, detailRow];
  });

  /* ─────────────────────────────────────────────────────────
     Render
  ───────────────────────────────────────────────────────── */

  return (
    <div className={styles.page}>

      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Feedback</h1>
      </div>

      {/* Controls — filter pills + search */}
      <div className={styles.controls}>
        <div className={styles.controlsLeft}>
          <div className={styles.filterGroup}>
            {(['all', 'submitted', 'pending'] as FilterTab[]).map((tab) => (
              <button
                key={tab}
                type="button"
                className={`${styles.filterTab}${filter === tab ? ' ' + styles.filterTabActive : ''}`}
                onClick={() => handleFilterChange(tab)}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                {tab === 'submitted' && (
                  <span className={styles.filterCount}>{submittedCount}</span>
                )}
                {tab === 'pending' && (
                  <span className={styles.filterCount}>{pendingCount}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Search */}
        <label className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M10.5 10.5L13.5 13.5"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search orders, vendors, products…"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
          />
        </label>
      </div>

      {/* Stat strip — 3 tiles */}
      <div className={styles.statStrip}>
        {/* Total Orders — display-only, no click */}
        <div
          className={styles.statTile}
          style={{ borderRight: '1px solid var(--color-border)' }}
        >
          <span className={styles.statValue}>{MOCK_ORDERS.length}</span>
          <span className={styles.statLabel}>Total Orders</span>
        </div>

        {/* Submitted — clickable filter */}
        <div
          className={`${styles.statTile} ${styles.statTileClickable}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => handleFilterChange('submitted')}
        >
          {filter === 'submitted' && <span className={styles.statActiveDot} />}
          <span className={styles.statValue}>{submittedCount}</span>
          <span className={styles.statLabel}>Submitted</span>
        </div>

        {/* Pending — clickable filter */}
        <div
          className={`${styles.statTile} ${styles.statTileClickable}`}
          onClick={() => handleFilterChange('pending')}
        >
          {filter === 'pending' && <span className={styles.statActiveDot} />}
          <span className={styles.statValue}>{pendingCount}</span>
          <span className={styles.statLabel}>Pending</span>
        </div>
      </div>

      {/* Feedback table */}
      <div className={styles.tableWrap}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr className={styles.tableHeader}>
              <th className={styles.th}>Order No.</th>
              <th className={styles.th}>Vendor</th>
              <th className={styles.th}>Product</th>
              <th className={styles.th}>Rating</th>
              <th className={styles.th}>Comment</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ width: 48 }} />
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.td} style={{ borderBottom: 'none', padding: 0 }}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyIcon}>⊘</span>
                    <p className={styles.emptyTitle}>No feedback found</p>
                    <p className={styles.emptyHint}>{emptyHint}</p>
                  </div>
                </td>
              </tr>
            ) : (
              rows
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className={styles.tableFooter}>{footerText}</div>
      </div>
    </div>
  );
}