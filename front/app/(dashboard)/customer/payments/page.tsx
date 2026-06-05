'use client';

import { useState, useMemo } from 'react';
import s from './payments.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────
type FilterTab = 'all' | 'paid' | 'pending' | 'overdue';

interface Payment {
  id: number;
  invoiceNo: string;
  orderNo: string;
  vendor: string;
  vendorInitial: string;
  amount: number;
  gst: number;
  total: number;
  mode: string;
  reference: string | null;
  status: 'paid' | 'pending' | 'overdue';
  paidAt: string | null;
}

// ─── Mock data ───────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/customer/payments
const mockPayments: Payment[] = [
  { id: 1, invoiceNo: 'INV-2024-0041', orderNo: 'ORD-2024-0087', vendor: 'TechSupply Co.', vendorInitial: 'T', amount: 12400, gst: 2232,  total: 14632, mode: 'Online', reference: 'TXN8823991', status: 'paid',    paidAt: '2024-11-18' },
  { id: 2, invoiceNo: 'INV-2024-0038', orderNo: 'ORD-2024-0081', vendor: 'OfficeWorld',    vendorInitial: 'O', amount: 18500, gst: 3330,  total: 21830, mode: 'NEFT',   reference: 'NEFT00291',  status: 'paid',    paidAt: '2024-11-10' },
  { id: 3, invoiceNo: 'INV-2024-0044', orderNo: 'ORD-2024-0093', vendor: 'BuildMart',      vendorInitial: 'B', amount: 3800,  gst: 684,   total: 4484,  mode: 'Cash',   reference: null,         status: 'pending', paidAt: null },
  { id: 4, invoiceNo: 'INV-2024-0029', orderNo: 'ORD-2024-0061', vendor: 'CleanPro',       vendorInitial: 'C', amount: 9600,  gst: 1728,  total: 11328, mode: 'Cheque', reference: 'CHQ-00182',  status: 'overdue', paidAt: null },
  { id: 5, invoiceNo: 'INV-2024-0046', orderNo: 'ORD-2024-0098', vendor: 'NetGear India',  vendorInitial: 'N', amount: 28000, gst: 5040,  total: 33040, mode: 'Online', reference: null,         status: 'pending', paidAt: null },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function fmtDate(d: string | null) {
  if (!d) return '—';
  return new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function statusStyle(status: Payment['status']) {
  if (status === 'paid')    return { background: 'rgba(76,175,80,0.08)',   color: '#2e7d32',              dotColor: '#4CAF50' };
  if (status === 'pending') return { background: 'rgba(245,197,24,0.12)',  color: '#B8940A',              dotColor: '#F5C518' };
  /* overdue */             return { background: 'rgba(229,57,53,0.08)',   color: 'var(--color-error)',   dotColor: 'var(--color-error)' };
}

function statusLabel(status: Payment['status']) {
  if (status === 'paid')    return 'Paid';
  if (status === 'pending') return 'Pending';
  return 'Overdue';
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function CustomerPaymentsPage() {
  const [filter, setFilter]       = useState<FilterTab>('all');
  const [search, setSearch]       = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Featured: first overdue → first pending → mockPayments[0]
  const featuredPayment: Payment =
    mockPayments.find(p => p.status === 'overdue') ??
    mockPayments.find(p => p.status === 'pending') ??
    mockPayments[0];

  // Stat counts
  const paidCount    = mockPayments.filter(p => p.status === 'paid').length;
  const pendingCount = mockPayments.filter(p => p.status === 'pending' || p.status === 'overdue').length;
  const totalSpent   = mockPayments.filter(p => p.status === 'paid').reduce((acc, p) => acc + p.total, 0);

  // Filtered list
  const filtered = useMemo(() => {
    let list = [...mockPayments];
    if (filter !== 'all') list = list.filter(p => p.status === filter);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(p =>
        p.invoiceNo.toLowerCase().includes(q) ||
        p.orderNo.toLowerCase().includes(q) ||
        p.vendor.toLowerCase().includes(q)
      );
    }
    return list;
  }, [filter, search]);

  function handleFilterChange(f: FilterTab) {
    setFilter(f);
    setExpandedId(null);
  }

  function handleSearch(v: string) {
    setSearch(v);
    setExpandedId(null);
  }

  function toggleExpand(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setExpandedId(prev => (prev === id ? null : id));
  }

  // Table footer text
  const footerParts: string[] = [`${filtered.length} payment(s)`];
  if (filter !== 'all') footerParts.push(`filtered by ${filter}`);
  if (search.trim()) footerParts.push(`matching "${search.trim()}"`);
  const footerText = footerParts.join(' · ');

  // Empty state hint
  function emptyHint() {
    if (search.trim() && filter !== 'all')
      return <>No payments match <strong>{filter}</strong> and &ldquo;{search.trim()}&rdquo;. <button className={s.emptyHintBtn} onClick={() => { handleFilterChange('all'); handleSearch(''); }}>Clear</button></>;
    if (search.trim())
      return <>No payments match &ldquo;{search.trim()}&rdquo;. <button className={s.emptyHintBtn} onClick={() => handleSearch('')}>Clear search</button></>;
    if (filter !== 'all')
      return <>No <strong>{filter}</strong> payments found. <button className={s.emptyHintBtn} onClick={() => handleFilterChange('all')}>View all</button></>;
    return <>No payment records yet.</>;
  }

  // flatMap rows
  const rows = filtered.flatMap((payment, idx) => {
    const isLast     = idx === filtered.length - 1 && expandedId !== payment.id;
    const isExpanded = expandedId === payment.id;
    const ss         = statusStyle(payment.status);

    const dataRow = (
      <tr
        key={`row-${payment.id}`}
        className={`${s.row} ${isLast && !isExpanded ? s.lastRow : ''}`}
        onClick={(e) => toggleExpand(e, payment.id)}
      >
        {/* Invoice No */}
        <td className={s.td}>
          <code className={s.monoChip}>{payment.invoiceNo}</code>
        </td>

        {/* Order No */}
        <td className={s.td}>
          <code className={s.monoChip}>{payment.orderNo}</code>
        </td>

        {/* Vendor */}
        <td className={s.td}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              background: 'var(--color-dark)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 13,
              color: '#fff', flexShrink: 0,
            }}>
              {payment.vendorInitial}
            </div>
            <span style={{ fontSize: 13, fontWeight: 500 }}>{payment.vendor}</span>
          </div>
        </td>

        {/* Amount */}
        <td className={s.td} style={{ textAlign: 'right' }}>
          <div className={s.amountCell}>
            <span className={s.amountValue}>{fmt(payment.total)}</span>
            <span className={s.gstSubline}>+GST {fmt(payment.gst)}</span>
          </div>
        </td>

        {/* Mode */}
        <td className={s.td}>
          <span className={s.modeChip}>{payment.mode}</span>
        </td>

        {/* Status */}
        <td className={s.td}>
          <span className={s.badge} style={{ background: ss.background, color: ss.color }}>
            <span className={s.badgeDot} style={{ background: ss.dotColor }} />
            {statusLabel(payment.status)}
          </span>
        </td>

        {/* Date */}
        <td className={s.td} style={{ color: 'var(--color-muted)', fontSize: 12 }}>
          {fmtDate(payment.paidAt)}
        </td>

        {/* Expand toggle */}
        <td className={`${s.td} ${s.expandTd}`} onClick={(e) => toggleExpand(e, payment.id)}>
          <button
            className={`${s.expandBtn} ${isExpanded ? s.expandBtnActive : ''}`}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? '▲' : '▼'}
          </button>
        </td>
      </tr>
    );

    if (!isExpanded) return [dataRow];

    const isDetailLast = idx === filtered.length - 1;

    const detailRow = (
      <tr key={`detail-${payment.id}`} className={isDetailLast ? s.detailRowLast : ''}>
        <td
          className={s.td}
          colSpan={8}
          style={{ padding: 0, borderBottom: isDetailLast ? 'none' : '1px solid var(--color-border)' }}
        >
          <div className={s.detailPanel}>
            <div className={s.detailPanelInner}>

              {/* Section 1: Payment Details */}
              <div className={s.detailSection}>
                <p className={s.detailSectionTitle}>Payment Details</p>

                <div className={s.detailField}>
                  <span className={s.detailFieldKey}>Invoice No</span>
                  <code className={s.monoChip}>{payment.invoiceNo}</code>
                </div>
                <div className={s.detailField}>
                  <span className={s.detailFieldKey}>Order No</span>
                  <code className={s.monoChip}>{payment.orderNo}</code>
                </div>
                <div className={s.detailField}>
                  <span className={s.detailFieldKey}>Reference</span>
                  {payment.reference
                    ? <code className={s.monoChip}>{payment.reference}</code>
                    : <span className={s.detailFieldVal} style={{ color: 'var(--color-muted)' }}>—</span>
                  }
                </div>
                <div className={s.detailField}>
                  <span className={s.detailFieldKey}>Mode</span>
                  <span className={s.modeChip}>{payment.mode}</span>
                </div>
                <div className={s.detailField}>
                  <span className={s.detailFieldKey}>Paid On</span>
                  <span className={s.detailFieldVal}>{fmtDate(payment.paidAt)}</span>
                </div>
              </div>

              <div className={s.detailDivider} />

              {/* Section 2: GST Breakdown */}
              <div className={s.detailSection}>
                <p className={s.detailSectionTitle}>GST Breakdown</p>
                <div className={s.gstBreakdown}>
                  <div className={s.gstRow}>
                    <span className={s.gstRowKey}>Base Amount</span>
                    <span className={s.gstRowVal}>{fmt(payment.amount)}</span>
                  </div>
                  <div className={s.gstRow}>
                    <span className={s.gstRowKey}>GST (18%)</span>
                    <span className={s.gstRowVal}>{fmt(payment.gst)}</span>
                  </div>
                  <div className={s.gstTotalRow}>
                    <span className={s.gstTotalKey}>Total</span>
                    <span className={s.gstTotalVal}>{fmt(payment.total)}</span>
                  </div>
                </div>
              </div>

              <div className={s.detailDivider} />

              {/* Section 3: Invoice Actions */}
              <div className={s.detailSection}>
                <p className={s.detailSectionTitle}>Invoice Actions</p>
                <div className={s.invoiceActionsRow}>
                  <button
                    className={s.downloadBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log('Download', payment.invoiceNo);
                      // TODO: API — GET /api/customer/invoices/:id
                    }}
                  >
                    {/* Download icon */}
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download Invoice
                  </button>
                  <button
                    className={s.viewOrderBtn}
                    onClick={(e) => {
                      e.stopPropagation();
                      // TODO: API — navigate to /customer/orders?highlight=payment.orderNo
                    }}
                  >
                    {/* Arrow icon */}
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                    View Order
                  </button>
                </div>
              </div>

            </div>
          </div>
        </td>
      </tr>
    );

    return [dataRow, detailRow];
  });

  return (
    <div className={s.page}>

      {/* Page Header */}
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Payments & Invoices</h1>
        <p className={s.pageSubtitle}>Track your payment history and download invoices</p>
      </div>

      {/* Featured Invoice Card */}
      {featuredPayment && (
        <div className={s.featuredCard}>
          <div className={s.featuredLeft}>
            <p className={s.featuredCardLabel}>Most Actionable Invoice</p>
            <div className={s.featuredChips}>
              <code className={s.monoChip}>{featuredPayment.invoiceNo}</code>
              <code className={s.monoChip}>{featuredPayment.orderNo}</code>
            </div>
            <span className={s.featuredVendor}>{featuredPayment.vendor}</span>
          </div>
          <div className={s.featuredRight}>
            <p className={s.featuredCardLabel} style={{ textAlign: 'right' }}>Amount Due</p>
            <div className={s.amountCell}>
              <span className={s.amountValue} style={{ fontSize: 20 }}>{fmt(featuredPayment.total)}</span>
              <span className={s.gstSubline}>incl. GST {fmt(featuredPayment.gst)}</span>
            </div>
            <span
              className={s.badge}
              style={{
                background: statusStyle(featuredPayment.status).background,
                color:      statusStyle(featuredPayment.status).color,
              }}
            >
              <span className={s.badgeDot} style={{ background: statusStyle(featuredPayment.status).dotColor }} />
              {statusLabel(featuredPayment.status)}
            </span>
          </div>
        </div>
      )}

      {/* Controls Row */}
      <div className={s.controlsRow}>

        {/* Filter Pills */}
        <div className={s.filterGroup} role="group" aria-label="Filter payments">
          {(['all', 'paid', 'pending', 'overdue'] as FilterTab[]).map(tab => (
            <button
              key={tab}
              className={`${s.filterTab} ${filter === tab ? s.filterTabActive : ''}`}
              onClick={() => handleFilterChange(tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              <span className={s.filterCount}>
                {tab === 'all'     ? mockPayments.length
                 : tab === 'paid'  ? paidCount
                 : tab === 'pending' ? mockPayments.filter(p => p.status === 'pending').length
                 : mockPayments.filter(p => p.status === 'overdue').length}
              </span>
            </button>
          ))}
        </div>

        {/* Search */}
        <label className={s.searchWrap} aria-label="Search payments">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search by invoice, order, vendor…"
            value={search}
            onChange={e => handleSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Stat Strip */}
      <div className={s.statStrip}>

        {/* Total Spent — display-only */}
        <div className={s.statTile} style={{ borderRight: '1px solid var(--color-border)' }}>
          <span className={s.statValue}>{fmt(totalSpent)}</span>
          <span className={s.statLabel}>Total Spent</span>
        </div>

        {/* Paid — clickable filter */}
        <div
          className={`${s.statTile} ${s.statTileClickable}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => handleFilterChange('paid')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleFilterChange('paid')}
        >
          {filter === 'paid' && <span className={s.statActiveDot} />}
          <span className={s.statValue}>{paidCount}</span>
          <span className={s.statLabel}>Paid</span>
        </div>

        {/* Pending — clickable filter */}
        <div
          className={`${s.statTile} ${s.statTileClickable}`}
          onClick={() => handleFilterChange('pending')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleFilterChange('pending')}
        >
          {filter === 'pending' && <span className={s.statActiveDot} />}
          <span className={s.statValue}>{pendingCount}</span>
          <span className={s.statLabel}>Pending / Overdue</span>
        </div>
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th}>Invoice No</th>
              <th className={s.th}>Order No</th>
              <th className={s.th}>Vendor</th>
              <th className={s.th} style={{ textAlign: 'right' }}>Amount</th>
              <th className={s.th}>Mode</th>
              <th className={s.th}>Status</th>
              <th className={s.th}>Date</th>
              <th className={s.th} style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={8} className={s.td} style={{ padding: 0, border: 'none' }}>
                  <div className={s.emptyState}>
                    <span className={s.emptyIcon}>⊘</span>
                    <p className={s.emptyTitle}>No payments found</p>
                    <p className={s.emptyHint}>{emptyHint()}</p>
                  </div>
                </td>
              </tr>
            ) : rows}
          </tbody>
        </table>

        {/* Table Footer */}
        {filtered.length > 0 && (
          <div className={s.tableFooter}>{footerText}</div>
        )}
      </div>

    </div>
  );
}