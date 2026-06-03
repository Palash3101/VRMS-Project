'use client';

import React, { useState } from 'react';
import s from './orders.module.css';

// TODO: API — replace with GET /api/vendor/orders
const vendorOrders = [
  { id: 1, orderNo: 'ORD-2024-0004', customer: 'Priya Sharma',  product: 'Industrial Valve',    amount: 15200, gst: 2736, status: 'Pending'    },
  { id: 2, orderNo: 'ORD-2024-0007', customer: 'Arjun Bose',    product: 'Steel Fittings Set',  amount:  8400, gst: 1512, status: 'Processing' },
  { id: 3, orderNo: 'ORD-2024-0011', customer: 'Sunita Rao',    product: 'Pipe Connector Kit',  amount: 22000, gst: 3960, status: 'Dispatched' },
  { id: 4, orderNo: 'ORD-2024-0015', customer: 'Deepak Joshi',  product: 'Pressure Gauge',      amount:  4800, gst:  864, status: 'Delivered'  },
  { id: 5, orderNo: 'ORD-2024-0018', customer: 'Kavitha Menon', product: 'Flow Meter',          amount: 31500, gst: 5670, status: 'Pending'    },
];

type FilterTab = 'All' | 'Pending' | 'Processing' | 'Dispatched' | 'Delivered';

const FILTER_TABS: FilterTab[] = ['All', 'Pending', 'Processing', 'Dispatched', 'Delivered'];

// Status pipeline — order follows this exact sequence
const STEPS = ['Pending', 'Processing', 'Dispatched', 'Delivered'] as const;
type Step = typeof STEPS[number];

// Status badge inline styles (Rule #9 — dynamic colors via JS map, not dynamic class names)
const STATUS_STYLES: Record<string, { bg: string; color: string; dot: string }> = {
  Pending:    { bg: 'rgba(245, 197, 24, 0.15)',  color: '#B8940A',               dot: '#F5C518' },
  Processing: { bg: 'rgba(26, 26, 26, 0.08)',    color: 'var(--color-text)',      dot: '#1A1A1A' },
  Dispatched: { bg: 'rgba(76, 175, 80, 0.12)',   color: 'var(--color-success)',   dot: '#4CAF50' },
  Delivered:  { bg: 'rgba(76, 175, 80, 0.18)',   color: 'var(--color-success)',   dot: '#4CAF50' },
  Cancelled:  { bg: 'rgba(229, 57, 53, 0.1)',    color: 'var(--color-error)',     dot: '#E53935' },
};

/** Format a number as Indian-locale rupees */
function fmt(n: number): string {
  return '₹' + n.toLocaleString('en-IN');
}

export default function VendorOrdersPage() {
  const [filter, setFilter]       = useState<FilterTab>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // TODO: API — optimistic local state; sync with PATCH /api/vendor/orders/:id on each change
  const [orderStatuses, setOrderStatuses] = useState<Record<number, string>>(
    Object.fromEntries(vendorOrders.map(o => [o.id, o.status]))
  );

  // ─── Handlers ──────────────────────────────────────────────────────────────

  function handleAccept(e: React.MouseEvent, id: number) {
    e.stopPropagation(); // prevent row expand from firing
    setOrderStatuses(prev => ({ ...prev, [id]: 'Processing' }));
    // TODO: API — PATCH /api/vendor/orders/:id { status: 'Processing' }
  }

  function handleReject(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    setOrderStatuses(prev => ({ ...prev, [id]: 'Cancelled' }));
    // TODO: API — PATCH /api/vendor/orders/:id { status: 'Cancelled' }
  }

  function toggleExpand(id: number) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function changeFilter(tab: FilterTab) {
    setFilter(tab);
    setExpandedId(null); // collapse any open row when switching filter
  }

  // ─── Derived data ──────────────────────────────────────────────────────────

  // Live counts reflect optimistic state so filter pills stay accurate after Accept/Reject
  const counts: Record<FilterTab, number> = {
    All:        vendorOrders.length,
    Pending:    vendorOrders.filter(o => orderStatuses[o.id] === 'Pending').length,
    Processing: vendorOrders.filter(o => orderStatuses[o.id] === 'Processing').length,
    Dispatched: vendorOrders.filter(o => orderStatuses[o.id] === 'Dispatched').length,
    Delivered:  vendorOrders.filter(o => orderStatuses[o.id] === 'Delivered').length,
  };

  const filtered = vendorOrders.filter(o =>
    filter === 'All' || orderStatuses[o.id] === filter
  );

  // ─── Render ────────────────────────────────────────────────────────────────

  return (
    <main className={s.page}>
      <h1 className={s.heading}>Orders</h1>

      {/* ── Filter pills ───────────────────────────────────────────────────── */}
      <div className={s.topRow}>
        <div className={s.filterGroup}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              className={filter === tab ? `${s.filterTab} ${s.filterTabActive}` : s.filterTab}
              onClick={() => changeFilter(tab)}
            >
              {tab}
              <span className={s.filterCount}>{counts[tab]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Stat strip ─────────────────────────────────────────────────────── */}
      {/* Rule #12 — one shared border; internal border-right via inline style on all but last */}
      <div className={s.statStrip}>
        {FILTER_TABS.map((tab, i) => (
          <button
            key={tab}
            className={`${s.statTile} ${filter === tab ? s.statTileActive : ''}`}
            style={i < FILTER_TABS.length - 1 ? { borderRight: '1px solid var(--color-border)' } : {}}
            onClick={() => changeFilter(tab)}
          >
            {filter === tab && tab !== 'All' && <span className={s.statActiveDot} />}
            <span className={s.statValue}>{counts[tab]}</span>
            <span className={s.statLabel}>{tab === 'All' ? 'All Orders' : tab}</span>
          </button>
        ))}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead>
            <tr>
              <th className={s.th}>Order</th>
              <th className={s.th}>Customer</th>
              <th className={s.th}>Product</th>
              <th className={s.th}>Amount</th>
              <th className={s.th}>Status</th>
              <th className={s.th}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              /* ── Empty state (Rule #16) ─────────────────────────────────── */
              <tr>
                <td colSpan={6} className={s.emptyCell}>
                  <div className={s.emptyState}>
                    <span className={s.emptyGlyph}>⊘</span>
                    <span className={s.emptyTitle}>No orders found</span>
                    <span className={s.emptyHint}>
                      {filter !== 'All'
                        ? `No orders with status "${filter}"`
                        : 'No orders have been assigned yet'}
                    </span>
                  </div>
                </td>
              </tr>
            ) : (
              /*
               * flatMap renders data rows + optional inline detail rows
               * without React.Fragment key issues.
               */
              filtered.flatMap((order, index) => {
                const st          = orderStatuses[order.id];
                const style       = STATUS_STYLES[st] ?? STATUS_STYLES.Pending;
                const isExpanded  = expandedId === order.id;
                const isLast      = index === filtered.length - 1;
                const stepIdx     = STEPS.indexOf(st as Step); // -1 if Cancelled

                const rows: React.ReactElement[] = [

                  /* ── Data row ─────────────────────────────────────────── */
                  <tr
                    key={order.id}
                    className={[
                      s.row,
                      isExpanded               ? s.rowExpanded : '',
                      isLast && !isExpanded    ? s.lastRow     : '',
                    ].filter(Boolean).join(' ')}
                    onClick={() => toggleExpand(order.id)}
                  >
                    {/* Order No (Rule #15 — monospace chip) */}
                    <td className={s.td}>
                      <code className={s.monoChip}>{order.orderNo}</code>
                    </td>

                    {/* Customer — 36px dark circle avatar + name */}
                    <td className={s.td}>
                      <div className={s.customerCell}>
                        <span className={s.avatar}>{order.customer.charAt(0)}</span>
                        <span className={s.customerName}>{order.customer}</span>
                      </div>
                    </td>

                    {/* Product */}
                    <td className={s.td}>
                      <span className={s.productName}>{order.product}</span>
                    </td>

                    {/* Amount — total prominent, GST as sub-line */}
                    <td className={s.td}>
                      <span className={s.amountMain}>{fmt(order.amount + order.gst)}</span>
                      <span className={s.amountSub}>incl. {fmt(order.gst)} GST</span>
                    </td>

                    {/* Status badge (Rule #13 — dot + label always) */}
                    <td className={s.td}>
                      <span
                        className={s.badge}
                        style={{ background: style.bg, color: style.color }}
                      >
                        <span className={s.badgeDot} style={{ background: style.dot }} />
                        {st}
                      </span>
                    </td>

                    {/* Actions — Accept/Reject only on Pending (Rule #5 — 32px) */}
                    <td
                      className={s.td}
                      onClick={e => e.stopPropagation()} /* prevent row expand on button click */
                    >
                      {st === 'Pending' && (
                        <div className={s.actionBtns}>
                          <button
                            className={s.acceptBtn}
                            onClick={e => handleAccept(e, order.id)}
                          >
                            Accept
                          </button>
                          <button
                            className={s.rejectBtn}
                            onClick={e => handleReject(e, order.id)}
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>,
                ];

                /* ── Inline detail panel (expands below the row, not a modal) ── */
                if (isExpanded) {
                  rows.push(
                    <tr
                      key={`detail-${order.id}`}
                      className={isLast ? `${s.detailRow} ${s.detailRowLast}` : s.detailRow}
                    >
                      <td colSpan={6} className={s.detailCell}>
                        <div className={s.detailPanel}>

                          {/* ── Left: Order details ──────────────────────── */}
                          <div className={s.detailSection}>
                            <p className={s.detailSectionTitle}>Order Details</p>

                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Order No</span>
                              <code className={s.monoChip}>{order.orderNo}</code>
                            </div>
                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Customer</span>
                              <span className={s.detailValue}>{order.customer}</span>
                            </div>
                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Product</span>
                              <span className={s.detailValue}>{order.product}</span>
                            </div>
                          </div>

                          <div className={s.detailDivider} />

                          {/* ── Middle: GST breakdown ────────────────────── */}
                          <div className={s.detailSection}>
                            <p className={s.detailSectionTitle}>Payment Breakdown</p>

                            <div className={s.gstBreakdown}>
                              <div className={s.gstRow}>
                                <span className={s.gstLabel}>Base Amount</span>
                                <span className={s.gstValue}>{fmt(order.amount)}</span>
                              </div>
                              <div className={s.gstRow}>
                                <span className={s.gstLabel}>GST (18%)</span>
                                <span className={s.gstValue}>{fmt(order.gst)}</span>
                              </div>
                              <div className={`${s.gstRow} ${s.gstTotalRow}`}>
                                <span className={s.gstLabelBold}>Total</span>
                                <span className={s.gstValueBold}>{fmt(order.amount + order.gst)}</span>
                              </div>
                            </div>
                          </div>

                          <div className={s.detailDivider} />

                          {/* ── Right: Status pipeline stepper ───────────── */}
                          <div className={`${s.detailSection} ${s.stepperSection}`}>
                            <p className={s.detailSectionTitle}>Order Status</p>

                            {st === 'Cancelled' ? (
                              <p className={s.cancelledNote}>This order was rejected.</p>
                            ) : (
                              /*
                               * Stepper: Pending → Processing → Dispatched → Delivered
                               * Active dot: yellow + glow ring
                               * Done dot:   dark
                               * Future dot: border color (muted)
                               * Done line:  dark
                               * Future line: border color
                               *
                               * flatMap emits [stepItem, stepLine, stepItem, stepLine, ...stepItem]
                               */
                              <div className={s.stepper}>
                                {STEPS.flatMap((step, i) => {
                                  const isDone   = i < stepIdx;
                                  const isActive = i === stepIdx;

                                  const items: React.ReactElement[] = [
                                    <div key={step} className={s.stepItem}>
                                      <span
                                        className={s.stepDot}
                                        style={{
                                          background: isActive
                                            ? 'var(--color-primary)'
                                            : isDone
                                              ? 'var(--color-dark)'
                                              : 'var(--color-border)',
                                          boxShadow: isActive
                                            ? '0 0 0 3px rgba(245, 197, 24, 0.28)'
                                            : 'none',
                                        }}
                                      />
                                      <span
                                        className={s.stepLabel}
                                        style={{
                                          color: isActive
                                            ? 'var(--color-text)'
                                            : isDone
                                              ? 'var(--color-dark)'
                                              : 'var(--color-muted)',
                                          fontWeight: isActive ? 700 : 600,
                                        }}
                                      >
                                        {step}
                                      </span>
                                    </div>,
                                  ];

                                  // Insert connecting line after every step except the last
                                  if (i < STEPS.length - 1) {
                                    items.push(
                                      <div
                                        key={`line-${i}`}
                                        className={s.stepLine}
                                        style={{
                                          // Line is dark only when the step before it is done
                                          background: isDone
                                            ? 'var(--color-dark)'
                                            : 'var(--color-border)',
                                        }}
                                      />
                                    );
                                  }

                                  return items;
                                })}
                              </div>
                            )}
                          </div>

                        </div>
                      </td>
                    </tr>
                  );
                }

                return rows;
              })
            )}
          </tbody>
        </table>

        {/* ── Table footer ─────────────────────────────────────────────────── */}
        <div className={s.tableFooter}>
          <span className={s.footerText}>
            {filtered.length} order{filtered.length !== 1 ? 's' : ''}
            {filter !== 'All' && (
              <> · filtered by <strong>{filter}</strong></>
            )}
          </span>
        </div>
      </div>
    </main>
  );
}