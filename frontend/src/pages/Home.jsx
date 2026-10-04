import { Link } from "react-router-dom"
import { ArrowRight, Check, ChevronDown, CircleHelp, MessageCircle, Package, Palette, Play, ShieldCheck, ShoppingBag, Smartphone, Sparkles, Store, Zap } from "lucide-react"

const recursos = [
  { Icone: Package, titulo: "Produtos organizados", texto: "Apresente fotos, preços, descrições e categorias em um catálogo fácil de navegar." },
  { Icone: ShoppingBag, titulo: "Carrinho simples", texto: "Seus clientes escolhem os produtos e conferem o pedido antes de enviar." },
  { Icone: MessageCircle, titulo: "Pedido no WhatsApp", texto: "O pedido é preparado em uma mensagem e enviado diretamente para sua loja." },
  { Icone: Palette, titulo: "Sua identidade", texto: "Use sua logo, banner e cor para deixar a loja com a cara do seu negócio." },
  { Icone: Zap, titulo: "Fácil de atualizar", texto: "Cadastre produtos e promoções pelo painel, sem depender de suporte técnico." },
  { Icone: ShieldCheck, titulo: "Acesso separado", texto: "Sua loja e seus produtos ficam ligados à sua conta de administrador." },
]

const perguntas = [
  ["Preciso saber programar?", "Não. Você cria a conta, configura a loja e gerencia produtos pelo painel."],
  ["Como recebo os pedidos?", "O cliente monta o pedido no catálogo e abre uma conversa no WhatsApp da sua loja com os itens organizados."],
  ["Posso personalizar a loja?", "Sim. Você pode definir a cor principal e adicionar logo e banner nas configurações disponíveis."],
  ["Como compartilho meu catálogo?", "Cada loja tem um endereço próprio. Copie o link no onboarding ou no painel e envie aos clientes."],
]

function Home() {
  return (
    <main className="overflow-hidden bg-white text-slate-950">
      <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[68px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5 text-slate-950 no-underline"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white"><Store size={18} /></span><span className="font-semibold tracking-tight">Catálogo Digital</span></Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 md:flex"><a href="#recursos" className="transition hover:text-green-800">Recursos</a><a href="#como-funciona" className="transition hover:text-green-800">Como funciona</a><a href="#faq" className="transition hover:text-green-800">Dúvidas</a></nav>
          <div className="flex items-center gap-2 sm:gap-3"><Link to="/login" className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-100 sm:px-4">Entrar</Link><Link to="/cadastro" className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-3.5 py-2.5 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-green-800 sm:px-4">Criar loja grátis <ArrowRight size={15} /></Link></div>
        </div>
      </header>

      <section className="relative isolate">
        <div className="absolute -right-40 top-0 -z-10 h-[540px] w-[540px] rounded-full bg-green-100/80 blur-3xl" />
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-900"><Sparkles size={14} /> Sua vitrine online, sem complicação</span>
            <h1 className="mt-6 max-w-2xl text-4xl font-bold leading-[1.06] tracking-[-.045em] sm:text-5xl lg:text-[3.65rem]">Sua loja online. Simples, profissional e pronta para vender.</h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-slate-600 sm:text-lg">Crie seu catálogo digital, compartilhe com seus clientes e receba pedidos diretamente pelo WhatsApp.</p>
            <div className="mt-8 flex flex-wrap gap-3"><Link to="/cadastro" className="inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white no-underline shadow-lg shadow-green-900/10 transition hover:-translate-y-0.5 hover:bg-green-800">Criar minha loja grátis <ArrowRight size={17} /></Link><a href="#exemplo" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 no-underline transition hover:border-slate-300 hover:bg-slate-50"><Play size={15} /> Ver demonstração</a></div>
            <div className="mt-7 flex flex-wrap gap-x-5 gap-y-2 text-xs font-medium text-slate-500"><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-green-700" /> Sem mensalidade</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-green-700" /> Link próprio da loja</span><span className="inline-flex items-center gap-1.5"><Check size={14} className="text-green-700" /> Fácil de usar</span></div>
          </div>

          <div id="exemplo" className="relative mx-auto w-full max-w-[470px] scroll-mt-24">
            <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-br from-green-100 via-emerald-50 to-amber-50 blur-xl" />
            <div className="relative mx-auto max-w-[340px] rounded-[2.5rem] border-[9px] border-slate-900 bg-white p-2 shadow-[0_35px_90px_-38px_rgba(15,23,42,.42)]">
              <div className="overflow-hidden rounded-[1.9rem] bg-white">
                <div className="flex items-center justify-between bg-white px-4 py-3"><div className="flex items-center gap-2.5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-50 text-green-800"><Store size={17} /></div><div><p className="text-xs font-bold">Mercadinho do João</p><p className="text-[10px] text-slate-500">Catálogo da loja</p></div></div><span className="flex h-8 w-8 items-center justify-center rounded-full bg-green-50 text-green-700"><MessageCircle size={15} /></span></div>
                <div className="relative h-32 overflow-hidden bg-gradient-to-br from-green-800 to-emerald-600 p-4"><div className="absolute -right-4 -top-8 h-32 w-32 rounded-full border-[18px] border-white/10" /><p className="relative mt-9 text-lg font-bold text-white">Feito para o seu dia</p></div>
                <div className="flex gap-2 overflow-hidden px-3 py-3">{["Todos", "Bebidas", "Mercearia"].map((item, i) => <span key={item} className={`whitespace-nowrap rounded-full px-3 py-1.5 text-[10px] font-semibold ${i === 0 ? "bg-green-700 text-white" : "bg-slate-100 text-slate-600"}`}>{item}</span>)}</div>
                <div className="grid grid-cols-2 gap-2.5 px-3 pb-3">{[{ nome: "Suco natural", preco: "R$ 8,90", cor: "from-orange-100 to-amber-50" }, { nome: "Pão artesanal", preco: "R$ 12,00", cor: "from-yellow-100 to-orange-50" }].map(item => <div key={item.nome} className="overflow-hidden rounded-2xl border border-slate-100 bg-white"><div className={`flex h-24 items-center justify-center bg-gradient-to-br ${item.cor}`}><ShoppingBag className="text-slate-500/70" size={28} /></div><div className="p-2.5"><p className="text-[11px] font-semibold">{item.nome}</p><div className="mt-2 flex items-center justify-between"><span className="text-[11px] font-bold text-green-800">{item.preco}</span><span className="flex h-6 w-6 items-center justify-center rounded-lg bg-green-700 text-white">+</span></div></div></div>)}</div>
                <div className="mx-3 mb-3 flex items-center justify-between rounded-xl bg-green-700 px-3 py-2.5 text-white"><span className="text-[10px] font-semibold">3 itens · R$ 28,90</span><span className="inline-flex items-center gap-1 text-[10px] font-semibold">Ver pedido <ArrowRight size={12} /></span></div>
              </div>
            </div>
            <div className="absolute -left-4 top-20 hidden items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 shadow-lg sm:flex"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-green-50 text-green-700"><Smartphone size={16} /></span>Pronta para celular</div>
            <div className="absolute -right-3 bottom-16 hidden items-center gap-2 rounded-2xl border border-slate-100 bg-white px-3.5 py-3 text-xs font-semibold text-slate-700 shadow-lg sm:flex"><span className="flex h-8 w-8 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><MessageCircle size={16} /></span>Pedido pelo WhatsApp</div>
          </div>
        </div>
      </section>

      <section id="como-funciona" className="border-y border-slate-100 bg-[#f8faf9] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto max-w-7xl"><div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-[.18em] text-green-800">Do cadastro ao primeiro pedido</p><h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Comece em três passos</h2><p className="mt-3 text-sm leading-6 text-slate-600 sm:text-base">Sem ferramentas complicadas. Sua loja fica pronta para compartilhar.</p></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">{[{ n: "01", titulo: "Crie sua loja", texto: "Defina o nome, a identidade visual e o WhatsApp de atendimento.", Icone: Store }, { n: "02", titulo: "Monte seu catálogo", texto: "Adicione produtos, organize categorias e destaque promoções.", Icone: Package }, { n: "03", titulo: "Compartilhe e venda", texto: "Envie o link aos clientes e receba o pedido pronto no WhatsApp.", Icone: MessageCircle }].map(item => <article key={item.n} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex items-center justify-between"><span className="text-sm font-bold text-green-800">{item.n}</span><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-50 text-green-800"><item.Icone size={18} /></span></div><h3 className="mt-5 text-lg font-semibold">{item.titulo}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.texto}</p></article>)}</div>
        </div>
      </section>

      <section id="recursos" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-green-800">Feito para o dia a dia</p><h2 className="mt-3 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">Tudo que sua loja precisa para começar</h2></div><p className="max-w-md text-sm leading-6 text-slate-600">Uma experiência simples para você gerenciar e para seu cliente comprar.</p></div>
        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{recursos.map(item => <article key={item.titulo} className="rounded-2xl border border-slate-200 p-5 transition hover:-translate-y-0.5 hover:border-green-200 hover:shadow-lg hover:shadow-green-900/5"><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-800"><item.Icone size={19} /></span><h3 className="mt-4 font-semibold">{item.titulo}</h3><p className="mt-2 text-sm leading-6 text-slate-600">{item.texto}</p></article>)}</div>
      </section>

      <section className="bg-[#10261b] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-10 lg:grid-cols-2"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-green-300">Pedidos sem complicação</p><h2 className="mt-3 max-w-xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl">Seu cliente monta o pedido. Você recebe no WhatsApp.</h2><p className="mt-4 max-w-lg text-sm leading-6 text-slate-300">Produtos e quantidades chegam organizados em uma mensagem, prontos para você continuar o atendimento.</p><Link to="/cadastro" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-semibold text-green-950 no-underline transition hover:bg-green-400">Quero criar minha loja <ArrowRight size={16} /></Link></div>
          <div className="mx-auto w-full max-w-md rounded-3xl border border-white/10 bg-white/5 p-4 shadow-2xl backdrop-blur"><div className="rounded-2xl bg-[#e9f5ec] p-4 text-slate-900"><div className="mb-4 flex items-center gap-2 text-sm font-semibold text-green-900"><MessageCircle size={17} /> Pedido da sua loja</div><div className="rounded-2xl rounded-tl-sm bg-white p-4 text-sm leading-6 shadow-sm"><p className="font-semibold">Olá! Quero fazer um pedido:</p><p className="mt-2 text-slate-600">2x Suco natural — R$ 17,80<br />1x Pão artesanal — R$ 12,00</p><p className="mt-3 border-t border-slate-100 pt-3 font-bold">Total: R$ 29,80</p></div><p className="mt-3 text-right text-[10px] text-slate-500">Enviado pelo catálogo</p></div></div>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-[#f8faf9] px-4 py-16 sm:px-6 lg:px-8 lg:py-20">
        <div className="mx-auto grid max-w-7xl items-center gap-8 lg:grid-cols-[.8fr_1.2fr]"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-green-800">Comece sem risco</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Um plano simples para sua loja.</h2><p className="mt-3 max-w-md text-sm leading-6 text-slate-600">Crie seu catálogo gratuitamente e coloque sua loja online sem mensalidade.</p></div><div className="rounded-3xl border border-green-200 bg-white p-6 shadow-sm sm:p-8"><div className="flex flex-wrap items-start justify-between gap-4"><div><span className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-800">Para começar</span><h3 className="mt-3 text-xl font-bold">Catálogo Digital</h3><p className="mt-1 text-sm text-slate-500">Tudo que você precisa para compartilhar seus produtos.</p></div><p className="text-2xl font-bold text-green-800">Grátis<span className="block text-xs font-medium text-slate-500">sem mensalidade</span></p></div><div className="my-6 h-px bg-slate-100" /><ul className="grid gap-3 text-sm text-slate-700 sm:grid-cols-2">{["Link próprio da loja", "Cadastro de produtos e categorias", "Carrinho e pedido pelo WhatsApp", "Personalização de cor e imagens"].map(item => <li key={item} className="flex items-center gap-2"><Check size={15} className="shrink-0 text-green-700" />{item}</li>)}</ul><Link to="/cadastro" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-green-700 px-5 py-3 text-sm font-semibold text-white no-underline transition hover:bg-green-800">Criar minha loja grátis <ArrowRight size={16} /></Link></div></div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[.8fr_1.2fr] lg:px-8 lg:py-20">
        <div><span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-800"><CircleHelp size={20} /></span><p className="mt-5 text-xs font-bold uppercase tracking-[.18em] text-green-800">Dúvidas frequentes</p><h2 className="mt-3 text-3xl font-bold tracking-tight">Tudo claro antes de começar.</h2><p className="mt-3 text-sm leading-6 text-slate-600">Veja como funciona o catálogo e o envio de pedidos pelo WhatsApp.</p></div>
        <div id="faq" className="scroll-mt-24 divide-y divide-slate-200">{perguntas.map(([pergunta, resposta]) => <details key={pergunta} className="group py-5"><summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-slate-900"><span>{pergunta}</span><ChevronDown size={18} className="shrink-0 text-slate-400 transition group-open:rotate-180" /></summary><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600">{resposta}</p></details>)}</div>
      </section>

      <section className="px-4 pb-16 sm:px-6 lg:px-8 lg:pb-20"><div className="mx-auto flex max-w-7xl flex-col items-start justify-between gap-6 rounded-3xl bg-green-50 p-7 sm:p-10 md:flex-row md:items-center"><div><p className="text-xs font-bold uppercase tracking-[.18em] text-green-800">Sua próxima venda começa aqui</p><h2 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">Coloque sua loja online hoje.</h2><p className="mt-2 text-sm text-slate-600">Crie seu catálogo e compartilhe o link com seus clientes.</p></div><Link to="/cadastro" className="inline-flex shrink-0 items-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white no-underline shadow-sm transition hover:bg-green-800">Criar minha loja grátis <ArrowRight size={16} /></Link></div></section>

      <footer className="border-t border-slate-100 px-4 py-7 sm:px-6 lg:px-8"><div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row"><Link to="/" className="flex items-center gap-2 text-sm font-semibold text-slate-800 no-underline"><span className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-700 text-white"><Store size={14} /></span>Catálogo Digital</Link><p className="text-xs text-slate-500">© {new Date().getFullYear()} Catálogo Digital · Feito para pequenos negócios.</p><div className="flex gap-4 text-xs font-medium text-slate-500"><Link to="/login" className="no-underline hover:text-green-800">Entrar</Link><Link to="/cadastro" className="no-underline hover:text-green-800">Criar loja</Link></div></div></footer>
    </main>
  )
}

export default Home
