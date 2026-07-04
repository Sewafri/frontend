export function Sidebar() {
  return (
    <aside className="w-64 border-r bg-muted/30 p-4">
      <nav className="space-y-1">
        <a href="#" className="block rounded px-3 py-2 hover:bg-muted">Dashboard</a>
        <a href="#" className="block rounded px-3 py-2 hover:bg-muted">Courses</a>
        <a href="#" className="block rounded px-3 py-2 hover:bg-muted">Settings</a>
      </nav>
    </aside>
  )
}
