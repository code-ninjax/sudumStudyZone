'use client'

import { DollarSign, Rocket } from 'lucide-react'

export default function AdminRevenuePage() {
  return (
    <div className="animate-fade-in min-h-[80vh] flex items-center justify-center">
      <div className="text-center max-w-lg mx-auto px-6">
        {/* Icon */}
        <div className="relative mb-10">
          <div className="w-32 h-32 mx-auto bg-gradient-to-br from-primary-light/10 to-accent-light/10 dark:from-primary-dark/10 dark:to-accent-dark/10 rounded-[2.5rem] flex items-center justify-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-light/5 to-accent-light/5 dark:from-primary-dark/5 dark:to-accent-dark/5 animate-pulse"></div>
            <DollarSign className="w-16 h-16 text-primary-light dark:text-primary-dark relative z-10 group-hover:scale-110 transition-transform duration-500" />
          </div>
          <div className="absolute -top-2 -right-2 w-12 h-12 bg-yellow-400/20 rounded-2xl flex items-center justify-center animate-bounce">
            <Rocket className="w-6 h-6 text-yellow-500" />
          </div>
        </div>

        {/* Text */}
        <h1 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark mb-4 tracking-tight">
          Coming <span className="text-primary-light dark:text-primary-dark">Soon</span>
        </h1>
        <p className="text-gray-500 dark:text-gray-400 text-lg font-medium mb-8 leading-relaxed">
          We're building something amazing. Revenue tracking, payment analytics, and transaction history — all in one place.
        </p>

        {/* Status Badge */}
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-white dark:bg-subtle-dark rounded-full border border-gray-100 dark:border-white/5 shadow-lg">
          <span className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse"></span>
          <span className="text-sm font-bold text-gray-600 dark:text-gray-300 uppercase tracking-widest">In Development</span>
        </div>
      </div>
    </div>
  )
}
