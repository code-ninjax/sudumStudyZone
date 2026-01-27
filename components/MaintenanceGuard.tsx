'use client'

import { useEffect, useState } from 'react'
import { getMaintenanceMode, MaintenanceMode } from '@/packages/supabase/src/settings'
import { Hammer, Rocket, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function MaintenanceGuard({ children }: { children: React.ReactNode }) {
  const [maintenance, setMaintenance] = useState<MaintenanceMode | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function checkMaintenance() {
      try {
        const mode = await getMaintenanceMode()
        setMaintenance(mode)
      } catch (error) {
        console.error("Maintenance check failed:", error)
      } finally {
        setLoading(false)
      }
    }
    checkMaintenance()
  }, [])

  if (loading) return null // Or a loader

  if (maintenance?.enabled) {
    return (
      <div className="fixed inset-0 z-[100] bg-background-light dark:bg-background-dark flex items-center justify-center p-6 text-center animate-fade-in">
        <div className="max-w-2xl">
          <div className="relative mb-12 group inline-block">
            <div className="absolute inset-0 bg-primary-light/20 blur-[100px] rounded-full"></div>
            <div className="relative w-32 h-32 bg-white dark:bg-subtle-dark rounded-[2.5rem] flex items-center justify-center shadow-3xl border border-gray-100 dark:border-white/5">
               <Hammer className="w-14 h-14 text-primary-light animate-bounce" />
            </div>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black text-text-light dark:text-text-dark mb-6 tracking-tighter uppercase leading-none">
            System <span className="text-premium-gradient bg-clip-text text-transparent">Optimization</span>
          </h1>
          
          <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-12">
            {maintenance.message || "We're currently fine-tuning the Study Zone engines for better academic throughput. Please stand by."}
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
             <Link 
               href="/"
               className="px-10 py-5 bg-premium-gradient text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl hover:scale-105 transition-all flex items-center gap-3"
             >
               <Rocket className="w-4 h-4" />
               Return to Base
             </Link>
          </div>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
