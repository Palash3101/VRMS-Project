'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import styles from './reports.module.css';

// ── Dynamic chart imports — Chart.js touches window, must be client-only ──
const RevenueChart = dynamic(
  () => import('../_components/RevenueChart'),
  { ssr: false }
);
const LeadsChart = dynamic(
  () => import('../_components/LeadsChart'),
  { ssr: false }
);

// ─── Mock Data ─────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/admin/reports/summary
const summaryStats = {
  totalRevenue:  86950,
  totalOrders:   6,
  leadsConverted: 3,
  avgOrderValue: 14492,
};

// TODO: API — replace with GET /api/admin/reports/vendor-performance
const vendorPerformance = [
  { id: 1, name: 'TechServe Pvt.',   leadsHandled: 5, ordersClosed: 3, revenue: 43600 },
  { id: 2, name: 'BuildCorp Ltd.',   leadsHandled: 4, ordersClosed: 2, revenue: 17950 },
  { id: 3, name: 'SwiftSupply Co.', leadsHandled: 3, ordersClosed: 1, revenue:  5500  },
  { id: 4, name: 'NexaWorks',        leadsHandled: 2, ordersClosed: 0, revenue:     0  },
];

// ── Max values for progress bars ──
const maxLeads   = Math.max(...vendorPerformance.map(v => v.leadsHandled), 1);
const maxOrders  = Math.max(...vendorPerformance.map(v => v.ordersClosed), 1);
const maxRevenue = Math.max(...vendorPerformance.map(v => v.revenue), 1);

type ActiveStat = 'revenue' | 'orders' | 'leads' | 'avg';

// ─── SVG Icons (inline — no icon lib dependency) ───────────────────────────
function DownloadIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M7 1v8M4 6l3 3 3-3M2 11h10"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function ReportsPage() {
  const [activeStat, setActiveStat] = useState<ActiveStat>('revenue');
  const [dateRange, setDateRange] = useState('this_month');

  const statTiles: { key: ActiveStat; label: string; value: string }[] = [
    {
      key:   'revenue',
      label: 'Total Revenue',
      value: `₹${summaryStats.totalRevenue.toLocaleString('en-IN')}`,
    },
    {
      key:   'orders',
      label: 'Total Orders',
      value: String(summaryStats.totalOrders),
    },
    {
      key:   'leads',
      label: 'Leads Converted',
      value: String(summaryStats.leadsConverted),
    },
    {
      key:   'avg',
      label: 'Avg. Order Value',
      value: `₹${summaryStats.avgOrderValue.toLocaleString('en-IN')}`,
    },
  ];

  return (
    <main className={styles.page}>

      {/* ── Toolbar ──────────────────────────────────────────────── */}
      <div className={styles.toolbar}>
        <div>
          <h1 className={styles.heading}>Reports &amp; Analytics</h1>
          <p className={styles.sub}>Financial and operational overview</p>
        </div>

        <div className={styles.exportRow}>
          {/* TODO: API — wire to PDF export endpoint */}
          <button className={styles.exportBtn} onClick={() => {}}>
            <DownloadIcon />
            Export PDF
          </button>

          {/* TODO: API — wire to Excel export endpoint */}
          <button className={styles.exportBtn} onClick={() => {}}>
            <DownloadIcon />
            Export Excel
          </button>

          {/* TODO: API — pass dateRange to data queries */}
          <select
            className={styles.dateSelect}
            value={dateRange}
            onChange={e => setDateRange(e.target.value)}
          >
            <option value="today">Today</option>
            <option value="this_week">This Week</option>
            <option value="this_month">This Month</option>
            <option value="last_month">Last Month</option>
            <option value="this_year">This Year</option>
          </select>
        </div>
      </div>

      {/* ── Stat Strip ───────────────────────────────────────────── */}
      <div className={styles.statStrip}>
        {statTiles.map((tile, i) => (
          <button
            key={tile.key}
            className={`${styles.statTile} ${activeStat === tile.key ? styles.statTileActive : ''}`}
            style={i < statTiles.length - 1 ? { borderRight: '1px solid var(--color-border)' } : {}}
            onClick={() => setActiveStat(tile.key)}
          >
            {activeStat === tile.key && <span className={styles.statActiveDot} />}
            <span className={styles.statValue}>{tile.value}</span>
            <span className={styles.statLabel}>{tile.label}</span>
          </button>
        ))}
      </div>

      {/* ── Chart Grid ───────────────────────────────────────────── */}
      <div className={styles.chartGrid}>
        <div className={styles.chartPanel}>
          <p className={styles.chartTitle}>Revenue Trend</p>
          <RevenueChart />
        </div>
        <div className={styles.chartPanel}>
          <p className={styles.chartTitle}>Leads Overview</p>
          <LeadsChart />
        </div>
      </div>

      {/* ── Vendor Performance Table ──────────────────────────────── */}
      <div className={styles.tableSection}>
        <h2 className={styles.sectionHeading}>Vendor Performance</h2>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '34%' }}>Vendor</th>
                <th className={styles.th} style={{ width: '22%' }}>Leads Handled</th>
                <th className={styles.th} style={{ width: '22%' }}>Orders Closed</th>
                <th className={styles.th} style={{ width: '22%' }}>Revenue</th>
              </tr>
            </thead>
            <tbody>
              {vendorPerformance.map(vendor => (
                <tr key={vendor.id} className={styles.row}>

                  {/* Vendor name + avatar */}
                  <td className={styles.td}>
                    <div className={styles.vendorCell}>
                      <span className={styles.avatar}>
                        {vendor.name[0]}
                      </span>
                      <span className={styles.vendorName}>{vendor.name}</span>
                    </div>
                  </td>

                  {/* Leads handled — progress bar + number */}
                  <td className={styles.td}>
                    <div className={styles.metricCell}>
                      <span
                        className={styles.metricBar}
                        style={{ width: `${(vendor.leadsHandled / maxLeads) * 64}px` }}
                      />
                      <span className={styles.metricNum}>{vendor.leadsHandled}</span>
                    </div>
                  </td>

                  {/* Orders closed — progress bar + number */}
                  <td className={styles.td}>
                    <div className={styles.metricCell}>
                      {vendor.ordersClosed > 0 ? (
                        <>
                          <span
                            className={styles.metricBar}
                            style={{ width: `${(vendor.ordersClosed / maxOrders) * 64}px` }}
                          />
                          <span className={styles.metricNum}>{vendor.ordersClosed}</span>
                        </>
                      ) : (
                        <span className={styles.revenueZero}>—</span>
                      )}
                    </div>
                  </td>

                  {/* Revenue */}
                  <td className={styles.td}>
                    {vendor.revenue > 0 ? (
                      <span className={styles.revenueValue}>
                        ₹{vendor.revenue.toLocaleString('en-IN')}
                      </span>
                    ) : (
                      <span className={styles.revenueZero}>No revenue yet</span>
                    )}
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.tableFooter}>
            {vendorPerformance.length} vendor(s) · {dateRange.replace('_', ' ')}
          </div>
        </div>
      </div>

    </main>
  );
}