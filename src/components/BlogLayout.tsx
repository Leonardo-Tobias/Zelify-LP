import type { ReactNode } from 'react'
import { useState } from 'react'
import Navbar from './Navbar'
import Footer from './Footer'
import B2bModal from './B2bModal'

export default function BlogLayout({ children }: { children: ReactNode }) {
  const [b2bOpen, setB2bOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      {children}
      <Footer onB2bClick={() => setB2bOpen(true)} />
      {b2bOpen && <B2bModal onClose={() => setB2bOpen(false)} />}
    </div>
  )
}
