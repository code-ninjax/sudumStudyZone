'use client'

import { usePathname } from 'next/navigation'
import Footer from './Footer'

export default function ConditionalFooter() {
  const pathname = usePathname()
  
  // Don't render footer on admin or student routes
  if (pathname && (pathname.startsWith('/admin') || pathname.startsWith('/student'))) {
    return null
  }
  
  return <Footer />
}

