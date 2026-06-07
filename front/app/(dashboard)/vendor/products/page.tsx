'use client';

import { useState } from 'react';
import s from './products.module.css';

// TODO: API — replace with GET /api/vendor/products
const mockProducts = [
  { id: 1, name: 'Industrial Valve',   price: 12800, stock: 34, image: null },
  { id: 2, name: 'Steel Fittings Set', price:  6200, stock:  8, image: null },
  { id: 3, name: 'Pipe Connector Kit', price: 18500, stock: 21, image: null },
  { id: 4, name: 'Pressure Gauge',     price:  3900, stock:  5, image: null },
  { id: 5, name: 'Flow Meter',         price: 27000, stock: 12, image: null },
];

type Product = typeof mockProducts[number];

type FilterTab = 'all' | 'low';

const formatPrice = (p: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(p);

export default function VendorProductsPage() {
  // Controls visibility of the inline Add Product form
  const [showAddForm, setShowAddForm] = useState(false);

  // Which row is being edited (by product id)
  const [editingId, setEditingId] = useState<number | null>(null);

  // Controlled inputs for the Add form
  const [newProduct, setNewProduct] = useState({ name: '', price: '', stock: '' });

  // Per-row edit buffer — populated when Edit is clicked
  const [editBuffer, setEditBuffer] = useState<Record<number, { name: string; price: string; stock: string }>>({});

  // Local product list for optimistic add / edit / delete
  const [products, setProducts] = useState<Product[]>(mockProducts);

  // Active stat filter: 'all' | 'low'
  const [activeFilter, setActiveFilter] = useState<FilterTab>('all');

  const isLoading = false; // TODO: API — set true while fetching, false on data arrival

  // ── Derived values ──────────────────────────────────────────
  const lowStockProducts  = products.filter(p => p.stock < 10);
  const totalValue        = products.reduce((sum, p) => sum + p.price * p.stock, 0);

  const displayed = activeFilter === 'low' ? lowStockProducts : products;

  // ── Add product ─────────────────────────────────────────────
  function handleAddSave() {
    if (!newProduct.name.trim()) return;
    const price = parseFloat(newProduct.price) || 0;
    const stock = parseInt(newProduct.stock, 10) || 0;
    // TODO: API — POST /api/vendor/products
    setProducts(prev => [
      ...prev,
      { id: Date.now(), name: newProduct.name.trim(), price, stock, image: null },
    ]);
    setNewProduct({ name: '', price: '', stock: '' });
    setShowAddForm(false);
  }

  function handleAddCancel() {
    setNewProduct({ name: '', price: '', stock: '' });
    setShowAddForm(false);
  }

  // ── Edit product ─────────────────────────────────────────────
  function startEdit(p: Product) {
    setEditingId(p.id);
    setEditBuffer(prev => ({
      ...prev,
      [p.id]: { name: p.name, price: String(p.price), stock: String(p.stock) },
    }));
  }

  function handleEditSave(id: number) {
    const buf = editBuffer[id];
    if (!buf) return;
    // TODO: API — PATCH /api/vendor/products/:id
    setProducts(prev =>
      prev.map(p =>
        p.id === id
          ? { ...p, name: buf.name.trim(), price: parseFloat(buf.price) || p.price, stock: parseInt(buf.stock, 10) || p.stock }
          : p
      )
    );
    setEditingId(null);
  }

  function handleEditCancel() {
    setEditingId(null);
  }

  // ── Delete product ───────────────────────────────────────────
  function handleDelete(id: number) {
    // TODO: API — DELETE /api/vendor/products/:id
    setProducts(prev => prev.filter(p => p.id !== id));
    if (editingId === id) setEditingId(null);
  }

  // ── Stat tile click syncs filter ─────────────────────────────
  function handleStatClick(filter: FilterTab) {
    setActiveFilter(prev => (prev === filter ? 'all' : filter));
  }

  // ── Render ───────────────────────────────────────────────────
  return (
    <div className={s.page}>

      {/* Page header */}
      <div className={s.pageHeader}>
        <h1 className={s.pageTitle}>Products</h1>
        <p className={s.pageSubtitle}>Manage your product catalogue — prices, stock levels, and details.</p>
      </div>

      {/* Stat strip */}
      <div className={s.statStrip}>
        <div
          className={`${s.statTile} ${activeFilter === 'all' ? s.statTileActive : ''}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => handleStatClick('all')}
        >
          {activeFilter === 'all' && <span className={s.statActiveDot} />}
          {isLoading ? <div className="skeleton skeletonStat" /> : <div className={s.statValue}>{products.length}</div>}
          {isLoading ? <div className="skeleton skeletonLabel" style={{ width: 56 }} /> : <div className={s.statLabel}>Total Products</div>}
        </div>
        <div
          className={`${s.statTile} ${activeFilter === 'low' ? s.statTileActive : ''}`}
          style={{ borderRight: '1px solid var(--color-border)' }}
          onClick={() => handleStatClick('low')}
        >
          {activeFilter === 'low' && <span className={s.statActiveDot} />}
          {isLoading ? (
            <div className="skeleton skeletonStat" />
          ) : (
            <div className={s.statValue} style={{ color: lowStockProducts.length > 0 ? 'var(--color-error)' : undefined }}>
              {lowStockProducts.length}
            </div>
          )}
          {isLoading ? <div className="skeleton skeletonLabel" style={{ width: 56 }} /> : <div className={s.statLabel}>Low Stock (&lt; 10)</div>}
        </div>
        <div className={s.statTile}>
          {isLoading ? <div className="skeleton skeletonStat" /> : <div className={s.statValue}>{formatPrice(totalValue)}</div>}
          {isLoading ? <div className="skeleton skeletonLabel" style={{ width: 56 }} /> : <div className={s.statLabel}>Catalogue Value</div>}
        </div>
      </div>

      {/* Content header row */}
      <div className={s.contentHeader}>
        <p className={s.sectionTitle}>
          {activeFilter === 'low' ? 'Low Stock Products' : 'All Products'}
        </p>
        <button
          className={s.addBtn}
          onClick={() => { setShowAddForm(v => !v); setEditingId(null); }}
        >
          <span className={s.addBtnIcon}>{showAddForm ? '−' : '+'}</span>
          {showAddForm ? 'Close Form' : 'Add Product'}
        </button>
      </div>

      {/* ── Inline Add form ─────────────────────────────────── */}
      {showAddForm && (
        <div className={s.addFormPanel}>
          <p className={s.addFormTitle}>New Product</p>
          <div className={s.formGrid}>
            <div className={s.formField}>
              <label className={s.label}>Product Name</label>
              <input
                className={s.input}
                type="text"
                placeholder="e.g. Industrial Valve"
                value={newProduct.name}
                onChange={e => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
            <div className={s.formField}>
              <label className={s.label}>Price (₹)</label>
              <input
                className={s.input}
                type="number"
                placeholder="0"
                min="0"
                value={newProduct.price}
                onChange={e => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
              />
            </div>
            <div className={s.formField}>
              <label className={s.label}>Stock Quantity</label>
              <input
                className={s.input}
                type="number"
                placeholder="0"
                min="0"
                value={newProduct.stock}
                onChange={e => setNewProduct(prev => ({ ...prev, stock: e.target.value }))}
              />
            </div>
            <div className={s.formField}>
              {/* Spacer — keeps the grid balanced, dropzone spans below */}
            </div>

            {/* Image dropzone — spans both columns */}
            <div
              className={s.imageDropzone}
              style={{ gridColumn: '1 / -1' }}
              onClick={() => { /* TODO: API — file upload handled by backend teammate */ }}
            >
              <span className={s.dropzoneIcon}>🖼</span>
              <span className={s.dropzoneText}>Drop image or click to upload</span>
            </div>
          </div>

          <div className={s.formActions}>
            <button className={s.saveBtn} onClick={handleAddSave}>Save Product</button>
            <button className={s.cancelBtn} onClick={handleAddCancel}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Table ────────────────────────────────────────────── */}
      <div className={s.tableWrap}>
        <table className={s.table}>
          <thead className={s.thead}>
            <tr>
              <th className={s.th}>Product</th>
              <th className={s.th}>Price</th>
              <th className={s.th}>Stock</th>
              <th className={s.th} style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              /* Block D - Skeleton Rows (Adjusted to colSpan={4}) */
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={`skel-${i}`}>
                  <td colSpan={4} style={{ padding: '10px 24px' }}>
                    <div className="skeleton skeletonRow" style={{ height: '40px' }} />
                  </td>
                </tr>
              ))
            ) : displayed.length === 0 ? (
              /* Existing Empty State */
              <tr>
                <td colSpan={4}>
                  <div className={s.emptyState}>
                    <span className={s.emptyGlyph}>⊘</span>
                    <p className={s.emptyTitle}>
                      {activeFilter === 'low' ? 'No low-stock products' : 'No products yet'}
                    </p>
                    <p className={s.emptyHint}>
                      {activeFilter === 'low'
                        ? 'All products are sufficiently stocked.'
                        : 'Click "+ Add Product" above to list your first item.'}
                    </p>
                  </div>
                </td>
              </tr>
            ) : (
              /* Existing Data Rows */
              displayed.map(product => {
                const isEditing = editingId === product.id;
                const buf = editBuffer[product.id] ?? { name: product.name, price: String(product.price), stock: String(product.stock) };

                return (
                  <tr
                    key={product.id}
                    className={`${s.row} ${isEditing ? s.editingRow : ''}`}
                  >
                    {/* Product name cell */}
                    <td className={s.td}>
                      {isEditing ? (
                        <div className={s.imgCell}>
                          <div className={s.imgPlaceholder}>
                            <span className={s.imgIcon}>📦</span>
                          </div>
                          <input
                            className={s.inlineInput}
                            type="text"
                            value={buf.name}
                            onChange={e =>
                              setEditBuffer(prev => ({ ...prev, [product.id]: { ...buf, name: e.target.value } }))
                            }
                          />
                        </div>
                      ) : (
                        <div className={s.imgCell}>
                          <div className={s.imgPlaceholder}>
                            <span className={s.imgIcon}>📦</span>
                          </div>
                          <span className={s.productName}>{product.name}</span>
                        </div>
                      )}
                    </td>

                    {/* Price cell */}
                    <td className={s.td}>
                      {isEditing ? (
                        <input
                          className={s.inlineInput}
                          type="number"
                          min="0"
                          style={{ width: 120 }}
                          value={buf.price}
                          onChange={e =>
                            setEditBuffer(prev => ({ ...prev, [product.id]: { ...buf, price: e.target.value } }))
                          }
                        />
                      ) : (
                        <span className={s.price}>
                          {formatPrice(product.price)}
                          <span className={s.priceSub}>excl. GST</span>
                        </span>
                      )}
                    </td>

                    {/* Stock cell */}
                    <td className={s.td}>
                      {isEditing ? (
                        <input
                          className={s.inlineInput}
                          type="number"
                          min="0"
                          style={{ width: 90 }}
                          value={buf.stock}
                          onChange={e =>
                            setEditBuffer(prev => ({ ...prev, [product.id]: { ...buf, stock: e.target.value } }))
                          }
                        />
                      ) : (
                        <span className={product.stock < 10 ? s.stockChipLow : s.stockChip}>
                          {product.stock < 10 && <span className={s.stockWarningDot} />}
                          {product.stock} units
                        </span>
                      )}
                    </td>

                    {/* Actions cell */}
                    <td className={s.td} style={{ textAlign: 'right' }}>
                      {isEditing ? (
                        <div className={s.editActionBtns} style={{ justifyContent: 'flex-end' }}>
                          <button className={s.rowSaveBtn} onClick={() => handleEditSave(product.id)}>
                            Save
                          </button>
                          <button className={s.rowCancelBtn} onClick={handleEditCancel}>
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className={s.actionCell}>
                          <button className={s.editBtn} onClick={() => startEdit(product)}>
                            Edit
                          </button>
                          <button className={s.deleteBtn} onClick={() => handleDelete(product.id)}>
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* Table footer */}
        <div className={s.tableFooter}>
          <span>
            {displayed.length} product{displayed.length !== 1 ? 's' : ''}
            {activeFilter === 'low' ? ' · filtered by low stock' : ''}
          </span>
          <span>
            {lowStockProducts.length > 0 && activeFilter !== 'low' && (
              <span style={{ color: 'var(--color-error)' }}>
                {lowStockProducts.length} item{lowStockProducts.length !== 1 ? 's' : ''} low on stock
              </span>
            )}
          </span>
        </div>
      </div>

    </div>
  );
}