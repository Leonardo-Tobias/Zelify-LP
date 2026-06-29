import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useMotionValue } from 'framer-motion';
import { 
  Building2, 
  QrCode, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,

  ArrowUpRight, 
  ChevronDown, 
  User, 
  Mail, 
  Sparkles,
  Check,
  Send,
  MessageSquare,
  X,
  Camera,
  Layers,
  Clock,
  MapPin,
  Zap,
  Shield,
  Eye
} from 'lucide-react';

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
  const ref = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.05, rootMargin: '0px 0px -50px 0px' }
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

  const effectClass = type === 'slide'
    ? (isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-[20px]')
    : (isVisible ? 'opacity-100' : 'opacity-0');

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

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [faqOpen, setFaqOpen] = useState<Record<number, boolean>>({});
  const [condoCount, setCondoCount] = useState(12);
  const [isAnnual, setIsAnnual] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);


  const { scrollY } = useScroll();
  const timelineRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start start", "end end"]
  });
  // Rastreia a progressão máxima de scroll alcançada para não retroceder as animações
  const maxScrollYProgress = useMotionValue(0);
  const [hasStep1Shown, setHasStep1Shown] = useState(false);
  const [hasStep2Shown, setHasStep2Shown] = useState(false);
  const [hasStep3Shown, setHasStep3Shown] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);
  
  // Arcos Hero: começam invisíveis e crescem progressivamente com o scroll
  const arcScale = useTransform(scrollY, [0, 600], [0.05, 3.5]);
  const arcOpacity = useTransform(scrollY, [0, 80, 500], [0, 0.7, 0.15]);
  const arcRotation = useTransform(scrollY, [0, 600], [0, 60]);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return;
      const rect = timelineRef.current.getBoundingClientRect();
      
      // Se passarmos do fim da seção (rolando para baixo), destrava a seção
      if (!isUnlocked && rect.bottom <= 1) {
        setIsUnlocked(true);
        const diff = Math.round(rect.height - (window.innerHeight * 1.05));
        window.scrollBy(0, -diff);
      }
      
      // Se subirmos de volta para cima do topo da seção, apenas destrava o scroll
      // mas NÃO reseta a animação — ela fica revelada até o usuário atualizar a página
      if (isUnlocked && rect.top >= window.innerHeight - 1) {
        setIsUnlocked(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isUnlocked]);

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest > maxScrollYProgress.get()) {
      maxScrollYProgress.set(latest);
    }
    if (latest >= 0.0) setHasStep1Shown(true);
    if (latest >= 0.40) setHasStep2Shown(true);
    if (latest >= 0.70) setHasStep3Shown(true);
  });
  
  // Mapeamento preciso da linha de progresso (utiliza a progressão máxima para ficar fixa)
  const scaleX = useTransform(
    maxScrollYProgress,
    [0.0, 0.4, 0.7, 1.0],
    [0.0, 0.5, 1.0, 1.0],
    { clamp: true }
  );

  // Animação de opacidade e posição por intervalo (fade-in acumulativo que não retrocede)
  const opacity1 = useTransform(maxScrollYProgress, [0.0, 0.2, 1.0], [0, 1, 1], { clamp: true });
  const opacity2 = useTransform(maxScrollYProgress, [0.0, 0.4, 0.6, 1.0], [0, 0, 1, 1], { clamp: true });
  const opacity3 = useTransform(maxScrollYProgress, [0.0, 0.7, 0.9, 1.0], [0, 0, 1, 1], { clamp: true });

  const y1 = useTransform(maxScrollYProgress, [0.0, 0.2, 1.0], [20, 0, 0], { clamp: true });
  const y2 = useTransform(maxScrollYProgress, [0.0, 0.4, 0.6, 1.0], [20, 20, 0, 0], { clamp: true });
  const y3 = useTransform(maxScrollYProgress, [0.0, 0.7, 0.9, 1.0], [20, 20, 0, 0], { clamp: true });

  // Círculos acesos reativos permanentes (não retrocedem)
  const isStep1Active = hasStep1Shown;
  const isStep2Active = hasStep2Shown;
  const isStep3Active = hasStep3Shown;

  const testimonials = [
    {
      text: "O Zelify reduziu em mais de 70% as ligações desnecessárias na portaria e o volume de mensagens no WhatsApp. Os moradores adoram a simplicidade do QR Code.",
      author: "Roberto Silva",
      role: "Síndico Profissional",
      details: "Gestão de 8 condomínios em SP",
      avatar: "RS"
    },
    {
      text: "Consigo relatar uma lâmpada queimada na garagem em menos de 10 segundos quando estou saindo para trabalhar. É incrivelmente prático!",
      author: "Carla Souza",
      role: "Moradora",
      details: "Residencial Jardim das Flores",
      avatar: "CS"
    },
    {
      text: "Receber as tarefas de manutenção organizadas em um painel Kanban mudou nossa rotina. Sei exatamente o que está pendente ou concluído.",
      author: "Julio Costa",
      role: "Zelador",
      details: "Edifício Itália",
      avatar: "JC"
    },
    {
      text: "Oferecer o Zelify como um portal de zeladoria digital nos ajudou a agregar valor e reter 3 grandes condomínios em nossa carteira corporativa.",
      author: "Mariana Dias",
      role: "Gerente Operacional",
      details: "Lello Administradora",
      avatar: "MD"
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
  let pricePerCondo = isAnnual ? 49 : 59;
  if (condoCount >= 16 && condoCount <= 50) {
    pricePerCondo = isAnnual ? 39 : 49;
  } else if (condoCount > 50) {
    pricePerCondo = isAnnual ? 29 : 39;
  }
  const totalPrice = condoCount * pricePerCondo;
  const [b2bModalOpen, setB2bModalOpen] = useState(false);
  const [b2bSubmitted, setB2bSubmitted] = useState(false);
  const [b2bName, setB2bName] = useState('');
  const [b2bEmail, setB2bEmail] = useState('');
  const [b2bCompany, setB2bCompany] = useState('');
  const [b2bPhone, setB2bPhone] = useState('');

  const toggleFaq = (index: number) => {
    setFaqOpen(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleB2bSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (b2bName && b2bEmail && b2bCompany) {
      setB2bSubmitted(true);
      setTimeout(() => {
        setB2bSubmitted(false);
        setB2bModalOpen(false);
        setB2bName('');
        setB2bEmail('');
        setB2bCompany('');
        setB2bPhone('');
      }, 3000);
    }
  };

  const faqItems = [
    {
      q: "O morador realmente não precisa baixar nada para usar?",
      a: "Não. O morador apenas aponta a câmera do celular para o QR Code fixado no prédio. O Zelify abre instantaneamente no navegador do smartphone (como uma página web leve), permitindo registrar a ocorrência com foto em menos de 20 segundos. Sem downloads, sem criação de contas, sem senhas."
    },
    {
      q: "Como o síndico ou o zelador ficam sabendo das novas ocorrências?",
      a: "O sistema centraliza tudo no Painel do Gestor em tempo real. Além disso, o Zelify envia alertas automáticos por e-mail e notificações configuráveis assim que um morador envia um novo relato, garantindo que nenhum vazamento ou lâmpada queimada passe despercebida."
    },
    {
      q: "Qualquer pessoa de fora do condomínio pode escanear o QR Code e enviar falsos chamados?",
      a: "Não. Para a segurança do prédio, cada condomínio possui um link exclusivo atrelado a um código de acesso rápido de 4 dígitos impresso no próprio adesivo do QR Code. Apenas quem tem acesso físico às áreas internas do prédio consegue visualizar e enviar o chamado."
    },
    {
      q: "Como funciona a cobrança em lote para as Administradoras de Condomínio?",
      a: "Oferecemos uma tabela progressiva extremamente vantajosa para administradoras que desejam incluir o Zelify em sua carteira de clientes, reduzindo o custo unitário por prédio à medida que o volume aumenta (variando de R$ 59 a R$ 39 mensais por condomínio ativo). A gestão financeira é unificada em uma única fatura mensal."
    },
    {
      q: "O Plano Starter Gratuito tem pegadinhas ou exige cartão de crédito?",
      a: "Não. O Plano Starter é 100% gratuito para 1 condomínio e serve para você validar o sistema na prática. Você pode usar todos os meses até atingir o teto de 15 chamados mensais. Não pedimos cartão de crédito no cadastro e você só faz o upgrade para o Plano Pro se e quando quiser liberar chamados ilimitados."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-[#001CFF]/10 selection:text-[#001CFF] scroll-smooth antialiased">
      
      {/* 2. NAVBAR */}
      <nav 
        style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
        className={`sticky top-0 z-40 w-full h-20 flex items-center transition-all ${
          isScrolled 
            ? 'bg-transparent border-transparent backdrop-blur-none shadow-none' 
            : 'bg-slate-50/80 backdrop-blur-md border-b border-slate-200/60'
        }`}
      >
        <div 
          style={{ transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)' }}
          className={`mx-auto flex items-center justify-between w-full px-6 transition-all ${
            isScrolled 
              ? 'bg-white/85 backdrop-blur-lg border border-slate-200/60 shadow-[0_12px_30px_rgba(0,28,255,0.04)] h-14 rounded-full max-w-5xl' 
              : 'bg-transparent border-transparent h-full rounded-none max-w-7xl'
          }`}
        >
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-slate-900">
              Zelify<span className="text-[#001CFF]">.</span>
            </span>
          </div>

          <div className="flex items-center space-x-5">
            <a 
              href="https://zelify.vercel.app/login"
              target="_blank"
              rel="noreferrer"
              className="text-xs font-medium text-slate-655 hover:text-[#001CFF] transition-colors cursor-pointer"
            >
              Entrar
            </a>
            <a 
              href="https://zelify.vercel.app/cadastro"
              target="_blank"
              rel="noreferrer"
              className={`bg-[#001CFF] hover:bg-[#0014CC] text-white text-xs font-semibold uppercase tracking-wider shadow-lg shadow-[#001CFF]/15 transition-all duration-300 active:scale-[0.98] cursor-pointer ${
                isScrolled ? 'px-3.5 py-1.5 rounded-lg' : 'px-4.5 py-2.5 rounded-xl'
              }`}
            >
              Testar Grátis
            </a>
          </div>
        </div>
      </nav>

      {/* 3. A. HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 border-b border-slate-200/60">
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
        
        <div className="max-w-4xl mx-auto px-6 flex flex-col items-center text-center space-y-8 relative z-10">
          
          <div className="inline-flex items-center space-x-2 bg-slate-200/50 border border-slate-250/60 px-3 py-1 rounded-full text-[11px] font-bold text-slate-700 uppercase tracking-widest animate-fade-in">
            <Sparkles className="w-3.5 h-3.5 text-[#001CFF]" />
            <span>O Futuro da Zeladoria Condominial</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 tracking-tight leading-[1.05] max-w-3xl">
            A gestão operacional do seu condomínio, <span className="animate-text-shine">direto no QR Code.</span>
          </h1>

          <p className="text-slate-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed max-w-2xl">
            Elimine o caos dos relatos perdidos no WhatsApp. Moradores notificam manutenções, achados e perdidos ou incidentes em 20 segundos, direto do navegador e sem precisar baixar nenhum aplicativo.
          </p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-2 w-full sm:w-auto">
            <a 
              href="https://zelify.vercel.app/cadastro"
              target="_blank"
              rel="noreferrer"
              className="bg-[#001CFF] hover:bg-[#0014CC] text-white text-xs font-semibold uppercase tracking-wider px-6 py-3.5 rounded-xl shadow-[0_8px_25px_rgba(0,28,255,0.18)] hover:shadow-[0_8px_25px_rgba(0,28,255,0.3)] transition-all text-center flex items-center justify-center space-x-2 active:scale-[0.98] cursor-pointer w-full sm:w-auto whitespace-nowrap"
            >
              <span>Testar Grátis</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <button 
              onClick={() => setB2bModalOpen(true)}
              className="border border-slate-300 hover:border-slate-800 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 text-xs font-medium uppercase tracking-wider px-6 py-3.5 rounded-xl transition-all text-center flex items-center justify-center active:scale-[0.98] cursor-pointer w-full sm:w-auto whitespace-nowrap"
            >
              Demonstração
            </button>
          </div>

          {/* Estatísticas & Benefícios Lado a Lado (Centralizados & Padronizados) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 md:gap-12 mt-12 pt-8 border-t border-slate-100 w-full max-w-4xl mx-auto">
            {/* Badge 1: 100% Transparência */}
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#001CFF]/8 text-[#001CFF] shrink-0 shadow-sm border border-[#001CFF]/15">
                <Eye className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-none">100% Transparência</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-1">Acompanhamento em tempo real.</p>
              </div>
            </div>

            {/* Badge 2: Rápido */}
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#001CFF]/8 text-[#001CFF] shrink-0 shadow-sm border border-[#001CFF]/15">
                <Zap className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-none">Rápido</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-1">Relatos em 20s, sem app.</p>
              </div>
            </div>

            {/* Badge 3: Seguro */}
            <div className="flex items-center space-x-3 text-left">
              <div className="w-10 h-10 rounded-full flex items-center justify-center bg-[#001CFF]/8 text-[#001CFF] shrink-0 shadow-sm border border-[#001CFF]/15">
                <Shield className="w-4.5 h-4.5" />
              </div>
              <div>
                <h4 className="font-bold text-slate-900 text-sm leading-none">Seguro</h4>
                <p className="text-[11px] text-slate-500 leading-tight mt-1">Histórico criptografado.</p>
              </div>
            </div>
          </div>

        </div>
      </section>



      {/* 3. B. SEÇÃO DE DEMONSTRAÇÃO DO PRODUTO */}
      <section className="py-20 md:py-28 bg-white border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-6">

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
                  alt="Painel administrativo Zelify — Mural de Ocorrências"
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
                  alt="Portal do morador Zelify — Interface mobile"
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
      <section className="py-24 md:py-36 border-b border-slate-200/60 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          <div className="max-w-4xl text-left space-y-4">
            <h2 className="text-3xl sm:text-4xl md:text-5xl tracking-tight text-slate-900 leading-tight">
              <span className="font-black">Soluções sob medida para </span>
              <span className="font-normal text-slate-700">condomínios individuais</span>
              <span className="font-black"> ou grandes carteiras.</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Card Síndicos Profissionais (Fundo Claro) */}
            <ScrollReveal className="flex flex-col h-full" delay={0}>
              <div className="bg-white border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
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
                        <div className="w-7 h-7 rounded-full bg-[#001CFF] flex items-center justify-center text-white text-xs font-black shrink-0">
                          CS
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[10px] font-black text-slate-900 leading-none">Carlos Santos</p>
                          <p className="text-[8px] text-slate-500 font-semibold mt-1">Síndico Profissional • Residencial Harmony</p>
                        </div>
                      </div>
                      <span className="text-[8px] bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                        Kanban Ativo
                      </span>
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
                    href="https://zelify.vercel.app/cadastro"
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
              <div className="bg-slate-900 border border-slate-800 text-white rounded-3xl p-8 sm:p-10 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group h-full">
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
                        <div className="w-7 h-7 rounded bg-blue-400/10 flex items-center justify-center text-blue-400 shrink-0">
                          <Building2 className="w-4 h-4" />
                        </div>
                        <div className="min-w-0 text-left">
                          <p className="text-[10px] font-black text-white leading-none">Lello Administradora</p>
                          <p className="text-[8px] text-slate-400 font-semibold mt-1">Gestão de Carteira • 12 Condomínios</p>
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
                      Reduza em até 40% a carga de atendimento telefônico da sua equipe. Agregue valor ao seu condomínio contratando uma plataforma moderna e garanta retenção máxima de sua carteira corporativa.
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
      <section ref={timelineRef} className="relative bg-white border-b border-slate-200/60" style={{ height: isUnlocked ? '105vh' : '300vh' }}>
        <div className={
          isUnlocked 
            ? 'relative w-full h-full flex flex-col justify-center py-16 bg-white z-10' 
            : 'sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-center py-16 bg-white z-10'
        }>
          <div className="max-w-7xl mx-auto w-full px-6 flex flex-col space-y-12">
            
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 w-full max-w-6xl mx-auto">
              
              {/* Linha guia de conexão no desktop */}
              <div className="hidden md:block absolute top-8 left-[16.67%] right-[16.67%] h-[3px] bg-slate-100 -translate-y-1/2 z-0 rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-[#001CFF] origin-left"
                  style={{ scaleX }}
                />
              </div>

              {/* Passo 01 Column */}
              <div className="flex flex-col items-center space-y-6">
                {/* Passo 01 Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-sm transition-all duration-500 z-10 border ${
                  isStep1Active 
                    ? 'bg-gradient-to-br from-[#001CFF] to-[#000AB3] border-[#001CFF] text-white shadow-[0_0_20px_rgba(0,28,255,0.25)]' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100/80 border-slate-200 text-slate-400'
                }`}>
                  01
                </div>

                {/* Card 1 */}
                <motion.div 
                  className="w-full flex flex-col items-center text-center space-y-6"
                  style={{ 
                    opacity: opacity1,
                    y: y1
                  }}
                >
                  <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 p-5 flex items-center justify-center relative overflow-hidden group-hover:border-[#001CFF]/20 transition-all duration-500">
                    <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'repeating-linear-gradient(90deg, #94a3b8 0px, transparent 1px, transparent 12px)', backgroundSize: '12px 12px' }}></div>
                    <div className="relative bg-white rounded-xl border border-slate-200 shadow-[0_8px_24px_rgba(0,0,0,0.08)] p-4 w-36 flex flex-col items-center space-y-2.5 transition-shadow duration-500">
                      <div className="flex items-center space-x-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#001CFF]"></div>
                        <span className="text-[9px] font-black text-[#001CFF] tracking-widest uppercase">Zelify.</span>
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
                      Adesivos do Zelify contendo link exclusivo e código de acesso são fixados em áreas de circulação como elevador e portaria.
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Passo 02 Column */}
              <div className="flex flex-col items-center space-y-6">
                {/* Passo 02 Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-sm transition-all duration-500 z-10 border ${
                  isStep2Active 
                    ? 'bg-gradient-to-br from-[#001CFF] to-[#000AB3] border-[#001CFF] text-white shadow-[0_0_20px_rgba(0,28,255,0.25)]' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100/80 border-slate-200 text-slate-400'
                }`}>
                  02
                </div>

                {/* Card 2 */}
                <motion.div 
                  className="w-full flex flex-col items-center text-center space-y-6"
                  style={{ 
                    opacity: opacity2,
                    y: y2
                  }}
                >
                  <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 p-5 flex items-center justify-center relative overflow-hidden transition-all duration-500">
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
                          <span className="text-[6px] font-black text-slate-900 tracking-wide">Zelify</span>
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

              {/* Passo 03 Column */}
              <div className="flex flex-col items-center space-y-6">
                {/* Passo 03 Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-black shadow-sm transition-all duration-500 z-10 border ${
                  isStep3Active 
                    ? 'bg-gradient-to-br from-[#001CFF] to-[#000AB3] border-[#001CFF] text-white shadow-[0_0_20px_rgba(0,28,255,0.25)]' 
                    : 'bg-gradient-to-br from-slate-50 to-slate-100/80 border-slate-200 text-slate-400'
                }`}>
                  03
                </div>

                {/* Card 3 */}
                <motion.div 
                  className="w-full flex flex-col items-center text-center space-y-6"
                  style={{ 
                    opacity: opacity3,
                    y: y3
                  }}
                >
                  <div className="w-full h-64 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/80 border border-slate-200/60 p-5 flex items-center justify-center relative overflow-hidden transition-all duration-500">
                    <div className="w-full max-w-[240px] bg-white border border-slate-200 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.06)] overflow-hidden transition-shadow duration-500">
                      <div className="px-3 py-2 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                        <div className="flex items-center space-x-1.5">
                          <Layers className="w-2.5 h-2.5 text-[#001CFF]" />
                          <span className="text-[7px] font-black text-slate-800 uppercase tracking-wider">Painel Kanban</span>
                        </div>
                        <div className="flex items-center space-x-0.5">
                          <div className="w-1 h-1 rounded-full bg-emerald-400"></div>
                          <span className="text-[5px] font-bold text-emerald-600">Ao vivo</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 divide-x divide-slate-100 min-h-[80px]">
                        <div className="p-2 space-y-1.5">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[5px] font-black text-amber-500 uppercase tracking-wider text-left">Pendentes</span>
                            <span className="text-[5px] font-bold text-amber-500 bg-amber-500/10 border border-amber-500/20 px-1.5 py-0.5 rounded-full">2</span>
                          </div>
                          <div className="bg-white border border-slate-150 rounded-lg p-1.5 shadow-sm space-y-1 hover:border-amber-200 transition-colors">
                            <div className="flex items-center justify-between">
                              <span className="text-[4px] font-bold text-amber-500 bg-amber-50 px-1 py-0.5 rounded uppercase">Urgente</span>
                              <Clock className="w-1.5 h-1.5 text-slate-300" />
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                            <div className="w-3/4 h-1 bg-slate-100 rounded-full"></div>
                            <div className="flex items-center space-x-0.5">
                              <MapPin className="w-1.5 h-1.5 text-slate-300" />
                              <span className="text-[4px] text-slate-400 font-medium">ElevadorSocial</span>
                            </div>
                          </div>
                          <div className="bg-white border border-slate-150 rounded-lg p-1.5 shadow-sm space-y-1">
                            <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                            <div className="w-2/3 h-1 bg-slate-100 rounded-full"></div>
                            <div className="flex items-center space-x-0.5">
                              <MapPin className="w-1.5 h-1.5 text-slate-300" />
                              <span className="text-[4px] text-slate-400 font-medium">Portaria</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-2 space-y-1.5 bg-emerald-50/30">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[5px] font-black text-emerald-500 uppercase tracking-wider text-left">Resolvidos</span>
                            <span className="text-[5px] font-bold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-full">3</span>
                          </div>
                          <div className="bg-white border border-emerald-100 rounded-lg p-1.5 shadow-sm space-y-1">
                            <div className="flex items-center justify-between">
                              <span className="text-[4px] font-bold text-emerald-650 bg-emerald-100 px-1 py-0.5 rounded uppercase">Concluído</span>
                              <CheckCircle2 className="w-2 h-2 text-emerald-500" />
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                            <div className="w-1/2 h-1 bg-slate-100 rounded-full"></div>
                          </div>
                          <div className="bg-white border border-emerald-100 rounded-lg p-1.5 shadow-sm space-y-1 opacity-70">
                            <div className="flex items-center justify-between">
                              <span className="text-[4px] font-bold text-emerald-650 bg-emerald-100 px-1 py-0.5 rounded uppercase">Concluído</span>
                              <CheckCircle2 className="w-2 h-2 text-emerald-500" />
                            </div>
                            <div className="w-full h-1 bg-slate-100 rounded-full"></div>
                            <div className="w-3/5 h-1 bg-slate-100 rounded-full"></div>
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

            </div>
          </div>
        </div>
      </section>
{/* SEÇÃO CARROSSEL DE COMENTÁRIOS (TESTIMONIALS) */}
      <section className="py-24 bg-gradient-to-b from-slate-50 to-slate-100/50 border-b border-slate-200/60 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-[#001CFF]/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-4xl mx-auto px-6 space-y-12 relative z-10">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
              O que quem usa o Zelify diz na prática
            </h2>
            <p className="text-slate-550 text-xs sm:text-sm font-semibold max-w-lg mx-auto">
              Moradores, zeladores e síndicos profissionais compartilham suas experiências reais com o ecossistema.
            </p>
          </div>

          {/* Testimonial Active Card */}
          <ScrollReveal type="fade" className="w-full">
            <div className="bg-white border border-slate-200/60 rounded-3xl p-8 sm:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.02)] relative flex flex-col justify-between min-h-[260px] transition-all duration-500 hover:shadow-[0_20px_50px_rgba(0,0,0,0.04)]">
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
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#001CFF] to-[#000AB3] flex items-center justify-center text-white text-xs font-black shadow-md shadow-[#001CFF]/15 uppercase">
                    {testimonials[currentTestimonial].avatar}
                  </div>
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
        </div>
      </section>

      {/* 3. E. TABELA DE PREÇOS (PRICING DE 3 COLUNAS) */}
      <section className="py-24 md:py-36 border-b border-slate-200/60 bg-slate-100/50">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
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
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/70 rounded-3xl p-8 flex flex-col justify-between shadow-[0_8px_30px_rgb(0,0,0,0.015)] hover:shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:-translate-y-1.5 hover:border-slate-300/80 transition-all duration-500 relative group">
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
                  href="https://zelify.vercel.app/cadastro"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center border-2 border-slate-900 hover:bg-slate-900 hover:text-white text-slate-900 text-xs font-medium uppercase tracking-wider py-4 rounded-xl transition-all duration-300 active:scale-[0.98] cursor-pointer shadow-sm hover:shadow-md"
                >
                  Começar Teste Gratuito
                </a>
              </div>
            </div>

            {/* PLANO PRO (MAIS POPULAR) */}
            <div className="bg-white border-2 border-[#001CFF] rounded-3xl p-8 flex flex-col justify-between shadow-[0_15px_45px_rgba(0,28,255,0.06)] hover:shadow-[0_25px_60px_rgba(0,28,255,0.12)] hover:-translate-y-2.5 transition-all duration-500 relative group">
              <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#001CFF] text-white border border-[#001CFF]/10 px-4.5 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest shadow-[0_4px_20px_rgba(0,28,255,0.3)] select-none">
                Mais Popular
              </div>
              
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-[#001CFF] uppercase tracking-widest">Controle Completo</span>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight flex items-center">
                    Zelify Pro
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
                  href="https://zelify.vercel.app/cadastro?plan=pro"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-[#001CFF] hover:bg-[#0014CC] text-white text-xs font-semibold uppercase tracking-wider py-4 rounded-xl shadow-[0_8px_30px_rgba(0,28,255,0.22)] hover:shadow-[0_12px_35px_rgba(0,28,255,0.35)] transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  Assinar Plano Pro
                </a>
              </div>
            </div>

            {/* PLANO CORPORATIVO (ADMINISTRADORAS) */}
            <div className="bg-[#0B0F19] border border-slate-800 text-white rounded-3xl p-8 flex flex-col justify-between shadow-lg hover:shadow-2xl hover:-translate-y-1.5 hover:border-slate-700 transition-all duration-500 relative group">
              <div className="space-y-6">
                <div className="space-y-1">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Múltiplos Prédios</span>
                  <h3 className="text-xl font-black uppercase tracking-tight text-white">Zelify Corporate</h3>
                </div>
                
                <div className="flex flex-col space-y-4">
                  <div className="space-y-1">
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
                      <span className="text-slate-400 text-xs font-semibold ml-1">/mês por prédio</span>
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
                  </div>

                  {/* Campo de entrada interativo */}
                  <div className="space-y-3 pt-2 bg-slate-950/40 border border-slate-800/60 p-4 rounded-2xl">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-350">
                      <label htmlFor="condo-qty" className="uppercase tracking-wider text-[9px] text-slate-400 font-extrabold">Qtd. de Prédios</label>
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
                      <span>100+</span>
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
                <a 
                  href="https://zelify.vercel.app/cadastro?plan=corporate"
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full text-center bg-white hover:bg-slate-100 text-slate-900 text-xs font-semibold uppercase tracking-wider py-4 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 active:scale-[0.98] cursor-pointer"
                >
                  Assinar Plano Corporate
                </a>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. F. PERGUNTAS FREQUENTES (FAQ ACCORDION) */}
      <section className="py-24 md:py-36 bg-white border-b border-slate-200/60">
        <div className="max-w-4xl mx-auto px-6 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">Perguntas Frequentes</h2>
            <p className="text-slate-500 text-xs sm:text-sm font-semibold">Tudo o que você precisa saber sobre o Zelify para começar a usar.</p>
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

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-16 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-8 items-start">
          
          {/* Col 1 */}
          <div className="md:col-span-6 space-y-4">
            <span className="text-2xl font-black tracking-tight">Zelify<span className="text-[#001CFF]">.</span></span>
            <p className="text-slate-450 text-xs max-w-sm font-semibold leading-relaxed">
              Simplificando a comunicação entre moradores e a zeladoria condominial com o uso inteligente de QR Codes. Sem aplicativo, sem burocracia.
            </p>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider pt-4">
              © {new Date().getFullYear()} Zelify. Todos os direitos reservados.
            </p>
          </div>

          {/* Col 2 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Links do Produto</h4>
            <ul className="space-y-2.5 text-xs text-slate-450 font-semibold">
              <li>
                <a href="https://zelify.vercel.app/login" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Entrar no Painel</a>
              </li>
              <li>
                <a href="https://zelify.vercel.app/cadastro" target="_blank" rel="noreferrer" className="hover:text-white transition-colors">Criar Novo Condomínio</a>
              </li>
              <li>
                <a href="#planos" className="hover:text-white transition-colors">Planos e Preços</a>
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Corporativo</h4>
            <ul className="space-y-2.5 text-xs text-slate-450 font-semibold">
              <li>
                <button onClick={() => setB2bModalOpen(true)} className="hover:text-white transition-colors text-left">Falar com Vendas B2B</button>
              </li>
              <li>
                <span className="text-slate-500 font-bold font-mono">contato@zelify.com.br</span>
              </li>
            </ul>
          </div>

        </div>
      </footer>

      {/* 4. MODAL DE SOLICITAÇÃO B2B */}
      {b2bModalOpen && (
        <div className="fixed inset-0 bg-slate-950/85 z-50 flex items-center justify-center p-4 backdrop-blur-md animate-fade-in">
          <div className="bg-white border border-slate-100 rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl relative animate-scale-in">
            {/* Close Button */}
            <button 
              onClick={() => setB2bModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-slate-600 bg-slate-50 hover:bg-slate-100 border border-slate-200/40 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 active:scale-95 cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Modal Body */}
            <div className="p-8">
              {/* Header section with badge */}
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
                    Preencha o formulário abaixo e retornaremos com nossa proposta comercial personalizada.
                  </p>
                </div>
              </div>

              {b2bSubmitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 rounded-2xl flex items-center justify-center mx-auto shadow-sm shadow-emerald-100/50">
                    <Check className="w-7 h-7 animate-pulse" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900 uppercase tracking-wide">Solicitação Enviada!</h4>
                  <p className="text-xs text-slate-550 font-semibold leading-relaxed max-w-xs mx-auto">
                    Entraremos em contato no e-mail informado nas próximas horas para apresentar a proposta ideal para sua carteira.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleB2bSubmit} className="space-y-4">
                  {/* Nome */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Nome Completo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <User className="w-4 h-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Roberto Silva"
                        value={b2bName}
                        onChange={(e) => setB2bName(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* E-mail */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      E-mail Corporativo
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Mail className="w-4 h-4 text-slate-400" />
                      </div>
                      <input 
                        type="email" 
                        required
                        placeholder="Ex: roberto@empresa.com.br"
                        value={b2bEmail}
                        onChange={(e) => setB2bEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Nome da Administradora */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      Nome da Administradora
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <Building2 className="w-4 h-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        required
                        placeholder="Ex: Administradora Viver Mais"
                        value={b2bCompany}
                        onChange={(e) => setB2bCompany(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Telefone */}
                  <div className="space-y-1.5">
                    <label className="block text-[9px] font-bold uppercase tracking-wider text-slate-400">
                      WhatsApp / Celular
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                        <MessageSquare className="w-4 h-4 text-slate-400" />
                      </div>
                      <input 
                        type="text" 
                        placeholder="Ex: (11) 99999-9999"
                        value={b2bPhone}
                        onChange={(e) => setB2bPhone(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/50 hover:bg-slate-55 focus:bg-white border border-slate-200/80 rounded-2xl text-xs text-slate-850 focus:outline-none focus:ring-4 focus:ring-[#001CFF]/10 focus:border-[#001CFF] font-semibold transition-all duration-200"
                      />
                    </div>
                  </div>

                  {/* Submit button */}
                  <button 
                    type="submit"
                    className="w-full bg-[#001CFF] hover:bg-[#0014CC] text-white py-3.5 rounded-2xl text-xs font-semibold uppercase tracking-wider shadow-lg shadow-blue-500/20 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center space-x-2 cursor-pointer mt-6"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Solicitar Contato</span>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
