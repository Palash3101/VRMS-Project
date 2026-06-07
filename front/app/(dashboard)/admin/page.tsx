'use client';

import dynamic from 'next/dynamic';
import styles from './admin.module.css';

// Chart.js requires the browser — load with no SSR
const RevenueChart = dynamic(() => import('./_components/RevenueChart'), {
  ssr: false,
  loading: () => <div className={styles.chartSkeleton} />,
});

const LeadsChart = dynamic(() => import('./_components/LeadsChart'), {
  ssr: false,
  loading: () => <div className={styles.chartSkeleton} />,
});

// TODO: API — replace with GET /api/admin/stats
const kpiStats = [
  { label: 'Total Vendors',    value: '142',     trend: '+8 this month',  positive: true  },
  { label: 'Active Leads',     value: '38',      trend: '+12 this month', positive: true  },
  { label: 'Monthly Revenue',  value: '₹4.8L',   trend: '+6% vs last mo', positive: true  },
  { label: 'Total Orders',     value: '267',     trend: '−3 this month',  positive: false },
];

// TODO: API — replace with GET /api/admin/activity?limit=6
const recentActivity = [
  { id: 1, text: 'Vendor Apex Solutions approved',              time: '2 min ago',  type: 'vendor'   },
  { id: 2, text: 'Lead assigned to TechBridge Pvt. Ltd.',       time: '14 min ago', type: 'lead'     },
  { id: 3, text: 'Order #ORD-2024-0892 marked delivered',       time: '1 hr ago',   type: 'order'    },
  { id: 4, text: 'New customer Priya Menon registered',         time: '2 hr ago',   type: 'customer' },
  { id: 5, text: 'Payment ₹18,400 recorded for ORD-0891',      time: '3 hr ago',   type: 'payment'  },
  { id: 6, text: 'Vendor GlobalMart Pvt. Ltd. pending review', time: '5 hr ago',   type: 'vendor'   },
];

// Color per activity type — JS map, not CSS dynamic class (CSS Modules can't do runtime keys)
const dotColor: Record<string, string> = {
  vendor:   '#F5C518',
  lead:     '#4CAF50',
  order:    '#1A1A1A',
  customer: '#9B9B9B',
  payment:  '#4CAF50',
};

export default function AdminDashboard() {
  const isLoading = false; // TODO: API — set true while fetching, false on data arrival
  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className={styles.page}>

      {/* ── Page header ─────────────────────────────────────────────── */}
      <div className={styles.header}>
        <div>
          <p className={styles.headerDate}>{today}</p>
          <h1 className={styles.headerTitle}>Dashboard</h1>
        </div>
        {/* TODO: API — wire to POST /api/admin/reports/export */}
        <button className={styles.exportBtn} type="button">
          Export Report
        </button>
      </div>

      {/* ── KPI strip ───────────────────────────────────────────────── */}
      <div className={styles.kpiStrip}>
        {kpiStats.map((stat, i) => (
          <div key={i} className={styles.kpiTile}>
            {isLoading
              ? <div className="skeleton skeletonStat" />
              : <span className={styles.kpiValue}>{stat.value}</span>
            }
            {isLoading
              ? <div className="skeleton skeletonLabel" style={{ width: 56 }} />
              : <span className={styles.kpiLabel}>{stat.label}</span>
            } 
            {isLoading
              ? <div className="skeleton skeletonLabel" style={{ width: 72 }} />
              : (
                <span
                  className={styles.kpiTrend}
                  style={{ color: stat.positive ? 'var(--color-success)' : 'var(--color-error)' }}
                >
                  {stat.trend}
                </span>
              )
            }
          </div>
        ))}
      </div>

      {/* ── Revenue chart (full width) ───────────────────────────────── */}
      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle}>Revenue</h2>
          <span className={styles.cardMeta}>Last 6 months</span>
        </div>
        {isLoading
          ? <div className="skeleton skeletonChart" />
          : <RevenueChart />
        }
      </div>

      {/* ── Bottom row: leads chart + activity feed ──────────────────── */}
      <div className={styles.bottomRow}>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Lead Sources</h2>
            <span className={styles.cardMeta}>By origin channel</span>
          </div>
          {isLoading
            ? <div className="skeleton skeletonChart" />
            : <LeadsChart />
          }
        </div>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle}>Recent Activity</h2>
          </div>
          <ul className={styles.activityList} aria-label="Recent system activity">
            {isLoading 
              ? Array.from({ length: 5 }).map((_, i) => (
                  <li key={`skel-${i}`} className={styles.activityItem}>
                    <div className="skeleton skeletonRow" style={{ width: '100%', height: '40px' }} />
                  </li>
                ))
              : recentActivity.map((item) => (
                  <li key={item.id} className={styles.activityItem}>
                    <span
                      className={styles.activityDot}
                      style={{ background: dotColor[item.type] ?? '#9B9B9B' }}
                      aria-hidden="true"
                    />
                    <div className={styles.activityContent}>
                      <p className={styles.activityText}>{item.text}</p>
                      <time className={styles.activityTime}>{item.time}</time>
                    </div>
                  </li>
                ))
            }
          </ul>
        </div>

      </div>
    </div>
  );
}