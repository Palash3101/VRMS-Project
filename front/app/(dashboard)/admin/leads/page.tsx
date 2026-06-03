'use client';

import { useState, useMemo } from 'react';
import s from './leads.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = 'High' | 'Medium' | 'Low';
type LeadStatus = 'New' | 'Contacted' | 'Negotiating' | 'Closed' | 'Lost';
type FilterTab = 'All' | LeadStatus;

interface Lead {
  id: number;
  name: string;
  contact: string;
  source: string;
  priority: Priority;
  status: LeadStatus;
  assignedVendor: string | null;
  followUpDate: string | null;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

// TODO: API — replace with GET /api/admin/leads
const LEADS: Lead[] = [
  { id: 1, name: 'Meera Joshi',    contact: 'meera@gmail.com',       source: 'Web',       priority: 'High',   status: 'New',         assignedVendor: null,              followUpDate: '2024-08-10' },
  { id: 2, name: 'Deepak Singh',   contact: '+91 90000 11111',        source: 'Referral',  priority: 'Medium', status: 'Contacted',   assignedVendor: 'TechServe Pvt.',  followUpDate: '2024-08-12' },
  { id: 3, name: 'Lakshmi Nair',   contact: 'lakshmi@outlook.com',   source: 'Social',    priority: 'Low',    status: 'Negotiating', assignedVendor: 'BuildCorp Ltd.',  followUpDate: null         },
  { id: 4, name: 'Rahul Gupta',    contact: '+91 81234 56789',        source: 'Cold Call', priority: 'High',   status: 'Closed',      assignedVendor: 'TechServe Pvt.',  followUpDate: null         },
  { id: 5, name: 'Fatima Sheikh',  contact: 'fatima@example.com',    source: 'Web',       priority: 'Medium', status: 'New',         assignedVendor: null,              followUpDate: '2024-08-15' },
  { id: 6, name: 'Nikhil Tiwari', contact: '+91 70000 22222',         source: 'Referral',  priority: 'Low',    status: 'Lost',        assignedVendor: 'BuildCorp Ltd.',  followUpDate: null         },
  { id: 7, name: 'Pooja Desai',    contact: 'pooja@gmail.com',        source: 'Social',    priority: 'High',   status: 'Contacted',   assignedVendor: null,              followUpDate: '2024-08-18' },
];

// TODO: API — replace with GET /api/admin/vendors?status=approved
const VENDOR_OPTIONS = ['TechServe Pvt.', 'BuildCorp Ltd.', 'SwiftSupply Co.', 'NexaWorks'];

// ─── Badge Styles ─────────────────────────────────────────────────────────────

const priorityStyle: Record<Priority, React.CSSProperties> = {
  High:   { background: 'rgba(229, 57, 53, 0.10)',  color: 'var(--color-error)'   },
  Medium: { background: 'rgba(245, 197, 24, 0.15)', color: '#B8940A'              },
  Low:    { background: 'rgba(155, 155, 155, 0.12)',color: 'var(--color-muted)'   },
};

const priorityDot: Record<Priority, string> = {
  High:   'var(--color-error)',
  Medium: '#B8940A',
  Low:    'var(--color-muted)',
};

const statusStyle: Record<LeadStatus, React.CSSProperties> = {
  New:         { background: 'rgba(26, 26, 26, 0.06)',  color: 'var(--color-text)'    },
  Contacted:   { background: 'rgba(76, 175, 80, 0.10)', color: 'var(--color-success)' },
  Negotiating: { background: 'rgba(245, 197, 24, 0.15)',color: '#B8940A'              },
  Closed:      { background: 'rgba(26, 26, 26, 0.08)',  color: 'var(--color-dark)'    },
  Lost:        { background: 'rgba(229, 57, 53, 0.10)', color: 'var(--color-error)'   },
};

const statusDot: Record<LeadStatus, string> = {
  New:         'var(--color-muted)',
  Contacted:   'var(--color-success)',
  Negotiating: '#B8940A',
  Closed:      'var(--color-dark)',
  Lost:        'var(--color-error)',
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatFollowUp(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

const FILTER_TABS: FilterTab[] = ['All', 'New', 'Contacted', 'Negotiating', 'Closed', 'Lost'];

const STAT_TILES: { label: string; filter: FilterTab }[] = [
  { label: 'Total',       filter: 'All'         },
  { label: 'New',         filter: 'New'         },
  { label: 'Contacted',   filter: 'Contacted'   },
  { label: 'Negotiating', filter: 'Negotiating' },
  { label: 'Closed',      filter: 'Closed'      },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminLeadsPage() {
  const [filter, setFilter]                       = useState<FilterTab>('All');
  const [search, setSearch]                       = useState('');
  // Track per-lead vendor assignment locally until API wired up
  // TODO: API — PATCH /api/admin/leads/:id/assign on change
  const [assignedVendors, setAssignedVendors]     = useState<Record<number, string>>(() =>
    Object.fromEntries(LEADS.filter(l => l.assignedVendor).map(l => [l.id, l.assignedVendor!]))
  );

  // ── Counts for stat strip & filter pill badges ─────────────────────────────
  const counts = useMemo(() => {
    const base: Record<string, number> = { All: LEADS.length };
    for (const l of LEADS) base[l.status] = (base[l.status] ?? 0) + 1;
    return base;
  }, []);

  // ── Filtered rows ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return LEADS.filter(l => {
      const matchesFilter = filter === 'All' || l.status === filter;
      const matchesSearch = !q || [l.name, l.contact, l.source, assignedVendors[l.id] ?? ''].some(v => v.toLowerCase().includes(q));
      return matchesFilter && matchesSearch;
    });
  }, [filter, search, assignedVendors]);

  // ── Footer context string ──────────────────────────────────────────────────
  const footerText = useMemo(() => {
    const parts: string[] = [`${filtered.length} lead${filtered.length !== 1 ? 's' : ''}`];
    if (filter !== 'All') parts.push(`filtered by ${filter.toLowerCase()}`);
    if (search.trim()) parts.push(`matching "${search.trim()}"`);
    return parts.join(' · ');
  }, [filtered.length, filter, search]);

  // ── Empty state hint ───────────────────────────────────────────────────────
  const emptyHint = search.trim()
    ? `No leads match "${search.trim()}". Try a different name, contact, or vendor.`
    : filter !== 'All'
      ? `No ${filter.toLowerCase()} leads right now. Adjust the filter to see others.`
      : 'No leads have been added yet. Use "Add Lead" to create the first one.';

  // ── Vendor assignment handler ──────────────────────────────────────────────
  function handleAssign(leadId: number, vendor: string) {
    setAssignedVendors(prev => ({ ...prev, [leadId]: vendor }));
    // TODO: API — PATCH /api/admin/leads/:id/assign { vendor_name: vendor }
  }

  return (
    <div className={s.page}>

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className={s.header}>
        <div className={s.headerLeft}>
          <h1 className={s.title}>Leads</h1>
          <p className={s.subtitle}>Pipeline overview · assign, track, and convert</p>
        </div>
        <button className={s.addBtn}>
          {/* Plus icon */}
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add Lead
        </button>
      </div>

      {/* ── Toolbar ────────────────────────────────────────────────────────── */}
      <div className={s.toolbar}>
        {/* Filter pills */}
        <div className={s.filterGroup}>
          {FILTER_TABS.map(tab => (
            <button
              key={tab}
              className={`${s.filterTab} ${filter === tab ? s.filterTabActive : ''}`}
              onClick={() => { setFilter(tab); setSearch(''); }}
            >
              {tab}
              {counts[tab] !== undefined && (
                <span className={s.filterCount}>{counts[tab]}</span>
              )}
            </button>
          ))}
        </div>

        {/* Search */}
        <label className={s.searchWrap}>
          <span className={s.searchIcon}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search leads…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* ── Stat Strip ─────────────────────────────────────────────────────── */}
      <div className={s.statStrip}>
        {STAT_TILES.map((tile, i) => (
          <button
            key={tile.filter}
            className={`${s.statTile} ${filter === tile.filter ? s.statTileActive : ''}`}
            style={{ borderRight: i < STAT_TILES.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            onClick={() => { setFilter(tile.filter); setSearch(''); }}
          >
            <span className={s.statValue}>
              {tile.filter === 'All' ? LEADS.length : (counts[tile.filter] ?? 0)}
            </span>
            <span className={s.statLabel}>{tile.label}</span>
            {filter === tile.filter && <span className={s.statActiveDot} />}
          </button>
        ))}
      </div>

      {/* ── Table ──────────────────────────────────────────────────────────── */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <colgroup>
            <col style={{ width: '26%' }} />
            <col style={{ width: '12%' }} />
            <col style={{ width: '11%' }} />
            <col style={{ width: '14%' }} />
            <col style={{ width: '20%' }} />
            <col style={{ width: '17%' }} />
          </colgroup>

          <thead className={s.thead}>
            <tr>
              <th className={s.th}>Lead</th>
              <th className={s.th}>Source</th>
              <th className={s.th}>Priority</th>
              <th className={s.th}>Status</th>
              <th className={s.th}>Assigned Vendor</th>
              <th className={s.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td className={s.td} colSpan={6}>
                  <div className={s.emptyState}>
                    <span className={s.emptyGlyph}>⊘</span>
                    <p className={s.emptyTitle}>No leads found</p>
                    <p className={s.emptyHint}>{emptyHint}</p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(lead => {
                const initial = lead.name.charAt(0).toUpperCase();
                const currentVendor = assignedVendors[lead.id] ?? '';

                return (
                  <tr key={lead.id} className={s.row}>

                    {/* Lead cell */}
                    <td className={s.td}>
                      <div className={s.leadCell}>
                        <div className={s.avatar}>{initial}</div>
                        <div className={s.leadInfo}>
                          <span className={s.leadName}>{lead.name}</span>
                          <span className={s.leadContact}>{lead.contact}</span>
                          {lead.followUpDate && (
                            <span className={s.followUpPill}>
                              ↻ {formatFollowUp(lead.followUpDate)}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Source chip */}
                    <td className={s.td}>
                      <code className={s.sourceChip}>{lead.source}</code>
                    </td>

                    {/* Priority badge */}
                    <td className={s.td}>
                      <span className={s.badge} style={priorityStyle[lead.priority]}>
                        <span className={s.badgeDot} style={{ background: priorityDot[lead.priority] }} />
                        {lead.priority}
                      </span>
                    </td>

                    {/* Status badge */}
                    <td className={s.td}>
                      <span className={s.badge} style={statusStyle[lead.status]}>
                        <span className={s.badgeDot} style={{ background: statusDot[lead.status] }} />
                        {lead.status}
                      </span>
                    </td>

                    {/* Assign vendor */}
                    <td className={s.td}>
                      <select
                        className={s.assignSelect}
                        value={currentVendor}
                        onChange={e => handleAssign(lead.id, e.target.value)}
                      >
                        <option value="">— Unassigned —</option>
                        {VENDOR_OPTIONS.map(v => (
                          <option key={v} value={v}>{v}</option>
                        ))}
                      </select>
                    </td>

                    {/* Actions */}
                    <td className={s.td}>
                      <div className={s.actionsCell}>
                        <button className={s.viewBtn}>View</button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className={s.tableFooter}>{footerText}</div>
      </div>

    </div>
  );
}