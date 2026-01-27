import { ArrowRight, Sparkles, BookOpen, Users } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-white dark:bg-background-dark pt-20">
      {/* Dynamic Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-light/5 dark:bg-primary-dark/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-accent-light/5 dark:bg-accent-dark/5 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
      
      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="space-y-8 animate-fade-in text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark border border-primary-light/20 animate-slide-up">
              <Sparkles className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">Official Academic Portal</span>
            </div>
            
            <div className="space-y-4">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-text-light dark:text-text-dark leading-[0.9] tracking-tighter">
                SUDUM<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark">STUDY ZONE</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-500 dark:text-gray-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed">
                Bridging the frontier of <span className="text-text-light dark:text-text-dark font-bold">Astrophysics</span> and <span className="text-text-light dark:text-text-dark font-bold">Theological Leadership</span>. A dedicated space for holistic academic excellence.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 justify-center lg:justify-start items-center pt-4">
              <Link href="/auth/signup" className="group relative px-10 py-5 bg-text-light dark:bg-white text-white dark:text-text-light rounded-2xl font-black transition-all hover:scale-105 hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] active:scale-95 flex items-center gap-3 overflow-hidden">
                <div className="absolute inset-0 bg-primary-light dark:bg-primary-dark translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                <span className="relative z-10 uppercase tracking-widest text-xs">Start Learning</span>
                <ArrowRight className="relative z-10 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              
              <Link href="/about" className="group flex items-center gap-3 px-8 py-5 text-gray-500 hover:text-text-light dark:hover:text-white transition-colors">
                <span className="text-xs font-black uppercase tracking-widest">The Journey</span>
                <div className="w-10 h-10 rounded-full border border-gray-200 dark:border-white/10 flex items-center justify-center group-hover:border-primary-light dark:group-hover:border-primary-dark transition-colors">
                   <ArrowRight className="w-4 h-4" />
                </div>
              </Link>
            </div>

            {/* Quick Stats/Trust */}
            <div className="flex flex-wrap justify-center lg:justify-start gap-8 pt-12 border-t border-gray-100 dark:border-white/5 max-w-md">
              <div className="flex flex-col">
                <span className="text-2xl font-black text-text-light dark:text-text-dark leading-none">500+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Students Guided</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-primary-light leading-none">15+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Research Papers</span>
              </div>
              <div className="flex flex-col">
                <span className="text-2xl font-black text-accent-light leading-none">30+</span>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Ministry Years</span>
              </div>
            </div>
          </div>

          {/* Visual Element */}
          <div className="relative hidden lg:block animate-fade-in group">
            <div className="relative z-10 rounded-[4rem] overflow-hidden border-[12px] border-white dark:border-gray-800 shadow-[0_40px_80px_rgba(0,0,0,0.15)] transform rotate-3 group-hover:rotate-0 transition-transform duration-700 aspect-[4/5]">
              <Image 
                src="/6035008313579212003.jpg" 
                alt="Dr. Sudum" 
                fill
                className="object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-12 left-12 right-12">
                 <p className="text-white text-3xl font-black leading-none mb-2 tracking-tighter shadow-sm uppercase">DR. ESAENWI SUDUM</p>
                 <p className="text-white/80 text-[10px] font-black uppercase tracking-[0.3em]">Astrophysicist & Minister</p>
              </div>
            </div>
            
            {/* Floating Cards */}
            <div className="absolute -top-12 -right-12 z-20 bg-white dark:bg-subtle-dark p-6 rounded-3xl shadow-2xl animate-float border border-gray-100 dark:border-white/5">
              <div className="w-12 h-12 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-gray-400">Curated Resources</p>
              <p className="text-sm font-bold text-text-light dark:text-text-dark">Ready for Access</p>
            </div>

            <div className="absolute bottom-12 -left-12 z-20 bg-white dark:bg-subtle-dark p-6 rounded-3xl shadow-2xl animate-float-delayed border border-gray-100 dark:border-white/5">
              <div className="flex items-center gap-3">
                 <div className="flex -space-x-3">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-primary-light border-2 border-white dark:border-gray-800 flex items-center justify-center text-[8px] text-white font-bold">
                        {i}
                      </div>
                    ))}
                 </div>
                 <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Active Members</p>
                    <p className="text-sm font-bold text-text-light dark:text-text-dark">Join the Community</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
