import StudentSidebar from '@/components/StudentSidebar'
import StudentBottomNav from '@/components/StudentBottomNav'
import ProtectedRoute from '@/components/ProtectedRoute'
import MaintenanceGuard from '@/components/MaintenanceGuard'

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <MaintenanceGuard>
      <ProtectedRoute>
        <div className="flex h-screen bg-subtle-light dark:bg-background-dark overflow-hidden relative">
          <StudentSidebar />
          <main className="flex-1 lg:ml-80 overflow-y-auto no-scrollbar transition-all duration-500">
            <div className="p-4 lg:p-8 pb-32 lg:pb-8">
              {children}
            </div>
          </main>
          <StudentBottomNav />
        </div>
      </ProtectedRoute>
    </MaintenanceGuard>
  )
}
