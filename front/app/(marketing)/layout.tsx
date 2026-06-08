/* Marketing route group layout.
   Wraps all pages in (marketing)/ — add shared marketing UI
   (announcement banners, persistent nav wrappers, etc.) here.
   Currently a transparent passthrough. */

export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
