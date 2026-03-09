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
        <div className="relative flex min-h-dvh bg-subtle-light dark:bg-background-dark lg:h-dvh overflow-hidden">
          <StudentSidebar />
          <main className="min-w-0 flex-1 overflow-x-hidden overflow-y-auto no-scrollbar transition-all duration-500 lg:ml-80">
            <div className="p-4 pb-32 sm:p-5 lg:p-8 lg:pb-8">
              {children}
            </div>
          </main>
          <StudentBottomNav />
        </div>
      </ProtectedRoute>
    </MaintenanceGuard>
  )
}
