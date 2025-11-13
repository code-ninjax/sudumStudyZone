import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
  onClick?: (e?: any) => void
}

export default function Card({ children, className = '', hover = true, onClick }: CardProps) {
  return (
    <div 
      onClick={onClick}
      className={`bg-white dark:bg-subtle-dark rounded-xl shadow-lg p-6 transition-all duration-300 ${
        hover ? 'hover:shadow-xl hover:-translate-y-1' : ''
      } ${className}`}
    >
      {children}
    </div>
  )
}
