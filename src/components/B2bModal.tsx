import { useState } from 'react'
import { X, User, Mail, Building2, MessageSquare, Check, Send } from 'lucide-react'

export default function B2bModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('')
  const [phone, setPhone] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name && email && company) {
      setSubmitted(true)
      setTimeout(() => {
        setSubmitted(false)
        onClose()
        setName('')
        setEmail('')
        setCompany('')
        setPhone('')
      }, 3000)
    }
  }

  return (
    <div className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
      <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-in">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="p-8">
          <div className="mb-6">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100/50 rounded-2xl flex items-center justify-center text-[#001CFF] mb-4.5 shadow-sm shadow-blue-100/30">
              <Building2 className="w-6 h-6" />
            </div>
            <div className="space-y-1.5">
              <span className="text-[9px] font-black text-[#001CFF] uppercase tracking-widest bg-blue-50/70 border border-blue-100/30 px-3 py-1 rounded-full w-fit">
                Atendimento Comercial
              </span>
              <h3 className="text-xl font-black text-slate-950 tracking-tight pt-1">
                Falar com Consultor B2B
              </h3>
              <p className="text-xs text-slate-500 font-semibold leading-relaxed">
                Preencha o formul&aacute;rio abaixo e retornaremos com nossa proposta comercial personalizada.
              </p>
            </div>
          </div>

          {submitted ? (
            <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm shadow-emerald-100/50">
                <Check className="w-7 h-7 animate-pulse" />
              </div>
              <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">Solicita&ccedil;&atilde;o Enviada!</h4>
              <p className="text-xs text-slate-550 font-semibold leading-relaxed max-w-xs mx-auto">
                Entraremos em contato no e-mail informado nas pr&oacute;ximas horas para apresentar a proposta ideal para sua carteira.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Nome Completo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <User className="w-4 h-4 text-slate-400" />
                  </div>
                  <input type="text" required placeholder="Ex: Roberto Silva" value={name} onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">E-mail Corporativo</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Mail className="w-4 h-4 text-slate-400" />
                  </div>
                  <input type="email" required placeholder="Ex: roberto@empresa.com.br" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">Nome da Administradora</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <Building2 className="w-4 h-4 text-slate-400" />
                  </div>
                  <input type="text" required placeholder="Ex: Administradora Viver Mais" value={company} onChange={(e) => setCompany(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">WhatsApp / Celular</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <MessageSquare className="w-4 h-4 text-slate-400" />
                  </div>
                  <input type="text" placeholder="Ex: (11) 99999-9999" value={phone} onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200" />
                </div>
              </div>

              <button type="submit"
                className="w-full bg-[#001CFF] hover:bg-[#0014CC] text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer mt-6">
                <Send className="w-3.5 h-3.5" />
                <span>Solicitar Contato</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
