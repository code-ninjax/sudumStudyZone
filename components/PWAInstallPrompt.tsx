'use client'

import { useState, useEffect } from 'react'
import { Download, Share2, Smartphone } from 'lucide-react'

export default function PWAInstallPrompt() {
  const [show, setShow] = useState(false)
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [isIos, setIsIos] = useState(false)

  useEffect(() => {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)
    if (!isMobile) return

    const iosDevice = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const standalone = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone

    setIsIos(iosDevice)
    if (standalone) return

    const handler = (e: any) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShow(true)
    }

    window.addEventListener('beforeinstallprompt', handler)
    if (iosDevice) {
      setShow(true)
    }
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShow(false)
    }
    setDeferredPrompt(null)
  }

  if (!show) return null

  return (
    <div className="fixed bottom-24 left-4 right-4 z-[99] animate-slide-up">
      <div className="bg-white dark:bg-subtle-dark border border-gray-100 dark:border-white/10 rounded-[2rem] p-6 shadow-3xl flex items-center gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary-light/5 rounded-full blur-2xl -mr-16 -mt-16"></div>
        
        <div className="w-14 h-14 bg-premium-gradient rounded-2xl flex items-center justify-center text-white shrink-0 shadow-lg shadow-primary-light/20">
           <Smartphone className="w-7 h-7" />
        </div>

        <div className="flex-1">
          <p className="text-xs font-black text-primary-light uppercase tracking-widest mb-1">Install App</p>
          <h4 className="text-sm font-black text-text-light dark:text-text-dark tracking-tight leading-tight">
            {isIos
              ? 'Use Share > Add to Home Screen to install Sudum Study Zone.'
              : 'Install Sudum Study Zone for a better experience.'}
          </h4>
        </div>

        <div className="flex flex-col gap-2">
           {isIos ? (
             <div className="px-4 py-3 rounded-xl bg-gray-100 dark:bg-white/5 text-[10px] font-black uppercase tracking-widest text-gray-500 dark:text-gray-300 text-center inline-flex items-center gap-2">
               <Share2 className="w-4 h-4" />
               Add To Home
             </div>
           ) : (
             <button 
               onClick={handleInstall}
               className="px-6 py-3 bg-primary-light text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg"
             >
               Install
             </button>
           )}
           <button 
             onClick={() => setShow(false)}
             className="text-[8px] font-black uppercase tracking-widest text-gray-400 text-center"
           >
             Dismiss
           </button>
        </div>
      </div>
    </div>
  )
}
