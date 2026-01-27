import { ButtonHTMLAttributes, ReactNode } from 'react'
import Spinner from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  children: ReactNode
  loading?: boolean
}

export default function Button({ 
  variant = 'primary', 
  children, 
  className = '',
  loading = false,
  ...props 
}: ButtonProps) {
  const baseStyles = 'px-6 py-3 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 flex items-center justify-center gap-2'
  
  const variants = {
    primary: 'bg-primary-light dark:bg-primary-dark text-white hover:opacity-90 shadow-md hover:shadow-lg focus:ring-primary-light dark:focus:ring-primary-dark disabled:opacity-70 disabled:cursor-not-allowed',
    secondary: 'bg-accent-light dark:bg-accent-dark text-white hover:opacity-90 focus:ring-accent-light dark:focus:ring-accent-dark disabled:opacity-70 disabled:cursor-not-allowed',
    outline: 'border-2 border-primary-light dark:border-primary-dark text-primary-light dark:text-primary-dark hover:bg-primary-light hover:text-white dark:hover:bg-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark disabled:opacity-70 disabled:cursor-not-allowed',
  }

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Spinner size="sm" />}
      {children}
    </button>
  )
}
