// app/(dashboard)/vendor/layout.tsx
// Server component — mirrors admin/layout.tsx exactly.
// Injects vendorNav into the shared TopBar. No client logic here.

import TopBar from '../_components/TopBar';

const vendorNav = [
  { label: 'Dashboard', href: '/vendor' },
  { label: 'Orders',    href: '/vendor/orders' },
  { label: 'Payments',  href: '/vendor/payments' },
  { label: 'Products',  href: '/vendor/products' },
  { label: 'Leads',     href: '/vendor/leads' },
  { label: 'Inquiries', href: '/vendor/inquiries' },
];

export default function VendorLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar
        navItems={vendorNav}
        userName="Rajiv Malhotra"
        userInitial="R"
      />
      {children}
    </>
  );
}