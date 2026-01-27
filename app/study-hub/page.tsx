'use client'

import { BookOpen, FileText, Newspaper, Award, Users, TrendingUp, Church, Rocket, GraduationCap, Heart, CheckCircle2, ArrowRight, Zap, Target, Star, BarChart3 } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function StudyHubPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-background-dark animate-fade-in">
      {/* Premium Hero Section */}
      <section className="relative pt-32 pb-24 overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-light/5 dark:bg-primary-dark/5 rounded-full blur-[120px] -mr-64 -mt-64"></div>
        <div className="container-custom relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-light/10 text-primary-light rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-primary-light/20">
              <Zap className="w-4 h-4 fill-current" />
              Intelligence Hub & Archive
            </div>
            <h1 className="text-6xl md:text-8xl font-black text-text-light dark:text-text-dark mb-8 tracking-tighter uppercase leading-[0.85]">
              STUDY <span className="text-gradient italic">HUB</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
              Your daily destination for high-end study resources, digital assets, and academic research chronicles.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link href="/auth/signup" className="px-12 py-6 bg-premium-gradient text-white rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-3xl hover:scale-105 active:scale-95 transition-all">
                Get Started for Free
              </Link>
              <Link href="/auth/login" className="px-12 py-6 bg-white dark:bg-subtle-dark border border-gray-100 dark:border-white/5 text-text-light dark:text-text-dark rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-xl hover:bg-gray-50 transition-all">
                Access Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Matrix */}
      <section className="py-24 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { 
                icon: Target, 
                title: 'Daily Streak System', 
                desc: 'Build your academic momentum. Visit daily to earn points and unlock premium resources.',
                stats: '7 Day Streak'
              },
              { 
                icon: BookOpen, 
                title: 'Digital Archive', 
                desc: 'Access 150+ curated volumes, technical guides, and research papers in our Scholar\'s Vault.',
                stats: '150+ Resources'
              },
              { 
                icon: BarChart3, 
                title: 'Intelligence Matrix', 
                desc: 'Track your learning trajectory with advanced progress reporting and cognitive load analysis.',
                stats: 'Real-time Stats'
              }
            ].map((feat, i) => (
              <div key={i} className="bg-white dark:bg-subtle-dark p-12 rounded-[3rem] border border-gray-100 dark:border-white/5 shadow-sm hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 group">
                 <div className="w-16 h-16 bg-primary-light/10 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-light group-hover:text-white transition-all">
                    <feat.icon className="w-8 h-8" />
                 </div>
                 <h3 className="text-2xl font-black mb-4 text-text-light dark:text-text-dark tracking-tight">{feat.title}</h3>
                 <p className="text-gray-500 dark:text-gray-400 font-medium leading-relaxed mb-8">{feat.desc}</p>
                 <div className="pt-8 border-t border-gray-50 dark:border-white/5 flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary-light">{feat.stats}</span>
                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-primary-light group-hover:translate-x-1 transition-all" />
                 </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Value Proposition */}
      <section className="py-24 overflow-hidden relative">
        <div className="container-custom">
           <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                 <h2 className="text-4xl md:text-6xl font-black text-text-light dark:text-text-dark tracking-tighter leading-none uppercase">
                    EVOLVE YOUR <br />
                    <span className="text-premium-gradient bg-clip-text text-transparent italic">LEARNING FLOW</span>
                 </h2>
                 <p className="text-lg text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    Sudum Study Hub isn't just a resource repository. It's an intelligent ecosystem designed to synchronize with your academic cycle.
                 </p>
                 <ul className="space-y-4">
                    {[
                      'Real-time Assignment Tracking',
                      'Curated Peer-Reviewed eBooks',
                      'Direct Ministry Mentorship Access',
                      'Gamified Reward Point System'
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-4 text-sm font-black uppercase tracking-widest text-text-light dark:text-text-dark">
                         <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white">
                            <CheckCircle2 className="w-4 h-4" />
                         </div>
                         {item}
                      </li>
                    ))}
                 </ul>
              </div>
              <div className="flex-1 relative">
                 <div className="relative z-10 bg-white dark:bg-subtle-dark p-12 rounded-[4rem] shadow-3xl border border-gray-100 dark:border-white/5 rotate-3 hover:rotate-0 transition-transform duration-700">
                    <div className="flex items-center justify-between mb-12">
                       <div className="space-y-1">
                          <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Global Progress</p>
                          <h4 className="text-3xl font-black text-text-light dark:text-text-dark uppercase">Scholar Profile</h4>
                       </div>
                       <div className="w-16 h-16 bg-premium-gradient rounded-3xl flex items-center justify-center text-white shadow-xl">
                          <Users className="w-8 h-8" />
                       </div>
                    </div>
                    <div className="space-y-10">
                       <div className="space-y-4">
                          <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-gray-400">
                             <span>Skill Level</span>
                             <span>75%</span>
                          </div>
                          <div className="w-full h-3 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                             <div className="w-3/4 h-full bg-premium-gradient rounded-full"></div>
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6">
                          <div className="p-6 bg-gray-50 dark:bg-white/[0.04] rounded-3xl text-center">
                             <p className="text-2xl font-black text-text-light dark:text-text-dark">1,250</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Total Points</p>
                          </div>
                          <div className="p-6 bg-gray-50 dark:bg-white/[0.04] rounded-3xl text-center">
                             <p className="text-2xl font-black text-text-light dark:text-text-dark">12</p>
                             <p className="text-[8px] font-black uppercase tracking-widest text-gray-400">Badges</p>
                          </div>
                       </div>
                    </div>
                 </div>
                 <div className="absolute -inset-10 bg-primary-light/5 blur-[100px] -z-10 rounded-full"></div>
              </div>
           </div>
        </div>
      </section>

      {/* CTA Bottom */}
      <section className="py-24 bg-background-dark text-white relative overflow-hidden">
         <div className="absolute inset-x-0 bottom-0 top-1/2 bg-primary-light/10 blur-[150px]"></div>
         <div className="container-custom relative z-10 text-center">
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8 leading-none">
               JOIN THE <br />
               COMMAND CENTRE
            </h2>
            <p className="text-gray-400 font-medium text-lg max-w-xl mx-auto mb-12">
               Synchronize your academic journey with a community dedicated to excellence and spiritual growth.
            </p>
            <Link href="/auth/signup" className="inline-flex px-12 py-6 bg-white text-primary-light rounded-[2rem] font-black uppercase tracking-widest text-[10px] shadow-2xl hover:scale-105 transition-all">
               Initialize Account
            </Link>
         </div>
      </section>
    </div>
  )
}
