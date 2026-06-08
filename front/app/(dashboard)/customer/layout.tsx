// app/(dashboard)/customer/layout.tsx
import TopBar from '../_components/TopBar';

const customerNav = [
  { label: 'Dashboard', href: '/customer' },
  { label: 'Vendors',   href: '/customer/vendors' },
  { label: 'Payments',  href: '/customer/payments' },
  { label: 'Feedback',  href: '/customer/feedback' },
];

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <TopBar navItems={customerNav} userName="Kavya Reddy" userInitial="K" />
      {children}
    </>
  );
}