import Hero from '@/components/Hero'
import Card from '@/components/Card'
import { BookOpen, FileText, Newspaper, Award, Users, TrendingUp, Church, Rocket, GraduationCap, Heart, CheckCircle2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export const dynamic = 'force-dynamic'

export default function Home() {
  const features = [
    {
      icon: BookOpen,
      title: 'Materials & Resources',
      description: 'Access comprehensive course materials, lecture notes, and astrophysics research data.',
      href: '/student/assignments',
    },
    {
      icon: FileText,
      title: 'Assignments',
      description: 'Submit your coursework, track grading progress, and receive detailed feedback.',
      href: '/dashboard',
    },
    {
      icon: Newspaper,
      title: 'Academic Blog',
      description: 'Insightful articles on physics, space science, and Christian leadership.',
      href: '/blog',
    },
    {
      icon: Award,
      title: 'Digital Library',
      description: 'Premium eBooks and research papers across science and theology.',
      href: '/ebooks',
    },
    {
      icon: TrendingUp,
      title: 'Study Hub',
      description: 'Daily resources and gamified learning to keep you on track.',
      href: '/study-hub',
    },
    {
      icon: Church,
      title: 'Ministry Service',
      description: 'Leadership development and biblical teaching for the campus community.',
      href: '/about',
    },
  ]

  const stats = [
    { label: 'Ministry Journey', value: 'Since 1992', icon: Church },
    { label: 'Full-time Service', value: 'Since 2015', icon: Heart },
    { label: 'Academic Impact', value: 'Astronomy & Physics', icon: Rocket },
    { label: 'Family Life', value: '4 Children', icon: Users },
  ]

  return (
    <div className="bg-white dark:bg-background-dark">
      <Hero />
      
      {/* Bio Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-slide-up">
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl transform lg:-rotate-2 hover:rotate-0 transition-transform duration-500">
                <Image 
                  src="/6035008313579212003.jpg" 
                  alt="Dr. Esaenwi Sudum" 
                  width={600} 
                  height={800}
                  className="w-full h-auto object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 z-20 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-xs animate-bounce-subtle">
                <p className="text-primary-light dark:text-primary-dark font-bold text-lg mb-1">Dr. Esaenwi Sudum</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Astrophysicist, Educator & Minister</p>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-light/5 dark:bg-primary-dark/5 rounded-full blur-3xl -z-10" />
            </div>
            
            <div className="space-y-8 animate-slide-up">
              <div>
                <h2 className="text-sm font-bold tracking-widest text-primary-light dark:text-primary-dark uppercase mb-4">The Journey</h2>
                <h3 className="text-4xl md:text-5xl font-extrabold text-text-light dark:text-text-dark mb-6 leading-tight">
                  A Life Dedicated to <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light">Science & Faith</span>
                </h3>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  Dr. Esaenwi Sudum represents a rare integration of science, education, and faith-based service. His Christian journey began in 1992, and he entered full-time ministry service in 2015.
                </p>
                <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                  He is affiliated with Deeper Life Campus Fellowship, where he functions in teaching, pastoral support, and leadership development. His ministry emphasizes biblical teaching, holiness, prayer, and social impact.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                {stats.map((stat, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10">
                    <stat.icon className="w-6 h-6 text-primary-light dark:text-primary-dark mb-2" />
                    <p className="text-2xl font-bold text-text-light dark:text-text-dark">{stat.value}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Identity */}
      <section className="py-24 bg-gray-50 dark:bg-white/5">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-extrabold text-text-light dark:text-text-dark mb-6">Professional Identity & Impact</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Dr. Sudum's work contributes significantly to the growth of academia and spiritual development in Nigeria.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-background-dark p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-white/5">
              <div className="w-14 h-14 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Rocket className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Space Science Research</h4>
              <p className="text-gray-600 dark:text-gray-400">The advancement of astrophysics and space science research in Nigeria, pushing the boundaries of local discovery.</p>
            </div>

            <div className="bg-white dark:bg-background-dark p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-white/5">
              <div className="w-14 h-14 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center mb-6">
                <GraduationCap className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Scientific Training</h4>
              <p className="text-gray-600 dark:text-gray-400">Dedicated training of students and young scientists in physics and astronomy, fostering the next generation of scholars.</p>
            </div>

            <div className="bg-white dark:bg-background-dark p-8 rounded-3xl shadow-lg hover:shadow-xl transition-shadow border border-gray-100 dark:border-white/5">
              <div className="w-14 h-14 bg-purple-100 dark:bg-purple-900/30 rounded-2xl flex items-center justify-center mb-6">
                <Heart className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
              <h4 className="text-xl font-bold mb-4 text-text-light dark:text-text-dark">Humanitarian Outreach</h4>
              <p className="text-gray-600 dark:text-gray-400">Strengthening Christian missions and humanitarian outreach through structured leadership and administration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Bio Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative animate-slide-up group">
              <div className="relative z-10 rounded-[3rem] overflow-hidden shadow-2xl transform lg:-rotate-2 group-hover:rotate-0 transition-all duration-700">
                <Image 
                  src="/6035008313579212003.jpg" 
                  alt="Dr. Esaenwi Sudum" 
                  width={600} 
                  height={800}
                  className="w-full h-auto object-cover scale-105 group-hover:scale-100 transition-transform duration-1000"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 z-20 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-8 rounded-3xl shadow-2xl max-w-xs animate-bounce-subtle border border-gray-100 dark:border-white/5">
                <p className="text-primary-light dark:text-primary-dark font-black text-xl mb-1 tracking-tighter">Dr. Esaenwi Sudum</p>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">Astrophysicist & Minister</p>
              </div>
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary-light/5 dark:bg-primary-dark/5 rounded-full blur-3xl -z-10" />
            </div>
            
            <div className="space-y-8 animate-slide-up">
              <div>
                <h2 className="text-xs font-black tracking-[0.3em] text-primary-light dark:text-primary-dark uppercase mb-4">The Journey</h2>
                <h3 className="text-4xl md:text-6xl font-black text-text-light dark:text-text-dark mb-8 leading-[0.9] tracking-tighter">
                  INTEGRATING <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light">SCIENCE & FAITH</span>
                </h3>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium mb-6">
                  Dr. Esaenwi Sudum represents a rare integration of science, education, and faith-based service. His Christian journey began in 1992, and he entered full-time ministry service in 2015.
                </p>
                <p className="text-lg text-gray-500 dark:text-gray-400 leading-relaxed font-medium">
                  Affiliated with Deeper Life Campus Fellowship, his ministry emphasizes biblical teaching, holiness, and social impact, balanced with a distinguished academic career in astronomy.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {stats.map((stat, i) => (
                  <div key={i} className="p-6 rounded-3xl bg-gray-50 dark:bg-white/[0.02] border border-gray-100 dark:border-white/5 hover:border-primary-light/20 transition-colors">
                    <stat.icon className="w-5 h-5 text-primary-light dark:text-primary-dark mb-4" />
                    <p className="text-xl font-black text-text-light dark:text-text-dark tracking-tight">{stat.value}</p>
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Impact / Features */}
      <section className="py-24 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-xs font-black tracking-[0.3em] text-primary-light dark:text-primary-dark uppercase mb-4">Excellence & Values</h2>
             <h3 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tighter">PROFESSIONAL IMPACT</h3>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="group bg-white dark:bg-subtle-dark p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 hover:-translate-y-2">
              <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Rocket className="w-8 h-8 text-blue-500" />
              </div>
              <h4 className="text-xl font-black mb-4 text-text-light dark:text-text-dark group-hover:text-primary-light transition-colors">Space Science</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Advancing astrophysics and space research in Nigeria, pushing the boundaries of local and global discovery.</p>
            </div>

            <div className="group bg-white dark:bg-subtle-dark p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 hover:-translate-y-2">
              <div className="w-16 h-16 bg-green-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <GraduationCap className="w-8 h-8 text-green-500" />
              </div>
              <h4 className="text-xl font-black mb-4 text-text-light dark:text-text-dark group-hover:text-primary-light transition-colors">Scientific Training</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Dedicated mentorship of students and young scientists in physics, fostering the next generation of scholars.</p>
            </div>

            <div className="group bg-white dark:bg-subtle-dark p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 hover:-translate-y-2">
              <div className="w-16 h-16 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
                <Heart className="w-8 h-8 text-purple-500" />
              </div>
              <h4 className="text-xl font-black mb-4 text-text-light dark:text-text-dark group-hover:text-primary-light transition-colors">Humanitarian Work</h4>
              <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed font-medium">Strengthening Christian missions and outreach through structured leadership and compassionate administration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Features Section */}
      <section className="py-24 bg-white dark:bg-background-dark">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-xs font-black tracking-[0.3em] text-primary-light dark:text-primary-dark uppercase mb-4">Ecosystem</h2>
             <h3 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tighter">STUDY ZONE FEATURES</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Link key={index} href={feature.href} className="group">
                <div className="h-full bg-gray-50/50 dark:bg-white/[0.02] p-10 rounded-[2.5rem] shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-white/5 group-hover:-translate-y-2">
                  <div className="w-16 h-16 bg-primary-light/5 dark:bg-primary-dark/5 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary-light group-hover:text-white transition-all duration-300">
                    <feature.icon className="w-7 h-7 text-primary-light dark:text-primary-dark group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="text-xl font-black mb-4 text-text-light dark:text-text-dark group-hover:text-primary-light transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 font-medium leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-24 bg-gray-50/50 dark:bg-white/[0.02]">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-sm font-bold tracking-[0.3em] text-primary-light dark:text-primary-dark uppercase mb-4">Latest Insights</h2>
              <h3 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tighter leading-none">
                ACADEMIC & SPIRITUAL <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-light to-accent-light">CHRONICLES</span>
              </h3>
            </div>
            <Link href="/blog" className="group flex items-center gap-3 text-sm font-black uppercase tracking-widest text-gray-400 hover:text-primary-light transition-colors">
              View All Articles <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "The Physics of the Universe",
                excerpt: "Exploring the fundamental laws that govern the cosmos from an astrophysical perspective.",
                date: "Jan 24, 2026",
                category: "Science",
                image: "/6035008313579212004.jpg" 
              },
              {
                title: "Leadership in Modern Missions",
                excerpt: "How to apply biblical principles to lead effective campus ministry in a digital age.",
                date: "Jan 15, 2026",
                category: "Ministry",
                image: "/6035008313579212003.jpg"
              },
              {
                title: "Balancing Faith and Research",
                excerpt: "A personal reflection on maintaining spiritual depth while pursuing rigorous academic studies.",
                date: "Jan 02, 2026",
                category: "Academic",
                image: "/6035008313579212004.jpg"
              }
            ].map((post, i) => (
              <Link key={i} href="/blog" className="group flex flex-col h-full bg-white dark:bg-subtle-dark border border-gray-100 dark:border-white/5 rounded-3xl overflow-hidden hover:shadow-2xl hover:shadow-primary-light/5 transition-all duration-500 hover:-translate-y-2">
                <div className="relative h-64 overflow-hidden">
                   <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-white/90 dark:bg-black/80 backdrop-blur-md rounded-full text-[10px] font-black uppercase tracking-widest text-primary-light">
                      {post.category}
                   </div>
                   <Image 
                     src={post.image} 
                     alt={post.title} 
                     fill 
                     className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700"
                   />
                </div>
                <div className="p-8 flex flex-col flex-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">{post.date}</p>
                  <h4 className="text-xl font-black text-text-light dark:text-text-dark mb-4 group-hover:text-primary-light transition-colors leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex-1">
                    {post.excerpt}
                  </p>
                  <div className="pt-6 border-t border-gray-100 dark:border-white/5 flex items-center justify-between text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-primary-light transition-colors">
                     Read Post <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-background-dark overflow-hidden">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-20">
             <h2 className="text-xs font-black tracking-[0.3em] text-primary-light dark:text-primary-dark uppercase mb-4">Common Enquiries</h2>
             <h3 className="text-4xl md:text-5xl font-black text-text-light dark:text-text-dark tracking-tighter">FREQUENTLY ASKED</h3>
          </div>

          <div className="max-w-4xl mx-auto grid gap-4">
            {[
              {
                q: "What is the Sudum Study Zone?",
                a: "A digital academic and ministry environment created by Dr. Esaenwi Sudum to facilitate learning in physics, astrophysics, and leadership development."
              },
              {
                q: "How can I access study materials?",
                a: "Once you create a free account, you can access assignments, lecture notes, and research data through your student dashboard."
              },
              {
                q: "Is the platform mobile-friendly?",
                a: "Yes, the entire portal is redesigned with a mobile-first approach for seamless learning on any device."
              },
              {
                q: "Can I join the ministry activities remotely?",
                a: "Absolutely. We provide blog updates and resources for our remote campus community to stay connected with Dr. Sudum's teachings."
              }
            ].map((faq, i) => (
              <div key={i} className="group bg-gray-50 dark:bg-white/[0.02] rounded-3xl border border-gray-100 dark:border-white/5 p-6 md:p-8 hover:border-primary-light/20 transition-all duration-300">
                <div className="flex justify-between items-start gap-4 cursor-pointer">
                  <h4 className="text-lg font-bold text-text-light dark:text-text-dark group-hover:text-primary-light transition-colors">{faq.q}</h4>
                  <div className="w-8 h-8 rounded-full bg-white dark:bg-subtle-dark flex items-center justify-center text-gray-400 group-hover:bg-primary-light group-hover:text-white transition-all transform group-hover:rotate-180">
                     <ArrowRight className="w-4 h-4 rotate-90" />
                  </div>
                </div>
                <div className="mt-4 overflow-hidden h-0 group-hover:h-auto transition-all duration-500">
                  <p className="text-gray-500 dark:text-gray-400 leading-relaxed text-sm pt-4 border-t border-gray-50 dark:border-white/5 font-medium">
                    {faq.a}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-primary-light dark:bg-primary-dark" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary-light to-accent-light dark:from-primary-dark dark:to-accent-dark opacity-90" />
        
        <div className="container-custom relative z-10 text-center text-white">
          <div className="max-w-3xl mx-auto space-y-12">
            <h2 className="text-5xl md:text-7xl font-black tracking-tighter leading-none">
              READY TO <br />
              <span className="opacity-50">TRANSCEND?</span>
            </h2>
            <p className="text-xl opacity-80 font-medium leading-relaxed max-w-2xl mx-auto">
              Join the Sudum Study Zone today and gain access to a world-class 
              combination of scientific research and faith-based mentorship.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
              <Link href="/auth/signup" className="px-12 py-5 bg-white text-primary-light rounded-2xl font-black uppercase tracking-widest text-[10px] hover:scale-105 transition-all shadow-2xl">
                Create Free Account
              </Link>
              <Link href="/contact" className="px-12 py-5 bg-transparent border-2 border-white/30 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-white/10 transition-all">
                Reach Support
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
