import { Users, Target, Rocket, Heart, GraduationCap, ArrowRight, ShieldCheck, Mail } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function AboutPage() {
  const contributions = [
    {
      icon: Rocket,
      title: 'Space Research',
      description: 'The advancement of astrophysics and space science research in Nigeria, pushing the boundaries of discovery.',
      color: 'blue'
    },
    {
      icon: GraduationCap,
      title: 'Academic Training',
      description: 'Dedicated training of students and young scientists in physics and astronomy for global impact.',
      color: 'green'
    },
    {
      icon: Heart,
      title: 'Humanitarian Work',
      description: 'Strengthening Christian missions and humanitarian outreach through structured leadership.',
      color: 'purple'
    },
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-background-dark pt-20">
      {/* Hero Header */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
             <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-light/10 text-primary-light dark:bg-primary-dark/10 dark:text-primary-dark border border-primary-light/20">
                <span className="text-[10px] font-black uppercase tracking-[0.3em]">The Visionary</span>
             </div>
             <h1 className="text-5xl md:text-8xl font-black text-text-light dark:text-text-dark tracking-tighter leading-[0.85]">
                BEYOND THE <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light">HORIZON</span>
             </h1>
             <p className="text-xl text-gray-500 dark:text-gray-400 font-medium max-w-2xl mx-auto leading-relaxed">
                Bridging the frontier of scientific pursuit and spiritual depth. A journey of excellence since 1992.
             </p>
          </div>
        </div>
        
        {/* Background Accents */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary-light/[0.03] rounded-full blur-[120px] -z-10" />
      </section>

      {/* Founder Profile Section */}
      <section className="py-24 border-y border-gray-100 dark:border-white/5">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div className="relative group">
              <div className="relative z-10 rounded-[4rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.1)] transform lg:-rotate-1 group-hover:rotate-0 transition-all duration-700">
                <Image 
                  src="/6035008313579212004.jpg" 
                  alt="Dr. Esaenwi Sudum" 
                  width={600} 
                  height={800}
                  className="w-full h-auto object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary-light text-white rounded-3xl flex items-center justify-center font-black text-4xl shadow-2xl animate-float">
                S
              </div>
            </div>

            <div className="space-y-10">
              <div className="space-y-4">
                <h2 className="text-xs font-black text-primary-light dark:text-primary-dark uppercase tracking-[0.4em]">Biography</h2>
                <h3 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tighter">DR. ESAENWI SUDUM</h3>
                <p className="text-sm font-black text-gray-400 uppercase tracking-widest border-l-4 border-primary-light pl-4 py-1">
                  Astrophysicist | Educator | Minister
                </p>
              </div>

              <div className="prose prose-lg dark:prose-invert max-w-none text-gray-500 dark:text-gray-400 font-medium leading-relaxed space-y-6">
                <p>
                  Dr. Esaenwi Sudum represents a rare integration of science, education, and faith-based service. His Christian journey began in 1992, and he entered full-time ministry service in 2015.
                </p>
                <p>
                  With a Ph.D. in Astrophysics, he has dedicated his life to uncovering the mysteries of the cosmos while simultaneously nurturing the spiritual growth of campus communities through his work with Deeper Life Campus Fellowship.
                </p>
                <p>
                  Married to Nurse Holiness Agezichukwuihe Sudum and blessed with four children, Dr. Sudum maintains a holistic approach to life, balancing rigorous scientific research with compassionate pastoral support.
                </p>
              </div>

              <div className="flex flex-wrap gap-4">
                 {[
                   { label: 'Active Since', value: '1992' },
                   { label: 'Specialization', value: 'Astrophysics' },
                   { label: 'Impact', value: '5K+ Guided' }
                 ].map((stat, i) => (
                   <div key={i} className="px-6 py-3 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/5">
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">{stat.label}</p>
                      <p className="text-sm font-black text-text-light dark:text-text-dark">{stat.value}</p>
                   </div>
                 ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contributions Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-xs font-black tracking-[0.3em] text-primary-light dark:text-primary-dark uppercase mb-4">Legacy & Mission</h2>
             <h3 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tighter leading-none">PROFESSIONAL IDENTITY <br /> & IMPACT</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {contributions.map((item, i) => (
              <div key={i} className="group bg-white dark:bg-subtle-dark p-12 rounded-[3rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 hover:-translate-y-2">
                 <div className="w-16 h-16 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center mb-8 group-hover:bg-primary-light transition-all duration-300">
                    <item.icon className="w-8 h-8 text-primary-light group-hover:text-white transition-colors" />
                 </div>
                 <h4 className="text-xl font-black mb-4 text-text-light dark:text-text-dark uppercase tracking-tight">{item.title}</h4>
                 <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Connect Section */}
      <section className="py-24 relative overflow-hidden group">
         <div className="container-custom">
            <div className="bg-text-light dark:bg-white rounded-[4rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
               <div className="absolute inset-0 bg-primary-light opacity-0 group-hover:opacity-10 transition-opacity" />
               <div className="max-w-3xl mx-auto space-y-8 relative z-10">
                  <h3 className="text-4xl md:text-6xl font-black text-white dark:text-text-light tracking-tighter leading-none">WANT TO <br /> COLLABORATE?</h3>
                  <p className="text-white/60 dark:text-text-light/60 font-medium text-lg">Dr. Sudum is open to academic partnerships, mentorship roles, and speaking engagements related to Astrophysics and Leadership.</p>
                  <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
                     <Link href="mailto:support@sudumstudyzone.com" className="px-10 py-5 bg-white dark:bg-text-light text-text-light dark:text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-3">
                        <Mail className="w-4 h-4" /> Send Direct Message
                     </Link>
                     <Link href="/contact" className="px-10 py-5 bg-transparent border-2 border-white/20 dark:border-text-light/20 text-white dark:text-text-light rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-colors">
                        Formal Inquiry
                     </Link>
                  </div>
               </div>
            </div>
         </div>
      </section>
    </div>
  )
}
