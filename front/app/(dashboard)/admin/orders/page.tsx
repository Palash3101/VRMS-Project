'use client';

import { useState, useMemo } from 'react';
import s from './orders.module.css';

// ─── Types ──────────────────────────────────────────────────────────────────

type OrderStatus = 'Pending' | 'Processing' | 'Dispatched' | 'Delivered' | 'Cancelled';
type PaymentStatus = 'paid' | 'pending';
type FilterTab = 'All' | OrderStatus;
type DateFilter = 'all' | 'today' | 'week' | 'month';

interface Order {
  id: number;
  orderNo: string;
  customer: string;
  vendor: string;
  amount: number;
  gstAmount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string; // ISO date string
}

// ─── Mock data ───────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/admin/orders

const SEED_ORDERS: Order[] = [
  { id: 1, orderNo: 'ORD-2024-0001', customer: 'Meera Joshi',   vendor: 'TechServe Pvt.',  amount: 12400, gstAmount: 2232, status: 'Delivered',  paymentStatus: 'paid',    createdAt: '2024-07-18' },
  { id: 2, orderNo: 'ORD-2024-0002', customer: 'Deepak Singh',  vendor: 'BuildCorp Ltd.',  amount:  8750, gstAmount: 1575, status: 'Processing', paymentStatus: 'pending', createdAt: '2024-08-01' },
  { id: 3, orderNo: 'ORD-2024-0003', customer: 'Rahul Gupta',   vendor: 'TechServe Pvt.',  amount: 31200, gstAmount: 5616, status: 'Dispatched', paymentStatus: 'paid',    createdAt: '2024-08-05' },
  { id: 4, orderNo: 'ORD-2024-0004', customer: 'Fatima Sheikh', vendor: 'SwiftSupply Co.', amount:  5500, gstAmount:  990, status: 'Pending',    paymentStatus: 'pending', createdAt: '2024-08-09' },
  { id: 5, orderNo: 'ORD-2024-0005', customer: 'Pooja Desai',   vendor: 'NexaWorks',       amount: 18900, gstAmount: 3402, status: 'Cancelled',  paymentStatus: 'pending', createdAt: '2024-08-10' },
  { id: 6, orderNo: 'ORD-2024-0006', customer: 'Lakshmi Nair',  vendor: 'BuildCorp Ltd.',  amount:  9200, gstAmount: 1656, status: 'Pending',    paymentStatus: 'pending', createdAt: '2024-08-11' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatAmount(n: number): string {
  return '₹' + n.toLocaleString('en-IN', { minimumFractionDigits: 2 });
}

function formatDate(iso: string): string {
  const d = new Date(iso + 'T00:00:00');
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

function isInDateRange(iso: string, range: DateFilter): boolean {
  if (range === 'all') return true;
  const date = new Date(iso + 'T00:00:00');
  const now = new Date();
  if (range === 'today') {
    return date.toDateString() === now.toDateString();
  }
  if (range === 'week') {
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    return date >= weekAgo;
  }
  if (range === 'month') {
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }
  return true;
}

// ─── Badge configs ────────────────────────────────────────────────────────────

const STATUS_BADGE: Record<OrderStatus, { bg: string; color: string; dot: string; label: string }> = {
  Pending:    { bg: 'rgba(245,197,24,0.15)',  color: '#B8940A',               dot: '#B8940A',               label: 'Pending'    },
  Processing: { bg: 'rgba(26,26,26,0.06)',    color: 'var(--color-text)',      dot: 'var(--color-text)',     label: 'Processing' },
  Dispatched: { bg: 'rgba(76,175,80,0.1)',    color: 'var(--color-success)',   dot: 'var(--color-success)',  label: 'Dispatched' },
  Delivered:  { bg: 'rgba(76,175,80,0.15)',   color: 'var(--color-success)',   dot: 'var(--color-success)',  label: 'Delivered'  },
  Cancelled:  { bg: 'rgba(229,57,53,0.1)',    color: 'var(--color-error)',     dot: 'var(--color-error)',    label: 'Cancelled'  },
};

const PAYMENT_BADGE: Record<PaymentStatus, { bg: string; color: string; dot: string; label: string }> = {
  paid:    { bg: 'rgba(76,175,80,0.1)',   color: 'var(--color-success)', dot: 'var(--color-success)', label: 'Paid'    },
  pending: { bg: 'rgba(245,197,24,0.15)', color: '#B8940A',              dot: '#B8940A',              label: 'Pending' },
};

const FILTER_TABS: FilterTab[] = ['All', 'Pending', 'Processing', 'Dispatched', 'Delivered', 'Cancelled'];

const STAT_FILTERS: { key: FilterTab; label: string }[] = [
  { key: 'All',        label: 'Total'      },
  { key: 'Pending',    label: 'Pending'    },
  { key: 'Processing', label: 'Processing' },
  { key: 'Dispatched', label: 'Dispatched' },
  { key: 'Delivered',  label: 'Delivered'  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>(SEED_ORDERS);
  const [activeFilter, setActiveFilter] = useState<FilterTab>('All');
  const [search, setSearch] = useState('');
  const [dateRange, setDateRange] = useState<DateFilter>('all');

  // Cancel an order locally
  // TODO: API — PATCH /api/admin/orders/:id/cancel
  function handleCancel(id: number) {
    setOrders(prev =>
      prev.map(o => o.id === id ? { ...o, status: 'Cancelled' as OrderStatus } : o)
    );
  }

  // Stat counts (date-range aware)
  const statCounts = useMemo(() => {
    const dateFiltered = orders.filter(o => isInDateRange(o.createdAt, dateRange));
    return {
      All:        dateFiltered.length,
      Pending:    dateFiltered.filter(o => o.status === 'Pending').length,
      Processing: dateFiltered.filter(o => o.status === 'Processing').length,
      Dispatched: dateFiltered.filter(o => o.status === 'Dispatched').length,
      Delivered:  dateFiltered.filter(o => o.status === 'Delivered').length,
      Cancelled:  dateFiltered.filter(o => o.status === 'Cancelled').length,
    };
  }, [orders, dateRange]);

  // Filtered rows
  const filtered = useMemo(() => {
    let rows = orders.filter(o => isInDateRange(o.createdAt, dateRange));
    if (activeFilter !== 'All') rows = rows.filter(o => o.status === activeFilter);
    const q = search.trim().toLowerCase();
    if (q) {
      rows = rows.filter(o =>
        o.orderNo.toLowerCase().includes(q) ||
        o.customer.toLowerCase().includes(q) ||
        o.vendor.toLowerCase().includes(q)
      );
    }
    return rows;
  }, [orders, activeFilter, search, dateRange]);

  // Footer label
  const footerLabel = useMemo(() => {
    let label = `${filtered.length} order${filtered.length !== 1 ? 's' : ''}`;
    if (activeFilter !== 'All') label += ` · filtered by ${activeFilter.toLowerCase()}`;
    if (search.trim()) label += ` · matching "${search.trim()}"`;
    if (dateRange !== 'all') {
      const map: Record<string, string> = { today: 'today', week: 'this week', month: 'this month' };
      label += ` · ${map[dateRange]}`;
    }
    return label;
  }, [filtered.length, activeFilter, search, dateRange]);

  function handleStatTileClick(key: FilterTab) {
    setActiveFilter(key);
    setSearch('');
  }

  return (
    <div className={s.page}>
      {/* Header */}
      <div className={s.header}>
        <h1 className={s.title}>Orders</h1>
        <p className={s.subtitle}>Track the full order pipeline — from placement to delivery.</p>
      </div>

      {/* Stat strip — Total / Pending / Processing / Dispatched / Delivered */}
      <div className={s.statStrip}>
        {STAT_FILTERS.map((tile, i) => (
          <div
            key={tile.key}
            className={`${s.statTile} ${activeFilter === tile.key ? s.statTileActive : ''}`}
            style={{ borderRight: i < STAT_FILTERS.length - 1 ? '1px solid var(--color-border)' : 'none' }}
            onClick={() => handleStatTileClick(tile.key)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && handleStatTileClick(tile.key)}
          >
            <div className={s.statValue}>{statCounts[tile.key]}</div>
            <div className={s.statLabel}>{tile.label}</div>
            {activeFilter === tile.key && <span className={s.statActiveDot} />}
          </div>
        ))}
      </div>

      {/* Filter pill group — All / Pending / Processing / Dispatched / Delivered / Cancelled */}
      <div className={s.filterGroup} role="tablist">
        {FILTER_TABS.map(tab => (
          <button
            key={tab}
            role="tab"
            aria-selected={activeFilter === tab}
            className={`${s.filterTab} ${activeFilter === tab ? s.filterTabActive : ''}`}
            onClick={() => { setActiveFilter(tab); setSearch(''); }}
          >
            {tab}
            <span className={s.filterCount}>
              {tab === 'All' ? statCounts.All : statCounts[tab as OrderStatus]}
            </span>
          </button>
        ))}
      </div>

      {/* Toolbar — search + date filter */}
      <div className={s.toolbar}>
        <div className={s.toolbarLeft}>
          <label className={s.searchWrap}>
            <span className={s.searchIcon}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.5" />
                <path d="M11 11l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </span>
            <input
              type="search"
              className={s.searchInput}
              placeholder="Search order no., customer, vendor…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </label>
        </div>

        <div className={s.toolbarRight}>
          <select
            className={s.dateSelect}
            value={dateRange}
            onChange={e => setDateRange(e.target.value as DateFilter)}
            aria-label="Filter by date range"
          >
            <option value="all">All Time</option>
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th} style={{ width: '28%' }}>Order</th>
              <th className={s.th} style={{ width: '14%' }}>Amount</th>
              <th className={s.th} style={{ width: '14%' }}>Status</th>
              <th className={s.th} style={{ width: '13%' }}>Payment</th>
              <th className={s.th} style={{ width: '13%' }}>Date</th>
              <th className={s.th} style={{ width: '18%' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6}>
                  <div className={s.emptyState}>
                    <span className={s.emptyGlyph}>⊘</span>
                    <p className={s.emptyTitle}>No orders found</p>
                    <p className={s.emptyHint}>
                      {search.trim()
                        ? `No orders matching "${search.trim()}"`
                        : activeFilter !== 'All'
                        ? `No ${activeFilter.toLowerCase()} orders in this date range`
                        : 'No orders have been placed yet'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map(order => {
                const statusCfg  = STATUS_BADGE[order.status];
                const paymentCfg = PAYMENT_BADGE[order.paymentStatus];
                const canCancel  = order.status !== 'Delivered' && order.status !== 'Cancelled';

                return (
                  <tr key={order.id} className={s.row}>
                    {/* Order cell */}
                    <td className={s.td}>
                      <div className={s.orderCell}>
                        <span className={s.orderNo}>
                          <code className={s.orderNoChip}>{order.orderNo}</code>
                        </span>
                        <span className={s.orderMeta}>
                          {order.customer} · {order.vendor}
                        </span>
                      </div>
                    </td>

                    {/* Amount cell */}
                    <td className={s.td}>
                      <div className={s.amountCell}>
                        <span className={s.amountPrimary}>{formatAmount(order.amount)}</span>
                        <span className={s.amountGst}>+{formatAmount(order.gstAmount)} GST</span>
                      </div>
                    </td>

                    {/* Status badge */}
                    <td className={s.td}>
                      <span
                        className={s.badge}
                        style={{ background: statusCfg.bg, color: statusCfg.color }}
                      >
                        <span
                          className={s.badgeDot}
                          style={{ background: statusCfg.dot }}
                        />
                        {statusCfg.label}
                      </span>
                    </td>

                    {/* Payment badge */}
                    <td className={s.td}>
                      <span
                        className={s.badge}
                        style={{ background: paymentCfg.bg, color: paymentCfg.color }}
                      >
                        <span
                          className={s.badgeDot}
                          style={{ background: paymentCfg.dot }}
                        />
                        {paymentCfg.label}
                      </span>
                    </td>

                    {/* Date */}
                    <td className={s.td}>
                      <span className={s.dateText}>{formatDate(order.createdAt)}</span>
                    </td>

                    {/* Actions */}
                    <td className={s.td}>
                      <div className={s.actions}>
                        <button className={s.viewBtn}>
                          View
                        </button>
                        {canCancel && (
                          <button
                            className={s.cancelBtn}
                            onClick={() => handleCancel(order.id)}
                          >
                            Cancel
                            {/* TODO: API — PATCH /api/admin/orders/:id/cancel */}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className={s.tableFooter}>{footerLabel}</div>
      </div>
    </div>
  );
}