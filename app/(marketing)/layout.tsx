export default function MarketingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <nav className="mx-auto max-w-7xl px-4 py-4">
          <h1 className="text-xl font-bold">Edify LMS</h1>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  )
}
