import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from 'react'

type CtaVariant = 'primary' | 'secondary' | 'dark' | 'light' | 'outline' | 'gradient' | 'ghost'
type CtaSize = 'compact' | 'default' | 'large'

type SharedProps = {
  children: ReactNode
  className?: string
  fullWidth?: boolean
  size?: CtaSize
  variant?: CtaVariant
}

const base = 'inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-xl text-center font-semibold uppercase tracking-wider transition-all duration-300 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

const sizes: Record<CtaSize, string> = {
  compact: 'min-h-9 px-3 text-[10px] sm:min-h-10 sm:px-4 sm:text-[11px] 2xl:min-h-11 2xl:px-5 2xl:text-xs',
  default: 'min-h-[42px] px-4 text-xs sm:min-h-11 sm:px-6 2xl:min-h-12 2xl:px-7 2xl:text-sm',
  large: 'min-h-11 px-5 text-xs sm:min-h-12 sm:px-8 sm:text-[13px] 2xl:min-h-13 2xl:px-9 2xl:text-sm',
}

const variants: Record<CtaVariant, string> = {
  primary: 'bg-[#001CFF] text-white shadow-[0_8px_25px_rgba(0,28,255,0.22)] hover:bg-[#0014CC] hover:shadow-[0_10px_32px_rgba(0,28,255,0.34)]',
  secondary: 'border border-slate-300 bg-white text-slate-700 hover:border-slate-800 hover:bg-slate-50 hover:text-slate-900',
  dark: 'bg-slate-900 text-white shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:bg-slate-800 hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]',
  light: 'bg-white text-slate-900 shadow-lg hover:bg-slate-100 hover:shadow-xl',
  outline: 'border-2 border-slate-900 bg-transparent text-slate-900 hover:bg-slate-900 hover:text-white',
  gradient: 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg hover:from-blue-500 hover:to-blue-400 hover:shadow-xl',
  ghost: 'border border-white/15 bg-white/5 text-white backdrop-blur-sm hover:border-white/30 hover:bg-white/10',
}

function classes({ className = '', fullWidth = false, size = 'default', variant = 'primary' }: Omit<SharedProps, 'children'>) {
  return `${base} ${sizes[size]} ${variants[variant]} ${fullWidth ? 'w-full' : 'w-auto'} ${className}`
}

export function CtaLink({ children, className, fullWidth, size, variant, ...props }: SharedProps & AnchorHTMLAttributes<HTMLAnchorElement>) {
  return <a {...props} className={classes({ className, fullWidth, size, variant })}>{children}</a>
}

export function CtaButton({ children, className, fullWidth, size, variant, type = 'button', ...props }: SharedProps & ButtonHTMLAttributes<HTMLButtonElement>) {
  return <button {...props} type={type} className={classes({ className, fullWidth, size, variant })}>{children}</button>
}
