'use client';
import { useState } from 'react';
import styles from './logs.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────
type LogType = 'vendor' | 'lead' | 'order' | 'payment' | 'system';
type FilterTab = 'all' | LogType;

interface LogEntry {
  id: number;
  adminName: string;
  adminInitial: string;
  type: LogType;
  action: string;
  ip: string;
  timestamp: string;
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/admin/logs
const MOCK_LOGS: LogEntry[] = [
  { id: 1,  adminName: 'Suresh Admin', adminInitial: 'S', type: 'vendor',  action: 'Approved vendor TechSupply Co. (#12)',              ip: '192.168.1.4',  timestamp: '2024-11-22 09:14' },
  { id: 2,  adminName: 'Suresh Admin', adminInitial: 'S', type: 'lead',    action: 'Assigned lead #88 to Rajiv Malhotra',               ip: '192.168.1.4',  timestamp: '2024-11-22 09:31' },
  { id: 3,  adminName: 'Suresh Admin', adminInitial: 'S', type: 'order',   action: 'Cancelled order ORD-2024-0091',                     ip: '10.0.0.2',     timestamp: '2024-11-21 14:05' },
  { id: 4,  adminName: 'Priya Admin',  adminInitial: 'P', type: 'payment', action: 'Marked payment INV-2024-0044 as completed',         ip: '10.0.0.5',     timestamp: '2024-11-21 11:48' },
  { id: 5,  adminName: 'Suresh Admin', adminInitial: 'S', type: 'vendor',  action: 'Rejected vendor GreenClean (#15) — docs missing',  ip: '192.168.1.4',  timestamp: '2024-11-20 16:22' },
  { id: 6,  adminName: 'Priya Admin',  adminInitial: 'P', type: 'system',  action: 'Updated GST rate to 18%',                          ip: '10.0.0.5',     timestamp: '2024-11-20 10:00' },
  { id: 7,  adminName: 'Suresh Admin', adminInitial: 'S', type: 'lead',    action: 'Converted lead #72 (NetGear India) to customer',   ip: '192.168.1.4',  timestamp: '2024-11-19 15:37' },
  { id: 8,  adminName: 'Priya Admin',  adminInitial: 'P', type: 'order',   action: 'Updated order ORD-2024-0085 status to Dispatched', ip: '10.0.0.5',     timestamp: '2024-11-19 13:12' },
];

// Rule #9 — dot color via inline style map, never a dynamic CSS class
const logTypeDot: Record<LogType, string> = {
  vendor:  '#F5C518',
  lead:    '#4CAF50',
  order:   '#1A1A1A',
  payment: '#9B9B9B',
  system:  '#E53935',
};

const FILTER_PILLS: { label: string; value: FilterTab }[] = [
  { label: 'All',     value: 'all'     },
  { label: 'Vendor',  value: 'vendor'  },
  { label: 'Lead',    value: 'lead'    },
  { label: 'Order',   value: 'order'   },
  { label: 'Payment', value: 'payment' },
  { label: 'System',  value: 'system'  },
];

// ─── Component ────────────────────────────────────────────────────────────────
export default function LogsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const isLoading = false; // TODO: API — set true while fetching, false on data arrival

  // Filter — by type pill, then search (matches action text OR IP)
  const filtered = MOCK_LOGS.filter((log) => {
    const matchesFilter = activeFilter === 'all' || log.type === activeFilter;
    const q = search.trim().toLowerCase();
    const matchesSearch =
      !q ||
      log.action.toLowerCase().includes(q) ||
      log.ip.toLowerCase().includes(q);
    return matchesFilter && matchesSearch;
  });

  // Footer context hint
  const footerText = () => {
    let text = `${filtered.length} entr${filtered.length === 1 ? 'y' : 'ies'}`;
    if (activeFilter !== 'all') text += ` · filtered by ${activeFilter}`;
    if (search.trim()) text += ` · matching "${search.trim()}"`;
    return text;
  };

  // Counts per pill
  const countFor = (val: FilterTab) =>
    val === 'all'
      ? MOCK_LOGS.length
      : MOCK_LOGS.filter((l) => l.type === val).length;

  return (
    <div className={styles.page}>
      {/* ── Header row ──────────────────────────────────────────────────────── */}
      <div className={styles.headerRow}>
        <h1 className={styles.pageTitle}>Activity Logs</h1>
      </div>

      {/* ── Controls row: filter pills + search ─────────────────────────────── */}
      <div className={styles.controlsRow}>
        {/* Filter pill group */}
        <div className={styles.filterGroup}>
          {FILTER_PILLS.map((pill) => (
            <button
              key={pill.value}
              className={`${styles.filterTab} ${activeFilter === pill.value ? styles.filterTabActive : ''}`}
              onClick={() => {
                setActiveFilter(pill.value);
                setSearch('');
              }}
            >
              {pill.label}
              <span className={styles.filterCount}>{countFor(pill.value)}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <label className={styles.searchWrap}>
          <svg
            className={styles.searchIcon}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
          >
            <circle cx="6" cy="6" r="4.5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M9.5 9.5L12 12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            className={styles.searchInput}
            type="search"
            placeholder="Search action or IP…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.th}>Timestamp</th>
              <th className={styles.th}>Admin</th>
              <th className={styles.th}>Type</th>
              <th className={styles.th}>Action</th>
              <th className={styles.th}>IP Address</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              /* Block D - Skeleton Rows */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  <td colSpan={5} style={{ padding: '10px 24px' }}>
                    <div className="skeleton skeletonRow" style={{ height: '40px' }} />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              /* Existing Empty State */
              <tr>
                <td colSpan={5} className={styles.td}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyGlyph}>⊘</span>
                    <p className={styles.emptyTitle}>No log entries found</p>
                    <p className={styles.emptyHint}>
                      {search.trim()
                        ? `No entries matching "${search.trim()}"${activeFilter !== 'all' ? ` in ${activeFilter}` : ''}`
                        : activeFilter !== 'all'
                        ? `No ${activeFilter} entries have been recorded yet`
                        : 'No activity has been logged yet'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              /* Existing Data Rows */
              filtered.map((log, idx) => {
                const isLast = idx === filtered.length - 1;
                return (
                  <tr key={log.id} className={styles.row}>
                    {/* Timestamp */}
                    <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                      <span className={styles.timestampCell}>{log.timestamp}</span>
                    </td>

                    {/* Admin avatar cell */}
                    <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                      <div className={styles.avatarCell}>
                        <span className={styles.avatarCircle}>{log.adminInitial}</span>
                        <span className={styles.avatarName}>{log.adminName}</span>
                      </div>
                    </td>

                    {/* Log type chip */}
                    <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                      <span className={styles.logTypeChip}>
                        <span
                          className={styles.typeDot}
                          style={{ background: logTypeDot[log.type] }}
                        />
                        {log.type}
                      </span>
                    </td>

                    {/* Action text */}
                    <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                      <span className={styles.actionText}>{log.action}</span>
                    </td>

                    {/* IP chip */}
                    <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                      <code className={styles.ipChip}>{log.ip}</code>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        {filtered.length > 0 && (
          <div className={styles.tableFooter}>
            <span>{footerText()}</span>
            {(activeFilter !== 'all' || search.trim()) && (
              <button
                className={styles.clearBtn}
                onClick={() => {
                  setActiveFilter('all');
                  setSearch('');
                }}
              >
                Clear filters
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}