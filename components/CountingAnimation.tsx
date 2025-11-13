'use client'

import { useEffect, useRef, useState } from 'react'

interface CountingAnimationProps {
  end: number
  duration?: number
  suffix?: string
  prefix?: string
  className?: string
}

export default function CountingAnimation({ 
  end, 
  duration = 2000, 
  suffix = '', 
  prefix = '',
  className = '' 
}: CountingAnimationProps) {
  const [count, setCount] = useState(0)
  const countRef = useRef(0)
  const [isVisible, setIsVisible] = useState(false)
  const elementRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (elementRef.current) {
      observer.observe(elementRef.current)
    }

    return () => observer.disconnect()
  }, [isVisible])

  useEffect(() => {
    if (!isVisible) return

    const increment = end / (duration / 16)
    const timer = setInterval(() => {
      countRef.current += increment
      if (countRef.current >= end) {
        setCount(end)
        clearInterval(timer)
      } else {
        setCount(Math.floor(countRef.current))
      }
    }, 16)

    return () => clearInterval(timer)
  }, [end, duration, isVisible])

  return (
    <span ref={elementRef} className={className}>
      {prefix}{count.toLocaleString()}{suffix}
    </span>
  )
}
