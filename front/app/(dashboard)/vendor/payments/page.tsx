'use client';

import { useState } from 'react';
import styles from './payments.module.css';

// TODO: API — replace with GET /api/vendor/payments
const mockPayments = [
  {
    id: 1,
    invoice_no: 'INV-2024-0041',
    order_no: 'ORD-2024-0088',
    customer: 'Arjun Mehta',
    contact: 'arjun@example.com',
    amount: 12400.0,
    gst: 2232.0,
    total: 14632.0,
    mode: 'Online',
    status: 'paid',
    paid_at: '2024-12-15',
    reference_no: 'TXN8821934',
  },
  {
    id: 2,
    invoice_no: 'INV-2024-0042',
    order_no: 'ORD-2024-0091',
    customer: 'Sneha Iyer',
    contact: '+91 91234 56789',
    amount: 8750.0,
    gst: 1575.0,
    total: 10325.0,
    mode: 'NEFT',
    status: 'paid',
    paid_at: '2024-12-17',
    reference_no: 'NEFT00291',
  },
  {
    id: 3,
    invoice_no: 'INV-2024-0043',
    order_no: 'ORD-2024-0094',
    customer: 'Rohit Sharma',
    contact: 'rohit@biz.co',
    amount: 5200.0,
    gst: 936.0,
    total: 6136.0,
    mode: 'Cash',
    status: 'pending',
    paid_at: null,
    reference_no: null,
  },
  {
    id: 4,
    invoice_no: 'INV-2024-0044',
    order_no: 'ORD-2024-0097',
    customer: 'Divya Pillai',
    contact: 'divya@works.com',
    amount: 31000.0,
    gst: 5580.0,
    total: 36580.0,
    mode: 'Cheque',
    status: 'pending',
    paid_at: null,
    reference_no: null,
  },
  {
    id: 5,
    invoice_no: 'INV-2024-0039',
    order_no: 'ORD-2024-0081',
    customer: 'Karan Verma',
    contact: 'karan@corp.in',
    amount: 4100.0,
    gst: 738.0,
    total: 4838.0,
    mode: 'Online',
    status: 'overdue',
    paid_at: null,
    reference_no: null,
  },
  {
    id: 6,
    invoice_no: 'INV-2024-0040',
    order_no: 'ORD-2024-0083',
    customer: 'Priya Nair',
    contact: '+91 98765 43210',
    amount: 9800.0,
    gst: 1764.0,
    total: 11564.0,
    mode: 'NEFT',
    status: 'paid',
    paid_at: '2024-12-12',
    reference_no: 'NEFT00184',
  },
];

type FilterTab = 'All' | 'paid' | 'pending' | 'overdue' | 'thisMonth';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const fmt = (n: number) =>
  `₹${n.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const BADGE_STYLE: Record<string, { background: string; color: string }> = {
  paid:    { background: 'rgba(76,175,80,0.1)',   color: 'var(--color-success)' },
  pending: { background: 'rgba(245,197,24,0.15)', color: '#B8940A' },
  overdue: { background: 'rgba(229,57,53,0.1)',   color: 'var(--color-error)' },
};

const DOT_COLOR: Record<string, string> = {
  paid:    'var(--color-success)',
  pending: 'var(--color-warning)',
  overdue: 'var(--color-error)',
};

const PILL_FILTERS: FilterTab[] = ['All', 'paid', 'pending', 'overdue'];
const PILL_LABEL: Record<string, string> = {
  All: 'All', paid: 'Paid', pending: 'Pending', overdue: 'Overdue',
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function VendorPaymentsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [expandedId, setExpandedId]     = useState<number | null>(null);
  const [search, setSearch]             = useState('');


  const isLoading = false; // TODO: API — set true while fetching, false on data arrival


  // ── Derived data ────────────────────────────────────────────────────────────
  const paidItems     = mockPayments.filter(p => p.status === 'paid');
  const pendingItems  = mockPayments.filter(p => p.status === 'pending');
  const thisMonthItems = mockPayments.filter(p => p.paid_at?.startsWith('2024-12'));

  const totalEarned      = paidItems.reduce((s, p) => s + p.total, 0);
  const thisMonthRevenue = thisMonthItems.reduce((s, p) => s + p.total, 0);

  // ── Filter + search ──────────────────────────────────────────────────────────
  const filtered = mockPayments.filter(p => {
    const matchesFilter =
      activeFilter === 'All'
        ? true
        : activeFilter === 'thisMonth'
        ? Boolean(p.paid_at?.startsWith('2024-12'))
        : p.status === activeFilter;

    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      p.invoice_no.toLowerCase().includes(q) ||
      p.customer.toLowerCase().includes(q);

    return matchesFilter && matchesSearch;
  });

  // ── Pill count (always reflects full dataset, not current search) ────────────
  const pillCount = (f: FilterTab) =>
    f === 'All'
      ? mockPayments.length
      : mockPayments.filter(p => p.status === f).length;

  // ── Stat tile click → set filter; click active tile → reset to All ────────────
  const handleTileClick = (filterOn: FilterTab) => {
    setActiveFilter(prev => (prev === filterOn ? 'All' : filterOn));
    setSearch('');
    setExpandedId(null);
  };

  const handlePillClick = (f: FilterTab) => {
    setActiveFilter(f);
    setExpandedId(null);
  };

  const handleSearch = (val: string) => {
    setSearch(val);
    setExpandedId(null);
  };

  const clearAll = () => {
    setSearch('');
    setActiveFilter('All');
    setExpandedId(null);
  };

  // ── Empty-state hint ─────────────────────────────────────────────────────────
  const emptyHint = () => {
    if (search && activeFilter !== 'All')
      return `No ${activeFilter} payments matching "${search}"`;
    if (search)
      return `No results matching "${search}"`;
    if (activeFilter === 'thisMonth')
      return 'No payments found for December 2024';
    if (activeFilter !== 'All')
      return `No ${activeFilter} payments`;
    return 'No payment records yet';
  };

  // ── Stat strip config ────────────────────────────────────────────────────────
  const statTiles = [
    { label: 'Total Earned', value: fmt(totalEarned),       filterOn: 'paid'       as FilterTab },
    { label: 'Paid',         value: paidItems.length,        filterOn: 'paid'       as FilterTab },
    { label: 'Pending',      value: pendingItems.length,     filterOn: 'pending'    as FilterTab },
    { label: 'This Month',   value: fmt(thisMonthRevenue),   filterOn: 'thisMonth'  as FilterTab },
  ] as const;

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className={styles.page}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Payments</h1>

        <div className={styles.searchWrap}>
          <label className={styles.searchLabel}>
            <span className={styles.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11L14 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              className={styles.searchInput}
              placeholder="Search by invoice or customer…"
              value={search}
              onChange={e => handleSearch(e.target.value)}
              aria-label="Search payments"
            />
          </label>
        </div>
      </div>

      {/* ── Stat strip ─────────────────────────────────────────────────────── */}
      <div className={styles.statStrip}>
        {statTiles.map((tile, i) => {
          const isActive = activeFilter === tile.filterOn;
          return (
            <div
              key={tile.label}
              className={[
                styles.statTile,
                styles.statTileClickable,
                isActive ? styles.statTileActive : '',
              ].join(' ')}
              style={{
                borderRight:
                  i < statTiles.length - 1
                    ? '1px solid var(--color-border)'
                    : 'none',
              }}
              onClick={() => handleTileClick(tile.filterOn)}
              role="button"
              tabIndex={0}
              onKeyDown={e => e.key === 'Enter' && handleTileClick(tile.filterOn)}
            >
              {isLoading ? (
                <div className="skeleton skeletonStat" />
              ) : (
                <span className={styles.statValue}>{tile.value}</span>
              )}

              {isLoading ? (
                <div className="skeleton skeletonLabel" style={{ width: 56 }} />
              ) : (
                <span className={styles.statLabel}>
                  {isActive && <span className={styles.statActiveDot} />}
                  {tile.label}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Filter pills ───────────────────────────────────────────────────── */}
      <div className={styles.filterRow}>
        <div className={styles.filterGroup} role="group" aria-label="Filter payments">
          {PILL_FILTERS.map(f => (
            <button
              key={f}
              className={
                activeFilter === f ? styles.filterTabActive : styles.filterTab
              }
              onClick={() => handlePillClick(f)}
            >
              {PILL_LABEL[f]}
              <span className={styles.filterCount}>{pillCount(f)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Invoice No</th>
              <th className={styles.th}>Order No</th>
              <th className={styles.th}>Customer</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Amount</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Total</th>
              <th className={styles.th}>Mode</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              /* Block D - Skeleton Rows */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  <td colSpan={8} style={{ padding: '10px 24px' }}>
                    <div className="skeleton skeletonRow" style={{ height: '40px' }} />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              /* Existing Empty State */
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  <div className={styles.emptyContent}>
                    <span className={styles.emptyIcon}>⊘</span>
                    <span className={styles.emptyTitle}>No payments found</span>
                    <span className={styles.emptyHint}>{emptyHint()}</span>
                    {(search || activeFilter !== 'All') && (
                      <button className={styles.clearFilterBtn} onClick={clearAll}>
                        Clear filter
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              /* Existing Data Rows */
              filtered.flatMap((p, idx) => {
                const isLast     = idx === filtered.length - 1;
                const isExpanded = expandedId === p.id;

                const rowClass = isExpanded
                  ? styles.rowExpanded
                  : isLast
                  ? styles.lastRow
                  : styles.row;

                const rows: React.ReactNode[] = [
                  <tr
                    key={p.id}
                    className={rowClass}
                    onClick={() => setExpandedId(isExpanded ? null : p.id)}
                    aria-expanded={isExpanded}
                  >
                    {/* Invoice No */}
                    <td className={styles.td}>
                      <code className={styles.monoChip}>{p.invoice_no}</code>
                    </td>

                    {/* Order No */}
                    <td className={styles.td}>
                      <code className={styles.monoChip}>{p.order_no}</code>
                    </td>

                    {/* Customer */}
                    <td className={styles.td}>
                      <div className={styles.customerCell}>
                        <div className={styles.avatar}>{p.customer[0]}</div>
                        <div>
                          <div className={styles.customerName}>{p.customer}</div>
                          <div className={styles.customerContact}>{p.contact}</div>
                        </div>
                      </div>
                    </td>

                    {/* Amount + GST sub-line */}
                    <td className={styles.td}>
                      <div className={styles.amountCell}>
                        <span className={styles.amountValue}>{fmt(p.amount)}</span>
                        <span className={styles.gstSubline}>+GST {fmt(p.gst)}</span>
                      </div>
                    </td>

                    {/* Total */}
                    <td className={styles.td} style={{ textAlign: 'right' }}>
                      <span className={styles.totalValue}>{fmt(p.total)}</span>
                    </td>

                    {/* Mode chip */}
                    <td className={styles.td}>
                      <span className={styles.modeChip}>{p.mode}</span>
                    </td>

                    {/* Status badge */}
                    <td className={styles.td}>
                      <span
                        className={styles.statusBadge}
                        style={BADGE_STYLE[p.status]}
                      >
                        <span
                          className={styles.statusDot}
                          style={{ background: DOT_COLOR[p.status] }}
                        />
                        {p.status.charAt(0).toUpperCase() + p.status.slice(1)}
                      </span>
                    </td>

                    {/* Date */}
                    <td
                      className={styles.td}
                      style={{ color: 'var(--color-muted)', fontSize: '13px' }}
                    >
                      {p.paid_at ?? '—'}
                    </td>
                  </tr>,
                ];

                // ── Inline detail panel ────────────────────────────────────────
                if (isExpanded) {
                  rows.push(
                    <tr key={`${p.id}-detail`}>
                      <td
                        colSpan={8}
                        className={`${styles.detailPanel} ${isLast ? styles.detailPanelLast : ''}`}
                      >
                        <div className={styles.detailSections}>

                          {/* ── Section 1: Payment Details ────────────────── */}
                          <div className={styles.detailSection}>
                            <div className={styles.detailSectionTitle}>Payment Details</div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Invoice No</span>
                              <code className={styles.referenceNo}>{p.invoice_no}</code>
                            </div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Order No</span>
                              <code className={styles.referenceNo}>{p.order_no}</code>
                            </div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Reference No</span>
                              {p.reference_no ? (
                                <code className={styles.referenceNo}>{p.reference_no}</code>
                              ) : (
                                <span className={styles.detailMuted}>—</span>
                              )}
                            </div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Mode</span>
                              <span className={styles.detailValue}>{p.mode}</span>
                            </div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Paid At</span>
                              {p.paid_at ? (
                                <span className={styles.detailValue}>{p.paid_at}</span>
                              ) : (
                                <span className={styles.detailMuted}>Not yet paid</span>
                              )}
                            </div>
                          </div>

                          <div className={styles.detailDivider} />

                          {/* ── Section 2: GST Breakdown ──────────────────── */}
                          <div className={styles.detailSection}>
                            <div className={styles.detailSectionTitle}>GST Breakdown</div>

                            <div className={styles.gstBreakdown}>
                              <div className={styles.gstRow}>
                                <span>Base Amount</span>
                                <span className={styles.gstValue}>{fmt(p.amount)}</span>
                              </div>
                              <div className={styles.gstRow}>
                                <span>GST (18%)</span>
                                <span className={styles.gstValue}>{fmt(p.gst)}</span>
                              </div>
                              <div className={styles.gstTotalRow}>
                                <span>Total</span>
                                <span className={styles.gstTotalValue}>{fmt(p.total)}</span>
                              </div>
                            </div>
                          </div>

                          <div className={styles.detailDivider} />

                          {/* ── Section 3: Customer Info ──────────────────── */}
                          <div className={styles.detailSection}>
                            <div className={styles.detailSectionTitle}>Customer Info</div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Name</span>
                              <span className={styles.detailValue}>{p.customer}</span>
                            </div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Contact</span>
                              <span className={styles.detailValue}>{p.contact}</span>
                            </div>

                            <div className={styles.detailField}>
                              <span className={styles.detailKey}>Address</span>
                              {/* TODO: API — shipping address not available in mock data */}
                              <span className={styles.detailMuted}>Not available</span>
                            </div>
                          </div>

                        </div>
                      </td>
                    </tr>,
                  );
                }

                return rows;
              })
            )}
          </tbody>
        </table>

        {/* ── Table footer ───────────────────────────────────────────────────── */}
        <div className={styles.tableFooter}>
          <span>
            {filtered.length} payment{filtered.length !== 1 ? 's' : ''}
            {activeFilter !== 'All' && ` · filtered by ${activeFilter}`}
            {search && ` · matching "${search}"`}
          </span>
          {(search || activeFilter !== 'All') && (
            <button className={styles.clearFilter} onClick={clearAll}>
              clear filter
            </button>
          )}
        </div>
      </div>

    </div>
  );
}