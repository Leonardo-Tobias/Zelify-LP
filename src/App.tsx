import React, { useState, useEffect, useRef } from 'react';
import { motion, useMotionValueEvent, useScroll, useTransform } from 'framer-motion';
import { 
  Building2, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  ArrowUpRight, 
  ChevronDown, 
  Sparkles,
  Check,
  Camera,
  Clock,
  MapPin,
  Zap,
  Shield,
  Eye,
  Paperclip
} from 'lucide-react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import B2bModal from './components/B2bModal';
import { PRODUCT_URL } from './config';


function ScrollReveal({ 
  children, 
  className = '', 
  delay = 0, 
  type = 'slide' 
}: { 
  children: React.ReactNode; 
  className?: string; 
  delay?: number; 
  type?: 'slide' | 'fade' 
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile] = React.useState(
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -20px 0px' }
    );

    const current = ref.current;
    if (current) {
      observer.observe(current);
    }

    return () => {
      if (current) {
        observer.unobserve(current);
      }
    };
  }, []);

  // Mobile: sempre visível sem animação
  const showContent = isMobile || isVisible;

  const effectClass = type === 'slide'
    ? (showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]')
    : (showContent ? 'opacity-100' : 'opacity-0');

  return (
    <div
      ref={ref}
      className={`transition-all duration-1000 ease-out transform ${effectClass} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
}

export default function App() {

  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [condoCount, setCondoCount] = useState(12);
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [revealedTimelineSteps, setRevealedTimelineSteps] = useState(0);

  const { scrollY } = useScroll();
  
  // Arcos Hero: começam invisíveis e crescem progressivamente com o scroll
  const arcScale = useTransform(scrollY, [0, 600], [0.05, 3.5]);
  const arcOpacity = useTransform(scrollY, [0, 80, 500], [0, 0.7, 0.15]);
  const arcRotation = useTransform(scrollY, [0, 600], [0, 60]);

  // Timeline / Ecossistema: animações progressivas conforme o scroll
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: timelineProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });

  useMotionValueEvent(timelineProgress, 'change', (latest) => {
    const reachedStep = latest >= 0.4 ? 3 : latest >= 0.22 ? 2 : latest >= 0.05 ? 1 : 0;
    setRevealedTimelineSteps((current) => Math.max(current, reachedStep));
  });

  const testimonials = [
    {
      text: "Centralize relatos que hoje chegam por telefone, papel e WhatsApp em uma fila única, com responsável e status visíveis.",
      author: "Gestão centralizada",
      role: "Cenário de uso",
      details: "Síndicos profissionais",
      avatar: "/favicon.svg"
    },
    {
      text: "O morador escaneia o QR Code, informa sua unidade e registra o problema com foto sem instalar aplicativo ou criar uma conta.",
      author: "Acesso simples",
      role: "Cenário de uso",
      details: "Moradores",
      avatar: "/favicon.svg"
    },
    {
      text: "O Kanban deixa pendências, serviços em execução e itens resolvidos em uma visão operacional fácil de acompanhar.",
      author: "Rotina organizada",
      role: "Cenário de uso",
      details: "Equipes de zeladoria",
      avatar: "/favicon.svg"
    },
    {
      text: "Administradoras podem alternar entre condomínios da carteira sem misturar chamados, moradores ou configurações.",
      author: "Carteira unificada",
      role: "Cenário de uso",
      details: "Administradoras",
      avatar: "/favicon.svg"
    },
    {
      text: "O painel gera o material com QR Code para impressão e instalação em elevadores, portaria e outras áreas comuns.",
      author: "Implantação prática",
      role: "Cenário de uso",
      details: "Áreas comuns",
      avatar: "/favicon.svg"
    },
    {
      text: "Comece no plano gratuito, valide o fluxo com os moradores e faça o upgrade apenas quando precisar ampliar o volume.",
      author: "Validação gradual",
      role: "Cenário de uso",
      details: "Plano Starter",
      avatar: "/favicon.svg"
    }
  ];

  // Auto-play for testimonials
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 8000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  // Plano Lote calculations
  const isUnlimited = condoCount >= 100;
  let pricePerCondo = isAnnual ? 49 : 59;
  if (condoCount >= 16 && condoCount <= 50) {
    pricePerCondo = isAnnual ? 39 : 49;
  } else if (condoCount > 50 && condoCount < 100) {
    pricePerCondo = isAnnual ? 29 : 39;
  }
  const totalPrice = isUnlimited ? 0 : condoCount * pricePerCondo;
  const [b2bModalOpen, setB2bModalOpen] = useState(false);

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const faqItems = [
    {
      q: "O morador realmente não precisa baixar nada para usar?",
      a: "Não. O morador aponta a câmera para o QR Code e usa o código de acesso compartilhado pela administração. O portal abre no navegador, sem download e sem criação de conta individual."
    },
    {
      q: "Como o síndico ou o zelador ficam sabendo das novas ocorrências?",
      a: "As novas ocorrências aparecem no Painel do Gestor, organizadas no Kanban por status. Assim, a equipe acompanha o que está pendente, em execução ou resolvido."
    },
    {
      q: "Qualquer pessoa de fora do condomínio pode escanear o QR Code e enviar falsos chamados?",
      a: "Não. Para a segurança do prédio, cada condomínio possui um link exclusivo atrelado a um código de acesso rápido de 4 dígitos impresso no próprio adesivo do QR Code. Apenas quem tem acesso físico às áreas internas do prédio consegue visualizar e enviar o chamado."
    },
    {
      q: "Como funciona a cobrança em lote para as Administradoras de Condomínio?",
      a: "Oferecemos uma tabela progressiva extremamente vantajosa para administradoras que desejam incluir o Zelcon em sua carteira de clientes, reduzindo o custo unitário por prédio à medida que o volume aumenta (variando de R$ 59 a R$ 39 mensais por condomínio ativo). A gestão financeira é unificada em uma única fatura mensal."
    },
    {
      q: "O Plano Starter Gratuito tem pegadinhas ou exige cartão de crédito?",
      a: "Não. O Plano Starter é 100% gratuito para 1 condomínio e serve para você validar o sistema na prática. Você pode usar todos os meses até atingir o teto de 15 chamados mensais. Não pedimos cartão de crédito no cadastro e você só faz o upgrade para o Plano Pro se e quando quiser liberar chamados ilimitados."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#001CFF]/10 selection:text-[#001CFF] scroll-smooth antialiased">
      
      <Navbar />

      {/* 3. A. HERO SECTION */}
      <section className="hero-compact relative overflow-hidden min-h-[calc(100svh-4rem)] sm:min-h-[calc(100svh-5rem)] flex items-center py-8 sm:py-12 md:py-16 border-b border-slate-200/60">
        {/* Arcos orbitais: começam invisíveis e expandem sem limite com o scroll */}
        <motion.div
          style={{
            x: "-50%",
            y: "-50%",
            scale: arcScale,
            opacity: arcOpacity,
            rotate: arcRotation
          }}
          className="absolute top-1/2 left-1/2 z-0 pointer-events-none"
        >
          {/* Círculo de referência base: 400px — o scale faz ele crescer até cobrir a tela */}
          {/* Arco 1 — Azul elétrico com destaque (mais interno) */}
          <div className="absolute rounded-full border-2 border-[#001CFF]/40 border-b-transparent border-r-transparent"
            style={{ width: 200, height: 200, top: -100, left: -100 }} />

          {/* Arco 2 — Cinza sólido */}
          <div className="absolute rounded-full border border-slate-300/50"
            style={{ width: 340, height: 340, top: -170, left: -170 }} />

          {/* Arco 3 — Azul sutil */}
          <div className="absolute rounded-full border border-[#001CFF]/20"
            style={{ width: 500, height: 500, top: -250, left: -250 }} />

          {/* Arco 4 — Cinza pontilhado externo */}
          <div className="absolute rounded-full border border-dashed border-slate-300/35"
            style={{ width: 680, height: 680, top: -340, left: -340 }} />

          {/* Arco 5 — Cinza muito leve, borda máxima */}
          <div className="absolute rounded-full border border-slate-200/25"
            style={{ width: 900, height: 900, top: -450, left: -450 }} />
        </motion.div>
        
        <div className="max-w-4xl 2xl:max-w-6xl mx-auto w-full px-4 sm:px-6 flex flex-col items-center text-center space-y-5 sm:space-y-7 2xl:space-y-9 relative z-10">
          
          <div className="inline-flex items-center space-x-1.5 sm:space-x-2 bg-slate-200/50 border border-slate-250/60 px-2.5 sm:px-3 2xl:px-4 py-1 2xl:py-1.5 rounded-full text-[9px] sm:text-[11px] 2xl:text-xs font-bold text-slate-700 uppercase tracking-widest animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#001CFF]" />
            <span>O Futuro da Zeladoria Condominial</span>
          </div>
          
          <h1 className="text-[clamp(2rem,9.5vw,3rem)] sm:text-5xl md:text-6xl 2xl:text-8xl font-black text-slate-900 tracking-tight leading-[1.05] max-w-3xl 2xl:max-w-5xl">
            A gestão operacional do seu condomínio, <span className="animate-text-shine">direto no QR Code.</span>
          </h1>

          <p className="text-slate-600 text-xs sm:text-base md:text-lg 2xl:text-xl font-medium leading-relaxed max-w-2xl 2xl:max-w-3xl">
            Elimine o caos dos relatos perdidos no WhatsApp. Moradores notificam manutenções, achados e perdidos ou incidentes em 20 segundos, direto do navegador e sem precisar baixar nenhum aplicativo.
          </p>

          <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 pt-1 sm:pt-2">
            <a 
              href={`${PRODUCT_URL}/cadastro`}
              target="_blank"
              rel="noreferrer"
              className="bg-[#001CFF] hover:bg-[#0014CC] text-white text-[10px] sm:text-xs 2xl:text-sm font-semibold uppercase tracking-wider px-4 py-2.5 sm:px-6 sm:py-3.5 2xl:px-8 2xl:py-4 rounded-lg sm:rounded-xl shadow-[0_8px_25px_rgba(0,28,255,0.18)] hover:shadow-[0_8px_25px_rgba(0,28,255,0.3)] transition-all text-center flex items-center justify-center space-x-1.5 sm:space-x-2 active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              <span>Testar Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button 
              onClick={() => setB2bModalOpen(true)}
              className="border border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-[10px] sm:text-xs 2xl:text-sm font-medium uppercase tracking-wider px-4 py-2.5 sm:px-6 sm:py-3.5 2xl:px-8 2xl:py-4 rounded-lg sm:rounded-xl transition-all text-center flex items-center justify-center active:scale-[0.98] cursor-pointer whitespace-nowrap"
            >
              Demonstração
            </button>
          </div>

          {/* Estatísticas & Benefícios Lado a Lado (Centralizados & Padronizados) */}
          <div className="grid grid-cols-3 items-start justify-center gap-2 sm:gap-8 md:gap-12 2xl:gap-20 mt-3 sm:mt-7 2xl:mt-10 pt-4 sm:pt-7 2xl:pt-9 border-t border-slate-100 w-full max-w-4xl 2xl:max-w-5xl mx-auto">
            {/* Badge 1: 100% Transparência */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left gap-1.5 sm:gap-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center bg-[#001CFF]/8 text-[#001CFF] shrink-0 shadow-sm border border-[#001CFF]/15">
                <Eye className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[9px] sm:text-sm 2xl:text-base leading-tight">100% Transparência</h4>
                <p className="hidden sm:block text-[11px] 2xl:text-sm text-slate-500 leading-tight mt-1">Acompanhamento em tempo real.</p>
              </div>
            </div>

            {/* Badge 2: Rápido */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left gap-1.5 sm:gap-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center bg-[#001CFF]/8 text-[#001CFF] shrink-0 shadow-sm border border-[#001CFF]/15">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[9px] sm:text-sm 2xl:text-base leading-tight">Rápido</h4>
                <p className="hidden sm:block text-[11px] 2xl:text-sm text-slate-500 leading-tight mt-1">Relatos em 20s, sem app.</p>
              </div>
            </div>

            {/* Badge 3: Seguro */}
            <div className="flex flex-col sm:flex-row items-center sm:space-x-3 text-center sm:text-left gap-1.5 sm:gap-0">
              <div className="w-8 h-8 sm:w-10 sm:h-10 2xl:w-12 2xl:h-12 rounded-full flex items-center justify-center bg-[#001CFF]/8 text-[#001CFF] shrink-0 shadow-sm border border-[#001CFF]/15">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-[9px] sm:text-sm 2xl:text-base leading-tight">Seguro</h4>
                <p className="hidden sm:block text-[11px] 2xl:text-sm text-slate-500 leading-tight mt-1">Histórico criptografado.</p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* 3. B. SEÇÃO DE DEMONSTRAÇÃO DO PRODUTO */}
      <section className="py-16 sm:py-20 md:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">

          {/* Header da Seção */}
          <div className="text-center max-w-3xl mx-auto space-y-4 mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Sincronia perfeita entre quem mora e quem resolve.
            </h2>
            <p className="text-slate-550 text-xs sm:text-sm font-semibold max-w-xl mx-auto leading-relaxed">
              De um lado, a simplicidade de um QR Code sem fricção para o morador. Do outro, um painel administrativo robusto e centralizado para o gestor.
            </p>
          </div>

          {/* Grid Principal */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-start">

            {/* CARD 1: PAINEL DO GESTOR */}
            <div className="group rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:border-slate-300/80 transition-all duration-300">
              <div className="w-full overflow-hidden border-b border-slate-200/80">
                <img
                  src="/mockup-admin.png"
                  alt="Painel administrativo Zelcon — Mural de Ocorrências"
                  className="w-full h-auto block"
                  draggable={false}
                />
              </div>
              <div className="p-7 sm:p-8 bg-white space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#001CFF] animate-pulse"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#001CFF]">Painel Administrativo</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">O Painel do Gestor</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Mural Kanban inteligente, controle de ocorrências ativas, relatórios e métricas de desempenho em tempo real. Acesse de qualquer desktop, a qualquer hora.
                </p>
              </div>
            </div>

            {/* CARD 2: PORTAL DO MORADOR */}
            <div className="group rounded-3xl overflow-hidden border border-slate-200/80 hover:shadow-xl hover:border-slate-300/80 transition-all duration-300">
              <div className="w-full overflow-hidden border-b border-slate-200/80">
                <img
                  src="/mockup-morador.png"
                  alt="Portal do morador Zelcon — Interface mobile"
                  className="w-full h-auto block"
                  draggable={false}
                />
              </div>
              <div className="p-7 sm:p-8 bg-white space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-600">Interface do Morador</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-snug">O Portal do Morador</h3>
                <p className="text-slate-500 text-sm font-medium leading-relaxed">
                  Sem downloads, logins ou senhas. O morador escaneia o QR Code, relata o problema em 20 segundos e anexa uma foto direto pelo celular.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>




      {/* 3. C. DOBRA DE SEGMENTAÇÃO (OS DOIS PÚBLICOS) */}
      <section className="py-16 sm:py-24 md:py-36 border-b border-slate-200/60 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="max-w-4xl text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
              <span className="font-black">Duas realidades, </span>
              <span className="font-normal text-slate-700">uma mesma solução.</span>
            </h2>
            <p className="text-slate-550 text-xs sm:text-sm font-semibold max-w-lg">
              Seja você um síndico profissional ou uma administradora com dezenas de prédios, o Zelcon se adapta ao seu modelo de gestão.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card Síndicos Profissionais (Fundo Claro) */}
            <ScrollReveal className="flex flex-col h-full" delay={0}>
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
                <div className="space-y-6">
                  {/* Visual Placeholder (Síndico trabalhando - Foto Real Unsplash) */}
                  <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative group border border-slate-200">
                    <img 
                      src="https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=800&q=80" 
                      alt="Síndico gerenciando chamados" 
                      className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-900/40 to-transparent"></div>
                    
                    {/* Glassmorphic Overlay Card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md border border-white/20 p-3 rounded-xl shadow-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src="https://randomuser.me/api/portraits/men/42.jpg"
                          alt="Carlos Santos"
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20 shrink-0"
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-[10px] font-black text-slate-900 leading-none">Carlos Santos</p>
                          <p className="text-[8px] text-slate-500 font-semibold mt-1">Síndico Profissional • Residencial Harmony</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1.5">
                        <span className="text-[8px] bg-[#001CFF]/10 text-[#001CFF] border border-[#001CFF]/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Pro
                        </span>
                        <span className="text-[8px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                          Kanban
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] font-extrabold text-[#001CFF] uppercase tracking-widest">Para Síndicos</span>
                    <h3 className="text-xl sm:text-2xl font-black text-slate-900 uppercase tracking-tight">Síndicos Profissionais & Orgânicos</h3>
                    <p className="text-slate-500 text-xs sm:text-sm font-semibold leading-relaxed">
                      Centralize toda a demanda de manutenção no Mural Kanban. Garanta transparência automática sobre a resolução das ocorrências e proteja o seu número pessoal de WhatsApp contra enxurradas de mensagens.
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <a 
                    href={`${PRODUCT_URL}/cadastro`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center space-x-2 bg-[#001CFF] hover:bg-[#0014CC] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg shadow-[#001CFF]/15 transition-all active:scale-[0.98]"
                  >
                    <span>Testar no meu condomínio</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Card Administradoras (Fundo Escuro) */}
            <ScrollReveal className="flex flex-col h-full" delay={150}>
              <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-6 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
                <div className="space-y-6">
                  {/* Visual Placeholder (Administradoras - Foto Real Unsplash) */}
                  <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden relative group border border-slate-800">
                    <img 
                      src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80" 
                      alt="Equipe de administradora em reunião" 
                      className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent"></div>
                    
                    {/* Glassmorphic Overlay Card */}
                    <div className="absolute bottom-4 left-4 right-4 bg-slate-900/95 backdrop-blur-md border border-slate-800 p-3 rounded-xl shadow-lg flex items-center justify-between">
                      <div className="flex items-center space-x-2.5 min-w-0">
                        <img
                          src="https://randomuser.me/api/portraits/women/33.jpg"
                          alt="Ana Beatriz"
                          className="w-7 h-7 rounded-full object-cover ring-1 ring-white/10 shrink-0"
                        />
                        <div className="min-w-0 text-left">
                          <p className="text-[10px] font-black text-white leading-none">Ana Beatriz</p>
                          <p className="text-[8px] text-slate-400 font-semibold mt-1">Gerente de Carteira • 12 Condomínios</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-blue-450/20 text-blue-400 border border-blue-400/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Corporate
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <span className="text-[9px] font-extrabold text-blue-400 uppercase tracking-widest">Para Administradoras</span>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-white">Administradoras de Condomínios</h3>
                    <p className="text-slate-400 text-xs sm:text-sm font-semibold leading-relaxed">
                      Reduza a dependência de ligações e mensagens dispersas. Agregue valor à sua carteira com uma operação centralizada e rastreável.
                    </p>
                  </div>
                </div>

                <div className="pt-8">
                  <button 
                    onClick={() => setB2bModalOpen(true)}
                    className="inline-flex items-center space-x-2 bg-white hover:bg-slate-100 text-slate-900 text-xs font-medium uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-lg transition-all active:scale-[0.98]"
                  >
                    <span>Falar com Consultor B2B</span>
                    <ArrowRight className="w-4 h-4 text-slate-900" />
                  </button>
                </div>
              </div>
            </ScrollReveal>

          </div>
        </div>
      </section>
      
            {/* 3. D. LINHA DO TEMPO: O ECOSSISTEMA NO MUNDO FÍSICO */}
      <section ref={timelineRef} className="relative bg-white border-b border-slate-200/60 py-16 sm:py-24 md:py-0 md:h-[300svh]">
        <div className="timeline-stage max-w-7xl mx-auto w-full px-4 sm:px-6 flex flex-col space-y-12 md:sticky md:top-0 md:h-[100svh] md:justify-center md:overflow-hidden">
          
          {/* Header */}
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              O ecossistema que conecta o mundo físico à gestão digital.
              </h2>
              <p className="text-slate-550 text-xs sm:text-sm font-semibold max-w-xl mx-auto">
                Três passos simples que eliminam intermediários e resolvem problemas de zeladoria de forma rápida.
              </p>
            </div>

            {/* Círculos e Cards Lado a Lado (grid) */}
            <div className="timeline-grid grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full max-w-6xl mx-auto">

              {/* Linha guia de conexão no desktop */}
              <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-[3px] bg-slate-100 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#001CFF] to-[#001CFF]/60 origin-left"
                  animate={{ scaleX: revealedTimelineSteps / 3 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                />
              </div>

              {/* Passo 01 Column */}
              <ScrollReveal delay={0}>
              <div className="flex flex-col items-center space-y-6">
                {/* Passo 01 Circle */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black z-10 bg-gradient-to-br from-[#001CFF] to-[#000AB3] border-[#001CFF] text-white"
                  animate={{
                    opacity: revealedTimelineSteps >= 1 ? 1 : 0.4,
                    scale: revealedTimelineSteps >= 1 ? 1 : 0.85,
                    boxShadow: revealedTimelineSteps >= 1 ? '0 0 20px rgba(0,28,255,0.25)' : '0 0 0px rgba(0,28,255,0)'
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  01
                </motion.div>

                {/* Card 1 */}
                <motion.div
                  className="w-full flex flex-col items-center text-center space-y-6"
                  animate={{ opacity: revealedTimelineSteps >= 1 ? 1 : 0, y: revealedTimelineSteps >= 1 ? 0 : 30 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="timeline-visual w-full h-64 lg:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 p-5 flex items-center justify-center relative overflow-hidden group-hover:border-[#001CFF]/20 transition-all duration-500">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #94a3b8 0px, transparent 1px, transparent 12px)', backgroundSize: '12px 12px' }}></div>
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-4 w-36 flex flex-col items-center space-y-2.5 transition-shadow duration-500">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#001CFF]"></div>
                        <span className="text-[9px] font-black text-[#001CFF] tracking-widest uppercase">Zelcon.</span>
                      </div>
                      <div className="relative bg-slate-50 rounded-lg p-2.5 border border-slate-100 w-full aspect-square flex items-center justify-center">
                        <div className="absolute top-1 left-1 w-2.5 h-2.5 border-l-2 border-t-2 border-[#001CFF]/40 rounded-tl-sm"></div>
                        <div className="absolute top-1 right-1 w-2.5 h-2.5 border-r-2 border-t-2 border-[#001CFF]/40 rounded-tr-sm"></div>
                        <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-l-2 border-b-2 border-[#001CFF]/40 rounded-bl-sm"></div>
                        <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-r-2 border-b-2 border-[#001CFF]/40 rounded-tr-sm"></div>
                        <QrCode className="w-12 h-12 text-slate-800" strokeWidth={1.5} />
                      </div>
                      <div className="w-full bg-[#001CFF]/5 border border-[#001CFF]/10 rounded-md py-1 flex items-center justify-center space-x-1">
                        <Camera className="w-2.5 h-2.5 text-[#001CFF]/70" />
                        <span className="text-[6px] font-bold text-[#001CFF]/70 uppercase tracking-widest">Aponte a câmera</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <span className="text-[5px] font-mono text-slate-400 tracking-widest">CÓDIGO:</span>
                        <span className="text-[6px] font-mono font-bold text-slate-600 bg-slate-100 px-1 rounded">7 2 4 1</span>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">1. O QR Code é fixado</h4>
                    <p className="text-slate-550 text-xs font-semibold leading-relaxed px-4">
                      Adesivos do Zelcon contendo link exclusivo e código de acesso são fixados em áreas de circulação como elevador e portaria.
                    </p>
                  </div>
                </motion.div>
              </div>
              </ScrollReveal>

              {/* Passo 02 Column */}
              <ScrollReveal delay={150}>
              <div className="flex flex-col items-center space-y-6">
                {/* Passo 02 Circle */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black z-10 bg-gradient-to-br from-[#001CFF] to-[#000AB3] border-[#001CFF] text-white"
                  animate={{
                    opacity: revealedTimelineSteps >= 2 ? 1 : 0.4,
                    scale: revealedTimelineSteps >= 2 ? 1 : 0.85,
                    boxShadow: revealedTimelineSteps >= 2 ? '0 0 20px rgba(0,28,255,0.25)' : '0 0 0px rgba(0,28,255,0)'
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  02
                </motion.div>

                {/* Card 2 */}
                <motion.div
                  className="w-full flex flex-col items-center text-center space-y-6"
                  animate={{ opacity: revealedTimelineSteps >= 2 ? 1 : 0, y: revealedTimelineSteps >= 2 ? 0 : 30 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="timeline-visual w-full h-64 lg:h-80 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 p-5 flex items-center justify-center relative overflow-hidden transition-all duration-500">
                    <div className="relative bg-slate-900 rounded-2xl p-1.5 shadow-[0_12px_40px_rgba(15,23,42,0.25)] w-28 h-52 mx-auto flex flex-col transition-shadow duration-500">
                      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-2.5 bg-slate-900 rounded-b-lg z-20 flex items-center justify-center">
                        <div className="w-4 h-1 bg-slate-800 rounded-full"></div>
                      </div>
                      <div className="flex-1 bg-white rounded-xl overflow-hidden flex flex-col">
                        <div className="bg-slate-50 px-2 pt-3 pb-1 flex items-center justify-between">
                          <span className="text-[5px] font-bold text-slate-400">9:41</span>
                          <div className="flex items-center space-x-0.5">
                            <div className="w-1 h-1.5 bg-slate-300 rounded-sm"></div>
                            <div className="w-1 h-2 bg-slate-300 rounded-sm"></div>
                            <div className="w-1 h-2.5 bg-slate-400 rounded-sm"></div>
                          </div>
                        </div>
                        <div className="px-2.5 py-1.5 border-b border-slate-100 flex items-center space-x-1">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#001CFF]"></div>
                          <span className="text-[6px] font-black text-slate-900 tracking-wide">Zelcon</span>
                        </div>
                        <div className="flex-1 px-2.5 py-2 space-y-1.5">
                          <span className="text-[5px] font-bold text-slate-500 uppercase tracking-wider text-left block">Nova Ocorrência</span>
                          <div className="w-full h-10 bg-slate-50 border border-dashed border-slate-200 rounded-lg flex items-center justify-center">
                            <Camera className="w-3 h-3 text-slate-300" />
                          </div>
                          <div className="space-y-1">
                            <div className="w-full h-3.5 bg-slate-50 rounded border border-slate-150 flex items-center px-1.5">
                              <span className="text-[4px] text-slate-400 font-semibold">Elevador Social</span>
                            </div>
                            <div className="w-full h-3.5 bg-slate-50 rounded border border-slate-150 flex items-center px-1.5">
                              <span className="text-[4px] text-slate-400 font-semibold">Bloco A - Apto 302</span>
                            </div>
                            <div className="w-full h-6 bg-white rounded border border-[#001CFF]/60 flex items-start px-1.5 pt-0.5 shadow-[0_0_6px_rgba(0,28,255,0.06)]">
                              <span className="text-[4px] text-slate-800 font-semibold">Lâmpada queimada...</span>
                              <span className="text-[4.5px] text-[#001CFF] -ml-0.5 animate-pulse">|</span>
                            </div>
                          </div>
                        </div>
                        <div className="px-2.5 pb-2">
                          <div className="w-full h-5 bg-[#001CFF] rounded-lg flex items-center justify-center shadow-[0_2px_8px_rgba(0,28,255,0.3)]">
                            <span className="text-[5px] text-white font-black uppercase tracking-widest">Enviar Chamado</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">2. O Morador Notifica</h4>
                    <p className="text-slate-550 text-xs font-semibold leading-relaxed px-4">
                      Sem criar senhas, o morador aponta a câmera para o QR Code, preenche o local, anexa a foto do problema e envia em 20 segundos.
                    </p>
                  </div>
                </motion.div>
              </div>
              </ScrollReveal>

              {/* Passo 03 Column */}
              <ScrollReveal delay={300}>
              <div className="flex flex-col items-center space-y-6">
                {/* Passo 03 Circle */}
                <motion.div
                  className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-black z-10 bg-gradient-to-br from-[#001CFF] to-[#000AB3] border-[#001CFF] text-white"
                  animate={{
                    opacity: revealedTimelineSteps >= 3 ? 1 : 0.4,
                    scale: revealedTimelineSteps >= 3 ? 1 : 0.85,
                    boxShadow: revealedTimelineSteps >= 3 ? '0 0 20px rgba(0,28,255,0.25)' : '0 0 0px rgba(0,28,255,0)'
                  }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  03
                </motion.div>

                {/* Card 3 */}
                <motion.div
                  className="w-full flex flex-col items-center text-center space-y-6"
                  animate={{ opacity: revealedTimelineSteps >= 3 ? 1 : 0, y: revealedTimelineSteps >= 3 ? 0 : 30 }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                >
                  <div className="timeline-visual w-full h-64 lg:h-80 rounded-2xl bg-gradient-to-br from-[#0B0F19] to-[#121826] border border-slate-800/80 p-3 flex items-center justify-center relative overflow-hidden transition-all duration-500">
                    <div className="w-full h-full bg-[#080B11] border border-slate-850 rounded-xl shadow-[0_12px_36px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col">
                      {/* Window Header */}
                      <div className="px-2.5 py-1.5 border-b border-slate-850 flex items-center justify-between bg-[#0B0F19]">
                        <div className="flex items-center space-x-1.5">
                          {/* Window buttons */}
                          <div className="flex space-x-1">
                            <div className="w-1.5 h-1.5 rounded-full bg-red-500/80"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500/80"></div>
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500/80"></div>
                          </div>
                          <span className="text-[6.5px] font-black text-slate-300 uppercase tracking-wider ml-1">Painel Kanban</span>
                        </div>
                        <div className="flex items-center space-x-1 bg-emerald-500/10 px-1.5 py-0.5 rounded-full border border-emerald-500/20">
                          <div className="w-1 h-1 rounded-full bg-emerald-400 animate-pulse"></div>
                          <span className="text-[5px] font-bold text-emerald-400 uppercase tracking-widest">Ao vivo</span>
                        </div>
                      </div>

                      {/* Kanban Columns */}
                      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-[#070A13] flex-1 overflow-hidden">
                        {/* PENDENTES Column */}
                        <div className="rounded-lg bg-[#0C0F19] border border-slate-850/60 flex flex-col overflow-hidden">
                          {/* Column Header */}
                          <div className="border-t border-amber-500 bg-amber-500/5 px-1.5 py-1 flex items-center justify-between text-[5.5px] font-black text-amber-500 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <Clock className="w-1.5 h-1.5" />
                              <span>PENDENTES</span>
                            </div>
                            <span className="bg-amber-500/20 px-1 py-0.2 rounded-full text-[5px]">2</span>
                          </div>
                          {/* Cards List */}
                          <div className="p-1 space-y-1 overflow-y-auto flex-1 scrollbar-none">
                            {/* Card 1 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-amber-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  GARAGEM
                                </span>
                                <span className="text-[3.5px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Média</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Lâmpada queimada</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">Lâmpada do corredor da garagem...</p>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco A · Apt 101</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>25/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-amber-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  ESCADA
                                </span>
                                <span className="text-[3.5px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Alta</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Corrimão solto</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">Corrimão da escada do bloco B...</p>
                              <div className="flex items-center space-x-0.5 text-[4px] text-blue-400 font-semibold cursor-pointer">
                                <Paperclip className="w-1 h-1 shrink-0" />
                                <span>Ver foto do chamado</span>
                              </div>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco B · Apt 204</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>24/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Column Footer */}
                          <div className="p-1 border-t border-slate-850 bg-[#0A0D17]">
                            <button className="w-full py-0.5 rounded border border-dashed border-slate-800 hover:border-slate-750 text-slate-500 hover:text-slate-450 text-[4.5px] font-medium transition-colors cursor-pointer">
                              + Novo chamado
                            </button>
                          </div>
                        </div>

                        {/* EM EXECUÇÃO Column */}
                        <div className="rounded-lg bg-[#0C0F19] border border-slate-850/60 flex flex-col overflow-hidden">
                          {/* Column Header */}
                          <div className="border-t border-blue-500 bg-blue-500/5 px-1.5 py-1 flex items-center justify-between text-[5.5px] font-black text-blue-500 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <Building2 className="w-1.5 h-1.5" />
                              <span>EM EXECUÇÃO</span>
                            </div>
                            <span className="bg-blue-500/20 px-1 py-0.2 rounded-full text-[5px]">3</span>
                          </div>
                          {/* Cards List */}
                          <div className="p-1 space-y-1 overflow-y-auto flex-1 scrollbar-none">
                            {/* Card 1 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-blue-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  HALL
                                </span>
                                <span className="text-[3.5px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Média</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Lâmpada queimada no hall</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">A lâmpada de led do hall...</p>
                              <div className="flex items-center space-x-0.5 text-[4px] text-blue-400 font-semibold cursor-pointer">
                                <Paperclip className="w-1 h-1 shrink-0" />
                                <span>Ver foto do chamado</span>
                              </div>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco A · Apt 302</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>26/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-blue-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  PISCINA
                                </span>
                                <span className="text-[3.5px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Alta</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Bomba d'água com ruído</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">Bomba fazendo barulho alto...</p>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco C · Apt 510</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>23/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                            {/* Card 3 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-blue-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  ELEVADOR
                                </span>
                                <span className="text-[3.5px] font-bold text-red-500 bg-red-500/10 border border-red-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Alta</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Porta travando</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">Porta do elevador demorando...</p>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco B · Apt 403</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>22/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Column Footer */}
                          <div className="p-1 border-t border-slate-850 bg-[#0A0D17]">
                            <button className="w-full py-0.5 rounded border border-dashed border-slate-800 hover:border-slate-750 text-slate-500 hover:text-slate-450 text-[4.5px] font-medium transition-colors cursor-pointer">
                              + Novo chamado
                            </button>
                          </div>
                        </div>

                        {/* RESOLVIDOS Column */}
                        <div className="rounded-lg bg-[#0C0F19] border border-slate-850/60 flex flex-col overflow-hidden">
                          {/* Column Header */}
                          <div className="border-t border-emerald-500 bg-emerald-500/5 px-1.5 py-1 flex items-center justify-between text-[5.5px] font-black text-emerald-500 uppercase tracking-wider">
                            <div className="flex items-center space-x-1">
                              <CheckCircle2 className="w-1.5 h-1.5" />
                              <span>RESOLVIDOS</span>
                            </div>
                            <span className="bg-emerald-500/20 px-1 py-0.2 rounded-full text-[5px]">2</span>
                          </div>
                          {/* Cards List */}
                          <div className="p-1 space-y-1 overflow-y-auto flex-1 scrollbar-none">
                            {/* Card 1 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-emerald-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  SALÃO FEST.
                                </span>
                                <span className="text-[3.5px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Baixa</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Ar-condicionado sem gelar</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">O ar-condicionado do salão...</p>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco A</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>20/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                            {/* Card 2 */}
                            <div className="bg-[#13192B] border border-slate-800 rounded-md p-1.5 space-y-1 hover:border-emerald-500/35 transition-colors">
                              <div className="flex items-center justify-between">
                                <span className="text-[4.5px] font-bold text-indigo-400 uppercase tracking-wider flex items-center">
                                  <MapPin className="w-1 h-1 mr-0.5 shrink-0" />
                                  PORTARIA
                                </span>
                                <span className="text-[3.5px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1 py-0.2 rounded uppercase scale-90 origin-right">Média</span>
                              </div>
                              <h5 className="text-[5.5px] font-black text-white text-left leading-tight">Interfone com falha</h5>
                              <p className="text-[4.5px] text-slate-450 text-left line-clamp-1 leading-normal">Interfone da portaria sem som...</p>
                              <div className="flex items-center justify-between text-[4px] text-slate-500 pt-1 border-t border-slate-800/50">
                                <span className="flex items-center"><Building2 className="w-1 h-1 mr-0.5 shrink-0" />Bloco —</span>
                                <span className="flex items-center space-x-0.5">
                                  <span>18/06</span>
                                  <div className="flex space-x-0.5 scale-90">
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-800 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&lt;</span>
                                    <span className="w-2.5 h-2.5 rounded-full bg-slate-700 flex items-center justify-center text-white text-[3px] select-none cursor-pointer">&gt;</span>
                                  </div>
                                </span>
                              </div>
                            </div>
                          </div>
                          {/* Column Footer */}
                          <div className="p-1 border-t border-slate-850 bg-[#0A0D17]">
                            <button className="w-full py-0.5 rounded border border-dashed border-slate-800 hover:border-slate-750 text-slate-500 hover:text-slate-450 text-[4.5px] font-medium transition-colors cursor-pointer">
                              + Novo chamado
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <h4 className="text-sm font-black uppercase text-slate-900 tracking-wider">3. O Gestor Resolve</h4>
                    <p className="text-slate-555 text-xs font-semibold leading-relaxed px-4">
                      O chamado cai em tempo real como um cartão no painel operacional do síndico, pronto para ser encaminhado à equipe de manutenção.
                    </p>
                  </div>
                </motion.div>
              </div>
              </ScrollReveal>

            </div>
          </div>
      </section>
{/* SEÇÃO CARROSSEL DE COMENTÁRIOS (TESTIMONIALS) */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 to-slate-100/50 border-b border-slate-200/60 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#001CFF]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10 sm:space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              Onde o Zelcon ajuda na prática
            </h2>
            <p className="text-slate-550 text-xs sm:text-sm font-semibold max-w-lg mx-auto">
              Cenários ilustrativos de como a plataforma pode organizar a rotina do condomínio.
            </p>
          </div>

          {/* Testimonial Active Card */}
          <ScrollReveal type="fade" className="w-full">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-6 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative flex flex-col justify-between min-h-[260px] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
              <div className="space-y-6">
                {/* Giant quotation mark SVG */}
                <div className="text-[#001CFF] opacity-15 absolute top-6 right-8">
                  <svg className="w-14 h-14 fill-current" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                  </svg>
                </div>

                {/* Text content */}
                <p className="text-slate-800 font-semibold text-sm sm:text-base md:text-lg italic leading-relaxed text-left pr-8">
                  "{testimonials[currentTestimonial].text}"
                </p>
              </div>

              {/* Author details & controls */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 pt-6 border-t border-slate-100 mt-6 shrink-0">
                <div className="flex items-center space-x-3.5 text-left">
                  <img
                    src={testimonials[currentTestimonial].avatar}
                    alt={testimonials[currentTestimonial].author}
                    className="w-10 h-10 rounded-full object-cover shadow-md shadow-[#001CFF]/15 ring-1 ring-white/20"
                  />
                  <div>
                    <h4 className="text-xs font-black text-slate-900 leading-none">{testimonials[currentTestimonial].author}</h4>
                    <p className="text-[10px] text-[#001CFF] font-bold mt-1.5 flex items-center gap-1.5 leading-none">
                      {testimonials[currentTestimonial].role}
                      <span className="text-slate-400 font-medium">•</span>
                      <span className="text-slate-550 font-semibold">{testimonials[currentTestimonial].details}</span>
                    </p>
                  </div>
                </div>

                {/* Controls */}
                <div className="flex items-center space-x-3 self-end sm:self-auto">
                  <button 
                    onClick={() => setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length)}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 active:scale-[0.92] text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  >
                    <ArrowLeft className="w-4 h-4" />
                  </button>
                  <div className="flex space-x-1.5">
                    {testimonials.map((_, index) => (
                      <button 
                        key={index}
                        onClick={() => setCurrentTestimonial(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentTestimonial ? 'bg-[#001CFF] w-4' : 'bg-slate-200'
                        }`}
                      ></button>
                    ))}
                  </div>
                  <button 
                    onClick={() => setCurrentTestimonial((prev) => (prev + 1) % testimonials.length)}
                    className="w-8 h-8 rounded-full border border-slate-200 hover:bg-slate-50 active:scale-[0.92] text-slate-600 hover:text-slate-900 flex items-center justify-center transition-all cursor-pointer shadow-sm"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </ScrollReveal>

          {/* CTA abaixo dos depoimentos */}
          <div className="text-center">
            <a
              href={`${PRODUCT_URL}/cadastro`}
              className="inline-flex items-center space-x-2 bg-slate-900 hover:bg-slate-800 text-white text-xs sm:text-sm font-black px-6 py-3 sm:px-8 sm:py-4 rounded-2xl transition-all active:scale-[0.97] shadow-[0_8px_25px_rgba(0,0,0,0.15)] hover:shadow-[0_12px_35px_rgba(0,0,0,0.2)]"
            >
              <span>Começar grátis agora</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <p className="text-[10px] text-slate-400 font-semibold mt-3">
              Sem cartão de crédito. Sem compromisso.
            </p>
          </div>
        </div>
      </section>

      {/* 3. E. TABELA DE PREÇOS (PRICING DE 3 COLUNAS) */}
      <section className="py-16 sm:py-24 md:py-36 border-b border-slate-200/60 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="max-w-3xl mx-auto text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 leading-tight">
              Um modelo de faturamento transparente, sem pegadinhas.
            </h2>
            <p className="text-slate-550 text-xs sm:text-sm font-semibold max-w-xl mx-auto">
              Encontre o plano ideal para a sua realidade operacional. Comece gratuitamente para validar a usabilidade do sistema.
            </p>
          </div>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center mb-16">
            <div className="bg-white/80 backdrop-blur-md p-1.5 rounded-full flex items-center space-x-3 border border-slate-200/60 shadow-sm">
              <button
                type="button"
                onClick={() => setIsAnnual(false)}
                className={`px-5 py-2 text-xs font-black rounded-full transition-all duration-300 cursor-pointer ${
                  !isAnnual 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Mensal
              </button>
              <button
                type="button"
                onClick={() => setIsAnnual(true)}
                className={`px-5 py-2 text-xs font-black rounded-full transition-all duration-300 cursor-pointer ${
                  isAnnual 
                    ? 'bg-slate-900 text-white shadow-sm' 
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Anual
              </button>
              <span className="text-[10px] px-3 py-1.5 rounded-full font-extrabold tracking-wide uppercase bg-[#001CFF] text-white shadow-[0_2px_8px_rgba(0,28,255,0.25)] whitespace-nowrap shrink-0">
                2 MESES GRÁTIS
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
            
            {/* PLANO STARTER (GRÁTIS) */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:border-slate-300/80 transition-all duration-500 relative group">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Para Começar</span>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight">Plano Starter</h3>
                </div>
                
                <div className="flex items-baseline space-x-1">
                  <span className="text-sm font-black text-slate-400 align-super">R$</span>
                  <span className="text-5xl font-black text-slate-900 tracking-tight">0</span>
                  <span className="text-slate-400 text-xs font-semibold ml-1">/mês</span>
                </div>

                <p className="text-slate-500 text-xs font-semibold leading-relaxed">
                  Perfeito para condomínios pequenos ou para avaliar a adesão dos moradores na prática.
                </p>

                <hr className="border-slate-100" />

                <ul className="space-y-3.5 text-xs font-semibold text-slate-650">
                  <li className="flex items-center text-slate-600 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#001CFF] flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    1 Condomínio Ativo
                  </li>
                  <li className="flex items-center text-slate-600 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#001CFF] flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Limite de 15 Chamados/Mês
                  </li>
                  <li className="flex items-center text-slate-600 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#001CFF] flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Acesso Completo via QR Code
                  </li>
                  <li className="flex items-center text-slate-600 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-800">
                    <span className="w-5 h-5 rounded-full bg-blue-50 text-[#001CFF] flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Mural Kanban Básico
                  </li>
                  <li className="flex items-center text-slate-400 font-medium text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-100/70 text-slate-450 flex items-center justify-center mr-2.5 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    Mural de Achados e Perdidos
                  </li>
                  <li className="flex items-center text-slate-400 font-medium text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-100/70 text-slate-450 flex items-center justify-center mr-2.5 shrink-0">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </span>
                    Suporte a Multi-Condomínios
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a 
                  href={`${PRODUCT_URL}/cadastro`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-medium uppercase tracking-wider py-4 rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
                >
                  Começar Teste Gratuito
                </a>
              </div>
            </div>

            {/* PLANO PRO (MAIS POPULAR) */}
            <div className="bg-white border-2 border-[#001CFF] rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,28,255,0.06)] hover:shadow-[0_25px_60px_rgba(0,28,255,0.12)] hover:-translate-y-2.5 transition-all duration-500 relative group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#001CFF] text-white border border-[#001CFF]/10 px-4.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(0,28,255,0.3)] select-none">
                Mais Popular
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#001CFF] uppercase tracking-widest">Controle Completo</span>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
                    Zelcon Pro
                    <Sparkles className="w-4 h-4 text-[#001CFF] ml-1.5 animate-pulse" />
                  </h3>
                </div>
                
                <div className="flex flex-col">
                  <div className="flex items-baseline space-x-1">
                    <span className="text-sm font-black text-[#001CFF] align-super">R$</span>
                    <motion.span 
                      key={isAnnual ? 'annual' : 'monthly'}
                      initial={{ opacity: 0, y: -2 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-5xl font-black text-slate-900 tracking-tight inline-block"
                    >
                      {isAnnual ? '124' : '149'}
                    </motion.span>
                    <span className="text-slate-550 text-xs font-semibold ml-1">/mês</span>
                  </div>
                  {isAnnual && (
                    <span className="text-[9.5px] text-slate-400 font-bold mt-1 text-left">
                      Cobrado anualmente (R$ 1.488/ano)
                    </span>
                  )}
                </div>

                <p className="text-slate-550 text-xs font-semibold leading-relaxed">
                  Tudo o que um síndico precisa para centralizar a operação do condomínio de ponta a ponta.
                </p>

                <hr className="border-slate-150" />

                <ul className="space-y-3.5 text-xs font-semibold text-slate-650">
                  <li className="flex items-center text-slate-700 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-emerald-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Chamados Ilimitados
                  </li>
                  <li className="flex items-center text-slate-700 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-emerald-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Mural Kanban Completo
                  </li>
                  <li className="flex items-center text-slate-700 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-emerald-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Mural de Achados e Perdidos
                  </li>
                  <li className="flex items-center text-slate-700 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-emerald-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Relatórios Gerenciais Mensais
                  </li>
                  <li className="flex items-center text-slate-700 font-semibold text-xs transition-colors duration-300 group-hover:text-slate-900">
                    <span className="w-5 h-5 rounded-full bg-emerald-50 text-emerald-650 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-emerald-200/10">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Suporte Prioritário do Time
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                <a 
                  href={`${PRODUCT_URL}/cadastro?plan=pro`}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-[#001CFF] hover:bg-[#0014CC] text-white text-xs font-semibold uppercase tracking-wider py-4 rounded-xl shadow-[0_8px_30px_rgba(0,28,255,0.22)] hover:shadow-[0_12px_35px_rgba(0,28,255,0.35)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  Assinar Plano Pro
                </a>
              </div>
            </div>

            {/* PLANO CORPORATIVO (ADMINISTRADORAS) */}
            <div className="bg-[#0B0F19] border border-slate-800 text-white rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1.5 hover:border-slate-700 transition-all duration-500 relative group">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Múltiplos Condomínios</span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">Zelcon Corporate</h3>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="space-y-1">
                    {isUnlimited ? (
                      <div className="flex items-baseline space-x-2">
                        <span className="text-4xl font-black text-white tracking-tight">Ilimitado</span>
                        <span className="text-slate-400 text-xs font-semibold ml-1">Condomínios</span>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-baseline space-x-1">
                          <span className="text-sm font-black text-blue-500 align-super">R$</span>
                          <motion.span
                            key={isAnnual ? 'annual' : 'monthly'}
                            initial={{ opacity: 0, y: -2 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-5xl font-black text-white tracking-tight inline-block"
                          >
                            {pricePerCondo}
                          </motion.span>
                          <span className="text-slate-400 text-xs font-semibold ml-1">/mês por condomínio</span>
                        </div>

                        <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wider flex items-center space-x-1.5 flex-wrap">
                          <span>Total:</span>
                          <motion.span
                            key={totalPrice}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-blue-400 font-black text-xs inline-block"
                          >
                            R$ {totalPrice.toLocaleString('pt-BR')},00
                          </motion.span>
                          <span className="text-slate-550 font-medium mr-1">/mês</span>
                          {isAnnual && (
                            <span className="text-[9.5px] text-slate-500 font-bold lowercase normal-case">
                              (R$ {(totalPrice * 12).toLocaleString('pt-BR')}/ano)
                            </span>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Campo de entrada interativo */}
                  <div className="space-y-3 pt-2 bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-350">
                      <label htmlFor="condo-qty" className="uppercase tracking-wider text-[9px] text-slate-400 font-extrabold">Qtd. de Condomínios</label>
                      <div className="flex items-center space-x-1.5 bg-slate-950 border border-slate-800 rounded-xl px-1 py-1 shadow-inner">
                        <button 
                          type="button"
                          onClick={() => setCondoCount(prev => Math.max(5, prev - 1))}
                          className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-[0.92] text-slate-350 hover:text-white flex items-center justify-center font-bold transition-all border border-slate-800/85 cursor-pointer text-xs select-none"
                        >
                          -
                        </button>
                        <input 
                          type="number"
                          id="condo-qty"
                          min={5}
                          max={500}
                          value={condoCount}
                          onChange={(e) => {
                            const val = parseInt(e.target.value);
                            setCondoCount(isNaN(val) ? 5 : Math.max(5, Math.min(500, val)));
                          }}
                          className="w-12 bg-transparent text-white text-center font-bold focus:outline-none text-xs [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setCondoCount(prev => Math.min(500, prev + 1))}
                          className="w-6 h-6 rounded-lg bg-slate-900 hover:bg-slate-800 active:scale-[0.92] text-slate-350 hover:text-white flex items-center justify-center font-bold transition-all border border-slate-800/85 cursor-pointer text-xs select-none"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    
                    <div className="relative flex items-center">
                      <input 
                        type="range"
                        id="condo-range"
                        min={5}
                        max={100}
                        value={condoCount > 100 ? 100 : condoCount}
                        onChange={(e) => setCondoCount(Math.max(5, parseInt(e.target.value)))}
                        className="w-full h-1.5 bg-slate-950 rounded-lg appearance-none cursor-pointer accent-blue-500 border border-slate-800 focus:outline-none"
                      />
                    </div>
                    
                    <div className="flex justify-between text-[8px] text-slate-500 font-bold uppercase tracking-wider">
                      <span>5</span>
                      <span>50</span>
                      <span className={condoCount >= 100 ? 'text-blue-400' : ''}>Ilimitado</span>
                    </div>
                  </div>
                  <p className="text-[8px] text-slate-500 text-right mt-1.5 leading-normal font-semibold">
                    *Condição exclusiva para o plano Corporate (mínimo de 5 condomínios ativos).
                  </p>
                </div>

                <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                  Infraestrutura corporativa desenvolvida especificamente para administradoras de condomínios.
                </p>

                <hr className="border-slate-800" />

                <ul className="space-y-3.5 text-xs font-semibold text-slate-350">
                  <li className="flex items-center text-slate-350 font-semibold text-xs transition-colors duration-300 group-hover:text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-950/80 text-blue-400 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-950/20">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Painel Consolidado de Carteira
                  </li>
                  <li className="flex items-center text-slate-355 font-semibold text-xs transition-colors duration-300 group-hover:text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-950/80 text-blue-400 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-950/20">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Relatórios Consolidados de Lote
                  </li>
                  <li className="flex items-center text-slate-355 font-semibold text-xs transition-colors duration-300 group-hover:text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-950/80 text-blue-400 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-950/20">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Faturamento Único Mensal
                  </li>
                  <li className="flex items-center text-slate-355 font-semibold text-xs transition-colors duration-300 group-hover:text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-950/80 text-blue-400 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-950/20">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Customização de Logotipo e Marca
                  </li>
                  <li className="flex items-center text-slate-355 font-semibold text-xs transition-colors duration-300 group-hover:text-white">
                    <span className="w-5 h-5 rounded-full bg-blue-950/80 text-blue-400 flex items-center justify-center mr-2.5 shrink-0 shadow-sm shadow-blue-950/20">
                      <Check className="w-3.5 h-3.5" />
                    </span>
                    Gestor de Conta Dedicado
                  </li>
                </ul>
              </div>

              <div className="pt-8">
                {isUnlimited ? (
                  <button
                    onClick={() => setB2bModalOpen(true)}
                    className="block w-full text-center bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white text-xs font-semibold uppercase tracking-wider py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    Falar com Consultor
                  </button>
                ) : (
                  <a
                    href={`${PRODUCT_URL}/cadastro?plan=corporate`}
                    target="_blank"
                    rel="noreferrer"
                    className="block w-full text-center bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold uppercase tracking-wider py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
                  >
                    Assinar Plano Corporate
                  </a>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. F. PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
      <section className="py-16 sm:py-24 md:py-36 bg-white border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12 sm:space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Perguntas Frequentes</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">Tudo o que você precisa saber sobre o Zelcon para começar a usar.</p>
          </div>

          <div className="divide-y divide-slate-200 border-t border-b border-slate-200">
            {faqItems.map((item, idx) => {
              const isOpen = !!faqOpen[idx];
              return (
                <div key={idx} className="py-5">
                  <button 
                    onClick={() => toggleFaq(idx)}
                    className="w-full flex items-center justify-between text-left group cursor-pointer focus:outline-none"
                  >
                    <span className="font-display text-xs sm:text-sm font-bold uppercase tracking-wide text-slate-900 group-hover:text-[#001CFF] transition-colors leading-relaxed">
                      {item.q}
                    </span>
                    <ChevronDown className={`w-4 h-4 text-slate-400 group-hover:text-[#001CFF] transition-all shrink-0 ml-4 ${isOpen ? 'transform rotate-180 text-[#001CFF]' : ''}`} />
                  </button>
                  
                  {/* Expandable answer */}
                  <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-56 opacity-100 mt-3.5' : 'max-h-0 opacity-0'}`}>
                    <p className="text-xs sm:text-sm text-slate-500 font-semibold leading-relaxed pl-1">
                      {item.a}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="relative overflow-hidden bg-[#0B0F19] min-h-[70svh] flex items-center py-16 sm:py-24 md:py-36">
        {/* Glow de fundo */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#001CFF]/12 rounded-full blur-[120px]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-[#001CFF]/10 rounded-full blur-[60px]" />
        </div>

        {/* Grade decorativa sutil */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-7 sm:space-y-10">

          {/* Badge */}
          <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 px-4 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-[#001CFF] animate-pulse" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Pronto para começar?
            </span>
          </div>

          {/* Título */}
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-[1.08] max-w-3xl mx-auto">
            Leve a operação do seu condomínio para um{' '}
            <span className="relative inline-block">
              <span className="relative z-10 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-300">
                novo nível
              </span>
              <span className="absolute inset-x-0 bottom-1 h-[3px] bg-gradient-to-r from-blue-500/60 to-blue-300/40 rounded-full" />
            </span>
            {' '}de organização.
          </h2>

          {/* Texto */}
          <p className="text-slate-400 text-sm sm:text-base font-medium leading-relaxed max-w-2xl mx-auto">
            Comece gratuitamente, valide com seus moradores e transforme a gestão operacional em algo simples, rastreável e centralizado.
          </p>

          {/* CTAs */}
          <div className="flex flex-row flex-wrap justify-center items-center gap-2 sm:gap-4 pt-2">
            <a
              href={`${PRODUCT_URL}/cadastro`}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2 bg-[#001CFF] hover:bg-[#0014CC] text-white text-[10px] sm:text-xs font-semibold uppercase tracking-wider px-4 py-2.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl shadow-[0_8px_30px_rgba(0,28,255,0.35)] hover:shadow-[0_12px_40px_rgba(0,28,255,0.5)] transition-all duration-300 active:scale-[0.98] whitespace-nowrap"
            >
              <span>Testar Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button
              onClick={() => setB2bModalOpen(true)}
              className="inline-flex items-center justify-center space-x-1.5 sm:space-x-2 border border-white/15 hover:border-white/30 bg-white/5 hover:bg-white/10 text-white text-[10px] sm:text-xs font-medium uppercase tracking-wider px-4 py-2.5 sm:px-8 sm:py-4 rounded-lg sm:rounded-xl transition-all duration-300 active:scale-[0.98] whitespace-nowrap backdrop-blur-sm"
            >
              <span>Ver Demonstração</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
          </div>

          {/* Social proof mínimo */}
          <p className="text-[11px] text-slate-600 font-medium">
            Sem cartão de crédito · Configuração em menos de 5 minutos · Cancele quando quiser
          </p>

        </div>
      </section>

      <Footer onB2bClick={() => setB2bModalOpen(true)} />

      {b2bModalOpen && <B2bModal onClose={() => setB2bModalOpen(false)} />}

    </div>
  );
}
