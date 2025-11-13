import StudentSidebar from '@/components/StudentSidebar'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex h-screen bg-subtle-light dark:bg-background-dark overflow-hidden">
      <StudentSidebar />
      <main className="flex-1 lg:ml-64 overflow-y-auto">
        <div className="p-4 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  )
}
