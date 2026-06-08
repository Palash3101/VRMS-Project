// app/(dashboard)/vendor/page.tsx
// Vendor Main Dashboard — Week 3 Day 15
// Pattern: mirrors admin/page.tsx. Dynamic chart imports (ssr: false).
// All mock data tagged TODO: API for backend teammate.

'use client';

import dynamic from 'next/dynamic';
import styles from './vendor.module.css';

// Reuse existing chart components — no new chart files needed
const RevenueChart = dynamic(
  () => import('../admin/_components/RevenueChart'),
  { ssr: false }
);
const LeadsChart = dynamic(
  () => import('../admin/_components/LeadsChart'),
  { ssr: false }
);

// TODO: API — replace with GET /api/vendor/stats
const vendorStats = {
  totalEarnings: 43600,
  activeOrders:  3,
  leadsAssigned: 5,
};

// TODO: API — replace with GET /api/vendor/recent-orders
const recentOrders = [
  { id: 1, orderNo: 'ORD-2024-0001', customer: 'Meera Nair',    amount: 12500, status: 'Delivered'  },
  { id: 2, orderNo: 'ORD-2024-0003', customer: 'Rohan Gupta',   amount: 18200, status: 'Processing' },
  { id: 3, orderNo: 'ORD-2024-0006', customer: 'Anita Desai',   amount:  8400, status: 'Dispatched' },
  { id: 4, orderNo: 'ORD-2024-0009', customer: 'Vikram Mehta',  amount:  4500, status: 'Pending'    },
];

// Semantic rgba tint pattern — locked. Same map used across all dashboards.
const orderStatusStyle: Record<string, { background: string; color: string }> = {
  Delivered:  { background: 'rgba(76, 175, 80, 0.1)',   color: 'var(--color-success)' },
  Processing: { background: 'rgba(245, 197, 24, 0.15)', color: '#B8940A'              },
  Dispatched: { background: 'rgba(26, 26, 26, 0.07)',   color: 'var(--color-text)'    },
  Pending:    { background: 'rgba(229, 57, 53, 0.1)',   color: 'var(--color-error)'   },
};

export default function VendorDashboard() {

  const isLoading = false; // TODO: API — set true while fetching, false on data arrival

  return (
    <main className={styles.page}>

      {/* ── Page Header ───────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          {/* Editorial restraint: heading is muted, not dark */}
          <h1 className={styles.heading}>Dashboard</h1>
          <p className={styles.sub}>Welcome back, Rajiv. Here's what's happening today.</p>
        </div>
      </div>

      {/* ── Stat Strip ────────────────────────────────────── */}
      {/* One shared border, internal border-right dividers via inline style — NOT individual cards */}
      <div className={styles.statStrip}>

        <div
          className={styles.statTile}
          style={{ borderRight: '1px solid var(--color-border)' }}
        >
          {isLoading ? <div className="skeleton skeletonLabel" style={{ width: 56 }} /> : <span className={styles.statLabel}>Total Earnings</span>}
          {isLoading ? <div className="skeleton skeletonStat" /> : (
            <span className={styles.statValue}>
              ₹{vendorStats.totalEarnings.toLocaleString('en-IN')}
            </span>
          )}
        </div>

        {/* Active tile — yellow dot signals live in-flight data */}
        <div
          className={`${styles.statTile} ${styles.statTileActive}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
        >
          {isLoading ? (
            <div className="skeleton skeletonLabel" style={{ width: 56 }} />
          ) : (
            <span className={styles.statLabel}>
              <span className={styles.statActiveDot} />
              Active Orders
            </span>
          )}
          {isLoading ? <div className="skeleton skeletonStat" /> : <span className={styles.statValue}>{vendorStats.activeOrders}</span>}
        </div>

        {/* Last tile: no border-right */}
        <div className={styles.statTile}>
          {isLoading ? <div className="skeleton skeletonLabel" style={{ width: 56 }} /> : <span className={styles.statLabel}>Leads Assigned</span>}
          {isLoading ? <div className="skeleton skeletonStat" /> : <span className={styles.statValue}>{vendorStats.leadsAssigned}</span>}
        </div>

      </div>

      {/* ── Chart Grid ────────────────────────────────────── */}
      {/* 2-col. Reuses admin chart components. Dynamic import ssr:false — locked pattern. */}
      <div className={styles.chartGrid}>
        <div className={styles.chartPanel}>
          <p className={styles.chartTitle}>Revenue Over Time</p>
          {isLoading ? <div className="skeleton skeletonChart" /> : <RevenueChart />}
        </div>
        <div className={styles.chartPanel}>
          <p className={styles.chartTitle}>Leads by Month</p>
          {isLoading ? <div className="skeleton skeletonChart" /> : <LeadsChart />}
        </div>
      </div>

      {/* ── Recent Orders Table ───────────────────────────── */}
      <div className={styles.tableSection}>
        <p className={styles.sectionHeading}>Recent Orders</p>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Order No.</th>
                <th className={styles.th}>Customer</th>
                <th className={styles.th}>Amount</th>
                <th className={styles.th}>Status</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                /* Block D - Skeleton Rows (colSpan changed to 4 to match headers) */
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={`skel-${i}`}>
                    <td colSpan={4} style={{ padding: '10px 24px' }}>
                      <div className="skeleton skeletonRow" style={{ height: '40px' }} />
                    </td>
                  </tr>
                ))
              ) : (
                /* Existing Data Rows */
                recentOrders.map((order, i) => {
                  const isLast = i === recentOrders.length - 1;
                  const tdBorder = isLast
                    ? { borderBottom: 'none' }
                    : undefined;

                  return (
                    <tr key={order.id} className={styles.row}>

                      {/* Order No. */}
                      <td className={styles.td} style={tdBorder}>
                        <code className={styles.monoChip}>{order.orderNo}</code>
                      </td>

                      {/* Customer */}
                      <td className={styles.td} style={tdBorder}>
                        <div className={styles.customerCell}>
                          <span className={styles.avatar}>
                            {order.customer[0]}
                          </span>
                          <span className={styles.customerName}>
                            {order.customer}
                          </span>
                        </div>
                      </td>

                      {/* Amount */}
                      <td className={styles.td} style={tdBorder}>
                        <span className={styles.amount}>
                          ₹{order.amount.toLocaleString('en-IN')}
                        </span>
                      </td>

                      {/* Status */}
                      <td className={styles.td} style={tdBorder}>
                        <span
                          className={styles.statusBadge}
                          style={orderStatusStyle[order.status]}
                        >
                          <span
                            className={styles.statusDot}
                            style={{ background: orderStatusStyle[order.status].color }}
                          />
                          {order.status}
                        </span>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table footer — live filtered count */}
        <div className={styles.tableFooter}>
          {recentOrders.length} order(s) · recent activity
        </div>

      </div>
    </main>
  );
}