export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen">
      <aside className="w-64 border-r bg-muted/30 p-4">
        <nav className="space-y-2">
          <a href="/(dashboard)/courses" className="block rounded px-3 py-2 hover:bg-muted">Courses</a>
          <a href="/(dashboard)/students" className="block rounded px-3 py-2 hover:bg-muted">Students</a>
          <a href="/(dashboard)/instructors" className="block rounded px-3 py-2 hover:bg-muted">Instructors</a>
          <a href="/(dashboard)/analytics" className="block rounded px-3 py-2 hover:bg-muted">Analytics</a>
          <a href="/(dashboard)/calendar" className="block rounded px-3 py-2 hover:bg-muted">Calendar</a>
          <a href="/(dashboard)/certificates" className="block rounded px-3 py-2 hover:bg-muted">Certificates</a>
          <a href="/(dashboard)/settings" className="block rounded px-3 py-2 hover:bg-muted">Settings</a>
        </nav>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  )
}
