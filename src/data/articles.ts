import { PRODUCT_URL } from '../config'

export interface Article {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  date: string
  content: string
  cta: string
  ctaLink: string
}

export const articles: Article[] = [
  {
    slug: 'como-organizar-chamados-de-manutencao-no-condominio',
    title: 'Como organizar chamados de manutenção no condomínio (sem enlouquecer)',
    excerpt: 'Se você é síndico, já deve ter passado por isso: o interfone toca, morador reclamando de uma lâmpada queimada. Depois WhatsApp, bilhete na portaria… No fim do mês, ninguém sabe o que foi resolvido.',
    category: 'Gestão',
    readTime: '4 min',
    date: '15 jun 2026',
    content: `
      <p>Se você é síndico, já deve ter passado por isso: o interfone toca, morador reclamando de uma lâmpada queimada no hall. Cinco minutos depois, WhatsApp. Mais tarde, um bilhete na portaria. No fim do mês, você não sabe o que foi resolvido e o que ficou perdido.</p>

      <p>Organizar manutenção de condomínio não precisa ser assim. Na verdade, o segredo é simples: tirar tudo do papel e do WhatsApp e centralizar num lugar só.</p>

      <h2>O problema do "jeito que sempre foi"</h2>

      <p>A maioria dos condomínios ainda funciona no improviso. O morador manda mensagem pra portaria, o porteiro anota num papel, o zelador dá uma olhada quando sobra tempo. Resultado: chamados duplicados, morador reclamando que "já avisei semana passada", e síndico tendo que apagar incêndio.</p>

      <p>Fora que WhatsApp mistura chamado de manutenção com "vou viajar e preciso de alguém pra regar as plantas". Vira bagunça.</p>

      <h2>O que funciona na prática</h2>

      <p>Ter um lugar único onde o morador abre o chamado e o gestor acompanha. O morador precisa conseguir:</p>

      <ul>
        <li>Dizer <strong>o que</strong> está quebrado</li>
        <li>Falar <strong>onde</strong> é</li>
        <li>Anexar uma foto (ninguém quer descrever "barulho estranho no elevador")</li>
        <li>Saber o status depois</li>
      </ul>

      <p>O gestor precisa:</p>

      <ul>
        <li>Ver todos os chamados de uma vez</li>
        <li>Saber o que está pendente, o que está sendo resolvido e o que já foi feito</li>
        <li>Poder passar o serviço pro zelador ou equipe</li>
      </ul>

      <h2>Um número que vale ouro</h2>

      <p>Ao organizar chamados digitalmente, o condomínio ganha visibilidade sobre prioridades, responsáveis e prazos. O resultado pode ser medido no próprio histórico da operação.</p>
    `,
    cta: 'Cansou de perder chamados no WhatsApp? O painel do Zelcon organiza tudo em 5 minutos. Teste grátis.',
    ctaLink: `${PRODUCT_URL}/cadastro`
  },
  {
    slug: 'achados-e-perdidos-guia-pratico-para-o-sindico-organizar',
    title: 'Achados e perdidos: guia prático para o síndico organizar',
    excerpt: 'Caixa de sapatos na portaria. Mochila esquecida no salão de festas. Chave de carro que ninguém reclama. O achados e perdidos de condomínio é sempre aquela bagunça que ninguém assume.',
    category: 'Organização',
    readTime: '3 min',
    date: '22 jun 2026',
    content: `
      <p>Caixa de sapatos na portaria. Mochila esquecida no salão de festas. Chave de carro que ninguém reclama. O achados e perdidos de condomínio é sempre aquela bagunça que ninguém assume, mas todo mundo reclama quando precisa.</p>

      <p>Organizar não é difícil, mas exige um mínimo de método.</p>

      <h2>O básico que funciona</h2>

      <p><strong>1. Registre tudo.</strong> Quando alguém entrega um objeto na portaria, anota: o que é, onde foi encontrado, data e quem entregou. Sem isso, vira "aquela chave que apareceu mês passado".</p>

      <p><strong>2. Dê visibilidade.</strong> O morador precisa saber que o objeto foi encontrado. Se ele não sabe que existe um achados e perdidos, ele simplesmente vai comprar outro. Colocar a lista num lugar acessível resolve.</p>

      <p><strong>3. Prazo de validade.</strong> Estabelece 30 dias para retirada. Depois disso, doe ou descarte. Não deixa acumular.</p>

      <p><strong>4. Entrega com responsabilidade.</strong> Só entrega o objeto pra quem descrever ele direito. "Perdi uma chave" não basta — qual chave? De que cor? Tem chaveiro?</p>

      <h2>O que a maioria erra</h2>

      <p>Achar que "é só uma caixa" resolve. Não resolve. Sem registro, você não sabe se o objeto é de ontem ou de 6 meses atrás. Sem visibilidade, o morador certo nunca vai buscar. Sem prazo, vira depósito.</p>

      <p>Digitalizar esse processo não é frescura — é a única forma de manter organizado sem depender da memória do porteiro.</p>
    `,
    cta: 'Quer organizar o achados e perdidos do seu condomínio sem papel? O Zelcon tem um módulo específico pra isso. Comece grátis.',
    ctaLink: `${PRODUCT_URL}/cadastro`
  },
  {
    slug: 'lgpd-para-condominios-o-que-o-sindico-precisa-saber',
    title: 'LGPD para condomínios: o que o síndico precisa saber em 2026',
    excerpt: 'Condomínio também coleta e trata dados pessoais — e pode ser multado se não tomar cuidado. Os principais vazamentos acontecem em lugares que você nem imagina.',
    category: 'LGPD',
    readTime: '4 min',
    date: '29 jun 2026',
    content: `
      <p>LGPD não é assunto só de empresa grande. Condomínio também coleta e trata dados pessoais — e pode ser multado se não tomar cuidado.</p>

      <h2>Onde o condomínio vaza dados sem perceber</h2>

      <p>Os principais vazamentos acontecem em lugares que você nem imagina:</p>

      <ul>
        <li><strong>Grupo de WhatsApp do condomínio.</strong> Toda vez que alguém posta "o morador do 302 reclama de barulho", está expondo dados de um morador pra dezenas de pessoas que não têm nada a ver com isso.</li>
        <li><strong>Lista de chamados na portaria.</strong> Papel com nome, apartamento e descrição do problema fica visível pra quem passa.</li>
        <li><strong>Planilha de moradores.</strong> Aquela listinha com nome, telefone, apartamento e placa do carro que todo mundo na administração tem acesso.</li>
      </ul>

      <h2>O que a lei realmente exige</h2>

      <ul>
        <li><strong>Coletar só o necessário.</strong> Não precisa do CPF do morador pra abrir um chamado de lâmpada queimada. Peça só o que realmente vai usar.</li>
        <li><strong>Controlar quem acessa.</strong> Só o síndico e o zelador precisam ver os detalhes do chamado — os outros moradores não.</li>
        <li><strong>Ter um canal de comunicação.</strong> O morador precisa saber como pedir pra excluir os dados dele se quiser.</li>
        <li><strong>Documentar.</strong> Se a ANPD bater na porta, você precisa provar que está seguindo as regras.</li>
      </ul>

      <h2>O risco real</h2>

      <p>Multas podem chegar a 2% do faturamento do condomínio. Mas o risco maior não é a multa — é o desgaste. Um morador que descobre que os dados dele estão expostos pode processar o condomínio e o síndico.</p>

      <h2>O que fazer hoje</h2>

      <ul>
        <li>Remove listas de moradores de lugares públicos</li>
        <li>Cria um processo claro pra tratar dados dos chamados</li>
        <li>Se usa ferramenta digital, verifica se ela é LGPD-compliant</li>
      </ul>
    `,
    cta: 'O Zelcon foi construído com LGPD em mente: morador não cria conta, não expõe dados, e o gestor controla quem vê o quê. Teste grátis.',
    ctaLink: `${PRODUCT_URL}/cadastro`
  },
  {
    slug: 'como-administradoras-de-condominio-podem-reduzir-custos',
    title: 'Como administradoras de condomínio podem reduzir custos operacionais',
    excerpt: 'Cada prédio da carteira gera um volume enorme de ligações, mensagens e demandas. Multiplica por 10, 20, 50 condomínios. O custo operacional vai lá em cima.',
    category: 'Administradoras',
    readTime: '4 min',
    date: '6 jul 2026',
    content: `
      <p>Se você trabalha com administração de condomínios, sabe: cada prédio da carteira gera um volume enorme de ligações, mensagens e demandas. Agora multiplica por 10, 20, 50 condomínios. O custo operacional vai lá em cima.</p>

      <h2>Onde o dinheiro está sendo desperdiçado</h2>

      <p><strong>1. Atendimento telefônico.</strong> Morador liga na administradora pra reportar uma lâmpada queimada. Sua equipe atende, anota, repassa pro zelador. Uma única solicitação simples consome 10 a 15 minutos de telefone e registro.</p>

      <p><strong>2. Retrabalho.</strong> "Já liguei semana passada e ninguém veio." Quantas vezes sua equipe ouve isso? Sem um registro centralizado, chamados se perdem e o morador liga de novo — e de novo.</p>

      <p><strong>3. Deslocamento desnecessário.</strong> Sua equipe vai até o condomínio pra avaliar um problema que poderia ter sido resolvido com uma foto e uma descrição clara.</p>

      <p><strong>4. Rotatividade de zelador.</strong> Quando um zelador sai, o histórico dos chamados vai junto porque estava tudo na cabeça dele.</p>

      <h2>O que reduz custo de verdade</h2>

      <p>O princípio é simples: <strong>quanto mais a ponta (morador) conseguir resolver sozinho, menos sua equipe central gasta.</strong></p>

      <ul>
        <li>Morador reporta direto pelo celular, com foto e local → sua equipe já recebe o chamado completo, sem precisar ligar de volta pra perguntar "onde é?"</li>
        <li>Síndico/zelador vê no painel, resolve e atualiza o status → morador acompanha sozinho → menos ligações cobrando resposta</li>
        <li>Histórico fica salvo → mesmo que troque o zelador, os chamados antigos continuam acessíveis</li>
      </ul>

      <h2>O ganho real</h2>

      <p>Uma administradora com muitos condomínios pode reduzir o tempo gasto procurando solicitações em canais diferentes. Não é substituir gente — é fazer a equipe gastar tempo com o que realmente importa.</p>
    `,
    cta: 'Quer reduzir custos operacionais na sua administradora? O Zelcon Corporate unifica todos os condomínios num painel só. Fale com um consultor.',
    ctaLink: `${PRODUCT_URL}/cadastro?plan=corporate`
  }
]
