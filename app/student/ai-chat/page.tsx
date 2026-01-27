'use client'

import { Bot, Sparkles, MessageSquare, Zap, Shield, ArrowRight } from 'lucide-react'
import Link from 'next/link'

export default function AIChatComingSoon() {
  return (
    <div className="animate-fade-in min-h-[80vh] flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* Hero Section */}
        <div className="relative bg-premium-gradient rounded-[3rem] p-12 sm:p-20 text-white shadow-3xl overflow-hidden group">
          {/* Ambient Background Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-[100px] -mr-48 -mt-48 transition-transform duration-1000 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-[80px] -ml-32 -mb-32"></div>
          
          <div className="relative z-10 flex flex-col items-center text-center">
            {/* Animated Icon */}
            <div className="relative mb-10">
              <div className="w-24 h-24 bg-white/20 backdrop-blur-xl rounded-3xl flex items-center justify-center border-2 border-white/30 shadow-2xl animate-bounce-subtle">
                <Bot className="w-12 h-12 text-white" />
              </div>
              <div className="absolute -top-3 -right-3 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center animate-pulse shadow-lg">
                <Sparkles className="w-4 h-4 text-black" />
              </div>
            </div>

            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-black/20 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-white/20">
              <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping"></div>
              Neural Link Under Construction
            </div>

            <h1 className="text-4xl sm:text-6xl font-black mb-6 tracking-tighter uppercase leading-none">
              Sudum <span className="text-yellow-300">AI Logic</span>
            </h1>
            
            <p className="text-xl sm:text-2xl font-medium opacity-90 max-w-2xl leading-relaxed mb-10">
              We're training our neural networks to assist you with research, complex algorithms, and academic problem-solving.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-3xl mb-12">
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-[2rem] border border-white/10">
                <Zap className="w-6 h-6 text-yellow-300 mb-3 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Instant Responses</p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-[2rem] border border-white/10">
                <Shield className="w-6 h-6 text-blue-300 mb-3 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Accurate Citations</p>
              </div>
              <div className="p-6 bg-white/10 backdrop-blur-sm rounded-[2rem] border border-white/10">
                <MessageSquare className="w-6 h-6 text-green-300 mb-3 mx-auto" />
                <p className="text-[10px] font-black uppercase tracking-widest opacity-60">24/7 Mentorship</p>
              </div>
            </div>

            <Link 
              href="/student"
              className="px-10 py-5 bg-white text-primary-light hover:bg-yellow-300 hover:text-black font-black uppercase tracking-[0.2em] text-xs rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-2xl hover:scale-105 active:scale-95"
            >
              Return to Command Center
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
