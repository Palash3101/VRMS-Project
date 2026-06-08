import TopBar from '../_components/TopBar';

// TODO: API — role/permissions come from session; nav items are static config
const adminNav = [
  { label: 'Dashboard', href: '/admin' },
  { label: 'Vendors',   href: '/admin/vendors' },
  { label: 'Customers', href: '/admin/customers' },
  { label: 'Leads',     href: '/admin/leads' },
  { label: 'Orders',    href: '/admin/orders' },
  { label: 'Reports',   href: '/admin/reports' },
  { label: 'Settings',  href: '/admin/settings' },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopBar navItems={adminNav} userName="Admin User" userInitial="A" />
      <main>{children}</main>
    </>
  );
}