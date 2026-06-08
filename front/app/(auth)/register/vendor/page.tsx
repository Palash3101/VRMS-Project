'use client';

import { useState, useRef, DragEvent } from 'react';
import Link from 'next/link';
import styles from './vendor.module.css';
import { useSearchParams } from "next/navigation";
/* ─────────────────────────────────────────────
   Types
   ───────────────────────────────────────────── */
interface FormData {
  // Step 1 — Company Identity
  companyName: string;
  businessType: string;
  yearEstablished: string;
  websiteUrl: string;

  // Step 2 — Tax & Registration
  gstNumber: string;
  panNumber: string;
  registrationNumber: string;

  // Step 3 — Contact Details
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  city: string;
  state: string;
  address: string;

  // Step 4 — Documents
  gstCertificate: File | null;
  businessLicense: File | null;
  logo: File | null;
  termsAccepted: boolean;
}

type UploadField = 'gstCertificate' | 'businessLicense' | 'logo';

const INITIAL: FormData = {
  companyName: '',
  businessType: '',
  yearEstablished: '',
  websiteUrl: '',
  gstNumber: '',
  panNumber: '',
  registrationNumber: '',
  contactName: '',
  contactEmail: '',
  contactPhone: '',
  city: '',
  state: '',
  address: '',
  gstCertificate: null,
  businessLicense: null,
  logo: null,
  termsAccepted: false,
};

const STEPS = [
  { label: 'Step 01', title: 'Company' },
  { label: 'Step 02', title: 'Tax & GST' },
  { label: 'Step 03', title: 'Contact' },
  { label: 'Step 04', title: 'Documents' },
];

const BUSINESS_TYPES = [
  'Sole Proprietorship',
  'Partnership Firm',
  'Private Limited (Pvt. Ltd.)',
  'Limited Liability Partnership (LLP)',
  'One Person Company (OPC)',
  'Public Limited',
  'Others',
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh', 'Chandigarh',
];

/* ─────────────────────────────────────────────
   Helpers — Icons
   ───────────────────────────────────────────── */
const ArrowLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7" />
  </svg>
);

const ArrowRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const Check = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const UploadIcon = ({ hasFile }: { hasFile: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={hasFile ? '#4CAF50' : '#9B9B9B'} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    {hasFile ? (
      <polyline points="20 6 9 17 4 12" />
    ) : (
      <>
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 8 12 3 7 8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </>
    )}
  </svg>
);

const ImageIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#9B9B9B" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <polyline points="21 15 16 10 5 21" />
  </svg>
);

const SuccessIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#F5C518" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

/* ─────────────────────────────────────────────
   Validation
   ───────────────────────────────────────────── */
function validateStep(step: number, data: FormData): Record<string, string> {
  const errors: Record<string, string> = {};

  if (step === 0) {
    if (!data.companyName.trim()) errors.companyName = 'Company name is required';
    if (!data.businessType) errors.businessType = 'Select a business type';
    if (!data.yearEstablished) errors.yearEstablished = 'Year is required';
    else if (
      Number(data.yearEstablished) < 1900 ||
      Number(data.yearEstablished) > new Date().getFullYear()
    )
      errors.yearEstablished = 'Enter a valid year';
  }

  if (step === 1) {
    if (!data.gstNumber.trim()) {
      errors.gstNumber = 'GST number is required';
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(data.gstNumber.toUpperCase())) {
      errors.gstNumber = 'Enter a valid 15-character GST number';
    }
    if (!data.panNumber.trim()) {
      errors.panNumber = 'PAN number is required';
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(data.panNumber.toUpperCase())) {
      errors.panNumber = 'Enter a valid 10-character PAN number';
    }
  }

  if (step === 2) {
    if (!data.contactName.trim()) errors.contactName = 'Contact name is required';
    if (!data.contactEmail.trim()) errors.contactEmail = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(data.contactEmail)) errors.contactEmail = 'Enter a valid email';
    if (!data.contactPhone.trim()) errors.contactPhone = 'Phone is required';
    else if (!/^[0-9]{10}$/.test(data.contactPhone)) errors.contactPhone = 'Enter a valid 10-digit number';
    if (!data.city.trim()) errors.city = 'City is required';
    if (!data.state) errors.state = 'Select a state';
  }

  if (step === 3) {
    if (!data.gstCertificate) errors.gstCertificate = 'GST certificate is required';
    if (!data.businessLicense) errors.businessLicense = 'Business license is required';
    if (!data.termsAccepted) errors.termsAccepted = 'You must accept the terms to continue';
  }

  return errors;
}

/* ─────────────────────────────────────────────
   Upload Zone Component
   ───────────────────────────────────────────── */
function UploadZone({
  label,
  sublabel,
  accept,
  file,
  fieldName,
  onChange,
  error,
  required = true,
}: {
  label: string;
  sublabel: string;
  accept: string;
  file: File | null;
  fieldName: UploadField;
  onChange: (field: UploadField, file: File | null) => void;
  error?: string;
  required?: boolean;
}) {
  const [dragging, setDragging] = useState(false);

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(fieldName, dropped);
  };

  return (
    <div className={styles.fieldGroup} style={{ marginBottom: 0 }}>
      <div
        className={`${styles.uploadZone} ${dragging ? styles.dragOver : ''} ${file ? styles.hasFile : ''}`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={error ? { borderColor: '#E53935' } : undefined}
      >
        <input
          className={styles.uploadInput}
          type="file"
          accept={accept}
          onChange={(e) => {
            const f = e.target.files?.[0] ?? null;
            onChange(fieldName, f);
          }}
        />
        <div className={styles.uploadIcon}>
          <UploadIcon hasFile={!!file} />
        </div>
        <div className={styles.uploadLabel}>
          {label}
          {required && <span style={{ color: '#E53935', marginLeft: 2 }}>*</span>}
        </div>
        <div className={styles.uploadSubLabel}>{file ? '' : sublabel}</div>
        {file && <div className={styles.uploadFileName}>{file.name}</div>}
      </div>
      {error && <div className={styles.fieldError}>{error}</div>}
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Component
   ───────────────────────────────────────────── */
export default function VendorRegisterPage() {
  const searchParams = useSearchParams();
  const prefillEmail    = searchParams.get('email')    ?? '';
  const prefillUsername = searchParams.get('username') ?? '';

  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<FormData>(() => ({
    ...INITIAL,
    contactEmail: prefillEmail,
    contactName:  prefillUsername,
  }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  const totalSteps = STEPS.length;

  /* ── Field helpers ── */
  const set = (field: keyof FormData, value: string | boolean | File | null) => {
    setData((prev) => ({ ...prev, [field]: value }));
    // clear error on change
    if (errors[field as string]) {
      setErrors((prev) => { const n = { ...prev }; delete n[field as string]; return n; });
    }
  };

  const handleUpload = (field: UploadField, file: File | null) => {
    set(field, file);
    if (field === 'logo' && file) {
      const reader = new FileReader();
      reader.onload = (e) => setLogoPreview(e.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  /* ── Navigation ── */
  const goNext = () => {
    const stepErrors = validateStep(currentStep, data);
    if (Object.keys(stepErrors).length > 0) {
      setErrors(stepErrors);
      return;
    }
    setErrors({});
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
      rightRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // Submit
      setSubmitted(true);
    }
  };

  const goBack = () => {
    setErrors({});
    setCurrentStep((s) => Math.max(0, s - 1));
    rightRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  /* ── Step content ── */
  const renderStep = () => {
    switch (currentStep) {
      /* ── STEP 1 — Company Identity ── */
      case 0:
        return (
          <div key="step-0" className={styles.formStepContent}>
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Company Name <span style={{ color: '#E53935' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.companyName ? styles.hasError : ''}`}
                  type="text"
                  placeholder="Acme Technologies Pvt. Ltd."
                  value={data.companyName}
                  onChange={(e) => set('companyName', e.target.value)}
                  autoFocus
                />
                {errors.companyName && <div className={styles.fieldError}>{errors.companyName}</div>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Year Established <span style={{ color: '#E53935' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.yearEstablished ? styles.hasError : ''}`}
                  type="number"
                  placeholder={`e.g. ${new Date().getFullYear() - 5}`}
                  min="1900"
                  max={new Date().getFullYear()}
                  value={data.yearEstablished}
                  onChange={(e) => set('yearEstablished', e.target.value)}
                />
                {errors.yearEstablished && <div className={styles.fieldError}>{errors.yearEstablished}</div>}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Business Type <span style={{ color: '#E53935' }}>*</span>
              </label>
              <select
                className={`${styles.select} ${errors.businessType ? styles.hasError : ''}`}
                value={data.businessType}
                onChange={(e) => set('businessType', e.target.value)}
              >
                <option value="">Select business structure</option>
                {BUSINESS_TYPES.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              {errors.businessType && <div className={styles.fieldError}>{errors.businessType}</div>}
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Website URL <span className={styles.labelOptional}>(optional)</span>
              </label>
              <div className={styles.inputWrapper}>
                <span className={styles.inputPrefix}>https://</span>
                <input
                  className={`${styles.input} ${styles.inputWithPrefix}`}
                  type="text"
                  placeholder="yourcompany.com"
                  value={data.websiteUrl}
                  onChange={(e) => set('websiteUrl', e.target.value)}
                />
              </div>
              <div className={styles.fieldHint}>Your company's public website, if available.</div>
            </div>
          </div>
        );

      /* ── STEP 2 — Tax & GST ── */
      case 1:
        return (
          <div key="step-1" className={styles.formStepContent}>
            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                GST Number <span style={{ color: '#E53935' }}>*</span>
              </label>
              <input
                className={`${styles.input} ${errors.gstNumber ? styles.hasError : ''}`}
                type="text"
                placeholder="22AAAAA0000A1Z5"
                value={data.gstNumber}
                onChange={(e) => set('gstNumber', e.target.value.toUpperCase())}
                maxLength={15}
                style={{ fontFamily: "'DM Mono', 'Courier New', monospace", letterSpacing: '0.08em' }}
              />
              {errors.gstNumber
                ? <div className={styles.fieldError}>{errors.gstNumber}</div>
                : <div className={styles.fieldHint}>15-character alphanumeric GSTIN issued by the government.</div>
              }
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                PAN Number <span style={{ color: '#E53935' }}>*</span>
              </label>
              <input
                className={`${styles.input} ${errors.panNumber ? styles.hasError : ''}`}
                type="text"
                placeholder="ABCDE1234F"
                value={data.panNumber}
                onChange={(e) => set('panNumber', e.target.value.toUpperCase())}
                maxLength={10}
                style={{ fontFamily: "'DM Mono', 'Courier New', monospace", letterSpacing: '0.08em' }}
              />
              {errors.panNumber
                ? <div className={styles.fieldError}>{errors.panNumber}</div>
                : <div className={styles.fieldHint}>10-character PAN linked to your business entity.</div>
              }
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Business Registration Number <span className={styles.labelOptional}>(optional)</span>
              </label>
              <input
                className={styles.input}
                type="text"
                placeholder="CIN / LLPIN / Reg. No."
                value={data.registrationNumber}
                onChange={(e) => set('registrationNumber', e.target.value)}
              />
              <div className={styles.fieldHint}>CIN for Pvt. Ltd. / LLP-IN for LLPs / Reg. No. for others.</div>
            </div>

            {/* Info note */}
            <div style={{
              padding: '16px 20px',
              borderRadius: '8px',
              background: 'rgba(245, 197, 24, 0.06)',
              border: '1px solid rgba(245, 197, 24, 0.25)',
              fontSize: '13px',
              color: '#1A1A1A',
              lineHeight: '1.6',
            }}>
              <strong style={{ display: 'block', marginBottom: 4 }}>Your data is safe.</strong>
              Tax identifiers are stored encrypted and used only for verification. We follow DPDP Act, 2023 guidelines.
            </div>
          </div>
        );

      /* ── STEP 3 — Contact Details ── */
      case 2:
        return (
          <div key="step-2" className={styles.formStepContent}>
            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Contact Person Name <span style={{ color: '#E53935' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.contactName ? styles.hasError : ''}`}
                  type="text"
                  placeholder="Rajesh Kumar"
                  value={data.contactName}
                  onChange={(e) => set('contactName', e.target.value)}
                  autoFocus
                />
                {errors.contactName && <div className={styles.fieldError}>{errors.contactName}</div>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  Official Email <span style={{ color: '#E53935' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.contactEmail ? styles.hasError : ''}`}
                  type="email"
                  placeholder="contact@company.com"
                  value={data.contactEmail}
                  onChange={(e) => set('contactEmail', e.target.value)}
                />
                {errors.contactEmail && <div className={styles.fieldError}>{errors.contactEmail}</div>}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Phone Number <span style={{ color: '#E53935' }}>*</span>
              </label>
              <div className={styles.phoneRow}>
                <span className={styles.phonePrefix}>+91</span>
                <input
                  className={`${styles.phoneInput} ${errors.contactPhone ? styles.hasError : ''}`}
                  type="tel"
                  placeholder="9876543210"
                  value={data.contactPhone}
                  onChange={(e) => set('contactPhone', e.target.value.replace(/\D/g, '').slice(0, 10))}
                />
              </div>
              {errors.contactPhone && <div className={styles.fieldError}>{errors.contactPhone}</div>}
            </div>

            <div className={styles.formRow}>
              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  City <span style={{ color: '#E53935' }}>*</span>
                </label>
                <input
                  className={`${styles.input} ${errors.city ? styles.hasError : ''}`}
                  type="text"
                  placeholder="Mumbai"
                  value={data.city}
                  onChange={(e) => set('city', e.target.value)}
                />
                {errors.city && <div className={styles.fieldError}>{errors.city}</div>}
              </div>

              <div className={styles.fieldGroup}>
                <label className={styles.label}>
                  State <span style={{ color: '#E53935' }}>*</span>
                </label>
                <select
                  className={`${styles.select} ${errors.state ? styles.hasError : ''}`}
                  value={data.state}
                  onChange={(e) => set('state', e.target.value)}
                >
                  <option value="">Select state</option>
                  {INDIAN_STATES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                {errors.state && <div className={styles.fieldError}>{errors.state}</div>}
              </div>
            </div>

            <div className={styles.fieldGroup}>
              <label className={styles.label}>
                Business Address <span className={styles.labelOptional}>(optional)</span>
              </label>
              <textarea
                className={styles.textarea}
                placeholder="Street, area, landmark…"
                value={data.address}
                onChange={(e) => set('address', e.target.value)}
                rows={3}
              />
            </div>
          </div>
        );

      /* ── STEP 4 — Documents ── */
      case 3:
        return (
          <div key="step-3" className={styles.formStepContent}>
            <div className={styles.uploadGrid}>
              <UploadZone
                label="GST Certificate"
                sublabel="PDF or image · max 5 MB"
                accept=".pdf,.jpg,.jpeg,.png"
                file={data.gstCertificate}
                fieldName="gstCertificate"
                onChange={handleUpload}
                error={errors.gstCertificate}
                required
              />

              <UploadZone
                label="Business License"
                sublabel="Registration cert · PDF or image"
                accept=".pdf,.jpg,.jpeg,.png"
                file={data.businessLicense}
                fieldName="businessLicense"
                onChange={handleUpload}
                error={errors.businessLicense}
                required
              />

              {/* Logo — full width */}
              <div
                className={`${styles.logoUploadZone} ${data.logo ? styles.hasFile : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const f = e.dataTransfer.files[0];
                  if (f) handleUpload('logo', f);
                }}
              >
                <input
                  className={styles.uploadInput}
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const f = e.target.files?.[0] ?? null;
                    handleUpload('logo', f);
                  }}
                />
                <div className={styles.logoPreview}>
                  {logoPreview
                    ? <img src={logoPreview} alt="Logo preview" />
                    : <ImageIcon />
                  }
                </div>
                <div className={styles.logoText}>
                  <div className={styles.uploadLabel}>
                    Company Logo <span className={styles.labelOptional}>(optional)</span>
                  </div>
                  <div className={styles.uploadSubLabel}>
                    {data.logo ? data.logo.name : 'PNG, JPG or SVG · min 200×200 px · Used on your vendor profile'}
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <label className={styles.termsRow} style={{ cursor: 'pointer' }}>
              <input
                className={styles.checkbox}
                type="checkbox"
                checked={data.termsAccepted}
                onChange={(e) => set('termsAccepted', e.target.checked)}
              />
              <span className={styles.termsText}>
                I confirm that all information provided is accurate and I agree to the{' '}
                <a href="/terms" target="_blank" rel="noopener noreferrer">Vendor Terms of Service</a>{' '}
                and{' '}
                <a href="/privacy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.
                I understand my application will be reviewed by the admin team.
              </span>
            </label>
            {errors.termsAccepted && (
              <div className={styles.fieldError} style={{ marginTop: -8, marginBottom: 8 }}>
                {errors.termsAccepted}
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  /* ── Step titles ── */
  const STEP_CONTENT = [
    { tag: 'Step 1 of 4', title: 'Company\nIdentity', subtitle: 'Tell us about your business. This information will appear on your vendor profile.' },
    { tag: 'Step 2 of 4', title: 'Tax &\nRegistration', subtitle: 'Your GST and PAN details for verification. These are never shared publicly.' },
    { tag: 'Step 3 of 4', title: 'Contact\nDetails', subtitle: 'Who should we reach out to? This will be the primary point of contact for your account.' },
    { tag: 'Step 4 of 4', title: 'Documents\n& Submit', subtitle: 'Upload the required documents for verification. Your application goes to admin review after submission.' },
  ];

  const current = STEP_CONTENT[currentStep];

  /* ── Submitted state ── */
  if (submitted) {
    return (
      <div className={styles.page}>
        {/* Minimal left panel */}
        <div className={styles.leftPanel}>
          <Link href="/register" className={styles.brandBack}>
            <ArrowLeft /> Back to register
          </Link>
          <div className={styles.panelTitle}>VRMS</div>
          <div className={styles.panelSubtitle}>Vendor Relationship Management System</div>
          <div className={styles.progressBar}>
            <div className={styles.progressLabel}>
              <span>Registration</span><span>Complete</span>
            </div>
            <div className={styles.progressTrack}>
              <div className={styles.progressFill} style={{ width: '100%' }} />
            </div>
          </div>
        </div>

        {/* Success */}
        <div className={styles.rightPanel} style={{ justifyContent: 'center' }}>
          <div className={styles.successState}>
            <div className={styles.successIcon}><SuccessIcon /></div>
            <h1 className={styles.successTitle}>Application Submitted</h1>
            <p className={styles.successBody}>
              Your vendor application for <strong>{data.companyName}</strong> has been received.
              Our admin team will review your documents and send an approval decision to{' '}
              <strong>{data.contactEmail}</strong> within 1–2 business days.
            </p>
            <Link
              href="/login"
              style={{
                height: 44,
                padding: '0 28px',
                background: '#1A1A1A',
                color: '#fff',
                borderRadius: 8,
                textDecoration: 'none',
                fontSize: 14,
                fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif",
                display: 'inline-flex',
                alignItems: 'center',
                gap: 8,
                transition: 'opacity 0.2s',
              }}
            >
              Go to Login <ArrowRight />
            </Link>
          </div>
        </div>
      </div>
    );
  }

  /* ── Main render ── */
  return (
    <div className={styles.page}>
      {/* ── LEFT PANEL ── */}
      <div className={styles.leftPanel}>
        <Link href="/register" className={styles.brandBack}>
          <ArrowLeft /> Back to register
        </Link>

        <div className={styles.panelTitle}>Vendor Registration</div>
        <div className={styles.panelSubtitle}>
          Fill in your business details to apply for a vendor account on VRMS.
        </div>

        <div className={styles.stepsList}>
          {STEPS.map((step, i) => {
            const isActive = i === currentStep;
            const isCompleted = i < currentStep;
            return (
              <div
                key={i}
                className={`${styles.stepItem} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}
              >
                <div className={styles.stepBadge}>
                  <span className={styles.stepBadgeNum}>{i + 1}</span>
                  <span className={styles.checkIcon}><Check /></span>
                </div>
                <div className={styles.stepText}>
                  <div className={styles.stepLabel}>{step.label}</div>
                  <div className={styles.stepTitle}>{step.title}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.progressBar}>
          <div className={styles.progressLabel}>
            <span>Progress</span>
            <span>{Math.round(((currentStep + 1) / totalSteps) * 100)}%</span>
          </div>
          <div className={styles.progressTrack}>
            <div
              className={styles.progressFill}
              style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div className={styles.rightPanel} ref={rightRef}>
        {/* Header */}
        <div className={styles.formHeader}>
          <div className={styles.stepTag}>{current.tag}</div>
          <h1 className={styles.formTitle} style={{ whiteSpace: 'pre-line' }}>
            {current.title}
          </h1>
          <p className={styles.formSubtitle}>{current.subtitle}</p>
        </div>

        {/* Step form content */}
        <div className={styles.formBody}>
          {renderStep()}
        </div>

        {/* Bottom navigation */}
        <div className={styles.formNav}>
          {currentStep > 0 ? (
            <button className={styles.btnBack} onClick={goBack}>
              <ArrowLeft /> Back
            </button>
          ) : (
            <div />
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <span className={styles.stepCounter}>
              <span>{currentStep + 1}</span> / {totalSteps}
            </span>

            {currentStep < totalSteps - 1 ? (
              <button className={styles.btnNext} onClick={goNext}>
                Continue <ArrowRight />
              </button>
            ) : (
              <button
                className={styles.btnSubmit}
                onClick={goNext}
                disabled={!data.termsAccepted}
              >
                Submit Application <ArrowRight />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}