'use client';
import { useState } from 'react';
import styles from './settings.module.css';

// ─── Initial values — used for dirty-check ────────────────────────────────────
const INITIAL_SETTINGS = {
  appName:      'VRMS Portal',
  supportEmail: 'support@vrms.in',
  timezone:     'Asia/Kolkata',
  smtpHost:     'smtp.sendgrid.net',
  smtpPort:     '587',
  gstRate:      '18',
  currency:     'INR (₹)',
};

// TODO: API — replace with GET /api/admin/logs
const MOCK_LOGS = [
  { id: 1, adminName: 'Suresh Admin', adminInitial: 'S', type: 'vendor',  action: 'Approved vendor TechSupply Co. (#12)',              ip: '192.168.1.4',  timestamp: '2024-11-22 09:14' },
  { id: 2, adminName: 'Suresh Admin', adminInitial: 'S', type: 'lead',    action: 'Assigned lead #88 to Rajiv Malhotra',               ip: '192.168.1.4',  timestamp: '2024-11-22 09:31' },
  { id: 3, adminName: 'Suresh Admin', adminInitial: 'S', type: 'order',   action: 'Cancelled order ORD-2024-0091',                     ip: '10.0.0.2',     timestamp: '2024-11-21 14:05' },
  { id: 4, adminName: 'Priya Admin',  adminInitial: 'P', type: 'payment', action: 'Marked payment INV-2024-0044 as completed',         ip: '10.0.0.5',     timestamp: '2024-11-21 11:48' },
  { id: 5, adminName: 'Suresh Admin', adminInitial: 'S', type: 'vendor',  action: 'Rejected vendor GreenClean (#15) — docs missing',  ip: '192.168.1.4',  timestamp: '2024-11-20 16:22' },
  { id: 6, adminName: 'Priya Admin',  adminInitial: 'P', type: 'system',  action: 'Updated GST rate to 18%',                          ip: '10.0.0.5',     timestamp: '2024-11-20 10:00' },
];

// Rule #9 — dot color via inline style, never a dynamic class
const logTypeDot: Record<string, string> = {
  vendor:  '#F5C518',
  lead:    '#4CAF50',
  order:   '#1A1A1A',
  payment: '#9B9B9B',
  system:  '#E53935',
};

export default function SettingsPage() {
  const [formState, setFormState] = useState({ ...INITIAL_SETTINGS });
  const [saveFlash, setSaveFlash] = useState(false);

  const isLoading = false; // TODO: API — set true while fetching, false on data arrival

  // Derived — no extra state needed
  const isDirty = (Object.keys(INITIAL_SETTINGS) as Array<keyof typeof INITIAL_SETTINGS>).some(
    (k) => formState[k] !== INITIAL_SETTINGS[k],
  );

  const handleChange = (field: keyof typeof formState, value: string) =>
    setFormState((prev) => ({ ...prev, [field]: value }));

  const handleSave = () => {
    // TODO: API — PATCH /api/admin/settings
    setSaveFlash(true);
    setTimeout(() => setSaveFlash(false), 2000);
  };

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>Settings</h1>

      {/* ── Application ──────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Application</p>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label className={styles.label}>App Name</label>
            <input
              className={styles.input}
              value={formState.appName}
              onChange={(e) => handleChange('appName', e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Support Email</label>
            <input
              className={styles.input}
              type="email"
              value={formState.supportEmail}
              onChange={(e) => handleChange('supportEmail', e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Timezone</label>
            <select
              className={styles.select}
              value={formState.timezone}
              onChange={(e) => handleChange('timezone', e.target.value)}
            >
              <option>Asia/Kolkata</option>
              <option>UTC</option>
              <option>America/New_York</option>
              <option>Europe/London</option>
            </select>
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ── Email / SMTP ──────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Email / SMTP</p>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label className={styles.label}>SMTP Host</label>
            <input
              className={styles.input}
              value={formState.smtpHost}
              onChange={(e) => handleChange('smtpHost', e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>SMTP Port</label>
            <input
              className={styles.input}
              value={formState.smtpPort}
              onChange={(e) => handleChange('smtpPort', e.target.value)}
            />
          </div>
        </div>
      </section>

      <div className={styles.divider} />

      {/* ── Tax & Currency ────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Tax & Currency</p>
        <div className={styles.formGrid}>
          <div className={styles.formField}>
            <label className={styles.label}>GST Rate (%)</label>
            <input
              className={styles.input}
              value={formState.gstRate}
              onChange={(e) => handleChange('gstRate', e.target.value)}
            />
          </div>
          <div className={styles.formField}>
            <label className={styles.label}>Currency</label>
            <select
              className={styles.select}
              value={formState.currency}
              onChange={(e) => handleChange('currency', e.target.value)}
            >
              <option>INR (₹)</option>
              <option>USD ($)</option>
              <option>EUR (€)</option>
              <option>GBP (£)</option>
            </select>
          </div>
        </div>
      </section>

      {/* ── Save row ──────────────────────────────────────────────────────────── */}
      <div className={styles.saveRow}>
        <span className={styles.saveStatus}>
          {saveFlash ? (
            <span className={styles.savedLabel}>✓ Saved</span>
          ) : isDirty ? (
            <span className={styles.unsavedLabel}>
              <span className={styles.unsavedDot} />
              Unsaved changes
            </span>
          ) : null}
        </span>
        <button className={styles.saveBtn} onClick={handleSave}>
          Save Settings
        </button>
      </div>

      <div className={styles.divider} />

      {/* ── Activity Log ──────────────────────────────────────────────────────── */}
      <section className={styles.section}>
        <p className={styles.sectionLabel}>Activity Log</p>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th}>Admin</th>
                <th className={styles.th}>Type</th>
                <th className={styles.th}>Action</th>
                <th className={styles.th}>IP Address</th>
                <th className={styles.th}>Timestamp</th>
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
              ) : (
                /* Existing Data Rows */
                MOCK_LOGS.map((log, idx) => {
                  const isLast = idx === MOCK_LOGS.length - 1;
                  return (
                    <tr key={log.id} className={styles.row}>
                      <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                        <div className={styles.avatarCell}>
                          <span className={styles.avatarCircle}>{log.adminInitial}</span>
                          <span className={styles.avatarName}>{log.adminName}</span>
                        </div>
                      </td>
                      <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                        <span className={styles.logTypeChip}>
                          <span
                            className={styles.typeDot}
                            style={{ background: logTypeDot[log.type] ?? 'var(--color-muted)' }}
                          />
                          {log.type}
                        </span>
                      </td>
                      <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                        <span className={styles.actionText}>{log.action}</span>
                      </td>
                      <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                        <code className={styles.ipChip}>{log.ip}</code>
                      </td>
                      <td className={`${styles.td} ${isLast ? styles.lastRow : ''}`}>
                        <span className={styles.timestamp}>{log.timestamp}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}