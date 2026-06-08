'use client';

import { useState } from 'react';
import styles from './leads.module.css';

// ─── Types ───────────────────────────────────────────────────────────────────

type FilterTab = 'All' | 'New' | 'Contacted' | 'Negotiating' | 'Closed' | 'Lost' | 'follow_up';

type Lead = {
  id: number;
  name: string;
  contact: string;
  source: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'New' | 'Contacted' | 'Negotiating' | 'Closed' | 'Lost';
  follow_up_date: string | null;
  notes: string;
  assigned_date: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/vendor/leads

const mockLeads: Lead[] = [
  {
    id: 1,
    name: 'Arjun Mehta',
    contact: 'arjun@example.com',
    source: 'Web',
    priority: 'High',
    status: 'New',
    follow_up_date: '2024-12-19',
    notes: 'Interested in bulk valve order. Mentioned Q1 delivery deadline.',
    assigned_date: '2024-12-15',
  },
  {
    id: 2,
    name: 'Priya Nair',
    contact: '+91 98765 43210',
    source: 'Referral',
    priority: 'Medium',
    status: 'Contacted',
    follow_up_date: '2024-12-22',
    notes: 'Called once, waiting for callback. Referral from Desai Industries.',
    assigned_date: '2024-12-14',
  },
  {
    id: 3,
    name: 'Rohit Sharma',
    contact: 'rohit@biz.co',
    source: 'Cold Call',
    priority: 'Low',
    status: 'Negotiating',
    follow_up_date: null,
    notes: 'Negotiating on price for 50 units. Wants 12% discount on MOQ.',
    assigned_date: '2024-12-10',
  },
  {
    id: 4,
    name: 'Sneha Iyer',
    contact: '+91 91234 56789',
    source: 'Social',
    priority: 'High',
    status: 'Closed',
    follow_up_date: null,
    notes: 'Order placed. Lead closed successfully. High-value account.',
    assigned_date: '2024-12-08',
  },
  {
    id: 5,
    name: 'Karan Verma',
    contact: 'karan@corp.in',
    source: 'Web',
    priority: 'Medium',
    status: 'Lost',
    follow_up_date: null,
    notes: 'Went with a competitor. Price sensitivity was the main blocker.',
    assigned_date: '2024-12-06',
  },
  {
    id: 6,
    name: 'Divya Pillai',
    contact: 'divya@works.com',
    source: 'Referral',
    priority: 'High',
    status: 'New',
    follow_up_date: '2024-12-19',
    notes: 'Urgent requirement for pressure gauges. Very responsive over email.',
    assigned_date: '2024-12-17',
  },
];

// Mock "today" for follow-up comparison
// TODO: API — use real Date in production
const TODAY = '2024-12-19';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const STATUS_OPTIONS = ['New', 'Contacted', 'Negotiating', 'Closed', 'Lost'] as const;
const FILTER_TABS: FilterTab[] = ['All', 'New', 'Contacted', 'Negotiating', 'Closed', 'Lost', 'follow_up'];
const OPEN_STATUSES = ['New', 'Contacted', 'Negotiating'];

function priorityStyle(priority: Lead['priority']): React.CSSProperties {
  switch (priority) {
    case 'High':
      return { background: 'rgba(229,57,53,0.08)', color: 'var(--color-error)' };
    case 'Medium':
      return { background: 'rgba(245,197,24,0.15)', color: '#B8940A' };
    case 'Low':
      return { background: 'var(--color-surface)', color: 'var(--color-muted)', border: '1px solid var(--color-border)' };
  }
}

function priorityDotStyle(priority: Lead['priority']): React.CSSProperties {
  switch (priority) {
    case 'High':   return { background: 'var(--color-error)' };
    case 'Medium': return { background: '#B8940A' };
    case 'Low':    return { background: 'var(--color-muted)' };
  }
}

function isFollowUpDue(date: string | null): boolean {
  if (!date) return false;
  return date <= TODAY;
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function VendorLeadsPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [leads, setLeads] = useState<Lead[]>(mockLeads);
  const [statusOverride, setStatusOverride] = useState<Record<number, string>>({});

  const isLoading = false; // TODO: API — set true while fetching, false on data arrival

  // ── Derived state ──

  function getStatus(lead: Lead): string {
    return statusOverride[lead.id] ?? lead.status;
  }

  function handleStatusChange(id: number, newStatus: string) {
    // TODO: API — PATCH /api/vendor/leads/:id/status
    setStatusOverride(prev => ({ ...prev, [id]: newStatus }));
  }

  // ── Stat counts ──
  const totalCount = leads.length;
  const openCount = leads.filter(l => OPEN_STATUSES.includes(getStatus(l))).length;
  const convertedCount = leads.filter(l => getStatus(l) === 'Closed').length;
  const followUpTodayCount = leads.filter(
    l => l.follow_up_date === TODAY && getStatus(l) !== 'Closed' && getStatus(l) !== 'Lost'
  ).length;

  // ── Filter counts for pills ──
  function countForTab(tab: FilterTab): number {
    if (tab === 'All') return leads.length;
    if (tab === 'follow_up')
      return leads.filter(l => l.follow_up_date === TODAY && getStatus(l) !== 'Closed' && getStatus(l) !== 'Lost').length;
    return leads.filter(l => getStatus(l) === tab).length;
  }

  // ── Filtered leads ──
  const filtered = leads.filter(lead => {
    if (activeFilter === 'All') return true;
    if (activeFilter === 'follow_up')
      return lead.follow_up_date === TODAY && getStatus(lead) !== 'Closed' && getStatus(lead) !== 'Lost';
    return getStatus(lead) === activeFilter;
  });

  // ── Filter tab label ──
  function tabLabel(tab: FilterTab): string {
    if (tab === 'follow_up') return 'Due Today';
    return tab;
  }

  // ── Stat tile click ──
  function handleStatClick(tile: FilterTab) {
    setActiveFilter(prev => (prev === tile ? 'All' : tile));
    setExpandedId(null);
  }

  // ── Row toggle ──
  function toggleRow(id: number) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  // ── Status history placeholder (derived from current status) ──
  function statusHistory(lead: Lead) {
    const current = getStatus(lead);
    const all = STATUS_OPTIONS;
    const currentIndex = all.indexOf(current as typeof STATUS_OPTIONS[number]);
    return all.slice(0, currentIndex + 1).map((s, i) => ({
      label: s,
      time: i === 0 ? lead.assigned_date : '—',
      isActive: i === currentIndex,
    }));
  }

  // ── Footer text ──
  function footerText(): string {
    const base = `${filtered.length} lead${filtered.length !== 1 ? 's' : ''}`;
    if (activeFilter === 'All') return base;
    if (activeFilter === 'follow_up') return `${base} · due today`;
    return `${base} · status: ${activeFilter}`;
  }

  // ── Empty state hint ──
  function emptyHint(): string {
    if (activeFilter === 'follow_up') return 'No leads have a follow-up scheduled for today.';
    if (activeFilter !== 'All') return `No leads with status "${activeFilter}".`;
    return 'No leads have been assigned to you yet.';
  }

  return (
    <div className={styles.page}>
      {/* ── Page header ── */}
      <div className={styles.pageHeader}>
        <div>
          <h1 className={styles.pageTitle}>Leads</h1>
          <p className={styles.pageSubtitle}>Assigned leads · optimistic status updates</p>
        </div>
      </div>

      {/* ── Stat strip — 4 tiles ── */}
      {/* TODO: API — replace with GET /api/vendor/leads/stats */}
      <div className={styles.statStrip}>
        {[
          { label: 'Total Assigned', value: totalCount,       tab: 'All'       as FilterTab },
          { label: 'Open',           value: openCount,        tab: 'open'      as unknown as FilterTab },
          { label: 'Converted',      value: convertedCount,   tab: 'Closed'    as FilterTab },
          { label: 'Follow-ups Due', value: followUpTodayCount, tab: 'follow_up' as FilterTab },
        ].map((tile, i, arr) => {
          // "open" is a synthetic filter: clicking it sets All+highlight separately below
          const isActive =
            tile.tab === ('open' as unknown as FilterTab)
              ? activeFilter === 'New' || activeFilter === 'Contacted' || activeFilter === 'Negotiating'
              : activeFilter === tile.tab;

          return (
            <div
              key={tile.label}
              className={`${styles.statTile} ${isActive ? styles.statTileActive : ''}`}
              style={i < arr.length - 1 ? { borderRight: '1px solid var(--color-border)' } : {}}
              onClick={() => {
                if (tile.tab === ('open' as unknown as FilterTab)) {
                  // Clicking "Open" → filter to New (a proxy; real open = all three)
                  // For simplicity we use 'New' as the open-group proxy.
                  // Full solution would require a compound filter. Using 'New' per spec.
                  setActiveFilter('New');
                  setExpandedId(null);
                } else {
                  handleStatClick(tile.tab);
                }
              }}
            >
              {isLoading ? (
                <div className="skeleton skeletonStat" />
              ) : (
                <div className={styles.statValue}>
                  {tile.value}
                  {isActive && <span className={styles.statActiveDot} />}
                </div>
              )}

              {isLoading ? (
                <div className="skeleton skeletonLabel" style={{ width: 56 }} />
              ) : (
                <div className={styles.statLabel}>{tile.label}</div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Toolbar: filter pills ── */}
      <div className={styles.toolbar}>
        <div className={styles.filterGroup}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              className={`${styles.filterTab} ${activeFilter === tab ? styles.filterTabActive : ''}`}
              onClick={() => { setActiveFilter(tab); setExpandedId(null); }}
            >
              {tabLabel(tab)}
              <span className={styles.filterCount}>{countForTab(tab)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead className={styles.thead}>
            <tr>
              <th className={styles.th}>Lead</th>
              <th className={styles.th}>Source</th>
              <th className={styles.th}>Priority</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th}>Follow-up</th>
              <th className={styles.th}></th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              /* Block D - Skeleton Rows */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  <td colSpan={6} style={{ padding: '10px 24px' }}>
                    <div className="skeleton skeletonRow" style={{ height: '40px' }} />
                  </td>
                </tr>
              ))
            ) : filtered.length === 0 ? (
              /* Existing Empty State */
              <tr>
                <td colSpan={6} className={styles.td}>
                  <div className={styles.emptyState}>
                    <span className={styles.emptyGlyph}>⊘</span>
                    <p className={styles.emptyTitle}>No leads found</p>
                    <p className={styles.emptyHint}>{emptyHint()}</p>
                  </div>
                </td>
              </tr>
            ) : (
              /* Existing Data Rows */
              filtered.flatMap((lead, idx, arr) => {
                const isExpanded = expandedId === lead.id;
                const isLast = idx === arr.length - 1 && !isExpanded;
                const isLastBeforeDetail = isExpanded && idx === arr.length - 1;
                const history = statusHistory(lead);
                const currentStatus = getStatus(lead);
                const dueToday = isFollowUpDue(lead.follow_up_date);

                const dataRow = (
                  <tr
                    key={`lead-${lead.id}`}
                    className={`${styles.row} ${isExpanded ? styles.rowExpanded : ''} ${isLast ? styles.lastRow : ''}`}
                    onClick={() => toggleRow(lead.id)}
                  >
                    {/* Lead: avatar + name + contact */}
                    <td className={styles.td}>
                      <div className={styles.avatarCell}>
                        <div className={styles.avatar}>
                          {lead.name.charAt(0)}
                        </div>
                        <div>
                          <div className={styles.leadName}>{lead.name}</div>
                          <div className={styles.leadContact}>{lead.contact}</div>
                        </div>
                      </div>
                    </td>

                    {/* Source chip */}
                    <td className={styles.td}>
                      <span className={styles.sourceChip}>{lead.source}</span>
                    </td>

                    {/* Priority badge — dot + label, Rule #13 */}
                    <td className={styles.td}>
                      <span
                        className={styles.priorityBadge}
                        style={priorityStyle(lead.priority)}
                      >
                        <span
                          className={styles.priorityDot}
                          style={priorityDotStyle(lead.priority)}
                        />
                        {lead.priority}
                      </span>
                    </td>

                    {/* Status select — in-cell, 32px */}
                    <td
                      className={styles.td}
                      onClick={e => e.stopPropagation()} // prevent row expand on select interaction
                    >
                      <select
                        className={styles.statusSelect}
                        value={currentStatus}
                        onChange={e => handleStatusChange(lead.id, e.target.value)}
                      >
                        {STATUS_OPTIONS.map(opt => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    </td>

                    {/* Follow-up date pill */}
                    <td className={styles.td}>
                      {lead.follow_up_date ? (
                        <span
                          className={`${styles.followUpPill} ${dueToday ? styles.followUpPillDue : ''}`}
                        >
                          {dueToday ? '⚑ ' : ''}{lead.follow_up_date}
                        </span>
                      ) : (
                        <span className={styles.followUpNone}>—</span>
                      )}
                    </td>

                    {/* View / collapse button */}
                    <td
                      className={styles.td}
                      onClick={e => e.stopPropagation()}
                    >
                      <button
                        className={`${styles.viewBtn} ${isExpanded ? styles.viewBtnActive : ''}`}
                        onClick={() => toggleRow(lead.id)}
                      >
                        {isExpanded ? 'Close' : 'View'}
                      </button>
                    </td>
                  </tr>
                );

                if (!isExpanded) return [dataRow];

                // ── Inline detail panel (flatMap pattern) ──
                const detailRow = (
                  <tr
                    key={`detail-${lead.id}`}
                    className={`${styles.detailRow} ${isLastBeforeDetail ? styles.lastRow : ''}`}
                  >
                    <td
                      colSpan={6}
                      className={styles.td}
                      style={{ padding: 0, borderBottom: isLastBeforeDetail ? 'none' : '1px solid var(--color-border)' }}
                    >
                      <div className={styles.detailPanel}>

                        {/* Section 1: Lead Info */}
                        <div className={styles.detailSection}>
                          <p className={styles.detailSectionTitle}>Lead Info</p>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Full Name</span>
                            <span className={styles.detailFieldValue}>{lead.name}</span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Contact</span>
                            <span className={styles.detailFieldValue}>{lead.contact}</span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Source</span>
                            <span className={styles.detailFieldValue}>{lead.source}</span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Notes</span>
                            <span className={styles.notesText}>{lead.notes}</span>
                          </div>
                        </div>

                        <div className={styles.detailDivider} />

                        {/* Section 2: Assignment Info */}
                        <div className={styles.detailSection}>
                          <p className={styles.detailSectionTitle}>Assignment</p>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Assigned To</span>
                            <span className={styles.detailFieldValue}>Rajiv Malhotra</span>
                            {/* TODO: API — pull from vendor session */}
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Assigned On</span>
                            <span className={styles.detailFieldValue}>{lead.assigned_date}</span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Priority</span>
                            <span
                              className={styles.priorityBadge}
                              style={{ ...priorityStyle(lead.priority), display: 'inline-flex' }}
                            >
                              <span className={styles.priorityDot} style={priorityDotStyle(lead.priority)} />
                              {lead.priority}
                            </span>
                          </div>

                          <div className={styles.detailField}>
                            <span className={styles.detailFieldLabel}>Follow-up Date</span>
                            <span className={styles.detailFieldValue}>
                              {lead.follow_up_date ?? 'Not scheduled'}
                            </span>
                          </div>
                        </div>

                        <div className={styles.detailDivider} />

                        {/* Section 3: Status History */}
                        <div className={styles.detailSection}>
                          <p className={styles.detailSectionTitle}>Status History</p>
                          {/* TODO: API — replace with GET /api/vendor/leads/:id/history */}
                          {history.map(entry => (
                            <div key={entry.label} className={styles.historyEntry}>
                              <div
                                className={`${styles.historyDot} ${entry.isActive ? styles.historyDotActive : ''}`}
                              />
                              <div>
                                <div className={styles.historyLabel}>{entry.label}</div>
                                <div className={styles.historyTime}>{entry.time}</div>
                              </div>
                            </div>
                          ))}
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
          {activeFilter !== 'All' && (
            <>
              <span className={styles.footerDot} />
              <button
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '12px',
                  color: 'var(--color-muted)',
                  padding: 0,
                  fontFamily: 'var(--font-body)',
                  textDecoration: 'underline',
                }}
                onClick={() => { setActiveFilter('All'); setExpandedId(null); }}
              >
                clear filter
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}