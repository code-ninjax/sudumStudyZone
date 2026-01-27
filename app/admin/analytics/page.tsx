'use client'

import { BarChart3, ShieldCheck, Activity, Zap, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function AdminAnalyticsComingSoon() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 text-center animate-fade-in">
      <div className="relative mb-12 group">
        <div className="absolute inset-0 bg-primary-light/20 blur-[100px] rounded-full group-hover:bg-primary-light/40 transition-all duration-1000"></div>
        <div className="relative w-32 h-32 bg-white dark:bg-subtle-dark rounded-[2.5rem] flex items-center justify-center shadow-3xl border border-gray-100 dark:border-white/5 transform group-hover:rotate-6 transition-transform duration-500">
           <BarChart3 className="w-14 h-14 text-primary-light animate-pulse" />
        </div>
        <div className="absolute -top-4 -right-4 w-12 h-12 bg-yellow-400 rounded-2xl flex items-center justify-center text-black shadow-xl border-4 border-white dark:border-subtle-dark">
           <Zap className="w-5 h-5 fill-current" />
        </div>
      </div>

      <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light/10 text-primary-light rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-6 border border-primary-light/20">
        <ShieldCheck className="w-4 h-4" />
        Intelligence Matrix Alpha
      </div>

      <h1 className="text-4xl md:text-6xl font-black text-text-light dark:text-text-dark mb-6 tracking-tighter uppercase leading-none max-w-2xl">
        Predictive <span className="text-premium-gradient bg-clip-text text-transparent">Analytics</span> is coming
      </h1>

      <p className="text-gray-500 dark:text-gray-400 text-lg md:text-xl font-medium max-w-xl mx-auto leading-relaxed mb-12">
        We're building a neural command center to track student growth, resource alpha, and academic performance with military precision.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-12 w-full max-w-2xl">
        {[
          { label: 'Growth Tracing', icon: Activity },
          { label: 'Resource ROI', icon: Zap },
          { label: 'Neural Insights', icon: ShieldCheck }
        ].map((feat, i) => (
          <div key={i} className="p-6 bg-white dark:bg-subtle-dark rounded-3xl border border-gray-100 dark:border-white/5 shadow-sm flex flex-col items-center gap-3">
            <feat.icon className="w-6 h-6 text-primary-light/40" />
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">{feat.label}</span>
          </div>
        ))}
      </div>

      <Link 
        href="/admin"
        className="px-10 py-5 bg-premium-gradient text-white rounded-[2rem] font-black uppercase tracking-[0.3em] text-[10px] shadow-3xl hover:scale-105 active:scale-95 transition-all flex items-center gap-3"
      >
        <ArrowLeft className="w-4 h-4" />
        Return to Command Center
      </Link>
    </div>
  )
}
