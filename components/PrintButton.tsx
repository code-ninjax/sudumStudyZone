'use client'

import { Printer } from 'lucide-react'

export default function PrintButton({
  label = 'Print / Save PDF',
  className = '',
}: {
  label?: string
  className?: string
}) {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className={`no-print inline-flex items-center gap-2 rounded-2xl border border-gray-200 bg-white px-5 py-3 text-[11px] font-black uppercase tracking-[0.2em] text-text-light transition hover:border-primary-light hover:text-primary-light dark:border-white/10 dark:bg-subtle-dark dark:text-text-dark ${className}`}
    >
      <Printer className="h-4 w-4" />
      {label}
    </button>
  )
}
