'use client';

import { useState, useMemo } from 'react';
import styles from './vendors.module.css';

// TODO: API — replace with GET /api/admin/vendors
const MOCK_VENDORS = [
  { id: 1, company: 'Apex Solutions',    gst: '27AABCU9603R1ZX', status: 'approved',  joined: 'May 2024', contact: 'contact@apexsolutions.in' },
  { id: 2, company: 'TechBridge Pvt.',   gst: '29AADCB2230M1Z5', status: 'pending',   joined: 'Jun 2024', contact: 'info@techbridge.co.in' },
  { id: 3, company: 'GlobalMart India',  gst: '06AAACP0165G1Z2', status: 'rejected',  joined: 'Jun 2024', contact: 'hello@globalmart.in' },
  { id: 4, company: 'SkyWave Systems',   gst: '19AADCS1234M1Z8', status: 'approved',  joined: 'Jul 2024', contact: 'ops@skywavesys.in' },
  { id: 5, company: 'BrightEdge Corp',   gst: '07AABCB5678R1ZM', status: 'pending',   joined: 'Jul 2024', contact: 'bd@brightedge.co' },
  { id: 6, company: 'NovaTech India',    gst: '36AADCN9012P1ZQ', status: 'approved',  joined: 'Aug 2024', contact: 'support@novatech.in' },
  { id: 7, company: 'Horizon Supplies',  gst: '24AABCH3456T1ZR', status: 'pending',   joined: 'Aug 2024', contact: 'sales@horizonsupplies.in' },
  { id: 8, company: 'Vertex Commerce',   gst: '33AADCV7890L1ZS', status: 'rejected',  joined: 'Sep 2024', contact: 'team@vertexcommerce.in' },
];

type Status = 'all' | 'approved' | 'pending' | 'rejected';

type Vendor = typeof MOCK_VENDORS[0];

const STATUS_CONFIG = {
  approved: {
    label: 'Approved',
    bg: 'rgba(76, 175, 80, 0.1)',
    color: 'var(--color-success)',
  },
  pending: {
    label: 'Pending',
    bg: 'rgba(245, 197, 24, 0.15)',
    color: '#B8940A',
  },
  rejected: {
    label: 'Rejected',
    bg: 'rgba(229, 57, 53, 0.1)',
    color: 'var(--color-error)',
  },
} as const;

const FILTERS: { key: Status; label: string }[] = [
  { key: 'all',      label: 'All' },
  { key: 'approved', label: 'Approved' },
  { key: 'pending',  label: 'Pending' },
  { key: 'rejected', label: 'Rejected' },
];

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(MOCK_VENDORS);
  const [activeFilter, setActiveFilter] = useState<Status>('all');
  const [search, setSearch] = useState('');

  const counts = useMemo(() => ({
    all:      vendors.length,
    approved: vendors.filter(v => v.status === 'approved').length,
    pending:  vendors.filter(v => v.status === 'pending').length,
    rejected: vendors.filter(v => v.status === 'rejected').length,
  }), [vendors]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return vendors.filter(v => {
      const matchFilter = activeFilter === 'all' || v.status === activeFilter;
      const matchSearch = !q || v.company.toLowerCase().includes(q) || v.gst.toLowerCase().includes(q);
      return matchFilter && matchSearch;
    });
  }, [vendors, activeFilter, search]);

  // TODO: API — replace with PATCH /api/admin/vendors/:id { status: 'approved' }
  const handleApprove = (id: number) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'approved' } : v));
  };

  // TODO: API — replace with PATCH /api/admin/vendors/:id { status: 'rejected' }
  const handleReject = (id: number) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, status: 'rejected' } : v));
  };

  return (
    <main className={styles.page}>

      {/* ─── Page header ─────────────────────────────────── */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>Vendors</h1>
          <p className={styles.subtitle}>Review registrations, manage approvals, and track vendor activity</p>
        </div>
        {/* TODO: API — trigger vendor invite flow */}
        <button className={styles.addBtn} aria-label="Invite a new vendor">
          + Invite Vendor
        </button>
      </div>

      {/* ─── Stat strip ──────────────────────────────────── */}
      <div className={styles.statStrip} role="region" aria-label="Vendor statistics">
        {FILTERS.map((f, i) => (
          <button
            key={f.key}
            className={`${styles.statTile} ${activeFilter === f.key ? styles.statTileActive : ''}`}
            style={{ borderRight: i < FILTERS.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            onClick={() => setActiveFilter(f.key)}
            aria-pressed={activeFilter === f.key}
          >
            <span className={styles.statValue}>{counts[f.key]}</span>
            <span className={styles.statLabel}>{f.key === 'all' ? 'Total vendors' : f.label}</span>
            {activeFilter === f.key && <span className={styles.statActiveDot} aria-hidden="true" />}
          </button>
        ))}
      </div>

      {/* ─── Controls row ────────────────────────────────── */}
      <div className={styles.controls}>
        <div className={styles.filterGroup} role="tablist" aria-label="Filter vendors by status">
          {FILTERS.map(f => (
            <button
              key={f.key}
              role="tab"
              aria-selected={activeFilter === f.key}
              className={`${styles.filterTab} ${activeFilter === f.key ? styles.filterTabActive : ''}`}
              onClick={() => setActiveFilter(f.key)}
            >
              {f.label}
              <span className={styles.filterCount}>{counts[f.key]}</span>
            </button>
          ))}
        </div>

        <label className={styles.searchWrap} aria-label="Search vendors">
          <svg className={styles.searchIcon} width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <circle cx="6.5" cy="6.5" r="5" stroke="currentColor" strokeWidth="1.4" />
            <path d="M10.5 10.5L13.5 13.5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
          </svg>
          <input
            className={styles.search}
            type="search"
            placeholder="Company name or GST…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            aria-label="Search by company name or GST number"
          />
        </label>
      </div>

      {/* ─── Table ───────────────────────────────────────── */}
      <div className={styles.tableWrap}>
        <table className={styles.table} aria-label="Vendors list">
          <thead>
            <tr>
              <th className={styles.th}>Company</th>
              <th className={styles.th}>GST Number</th>
              <th className={styles.th}>Joined</th>
              <th className={styles.th}>Status</th>
              <th className={styles.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.emptyCell}>
                  <div className={styles.empty}>
                    <span className={styles.emptyGlyph} aria-hidden="true">⊘</span>
                    <p className={styles.emptyTitle}>No vendors found</p>
                    <p className={styles.emptyHint}>
                      {search
                        ? `No results for "${search}" — try a different term`
                        : 'No vendors in this category yet'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(vendor => {
                const cfg = STATUS_CONFIG[vendor.status as keyof typeof STATUS_CONFIG];
                const initial = vendor.company.charAt(0).toUpperCase();
                return (
                  <tr key={vendor.id} className={styles.row}>

                    {/* Company */}
                    <td className={styles.td}>
                      <div className={styles.companyCell}>
                        <span className={styles.avatar} aria-hidden="true">{initial}</span>
                        <div>
                          <div className={styles.companyName}>{vendor.company}</div>
                          <div className={styles.companyContact}>{vendor.contact}</div>
                        </div>
                      </div>
                    </td>

                    {/* GST */}
                    <td className={styles.td}>
                      <code className={styles.gstChip}>{vendor.gst}</code>
                    </td>

                    {/* Joined */}
                    <td className={styles.td}>
                      <span className={styles.dateText}>{vendor.joined}</span>
                    </td>

                    {/* Status */}
                    <td className={styles.td}>
                      <span
                        className={styles.badge}
                        style={{ background: cfg.bg, color: cfg.color }}
                        aria-label={`Status: ${cfg.label}`}
                      >
                        <span className={styles.badgeDot} style={{ background: cfg.color }} aria-hidden="true" />
                        {cfg.label}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className={styles.td}>
                      <div className={styles.actionRow}>
                        {vendor.status !== 'approved' && (
                          <button
                            className={styles.btnApprove}
                            onClick={() => handleApprove(vendor.id)}
                            aria-label={`Approve ${vendor.company}`}
                          >
                            Approve
                          </button>
                        )}
                        {vendor.status !== 'rejected' && (
                          <button
                            className={styles.btnReject}
                            onClick={() => handleReject(vendor.id)}
                            aria-label={`Reject ${vendor.company}`}
                          >
                            Reject
                          </button>
                        )}
                        {/* TODO: link to /admin/vendors/:id */}
                        <button className={styles.btnView} aria-label={`View ${vendor.company} details`}>
                          View
                        </button>
                      </div>
                    </td>

                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer — result count */}
        {filtered.length > 0 && (
          <div className={styles.tableFooter}>
            <span>{filtered.length} vendor{filtered.length !== 1 ? 's' : ''}</span>
          </div>
        )}
      </div>

    </main>
  );
}