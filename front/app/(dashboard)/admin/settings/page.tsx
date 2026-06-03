'use client';

import { useState } from 'react';
import styles from './settings.module.css';

// ─── Mock Data ──────────────────────────────────────────────────────────────
// TODO: API — replace with GET /api/admin/settings
const defaultSettings = {
  appName:      'VRMS',
  gstRate:      18,
  currency:     'INR',
  smtpHost:     'smtp.gmail.com',
  smtpPort:     587,
  smtpEmail:    'noreply@vrms.in',
  smtpPassword: '',
};

// TODO: API — replace with GET /api/admin/activity-logs
const activityLogs = [
  {
    id: 1,
    admin:     'Arjun Mehta',
    action:    'Approved vendor TechServe Pvt.',
    ip:        '103.21.58.12',
    createdAt: '2024-08-11T09:14:00',
  },
  {
    id: 2,
    admin:     'Arjun Mehta',
    action:    'Assigned lead #7 to BuildCorp Ltd.',
    ip:        '103.21.58.12',
    createdAt: '2024-08-11T10:02:00',
  },
  {
    id: 3,
    admin:     'Priya Sharma',
    action:    'Updated GST rate to 18%',
    ip:        '192.168.1.45',
    createdAt: '2024-08-10T16:30:00',
  },
  {
    id: 4,
    admin:     'Priya Sharma',
    action:    'Rejected vendor NexaWorks',
    ip:        '192.168.1.45',
    createdAt: '2024-08-10T11:22:00',
  },
  {
    id: 5,
    admin:     'Arjun Mehta',
    action:    'Cancelled order ORD-2024-0005',
    ip:        '103.21.58.12',
    createdAt: '2024-08-10T09:55:00',
  },
];

// ─── Helpers ────────────────────────────────────────────────────────────────
function formatTimestamp(iso: string): string {
  const d = new Date(iso);
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const dd  = String(d.getDate()).padStart(2, '0');
  const mon = months[d.getMonth()];
  const yyyy = d.getFullYear();
  const hh  = String(d.getHours()).padStart(2, '0');
  const mm  = String(d.getMinutes()).padStart(2, '0');
  return `${dd} ${mon} ${yyyy}, ${hh}:${mm}`;
}

function initials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 1)
    .join('')
    .toUpperCase();
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [settings, setSettings] = useState(defaultSettings);
  const [saved, setSaved] = useState(false);

  function handleChange(field: keyof typeof defaultSettings, value: string | number) {
    setSettings(prev => ({ ...prev, [field]: value }));
    setSaved(false);
  }

  // TODO: API — replace with POST /api/admin/settings
  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <main className={styles.page}>
      <h1 className={styles.heading}>System Settings &amp; Logs</h1>

      {/* ── Settings Form ─────────────────────────────────────────── */}
      <section className={styles.settingsSection}>
        <h2 className={styles.sectionHeading}>General Settings</h2>

        <div className={styles.formGrid}>

          {/* App Name */}
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="appName">App Name</label>
            <input
              id="appName"
              type="text"
              className={styles.input}
              value={settings.appName}
              onChange={e => handleChange('appName', e.target.value)}
              placeholder="e.g. VRMS"
            />
          </div>

          {/* GST Rate */}
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="gstRate">GST Rate (%)</label>
            <input
              id="gstRate"
              type="number"
              className={styles.input}
              value={settings.gstRate}
              min={0}
              max={100}
              onChange={e => handleChange('gstRate', Number(e.target.value))}
              placeholder="18"
            />
          </div>

          {/* Currency */}
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="currency">Currency</label>
            <select
              id="currency"
              className={styles.select}
              value={settings.currency}
              onChange={e => handleChange('currency', e.target.value)}
            >
              <option value="INR">INR — Indian Rupee</option>
              <option value="USD">USD — US Dollar</option>
              <option value="EUR">EUR — Euro</option>
            </select>
          </div>

          {/* SMTP Host */}
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="smtpHost">SMTP Host</label>
            <input
              id="smtpHost"
              type="text"
              className={styles.input}
              value={settings.smtpHost}
              onChange={e => handleChange('smtpHost', e.target.value)}
              placeholder="smtp.gmail.com"
            />
          </div>

          {/* SMTP Port */}
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="smtpPort">SMTP Port</label>
            <input
              id="smtpPort"
              type="number"
              className={styles.input}
              value={settings.smtpPort}
              onChange={e => handleChange('smtpPort', Number(e.target.value))}
              placeholder="587"
            />
          </div>

          {/* Sender Email */}
          <div className={styles.formField}>
            <label className={styles.label} htmlFor="smtpEmail">Sender Email</label>
            <input
              id="smtpEmail"
              type="email"
              className={styles.input}
              value={settings.smtpEmail}
              onChange={e => handleChange('smtpEmail', e.target.value)}
              placeholder="noreply@vrms.in"
            />
          </div>

          {/* SMTP Password — full width */}
          <div className={styles.formField} style={{ gridColumn: '1 / -1' }}>
            <label className={styles.label} htmlFor="smtpPassword">SMTP Password</label>
            <input
              id="smtpPassword"
              type="password"
              className={styles.input}
              value={settings.smtpPassword}
              onChange={e => handleChange('smtpPassword', e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
            />
          </div>

        </div>

        {/* Save CTA */}
        <div className={styles.saveRow}>
          <button className={styles.saveBtn} onClick={handleSave}>
            {saved ? '✓ Saved' : 'Save Settings'}
          </button>
        </div>
      </section>

      {/* ── Divider ───────────────────────────────────────────────── */}
      <hr className={styles.divider} />

      {/* ── Activity Log Table ────────────────────────────────────── */}
      <section className={styles.logSection}>
        <h2 className={styles.sectionHeading}>Activity Log</h2>

        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.th} style={{ width: '28%' }}>Admin</th>
                <th className={styles.th} style={{ width: '36%' }}>Action</th>
                <th className={styles.th} style={{ width: '18%' }}>IP Address</th>
                <th className={styles.th} style={{ width: '18%' }}>Timestamp</th>
              </tr>
            </thead>
            <tbody>
              {activityLogs.map(log => (
                <tr key={log.id} className={styles.row}>

                  {/* Admin col — avatar + name */}
                  <td className={styles.td}>
                    <div className={styles.adminCell}>
                      <span className={styles.avatar}>{initials(log.admin)}</span>
                      <span className={styles.adminName}>{log.admin}</span>
                    </div>
                  </td>

                  {/* Action */}
                  <td className={styles.td}>{log.action}</td>

                  {/* IP — monospace chip (Rule #15) */}
                  <td className={styles.td}>
                    <code className={styles.ipChip}>{log.ip}</code>
                  </td>

                  {/* Timestamp */}
                  <td className={styles.td}>
                    <span className={styles.timestamp}>
                      {formatTimestamp(log.createdAt)}
                    </span>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>

          <div className={styles.tableFooter}>
            {activityLogs.length} log entries
          </div>
        </div>
      </section>

    </main>
  );
}