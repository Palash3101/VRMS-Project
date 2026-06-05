'use client';

import { useState } from 'react';
import styles from './customer.module.css';

// ── Types ────────────────────────────────────────────────────────
interface Order {
  id: number;
  order_no: string;
  vendor: string;
  product: string;
  amount: number;
  gst: number;
  status: string;
  date: string;
  tracking: string | null;
}

type OrderFilter = 'All' | 'active' | 'delivered' | 'cancelled';

// ── Constants ────────────────────────────────────────────────────
const PIPELINE = ['Placed', 'Processing', 'Dispatched', 'Delivered'] as const;
type PipelineStatus = (typeof PIPELINE)[number];

// ── Mock data ────────────────────────────────────────────────────
// TODO: API — replace with GET /api/customer/orders
const mockOrders: Order[] = [
  { id: 1, order_no: 'ORD-2024-0101', vendor: 'TechSupply Co.',  product: 'Industrial Drill Kit',   amount: 12400, gst: 2232, status: 'Dispatched',  date: '2024-12-15', tracking: 'DTDC-887612'     },
  { id: 2, order_no: 'ORD-2024-0098', vendor: 'BuildMart',       product: 'Safety Helmets × 10',   amount: 3800,  gst: 684,  status: 'Processing',   date: '2024-12-17', tracking: null              },
  { id: 3, order_no: 'ORD-2024-0091', vendor: 'OfficeWorld',     product: 'Ergonomic Chair',       amount: 18500, gst: 3330, status: 'Delivered',    date: '2024-12-08', tracking: 'BLUEDART-443221' },
  { id: 4, order_no: 'ORD-2024-0087', vendor: 'TechSupply Co.',  product: 'Cable Management Kit',  amount: 2200,  gst: 396,  status: 'Delivered',    date: '2024-11-28', tracking: 'DTDC-776543'     },
  { id: 5, order_no: 'ORD-2024-0083', vendor: 'CleanPro',        product: 'Industrial Vacuum',     amount: 9600,  gst: 1728, status: 'Placed',       date: '2024-12-19', tracking: null              },
  { id: 6, order_no: 'ORD-2024-0076', vendor: 'BuildMart',       product: 'Scaffolding Set',       amount: 24000, gst: 4320, status: 'Cancelled',    date: '2024-11-20', tracking: null              },
];

// ── Helpers ──────────────────────────────────────────────────────
function isActive(status: string) {
  return status === 'Placed' || status === 'Processing' || status === 'Dispatched';
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

function fmtDate(d: string) {
  return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
}

function statusStyle(status: string): { bg: string; color: string; dot: string } {
  if (status === 'Delivered')  return { bg: 'rgba(76,175,80,0.10)',   color: 'var(--color-success)', dot: 'var(--color-success)' };
  if (status === 'Dispatched') return { bg: 'rgba(26,26,26,0.07)',    color: 'var(--color-text)',    dot: 'var(--color-text)'    };
  if (status === 'Processing') return { bg: 'rgba(245,197,24,0.15)',  color: '#B8940A',              dot: '#B8940A'              };
  if (status === 'Placed')     return { bg: 'rgba(155,155,155,0.10)', color: 'var(--color-muted)',   dot: 'var(--color-muted)'  };
  if (status === 'Cancelled')  return { bg: 'rgba(229,57,53,0.10)',   color: 'var(--color-error)',   dot: 'var(--color-error)'  };
  return { bg: 'rgba(155,155,155,0.10)', color: 'var(--color-muted)', dot: 'var(--color-muted)' };
}

// ── Stepper sub-component ─────────────────────────────────────────
function OrderStepper({ status }: { status: string }) {
  const activeIdx = PIPELINE.indexOf(status as PipelineStatus);
  return (
    <div className={styles.stepper}>
      {PIPELINE.flatMap((step, i) => {
        const isDone   = i < activeIdx;
        const isActiveStep = i === activeIdx;
        const dotCls   = [styles.stepDot, isDone ? styles.stepDotDone : isActiveStep ? styles.stepDotActive : ''].filter(Boolean).join(' ');
        const labelCls = [styles.stepLabel, isDone ? styles.stepLabelDone : isActiveStep ? styles.stepLabelActive : ''].filter(Boolean).join(' ');
        const result: React.ReactNode[] = [
          <div key={step} className={styles.stepItem}>
            <div className={dotCls} />
            <span className={labelCls}>{step}</span>
          </div>,
        ];
        if (i < PIPELINE.length - 1) {
          result.push(
            <div
              key={`line-${i}`}
              className={[styles.stepLine, isDone ? styles.stepLineDone : ''].filter(Boolean).join(' ')}
            />
          );
        }
        return result;
      })}
    </div>
  );
}

// ── Page component ───────────────────────────────────────────────
export default function CustomerDashboard() {
  const [orderFilter, setOrderFilter] = useState<OrderFilter>('All');
  const [search, setSearch]           = useState('');
  const [expandedId, setExpandedId]   = useState<number | null>(null);

  // ── Derived stats ────────────────────────────────────────────
  const activeCount    = mockOrders.filter(o => isActive(o.status)).length;
  const deliveredCount = mockOrders.filter(o => o.status === 'Delivered').length;
  const totalSpent     = mockOrders
    .filter(o => o.status !== 'Cancelled')
    .reduce((sum, o) => sum + o.amount + o.gst, 0);

  // ── Featured order ───────────────────────────────────────────
  const featuredOrder = mockOrders.find(o => isActive(o.status)) ?? null;

  // ── Filter pills config ──────────────────────────────────────
  const FILTER_PILLS: { label: string; filter: OrderFilter; count: number }[] = [
    { label: 'All',       filter: 'All',       count: mockOrders.length },
    { label: 'Active',    filter: 'active',    count: activeCount        },
    { label: 'Delivered', filter: 'delivered', count: deliveredCount     },
    { label: 'Cancelled', filter: 'cancelled', count: mockOrders.filter(o => o.status === 'Cancelled').length },
  ];

  // ── Filtered list ────────────────────────────────────────────
  const filtered = mockOrders
    .filter(o => {
      if (orderFilter === 'active')    return isActive(o.status);
      if (orderFilter === 'delivered') return o.status === 'Delivered';
      if (orderFilter === 'cancelled') return o.status === 'Cancelled';
      return true;
    })
    .filter(o => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      return (
        o.order_no.toLowerCase().includes(q) ||
        o.vendor.toLowerCase().includes(q)   ||
        o.product.toLowerCase().includes(q)
      );
    });

  // ── Footer context string ─────────────────────────────────────
  function footerText() {
    let base = `${filtered.length} order${filtered.length !== 1 ? 's' : ''}`;
    if (orderFilter !== 'All') base += ` · filtered by ${orderFilter}`;
    if (search.trim())         base += ` · matching "${search.trim()}"`;
    return base;
  }

  // ── Empty state hint ──────────────────────────────────────────
  function emptyHint() {
    if (search.trim())         return `No orders match "${search.trim()}"`;
    if (orderFilter !== 'All') return `No ${orderFilter} orders found`;
    return 'Your order history will appear here';
  }

  return (
    <main className={styles.pageWrap}>
      {/* Page header */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Dashboard</h1>
          <p className={styles.pageSubtitle}>Welcome back, Kavya — here's your order activity.</p>
        </div>
      </div>

      {/* Stat strip */}
      <div className={styles.statStrip}>
        {/* Active Orders — clickable */}
        <div
          className={`${styles.statTile} ${styles.statTileClickable}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => { setOrderFilter('active'); setSearch(''); }}
          role="button" tabIndex={0}
        >
          <div className={styles.statValue}>{activeCount}</div>
          <div className={styles.statLabel}>Active Orders</div>
          {orderFilter === 'active' && <div className={styles.statActiveDot} />}
        </div>

        {/* Delivered — clickable */}
        <div
          className={`${styles.statTile} ${styles.statTileClickable}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => { setOrderFilter('delivered'); setSearch(''); }}
          role="button" tabIndex={0}
        >
          <div className={styles.statValue}>{deliveredCount}</div>
          <div className={styles.statLabel}>Delivered</div>
          {orderFilter === 'delivered' && <div className={styles.statActiveDot} />}
        </div>

        {/* Total Spent — display only */}
        <div className={styles.statTile}>
          <div className={styles.statValue}>{fmt(totalSpent)}</div>
          <div className={styles.statLabel}>Total Spent</div>
        </div>
      </div>

      {/* Featured order card */}
      {featuredOrder && (
        <div className={styles.featuredCard}>
          <div className={styles.featuredLeft}>
            <div className={styles.featuredCardLabel}>Active Order</div>
            <code className={styles.featuredOrderNo}>{featuredOrder.order_no}</code>
            <div className={styles.featuredProduct}>{featuredOrder.product}</div>
            <div className={styles.featuredVendor}>{featuredOrder.vendor}</div>
          </div>
          <div className={styles.featuredRight}>
            <div className={styles.featuredCardLabel}>Order Status</div>
            <OrderStepper status={featuredOrder.status} />
          </div>
        </div>
      )}

      {/* Controls */}
      <div className={styles.controlsRow}>
        <div className={styles.filterGroup}>
          {FILTER_PILLS.map(p => (
            <button
              key={p.filter}
              className={`${styles.filterTab} ${orderFilter === p.filter ? styles.filterTabActive : ''}`}
              onClick={() => { setOrderFilter(p.filter); setSearch(''); }}
            >
              {p.label}
              <span className={styles.filterCount}>{p.count}</span>
            </button>
          ))}
        </div>

        <label className={styles.searchWrap}>
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 15 15" fill="none">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.5"/>
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
          </svg>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search orders, vendors…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* Order history table */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Order No.</th>
              <th className={styles.th}>Vendor</th>
              <th className={styles.th}>Product</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Amount</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Date</th>
              <th className={styles.th} style={{ textAlign: 'right' }}></th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7}>
                  <div className={styles.emptyState}>
                    <div className={styles.emptyIcon}>⊘</div>
                    <p className={styles.emptyTitle}>No orders found</p>
                    <p className={styles.emptyHint}>{emptyHint()}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.flatMap((order, idx) => {
                const isExpanded = expandedId === order.id;
                const isLast     = idx === filtered.length - 1;
                const ss         = statusStyle(order.status);

                const dataRow = (
                  <tr
                    key={`row-${order.id}`}
                    className={`${styles.row} ${isExpanded ? styles.rowExpanded : ''} ${isLast && !isExpanded ? styles.lastRow : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : order.id)}
                  >
                    {/* Order No */}
                    <td className={styles.td}>
                      <code className={styles.monoChip}>{order.order_no}</code>
                    </td>

                    {/* Vendor */}
                    <td className={styles.td} style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
                      {order.vendor}
                    </td>

                    {/* Product */}
                    <td className={styles.td} style={{ fontWeight: 500 }}>
                      {order.product}
                    </td>

                    {/* Amount */}
                    <td className={styles.td}>
                      <div className={styles.amountCell}>
                        <span className={styles.amountValue}>{fmt(order.amount)}</span>
                        <span className={styles.gstSubline}>+GST {fmt(order.gst)}</span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className={styles.td}>
                      <span
                        className={styles.badge}
                        style={{ background: ss.bg, color: ss.color }}
                      >
                        <span className={styles.badgeDot} style={{ background: ss.dot }} />
                        {order.status}
                      </span>
                    </td>

                    {/* Date */}
                    <td className={styles.td} style={{ color: 'var(--color-muted)', fontSize: '13px' }}>
                      {fmtDate(order.date)}
                    </td>

                    {/* Expand toggle */}
                    <td className={`${styles.td} ${styles.expandToggle}`}>
                      {isExpanded ? '▲ Hide' : '▼ Details'}
                    </td>
                  </tr>
                );

                if (!isExpanded) return [dataRow];

                const detailRow = (
                  <tr
                    key={`detail-${order.id}`}
                    className={`${styles.detailRow} ${isLast ? styles.detailRowLast : ''}`}
                  >
                    <td colSpan={7} className={styles.td} style={{ padding: 0, borderBottom: isLast ? 'none' : undefined }}>
                      <div className={styles.detailPanel}>
                        {/* Section 1: Order Details */}
                        <div className={styles.detailSection}>
                          <div className={styles.detailSectionTitle}>Order Details</div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldKey}>Order No.</span>
                            <code className={styles.monoChip}>{order.order_no}</code>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldKey}>Vendor</span>
                            <span className={styles.detailFieldVal}>{order.vendor}</span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldKey}>Product</span>
                            <span className={styles.detailFieldVal}>{order.product}</span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldKey}>Amount Breakdown</span>
                            <div className={styles.gstBreakdown}>
                              <div className={styles.gstRow}>
                                <span className={styles.gstKey}>Base Amount</span>
                                <span className={styles.gstVal}>{fmt(order.amount)}</span>
                              </div>
                              <div className={styles.gstRow}>
                                <span className={styles.gstKey}>GST (18%)</span>
                                <span className={styles.gstVal}>{fmt(order.gst)}</span>
                              </div>
                              <div className={`${styles.gstRow} ${styles.gstTotalRow}`}>
                                <span className={styles.gstKey} style={{ fontWeight: 600, color: 'var(--color-text)' }}>Total</span>
                                <span className={styles.gstVal}>{fmt(order.amount + order.gst)}</span>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className={styles.detailDivider} />

                        {/* Section 2: Delivery Info */}
                        <div className={styles.detailSection}>
                          <div className={styles.detailSectionTitle}>Delivery Info</div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldKey}>Current Status</span>
                            <span
                              className={styles.badge}
                              style={{ background: ss.bg, color: ss.color, alignSelf: 'flex-start' }}
                            >
                              <span className={styles.badgeDot} style={{ background: ss.dot }} />
                              {order.status}
                            </span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldKey}>Order Date</span>
                            <span className={styles.detailFieldVal}>{fmtDate(order.date)}</span>
                          </div>

                          {order.status === 'Delivered' && (
                            <div className={styles.detailField}>
                              <span className={styles.detailFieldKey}>Delivery Note</span>
                              <span className={styles.detailFieldVal} style={{ color: 'var(--color-success)', fontWeight: 600 }}>
                                Successfully delivered
                              </span>
                            </div>
                          )}

                          {order.status === 'Cancelled' && (
                            <div className={styles.detailField}>
                              <span className={styles.detailFieldKey}>Cancellation Note</span>
                              <span className={styles.detailFieldVal} style={{ color: 'var(--color-error)' }}>
                                Order was cancelled
                              </span>
                            </div>
                          )}

                          {order.tracking && (
                            <div className={styles.detailField}>
                              <span className={styles.detailFieldKey}>Tracking</span>
                              {/* TODO: API — link to courier tracking URL */}
                              <span className={styles.trackingChip}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                  <rect x="1" y="3" width="15" height="13" rx="1"/>
                                  <path d="M16 8h4l3 3v5h-7V8z"/>
                                  <circle cx="5.5" cy="18.5" r="2.5"/>
                                  <circle cx="18.5" cy="18.5" r="2.5"/>
                                </svg>
                                {order.tracking}
                              </span>
                            </div>
                          )}

                          {!order.tracking && isActive(order.status) && (
                            <div className={styles.detailField}>
                              <span className={styles.detailFieldKey}>Tracking</span>
                              <span className={styles.detailFieldVal} style={{ color: 'var(--color-muted)' }}>
                                Not yet assigned
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </td>
                  </tr>
                );

                return [dataRow, detailRow];
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className={styles.tableFooter}>
          <span>{footerText()}</span>
          {(orderFilter !== 'All' || search.trim()) && (
            <button className={styles.clearFilter} onClick={() => { setOrderFilter('All'); setSearch(''); }}>
              Clear filter
            </button>
          )}
        </div>
      </div>
    </main>
  );
}