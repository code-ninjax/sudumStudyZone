import AdminSidebar from '@/components/AdminSidebar'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-subtle-light dark:bg-background-dark overflow-hidden">
      <AdminSidebar />
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
