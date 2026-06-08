'use client';

import { useState, useMemo } from 'react';
import s from './customers.module.css';

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────
type FilterTab = 'all' | 'active' | 'inactive';

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  joined: string;
  isActive: boolean;
}

// ─────────────────────────────────────────────
// Mock data — TODO: API — replace with GET /api/admin/customers
// ─────────────────────────────────────────────
const INITIAL_CUSTOMERS: Customer[] = [
  { id: 1, name: 'Priya Sharma',  email: 'priya@example.com',  phone: '+91 98765 43210', joined: 'Mar 2024', isActive: true  },
  { id: 2, name: 'Rohan Mehta',   email: 'rohan@example.com',  phone: '+91 91234 56789', joined: 'Apr 2024', isActive: true  },
  { id: 3, name: 'Ananya Iyer',   email: 'ananya@example.com', phone: '+91 87654 32109', joined: 'Apr 2024', isActive: false },
  { id: 4, name: 'Karan Verma',   email: 'karan@example.com',  phone: '+91 76543 21098', joined: 'May 2024', isActive: true  },
  { id: 5, name: 'Sneha Pillai',  email: 'sneha@example.com',  phone: '+91 65432 10987', joined: 'May 2024', isActive: true  },
  { id: 6, name: 'Arjun Nair',    email: 'arjun@example.com',  phone: '+91 54321 09876', joined: 'Jun 2024', isActive: false },
  { id: 7, name: 'Divya Reddy',   email: 'divya@example.com',  phone: '+91 43210 98765', joined: 'Jun 2024', isActive: true  },
  { id: 8, name: 'Vikram Bose',   email: 'vikram@example.com', phone: '+91 32109 87654', joined: 'Jul 2024', isActive: true  },
];

// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────
function getInitial(name: string): string {
  return name.trim().charAt(0).toUpperCase();
}

// ─────────────────────────────────────────────
// Component
// ─────────────────────────────────────────────
export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(INITIAL_CUSTOMERS);
  const [filter, setFilter] = useState<FilterTab>('all');
  const [search, setSearch] = useState('');

  const isLoading = false; // TODO: API — set true while fetching

  // ── Derived counts ──
  const totalCount    = customers.length;
  const activeCount   = customers.filter(c => c.isActive).length;
  const inactiveCount = customers.filter(c => !c.isActive).length;

  // ── Filtered + searched list ──
  const visible = useMemo(() => {
    let list = customers;

    if (filter === 'active')   list = list.filter(c => c.isActive);
    if (filter === 'inactive') list = list.filter(c => !c.isActive);

    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter(
        c =>
          c.name.toLowerCase().includes(q) ||
          c.email.toLowerCase().includes(q)
      );
    }

    return list;
  }, [customers, filter, search]);

  // ── Toggle active state ──
  function toggleActive(id: number) {
    setCustomers(prev =>
      prev.map(c => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  }

  // ── Empty state hint (context-aware) ──
  function emptyHint(): string {
    if (search) return `No customers match "${search}". Try a different name or email.`;
    if (filter === 'active')   return 'No active customers right now.';
    if (filter === 'inactive') return 'No inactive customers — great sign.';
    return 'No customers have registered yet.';
  }

  // ── Stat tile click sets filter ──
  function handleStatClick(tab: FilterTab) {
    setFilter(tab);
    setSearch('');
  }

  return (
    <div className={s.pageWrap}>

      {/* ── Top row: heading + search ── */}
      <div className={s.topRow}>
        <div>
          <h1 className={s.heading}>Customers</h1>
          <p className={s.subheading}>Manage registered customer accounts</p>
        </div>

        {/* Search */}
        <label className={s.searchWrap} aria-label="Search customers">
          {/* Magnifier icon */}
          <svg
            className={s.searchIcon}
            viewBox="0 0 16 16"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="7" cy="7" r="4.5" />
            <path d="M10.5 10.5 L14 14" />
          </svg>
          <input
            type="search"
            className={s.searchInput}
            placeholder="Search by name or email…"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </label>
      </div>

      {/* ── Stat strip ── */}
      <div className={s.statStrip}>
        {/* Total */}
        <div
          className={`${s.statTile} ${filter === 'all' ? s.statTileActive : ''}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => handleStatClick('all')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleStatClick('all')}
          aria-label="Show all customers"
        >
          {isLoading ? <div className="skeleton skeletonStat" /> : <div className={s.statValue}>{totalCount}</div>}
          {isLoading ? <div className="skeleton skeletonLabel" style={{ width: 56 }} /> : <div className={s.statLabel}>Total Customers</div>}
        </div>

        {/* Active */}
        <div
          className={`${s.statTile} ${filter === 'active' ? s.statTileActive : ''}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => handleStatClick('active')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleStatClick('active')}
          aria-label="Filter active customers"
        >
          {isLoading ? <div className="skeleton skeletonStat" /> : <div className={s.statValue}>{activeCount}</div>}
          {isLoading ? (
            <div className="skeleton skeletonLabel" style={{ width: 56 }} />
          ) : (
            <div className={s.statLabel}>
              <span className={s.statActiveDot} style={{ background: 'var(--color-success)' }} />
              Active
            </div>
          )}
        </div>

        {/* Inactive */}
        <div
          className={`${s.statTile} ${filter === 'inactive' ? s.statTileActive : ''}`}
          onClick={() => handleStatClick('inactive')}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && handleStatClick('inactive')}
          aria-label="Filter inactive customers"
        >
          {isLoading ? <div className="skeleton skeletonStat" /> : <div className={s.statValue}>{inactiveCount}</div>}
          {isLoading ? (
            <div className="skeleton skeletonLabel" style={{ width: 56 }} />
          ) : (
            <div className={s.statLabel}>
              <span className={s.statActiveDot} style={{ background: 'var(--color-muted)' }} />
              Inactive
            </div>
          )}
        </div>
      </div>

      {/* ── Toolbar: filter pills ── */}
      <div className={s.toolbar}>
        <div className={s.filterGroup} role="tablist" aria-label="Customer status filter">

          <button
            role="tab"
            aria-selected={filter === 'all'}
            className={`${s.filterTab} ${filter === 'all' ? s.filterTabActive : ''}`}
            onClick={() => { setFilter('all'); setSearch(''); }}
          >
            All
            <span className={s.filterCount}>{totalCount}</span>
          </button>

          <button
            role="tab"
            aria-selected={filter === 'active'}
            className={`${s.filterTab} ${filter === 'active' ? s.filterTabActive : ''}`}
            onClick={() => { setFilter('active'); setSearch(''); }}
          >
            Active
            <span className={s.filterCount}>{activeCount}</span>
          </button>

          <button
            role="tab"
            aria-selected={filter === 'inactive'}
            className={`${s.filterTab} ${filter === 'inactive' ? s.filterTabActive : ''}`}
            onClick={() => { setFilter('inactive'); setSearch(''); }}
          >
            Inactive
            <span className={s.filterCount}>{inactiveCount}</span>
          </button>
        </div>
      </div>

      {/* ── Table ── */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th} style={{ width: '34%' }}>Customer</th>
              <th className={s.th} style={{ width: '18%' }}>Phone</th>
              <th className={s.th} style={{ width: '12%' }}>Joined</th>
              <th className={s.th} style={{ width: '14%' }}>Status</th>
              <th className={s.th} style={{ width: '22%' }}>Actions</th>
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
            ) : visible.length === 0 ? (
              /* Existing Empty State */
              <tr>
                <td className={s.td} colSpan={5}>
                  <div className={s.emptyState}>
                    <span className={s.emptyGlyph} aria-hidden="true">⊘</span>
                    <p className={s.emptyTitle}>No customers found</p>
                    <p className={s.emptyHint}>{emptyHint()}</p>
                  </div>
                </td>
              </tr>
            ) : (
              /* Existing Data Rows */
              visible.map(customer => (
                <tr key={customer.id} className={s.row}>

                  {/* Customer cell */}
                  <td className={s.td}>
                    <div className={s.customerCell}>
                      <div className={s.avatarCircle} aria-hidden="true">
                        {getInitial(customer.name)}
                      </div>
                      <div>
                        <div className={s.customerName}>{customer.name}</div>
                        <div className={s.customerEmail}>{customer.email}</div>
                      </div>
                    </div>
                  </td>

                  {/* Phone */}
                  <td className={s.td}>
                    <span className={s.metaText}>{customer.phone}</span>
                  </td>

                  {/* Joined */}
                  <td className={s.td}>
                    <span className={s.metaText}>{customer.joined}</span>
                  </td>

                  {/* Status badge */}
                  <td className={s.td}>
                    {customer.isActive ? (
                      <span
                        className={s.badge}
                        style={{
                          background: 'rgba(76, 175, 80, 0.1)',
                          color: 'var(--color-success)',
                        }}
                      >
                        <span
                          className={s.badgeDot}
                          style={{ background: 'var(--color-success)' }}
                        />
                        Active
                      </span>
                    ) : (
                      <span
                        className={s.badge}
                        style={{
                          background: 'rgba(155, 155, 155, 0.12)',
                          color: 'var(--color-muted)',
                        }}
                      >
                        <span
                          className={s.badgeDot}
                          style={{ background: 'var(--color-muted)' }}
                        />
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className={s.td}>
                    <div className={s.actionsCell}>
                      {/* Toggle active / deactivate */}
                      {customer.isActive ? (
                        <button
                          className={`${s.btnAction} ${s.btnDeactivate}`}
                          onClick={() => toggleActive(customer.id)}
                          aria-label={`Deactivate ${customer.name}`}
                        >
                          Deactivate
                        </button>
                      ) : (
                        <button
                          className={`${s.btnAction} ${s.btnReactivate}`}
                          onClick={() => toggleActive(customer.id)}
                          aria-label={`Reactivate ${customer.name}`}
                        >
                          Reactivate
                        </button>
                      )}

                      {/* View */}
                      <button
                        className={`${s.btnAction} ${s.btnView}`}
                        aria-label={`View profile of ${customer.name}`}
                        onClick={() => {
                          console.log(`View customer #${customer.id}`);
                        }}
                      >
                        View
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className={s.tableFooter}>
          {visible.length} customer{visible.length !== 1 ? 's' : ''}
          {filter !== 'all' && ` · filtered by ${filter}`}
          {search && ` · matching "${search}"`}
        </div>
      </div>
    </div>
  );
}