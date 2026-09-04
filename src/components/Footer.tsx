import { PRODUCT_URL } from '../config'

export default function Footer({ onB2bClick }: { onB2bClick: () => void }) {
  return (
    <footer className="bg-slate-900 text-white py-12 sm:py-16 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 grid grid-cols-1 md:grid-cols-12 gap-10 sm:gap-12 md:gap-8 items-start">

        <div className="md:col-span-6 space-y-4">
          <a href="/" className="text-2xl font-black tracking-tight no-underline text-white">
            Zelcon<span className="text-[#001CFF]">.</span>
          </a>
          <p className="text-slate-450 text-xs max-w-sm font-semibold leading-relaxed">
            Simplificando a comunicação entre moradores e a zeladoria condominial com o uso inteligente de QR Codes. Sem aplicativo, sem burocracia.
          </p>
          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-4">
            &copy; {new Date().getFullYear()} Zelcon. Todos os direitos reservados.
          </p>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Links do Produto</h4>
          <ul className="space-y-2.5 text-xs text-slate-450 font-semibold">
            <li>
              <a href="/" className="hover:text-white transition-colors">Home</a>
            </li>
            <li>
              <a href="/blog" className="hover:text-white transition-colors">Blog</a>
            </li>
            <li>
              <a href={`${PRODUCT_URL}/login`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Entrar no Painel</a>
            </li>
            <li>
              <a href={`${PRODUCT_URL}/cadastro`} target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Criar Novo Condom&iacute;nio</a>
            </li>
          </ul>
        </div>

        <div className="md:col-span-3 space-y-4">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Corporativo</h4>
          <ul className="space-y-2.5 text-xs text-slate-450 font-semibold">
            <li>
              <button onClick={onB2bClick} className="hover:text-white transition-colors text-left cursor-pointer">Falar com Vendas B2B</button>
            </li>
            <li>
              <span className="text-slate-500 font-bold font-mono">contato@zelcon.com.br</span>
            </li>
          </ul>
        </div>

      </div>
    </footer>
  )
}
