'use client';

import { useState } from 'react';
import styles from './vendors.module.css';

// ─── Types ────────────────────────────────────────────────────────────────────

type CategoryFilter = 'All' | 'IT & Technology' | 'Construction' | 'Office Supplies' | 'Cleaning';

interface Product {
  name: string;
  price: number;
}

interface Vendor {
  id: number;
  company: string;
  initial: string;
  category: CategoryFilter;
  tagline: string;
  rating: number;
  gst: string;
  contact: string;
  status: string;
  products: Product[];
}

// ─── Mock data ────────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/customer/vendors

const mockVendors: Vendor[] = [
  {
    id: 1,
    company: 'TechSupply Co.',
    initial: 'T',
    category: 'IT & Technology',
    tagline: 'Precision tools and hardware for professionals',
    rating: 4,
    gst: '27AABCT3518Q1Z5',
    contact: 'sales@techsupply.in',
    status: 'approved',
    products: [
      { name: 'Industrial Drill Kit', price: 12400 },
      { name: 'Cable Management Kit', price: 2200 },
    ],
  },
  {
    id: 2,
    company: 'BuildMart',
    initial: 'B',
    category: 'Construction',
    tagline: 'Everything you need on the job site',
    rating: 5,
    gst: '29AABCB4521R1ZK',
    contact: 'orders@buildmart.in',
    status: 'approved',
    products: [
      { name: 'Safety Helmets × 10', price: 3800 },
      { name: 'Scaffolding Set', price: 24000 },
    ],
  },
  {
    id: 3,
    company: 'OfficeWorld',
    initial: 'O',
    category: 'Office Supplies',
    tagline: 'Ergonomic workspace solutions since 2010',
    rating: 4,
    gst: '06AABCO9923P1ZT',
    contact: 'hello@officeworld.in',
    status: 'approved',
    products: [
      { name: 'Ergonomic Chair', price: 18500 },
      { name: 'Standing Desk', price: 32000 },
    ],
  },
  {
    id: 4,
    company: 'CleanPro',
    initial: 'C',
    category: 'Cleaning',
    tagline: 'Industrial cleaning and hygiene specialists',
    rating: 3,
    gst: '33AABCC7712M1ZW',
    contact: 'support@cleanpro.in',
    status: 'approved',
    products: [
      { name: 'Industrial Vacuum', price: 9600 },
      { name: 'Floor Scrubber', price: 45000 },
    ],
  },
  {
    id: 5,
    company: 'NetGear India',
    initial: 'N',
    category: 'IT & Technology',
    tagline: 'Network infrastructure and connectivity',
    rating: 4,
    gst: '07AABCN3341S1ZQ',
    contact: 'b2b@netgearindia.in',
    status: 'approved',
    products: [
      { name: 'Managed Switch 24-Port', price: 28000 },
      { name: 'PoE Injector Kit', price: 4500 },
    ],
  },
  {
    id: 6,
    company: 'SafetyFirst',
    initial: 'S',
    category: 'Construction',
    tagline: 'PPE and site safety equipment supplier',
    rating: 5,
    gst: '24AABCS8819T1ZL',
    contact: 'orders@safetyfirst.in',
    status: 'approved',
    products: [
      { name: 'Hard Hat Class E', price: 1200 },
      { name: 'Safety Harness Kit', price: 8800 },
    ],
  },
];

// ─── Category filter config ───────────────────────────────────────────────────

const CATEGORIES: CategoryFilter[] = [
  'All',
  'IT & Technology',
  'Construction',
  'Office Supplies',
  'Cleaning',
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating }: { rating: number }) {
  return (
    <span className={styles.starRating}>
      {Array.from({ length: 5 }, (_, i) => (
        <span key={i} className={i < rating ? styles.starFilled : styles.starEmpty}>
          {i < rating ? '★' : '☆'}
        </span>
      ))}
    </span>
  );
}

function formatPrice(price: number) {
  return `₹${price.toLocaleString('en-IN')}`;
}

function getStatusBadgeStyle(status: string) {
  switch (status) {
    case 'approved':
      return {
        background: 'rgba(76, 175, 80, 0.08)',
        color: '#2e7d32',
        dotColor: '#4CAF50',
      };
    default:
      return {
        background: 'rgba(155, 155, 155, 0.08)',
        color: '#9B9B9B',
        dotColor: '#9B9B9B',
      };
  }
}

// ─── Page component ───────────────────────────────────────────────────────────

export default function CustomerVendorsPage() {
  const [catFilter, setCatFilter] = useState<CategoryFilter>('All');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [inquiry, setInquiry] = useState({ subject: '', message: '' });

  // ── Filter logic ────────────────────────────────────────────────────────────

  const filtered = mockVendors.filter((v) => {
    const matchesCat = catFilter === 'All' || v.category === catFilter;
    const q = search.toLowerCase().trim();
    const matchesSearch =
      !q ||
      v.company.toLowerCase().includes(q) ||
      v.category.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const expandedVendor = filtered.find((v) => v.id === expandedId) ?? null;

  // ── Handlers ────────────────────────────────────────────────────────────────

  function handleCatChange(cat: CategoryFilter) {
    setCatFilter(cat);
    setExpandedId(null);
  }

  function handleSearchChange(e: React.ChangeEvent<HTMLInputElement>) {
    setSearch(e.target.value);
    setExpandedId(null);
  }

  function handleCardClick(id: number) {
    setExpandedId((prev) => (prev === id ? null : id));
    setInquiry({ subject: '', message: '' });
  }

  function handleInquirySubmit() {
    console.log('Inquiry submitted:', { vendorId: expandedId, ...inquiry });
    setInquiry({ subject: '', message: '' });
    // TODO: API — POST /api/customer/inquiries
  }

  // ── Category counts ─────────────────────────────────────────────────────────

  function countForCat(cat: CategoryFilter) {
    if (cat === 'All') return mockVendors.length;
    return mockVendors.filter((v) => v.category === cat).length;
  }

  // ── Empty state hint ────────────────────────────────────────────────────────

  function emptyHint() {
    if (search && catFilter !== 'All')
      return `No vendors match "${search}" in ${catFilter}.`;
    if (search) return `No vendors match "${search}".`;
    if (catFilter !== 'All') return `No vendors in the ${catFilter} category.`;
    return 'No vendors available.';
  }

  // ── Render ──────────────────────────────────────────────────────────────────

  return (
    <div className={styles.page}>

      {/* Page header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.pageTitle}>Vendor Catalog</h1>
        <p className={styles.pageSubtitle}>
          Browse approved vendors, explore their products, and send inquiries directly.
        </p>
      </div>

      {/* Controls row */}
      <div className={styles.controlsRow}>
        {/* Category filter pills */}
        <div className={styles.filterGroup}>
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`${styles.filterTab} ${catFilter === cat ? styles.filterTabActive : ''}`}
              onClick={() => handleCatChange(cat)}
            >
              {cat}
              <span className={styles.filterCount}>{countForCat(cat)}</span>
            </button>
          ))}
        </div>

        {/* Search */}
        <label className={styles.searchWrap}>
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path
              d="M10 6.5a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0ZM9.5 10.207l3.146 3.147a.5.5 0 0 0 .708-.708L10.207 9.5A4.5 4.5 0 1 0 9.5 10.207Z"
              fill="currentColor"
            />
          </svg>
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Search vendors…"
            value={search}
            onChange={handleSearchChange}
          />
        </label>
      </div>

      {/* Vendor detail panel — rendered BEFORE the grid when expanded, so it
          appears contextually above the selected card on narrow grids.
          Per spec: rendered after the full grid div. We place it after. */}

      {/* Vendor grid */}
      <div className={styles.catalogWrap}>
        {filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>⊘</div>
            <p className={styles.emptyTitle}>No vendors found</p>
            <p className={styles.emptyHint}>{emptyHint()}</p>
          </div>
        ) : (
          filtered.map((vendor) => {
            const isActive = expandedId === vendor.id;
            return (
              <div
                key={vendor.id}
                className={`${styles.vendorCard} ${isActive ? styles.vendorCardActive : ''}`}
                onClick={() => handleCardClick(vendor.id)}
                role="button"
                aria-expanded={isActive}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleCardClick(vendor.id);
                  }
                }}
              >
                {/* Top: avatar + name + tagline */}
                <div className={styles.vendorCardTop}>
                  <div className={styles.vendorCardAvatar}>{vendor.initial}</div>
                  <div className={styles.vendorCardMeta}>
                    <p className={styles.vendorCardName}>{vendor.company}</p>
                    <p className={styles.vendorCardTagline}>{vendor.tagline}</p>
                  </div>
                </div>

                {/* Footer: category chip + star rating */}
                <div className={styles.vendorCardFooter}>
                  <span className={styles.categoryChip}>{vendor.category}</span>
                  <StarRating rating={vendor.rating} />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Vendor detail panel — rendered after the grid */}
      {expandedVendor && (
        <div className={styles.vendorDetailPanel}>

          {/* Section 1 — Vendor Info */}
          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Vendor Info</p>

            <div className={styles.detailField}>
              <span className={styles.detailFieldKey}>Company</span>
              <span className={styles.detailFieldVal}>{expandedVendor.company}</span>
            </div>

            <div className={styles.detailField}>
              <span className={styles.detailFieldKey}>GST No.</span>
              <code className={styles.monoChip}>{expandedVendor.gst}</code>
            </div>

            <div className={styles.detailField}>
              <span className={styles.detailFieldKey}>Contact</span>
              <span className={styles.detailFieldVal}>{expandedVendor.contact}</span>
            </div>

            <div className={styles.detailField}>
              <span className={styles.detailFieldKey}>Status</span>
              {(() => {
                const s = getStatusBadgeStyle(expandedVendor.status);
                return (
                  <span
                    className={styles.badge}
                    style={{ background: s.background, color: s.color }}
                  >
                    <span
                      className={styles.badgeDot}
                      style={{ background: s.dotColor }}
                    />
                    {expandedVendor.status.charAt(0).toUpperCase() +
                      expandedVendor.status.slice(1)}
                  </span>
                );
              })()}
            </div>

            <div className={styles.detailField}>
              <span className={styles.detailFieldKey}>Category</span>
              <span className={styles.detailFieldVal}>{expandedVendor.category}</span>
            </div>

            <div className={styles.detailField}>
              <span className={styles.detailFieldKey}>Rating</span>
              <StarRating rating={expandedVendor.rating} />
            </div>
          </div>

          <div className={styles.detailDivider} />

          {/* Section 2 — Products */}
          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Products</p>
            <div className={styles.productList}>
              {expandedVendor.products.map((product) => (
                <div key={product.name} className={styles.productRow}>
                  <span className={styles.productName}>{product.name}</span>
                  <span className={styles.productPrice}>
                    {formatPrice(product.price)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.detailDivider} />

          {/* Section 3 — Inquiry Form */}
          <div className={styles.detailSection}>
            <p className={styles.detailSectionTitle}>Send Inquiry</p>
            <div className={styles.inquiryForm}>
              <div
                className={styles.formField}
                onClick={(e) => e.stopPropagation()}
              >
                <label className={styles.label} htmlFor="inq-subject">
                  Subject
                </label>
                <input
                  id="inq-subject"
                  type="text"
                  className={styles.input}
                  placeholder="e.g. Bulk order pricing"
                  value={inquiry.subject}
                  onChange={(e) => {
                    e.stopPropagation();
                    setInquiry((prev) => ({ ...prev, subject: e.target.value }));
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <div
                className={styles.formField}
                onClick={(e) => e.stopPropagation()}
              >
                <label className={styles.label} htmlFor="inq-message">
                  Message
                </label>
                <textarea
                  id="inq-message"
                  className={styles.inquiryTextarea}
                  placeholder="Describe your requirements…"
                  value={inquiry.message}
                  onChange={(e) => {
                    e.stopPropagation();
                    setInquiry((prev) => ({ ...prev, message: e.target.value }));
                  }}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>

              <button
                className={styles.inquirySubmitBtn}
                onClick={(e) => {
                  e.stopPropagation();
                  handleInquirySubmit();
                }}
              >
                Send Inquiry
              </button>
            </div>
          </div>

        </div>
      )}

      {/* Footer */}
      {filtered.length > 0 && (
        <p className={styles.catalogFooter}>
          {filtered.length} vendor{filtered.length !== 1 ? 's' : ''}
          {catFilter !== 'All' ? ` · ${catFilter}` : ''}
          {search ? ` · matching "${search}"` : ''}
        </p>
      )}

    </div>
  );
}