'use client'

import { useState, useEffect } from 'react'
import { X, Share2, Smartphone, Download } from 'lucide-react'

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
    <div className="fixed bottom-4 left-4 right-4 z-[99] sm:bottom-6 sm:left-6 sm:right-6">
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-4 sm:p-5 shadow-xl flex items-center gap-4 relative">
        <button
          onClick={() => setShow(false)}
          className="absolute -top-2 -right-2 rounded-full bg-gray-100 dark:bg-gray-800 p-1.5 text-gray-500 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
        
        <div className="w-12 h-12 bg-green-500 dark:bg-green-600 rounded-xl flex items-center justify-center text-white shrink-0">
           <Smartphone className="w-6 h-6" />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-black uppercase tracking-widest text-green-600 dark:text-green-400 mb-0.5">Install App</p>
          <h4 className="text-sm font-bold text-gray-900 dark:text-white leading-tight truncate">
            {isIos
              ? 'Tap Share, then "Add to Home Screen"'
              : 'Install Sudum Study Zone'}
          </h4>
        </div>

        {isIos ? (
          <div className="shrink-0 px-4 py-2.5 rounded-xl bg-green-500 dark:bg-green-600 text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
            <Share2 className="w-4 h-4" />
            <span>Add</span>
          </div>
        ) : (
          <button 
            onClick={handleInstall}
            className="shrink-0 px-5 py-2.5 bg-green-500 dark:bg-green-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-green-600 dark:hover:bg-green-500 transition-colors flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Install</span>
          </button>
        )}
      </div>
    </div>
  )
}
