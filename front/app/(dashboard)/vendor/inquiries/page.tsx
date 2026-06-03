'use client';

import { useState } from 'react';
import s from './inquiries.module.css';

// TODO: API — replace with GET /api/vendor/inquiries
const mockInquiries = [
  {
    id: 1,
    ticket_id: 'TKT-2024-0021',
    customer: 'Arjun Mehta',
    contact: 'arjun@example.com',
    subject: 'Delay in order dispatch',
    description:
      "My order ORD-2024-0088 was supposed to be dispatched on Dec 12 but I haven't received any update. Please look into this urgently.",
    status: 'open',
    created_at: '2024-12-14',
    order_no: 'ORD-2024-0088',
  },
  {
    id: 2,
    ticket_id: 'TKT-2024-0022',
    customer: 'Sneha Iyer',
    contact: '+91 91234 56789',
    subject: 'Wrong item received',
    description:
      'I received a different product than what I ordered. The packaging was intact but the item inside was incorrect.',
    status: 'in_progress',
    created_at: '2024-12-16',
    order_no: 'ORD-2024-0091',
  },
  {
    id: 3,
    ticket_id: 'TKT-2024-0019',
    customer: 'Rohit Sharma',
    contact: 'rohit@biz.co',
    subject: 'Request for invoice copy',
    description:
      'Could you please resend the invoice for my recent order? I need it for my company expense report.',
    status: 'closed',
    created_at: '2024-12-10',
    order_no: 'ORD-2024-0094',
  },
  {
    id: 4,
    ticket_id: 'TKT-2024-0023',
    customer: 'Divya Pillai',
    contact: 'divya@works.com',
    subject: 'Product quality concern',
    description:
      'The product received does not match the quality shown on your catalogue. There are visible defects on the surface finish.',
    status: 'open',
    created_at: '2024-12-18',
    order_no: null,
  },
  {
    id: 5,
    ticket_id: 'TKT-2024-0020',
    customer: 'Karan Verma',
    contact: 'karan@corp.in',
    subject: 'GST certificate not attached',
    description:
      'The invoice sent does not have the GST certificate attached. Please send the updated invoice with the certificate.',
    status: 'closed',
    created_at: '2024-12-11',
    order_no: 'ORD-2024-0081',
  },
  {
    id: 6,
    ticket_id: 'TKT-2024-0024',
    customer: 'Priya Nair',
    contact: '+91 98765 43210',
    subject: 'Payment confirmation not received',
    description:
      "I made the payment via NEFT on Dec 12 but haven't received any confirmation email. Reference: NEFT00184.",
    status: 'in_progress',
    created_at: '2024-12-13',
    order_no: 'ORD-2024-0083',
  },
];

type FilterTab = 'All' | 'open' | 'in_progress' | 'closed';

const STATUS_LABEL: Record<string, string> = {
  open: 'Open',
  in_progress: 'In Progress',
  closed: 'Closed',
};

function statusStyle(status: string) {
  if (status === 'open')
    return {
      background: 'rgba(229,57,53,0.1)',
      color: 'var(--color-error)',
      dot: 'var(--color-error)',
    };
  if (status === 'in_progress')
    return {
      background: 'rgba(245,197,24,0.15)',
      color: '#B8940A',
      dot: '#B8940A',
    };
  if (status === 'closed')
    return {
      background: 'rgba(76,175,80,0.1)',
      color: 'var(--color-success)',
      dot: 'var(--color-success)',
    };
  return {
    background: 'rgba(155,155,155,0.1)',
    color: 'var(--color-muted)',
    dot: 'var(--color-muted)',
  };
}

function fmt(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

const COLS = 6;

export default function VendorInquiriesPage() {
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [resolvedIds, setResolvedIds] = useState<Record<number, boolean>>({});

  // Effective status respects optimistic local resolves
  function eff(p: (typeof mockInquiries)[number]) {
    return resolvedIds[p.id] ? 'closed' : p.status;
  }

  // Counts — recomputed each render (6 items, negligible cost)
  const openCount        = mockInquiries.filter(p => eff(p) === 'open').length;
  const inProgressCount  = mockInquiries.filter(p => eff(p) === 'in_progress').length;
  const closedCount      = mockInquiries.filter(p => eff(p) === 'closed').length;

  const filtered = mockInquiries.filter(p => {
    const matchFilter = activeFilter === 'All' || eff(p) === activeFilter;
    const q = search.toLowerCase();
    const matchSearch =
      !q ||
      p.customer.toLowerCase().includes(q) ||
      p.subject.toLowerCase().includes(q);
    return matchFilter && matchSearch;
  });

  const TILES: { label: string; value: number; filter: FilterTab }[] = [
    { label: 'Total Tickets', value: mockInquiries.length, filter: 'All' },
    { label: 'Open',          value: openCount,            filter: 'open' },
    { label: 'Resolved',      value: closedCount,          filter: 'closed' },
  ];

  const FILTER_PILLS: { label: string; filter: FilterTab; count: number }[] = [
    { label: 'All',         filter: 'All',         count: mockInquiries.length },
    { label: 'Open',        filter: 'open',        count: openCount },
    { label: 'In Progress', filter: 'in_progress', count: inProgressCount },
    { label: 'Closed',      filter: 'closed',      count: closedCount },
  ];

  function handleTileClick(filter: FilterTab) {
    setActiveFilter(prev => (prev === filter ? 'All' : filter));
    setSearch('');
    setExpandedId(null);
  }

  function handlePillClick(filter: FilterTab) {
    setActiveFilter(filter);
    setExpandedId(null);
  }

  function handleRowClick(id: number) {
    setExpandedId(prev => (prev === id ? null : id));
  }

  function handleResolve(e: React.MouseEvent, id: number) {
    e.stopPropagation();
    // TODO: API — PATCH /api/vendor/inquiries/:id/resolve
    setResolvedIds(prev => ({ ...prev, [id]: true }));
  }

  const showClear = activeFilter !== 'All' || !!search;

  function footerText() {
    let text = `${filtered.length} ticket${filtered.length !== 1 ? 's' : ''}`;
    if (activeFilter !== 'All')
      text += ` · filtered by ${STATUS_LABEL[activeFilter] ?? activeFilter}`;
    if (search) text += ` · matching "${search}"`;
    return text;
  }

  return (
    <div className={s.page}>
      {/* ── Header ── */}
      <div className={s.pageHeader}>
        <h1 className={s.title}>Customer Inquiries</h1>

        <div className={s.controls}>
          {/* Search */}
          <label className={s.searchWrap}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
              <path
                d="M11 11l2.5 2.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              placeholder="Search by customer or subject…"
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setExpandedId(null);
              }}
            />
          </label>

          {/* Filter pills */}
          <div className={s.filterGroup}>
            {FILTER_PILLS.map(({ label, filter, count }) => (
              <button
                key={filter}
                className={`${s.filterTab} ${activeFilter === filter ? s.filterTabActive : ''}`}
                onClick={() => handlePillClick(filter)}
              >
                {label}
                <span className={s.filterCount}>{count}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Stat Strip ── */}
      <div className={s.statStrip}>
        {TILES.map((tile, i) => (
          <div
            key={tile.filter}
            className={s.statTile}
            style={i < TILES.length - 1 ? { borderRight: '1px solid var(--color-border)' } : {}}
            onClick={() => handleTileClick(tile.filter)}
          >
            {activeFilter === tile.filter && <span className={s.statActiveDot} />}
            <span className={s.statValue}>{tile.value}</span>
            <span className={s.statLabel}>{tile.label}</span>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>Ticket ID</th>
              <th className={s.th}>Customer</th>
              <th className={s.th}>Subject</th>
              <th className={s.th}>Status</th>
              <th className={s.th}>Created</th>
              <th className={s.th} style={{ textAlign: 'right' }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={COLS} className={s.emptyCell}>
                  <div className={s.emptyState}>
                    <span className={s.emptyGlyph}>⊘</span>
                    <p className={s.emptyTitle}>No tickets found</p>
                    <p className={s.emptyHint}>
                      {search
                        ? `No results for "${search}" — try a different search.`
                        : activeFilter !== 'All'
                          ? `No ${(STATUS_LABEL[activeFilter] ?? activeFilter).toLowerCase()} tickets at the moment.`
                          : 'No customer inquiries yet.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.flatMap((p, idx) => {
                const isLast     = idx === filtered.length - 1;
                const isExpanded = expandedId === p.id;
                const effStatus  = eff(p);
                const style      = statusStyle(effStatus);

                const dataRow = (
                  <tr
                    key={`row-${p.id}`}
                    className={`${s.row} ${isLast && !isExpanded ? s.lastRow : ''}`}
                    onClick={() => handleRowClick(p.id)}
                  >
                    {/* Ticket ID — mono chip, Rule #15 */}
                    <td className={s.td}>
                      <code className={s.monoChip}>{p.ticket_id}</code>
                    </td>

                    {/* Customer — avatar cell */}
                    <td className={s.td}>
                      <div className={s.customerCell}>
                        <div className={s.avatar}>
                          <span className={s.avatarInitial}>{p.customer[0]}</span>
                        </div>
                        <div className={s.customerInfo}>
                          <span className={s.customerName}>{p.customer}</span>
                          <span className={s.customerContact}>{p.contact}</span>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className={s.td}>
                      <span className={s.subjectText}>{p.subject}</span>
                    </td>

                    {/* Status badge — dot + label, Rule #13 */}
                    <td className={s.td}>
                      <span
                        className={s.badge}
                        style={{ background: style.background, color: style.color }}
                      >
                        <span
                          className={s.badgeDot}
                          style={{ background: style.dot }}
                        />
                        {STATUS_LABEL[effStatus]}
                      </span>
                    </td>

                    {/* Created */}
                    <td
                      className={s.td}
                      style={{ color: 'var(--color-muted)', fontSize: '13px' }}
                    >
                      {fmt(p.created_at)}
                    </td>

                    {/* Actions — stopPropagation on cell to prevent row expand */}
                    <td
                      className={`${s.td} ${s.actionCell}`}
                      onClick={e => e.stopPropagation()}
                    >
                      {effStatus === 'closed' ? (
                        <span className={s.closedChip}>Closed</span>
                      ) : (
                        <button
                          className={s.resolveBtn}
                          onClick={e => handleResolve(e, p.id)}
                        >
                          Mark Resolved
                        </button>
                      )}
                    </td>
                  </tr>
                );

                const rows: React.ReactNode[] = [dataRow];

                if (isExpanded) {
                  rows.push(
                    <tr
                      key={`detail-${p.id}`}
                      className={s.detailRow}
                    >
                      <td
                        colSpan={COLS}
                        style={{
                          padding: 0,
                          borderBottom: isLast
                            ? 'none'
                            : '1px solid var(--color-border)',
                        }}
                      >
                        <div className={s.detailPanel}>
                          {/* Section 1 — Ticket Details */}
                          <div className={s.detailSection}>
                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Ticket ID</span>
                              <code className={s.monoChip}>{p.ticket_id}</code>
                            </div>

                            {p.order_no && (
                              <div className={s.detailField}>
                                <span className={s.detailLabel}>Order Ref.</span>
                                <code className={s.monoChip}>{p.order_no}</code>
                              </div>
                            )}

                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Subject</span>
                              <span className={s.detailValue}>{p.subject}</span>
                            </div>

                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Description</span>
                              <p className={s.descriptionText}>{p.description}</p>
                            </div>

                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Opened</span>
                              <span className={s.detailValue}>{fmt(p.created_at)}</span>
                            </div>
                          </div>

                          <div className={s.detailDivider} />

                          {/* Section 2 — Customer Info */}
                          <div className={s.detailSection}>
                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Customer</span>
                              <div className={s.detailAvatar}>
                                <div className={s.detailAvatarCircle}>
                                  <span className={s.detailAvatarInitial}>
                                    {p.customer[0]}
                                  </span>
                                </div>
                                <div className={s.detailAvatarInfo}>
                                  <span className={s.detailAvatarName}>{p.customer}</span>
                                  <span className={s.detailAvatarContact}>{p.contact}</span>
                                </div>
                              </div>
                            </div>

                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Contact</span>
                              <span className={s.detailValue}>{p.contact}</span>
                            </div>

                            <div className={s.detailField}>
                              <span className={s.detailLabel}>Current Status</span>
                              <span
                                className={s.badge}
                                style={{
                                  background: style.background,
                                  color: style.color,
                                  alignSelf: 'flex-start',
                                }}
                              >
                                <span
                                  className={s.badgeDot}
                                  style={{ background: style.dot }}
                                />
                                {STATUS_LABEL[effStatus]}
                              </span>
                            </div>
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

        {/* Footer */}
        {filtered.length > 0 && (
          <div className={s.tableFooter}>
            <span>{footerText()}</span>
            {showClear && (
              <button
                className={s.clearFilter}
                onClick={() => {
                  setActiveFilter('All');
                  setSearch('');
                  setExpandedId(null);
                }}
              >
                clear filter
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}