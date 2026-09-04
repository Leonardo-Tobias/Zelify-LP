import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { PRODUCT_URL } from '../config'
import { CtaLink } from './Cta'

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const isBlog = location.pathname.startsWith('/blog')

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <nav
      style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
      className={`sticky top-0 z-40 w-full h-16 sm:h-20 flex items-center transition-all ${
        isScrolled
          ? 'bg-transparent border-transparent backdrop-blur-none shadow-none'
          : 'bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60'
      }`}
    >
      <div
        style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        className={`mx-auto flex items-center justify-between w-full px-4 sm:px-6 transition-all ${
          isScrolled
            ? 'bg-white/85 backdrop-blur-lg border border-slate-200/60 shadow-[0_12px_30px_rgba(0,28,255,0.04)] h-14 rounded-full max-w-5xl'
            : 'bg-transparent border-transparent h-full rounded-none max-w-7xl'
        }`}
      >
        <a href="/" className="flex items-center space-x-2 no-underline">
          <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">
            Zelcon<span className="text-[#001CFF]">.</span>
          </span>
        </a>

        <div className="flex items-center space-x-3 sm:space-x-5">
          {!isBlog && (
            <a
              href="/blog"
              className="text-xs font-medium text-slate-655 hover:text-[#001CFF] transition-colors cursor-pointer hidden sm:inline"
            >
              Blog
            </a>
          )}
          <a
            href={`${PRODUCT_URL}/login`}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-slate-655 hover:text-[#001CFF] transition-colors cursor-pointer"
          >
            Entrar
          </a>
          <CtaLink
            href={`${PRODUCT_URL}/cadastro`}
            target="_blank"
            rel="noreferrer"
            size="compact"
            className={isScrolled ? 'shadow-md' : ''}
          >
            Testar Grátis
          </CtaLink>
        </div>
      </div>
    </nav>
  )
}
