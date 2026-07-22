import { Link } from "react-router-dom"
import { ShoppingCart, MessageCircle, Palette, Zap, Store, LayoutGrid, Package, Tag, Star, Link as LinkIcon, Settings, ChevronRight, Check } from "lucide-react"

function LandingPage() {

  const beneficios = [
    { icone: <LayoutGrid size={22} />, titulo: "Catálogo online", desc: "Exiba todos os seus produtos organizados por categoria com fotos e preços." },
    { icone: <ShoppingCart size={22} />, titulo: "Carrinho de compras", desc: "Clientes adicionam produtos e fecham o pedido com um clique." },
    { icone: <MessageCircle size={22} />, titulo: "Pedidos pelo WhatsApp", desc: "Cada pedido chega direto no seu WhatsApp já formatado e pronto." },
    { icone: <Palette size={22} />, titulo: "Personalização", desc: "Escolha as cores e adicione o logo da sua loja para ter identidade própria." },
    { icone: <Zap size={22} />, titulo: "Fácil de usar", desc: "Configure sua loja em minutos, sem precisar de conhecimento técnico." },
    { icone: <Store size={22} />, titulo: "Multi-lojas", desc: "Cada loja tem sua própria URL exclusiva e painel administrativo separado." },
  ]

  const recursos = [
    { icone: <Package size={18} />, texto: "Cadastro de produtos" },
    { icone: <LayoutGrid size={18} />, texto: "Categorias" },
    { icone: <Tag size={18} />, texto: "Promoções" },
    { icone: <Star size={18} />, texto: "Logo personalizada" },
    { icone: <Palette size={18} />, texto: "Tema personalizado" },
    { icone: <Settings size={18} />, texto: "Painel administrativo" },
    { icone: <MessageCircle size={18} />, texto: "Pedidos rápidos" },
    { icone: <LinkIcon size={18} />, texto: "Link exclusivo da loja" },
  ]

  const passos = [
    { num: "01", titulo: "Crie sua loja", desc: "Cadastre o nome, logo e cores da sua loja em menos de 2 minutos." },
    { num: "02", titulo: "Cadastre seus produtos", desc: "Adicione fotos, preços, categorias e promoções pelo painel admin." },
    { num: "03", titulo: "Compartilhe e venda", desc: "Envie o link pelo WhatsApp e receba pedidos direto no seu celular." },
  ]

  return (
    <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", color: "#0f0f0f", background: "#ffffff", overflowX: "hidden" }}>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        .btn-primary { background: #0f0f0f; color: #fff; padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; cursor: pointer; border: none; }
        .btn-primary:hover { background: #333; }
        .btn-secondary { background: transparent; color: #0f0f0f; padding: 12px 24px; border-radius: 10px; font-size: 15px; font-weight: 500; text-decoration: none; display: inline-flex; align-items: center; gap: 8px; border: 1.5px solid #e2e2e2; transition: border-color 0.15s, background 0.15s; }
        .btn-secondary:hover { border-color: #aaa; background: #fafafa; }
        .card { background: #fafafa; border: 1px solid #f0f0f0; border-radius: 16px; padding: 28px; }
        .recurso-chip { display: flex; align-items: center; gap: 10px; background: #fafafa; border: 1px solid #f0f0f0; border-radius: 10px; padding: 14px 18px; font-size: 14px; color: #333; }
        .recurso-chip svg { color: #555; flex-shrink: 0; }
        .tag { display: inline-flex; align-items: center; gap: 6px; background: #f0fdf4; border: 1px solid #bbf7d0; color: #15803d; font-size: 12px; font-weight: 500; padding: 4px 12px; border-radius: 999px; }
        .tag-dot { width: 6px; height: 6px; background: #22c55e; border-radius: 50%; }
        .mockup-phone { width: 220px; background: #0f0f0f; border-radius: 36px; padding: 12px; box-shadow: 0 40px 80px rgba(0,0,0,0.18); position: relative; flex-shrink: 0; }
        .mockup-screen { background: #fff; border-radius: 26px; overflow: hidden; }
        .mockup-bar { background: #f4f4f5; padding: 10px 14px; display: flex; align-items: center; gap: 8px; }
        .mockup-dot { width: 8px; height: 8px; background: #22c55e; border-radius: 50%; }
        .mockup-produto { display: flex; gap: 10px; padding: 10px 14px; border-bottom: 1px solid #f4f4f5; align-items: center; }
        .mockup-img { width: 44px; height: 44px; border-radius: 8px; flex-shrink: 0; }
        .check-item { display: flex; align-items: flex-start; gap: 10px; font-size: 15px; color: #444; line-height: 1.5; }
        .check-icon { width: 20px; height: 20px; background: #f0fdf4; border-radius: 50%; display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px; }
      `}</style>

      {/* NAV */}
      <nav style={{ position: "sticky", top: 0, zIndex: 100, background: "rgba(255,255,255,0.92)", backdropFilter: "blur(12px)", borderBottom: "1px solid #f0f0f0", padding: "0 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: 60 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#0f0f0f", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Store size={16} color="#fff" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 15 }}>Catálogo Digital</span>
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <Link to="/login" className="btn-secondary" style={{ padding: "8px 18px", fontSize: 14 }}>Entrar</Link>
            <Link to="/cadastro" className="btn-primary" style={{ padding: "8px 18px", fontSize: 14 }}>Criar loja grátis</Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "100px 24px 80px", display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
        <div style={{ flex: "1 1 440px", minWidth: 0 }}>
          <div className="tag" style={{ marginBottom: 24 }}>
            <span className="tag-dot"></span>
            100% gratuito para começar
          </div>
          <h1 style={{ fontSize: "clamp(36px, 5vw, 58px)", fontWeight: 600, lineHeight: 1.1, letterSpacing: "-0.03em", marginBottom: 20, color: "#0f0f0f" }}>
            Seu catálogo<br />online em minutos.
          </h1>
          <p style={{ fontSize: 18, color: "#666", lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
            Monte sua loja digital, cadastre produtos e receba pedidos direto no WhatsApp. Sem mensalidade, sem complicação.
          </p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link to="/cadastro" className="btn-primary">
              Criar minha loja <ChevronRight size={16} />
            </Link>
            <Link to="/login" className="btn-secondary">
              Já tenho uma loja
            </Link>
          </div>
          <div style={{ display: "flex", gap: 24, marginTop: 40, flexWrap: "wrap" }}>
            {["Sem cartão de crédito", "Pronto em 2 minutos", "Link exclusivo"].map(txt => (
              <div key={txt} className="check-item" style={{ fontSize: 13 }}>
                <div className="check-icon"><Check size={11} color="#16a34a" strokeWidth={3} /></div>
                {txt}
              </div>
            ))}
          </div>
        </div>

        {/* MOCKUP */}
        <div style={{ flex: "1 1 280px", display: "flex", justifyContent: "center", position: "relative" }}>
          <div style={{ position: "absolute", width: 320, height: 320, background: "radial-gradient(circle, #f0fdf4 0%, transparent 70%)", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 0 }}></div>
          <div className="mockup-phone" style={{ position: "relative", zIndex: 1 }}>
            <div className="mockup-screen">
              <div className="mockup-bar">
                <div className="mockup-dot"></div>
                <span style={{ fontSize: 11, color: "#555", fontWeight: 500 }}>Mercadinho do João</span>
              </div>
              <div style={{ padding: "10px 14px 6px", background: "#f0fdf4" }}>
                <span style={{ fontSize: 11, fontWeight: 600, color: "#15803d" }}>🛒 Bebidas</span>
              </div>
              {[
                { nome: "Coca-Cola 2L", preco: "R$ 8,90", cor: "#fee2e2" },
                { nome: "Suco de Uva", preco: "R$ 6,50", cor: "#fef9c3" },
                { nome: "Água Mineral", preco: "R$ 2,00", cor: "#e0f2fe" },
              ].map((p, i) => (
                <div key={i} className="mockup-produto">
                  <div className="mockup-img" style={{ background: p.cor }}></div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ fontSize: 12, fontWeight: 500, color: "#0f0f0f" }}>{p.nome}</p>
                    <p style={{ fontSize: 11, color: "#22c55e", fontWeight: 600 }}>{p.preco}</p>
                  </div>
                  <div style={{ width: 22, height: 22, background: "#0f0f0f", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#fff", fontSize: 14, lineHeight: 1 }}>+</span>
                  </div>
                </div>
              ))}
              <div style={{ padding: "12px 14px" }}>
                <div style={{ background: "#22c55e", borderRadius: 8, padding: "10px", textAlign: "center" }}>
                  <span style={{ fontSize: 12, color: "#fff", fontWeight: 600 }}>Enviar pedido pelo WhatsApp</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFÍCIOS */}
      <section style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Para qualquer negócio</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, letterSpacing: "-0.02em" }}>Tudo que você precisa para vender online</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 20 }}>
            {beneficios.map((b, i) => (
              <div key={i} className="card">
                <div style={{ width: 40, height: 40, background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, color: "#16a34a" }}>
                  {b.icone}
                </div>
                <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8 }}>{b.titulo}</h3>
                <p style={{ fontSize: 14, color: "#666", lineHeight: 1.6 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ textAlign: "center", marginBottom: 56 }}>
          <p style={{ fontSize: 13, fontWeight: 500, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Simples assim</p>
          <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, letterSpacing: "-0.02em" }}>Como funciona</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 32 }}>
          {passos.map((p, i) => (
            <div key={i} style={{ position: "relative" }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#ccc", letterSpacing: "0.04em", display: "block", marginBottom: 16 }}>{p.num}</span>
              <div style={{ width: 2, height: 32, background: "#f0f0f0", marginBottom: 16 }}></div>
              <h3 style={{ fontSize: 20, fontWeight: 600, marginBottom: 10, letterSpacing: "-0.01em" }}>{p.titulo}</h3>
              <p style={{ fontSize: 15, color: "#666", lineHeight: 1.6 }}>{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* RECURSOS */}
      <section style={{ background: "#fafafa", borderTop: "1px solid #f0f0f0", borderBottom: "1px solid #f0f0f0", padding: "80px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 12 }}>Funcionalidades</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 38px)", fontWeight: 600, letterSpacing: "-0.02em" }}>Tudo incluso, sem custo extra</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {recursos.map((r, i) => (
              <div key={i} className="recurso-chip">
                {r.icone}
                <span>{r.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* QUEM É PARA */}
      <section style={{ maxWidth: 1100, margin: "0 auto", padding: "80px 24px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 64, flexWrap: "wrap" }}>
          <div style={{ flex: "1 1 380px" }}>
            <p style={{ fontSize: 13, fontWeight: 500, color: "#888", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 16 }}>Para quem é</p>
            <h2 style={{ fontSize: "clamp(26px, 4vw, 36px)", fontWeight: 600, letterSpacing: "-0.02em", marginBottom: 20, lineHeight: 1.2 }}>Para qualquer pequeno negócio</h2>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7, marginBottom: 24 }}>
              Mercados, lanchonetes, pizzarias, padarias, açougues, adegas, distribuidoras, lojas de roupa — qualquer comércio que ainda envia preços pelo WhatsApp manualmente.
            </p>
            <p style={{ fontSize: 16, color: "#666", lineHeight: 1.7 }}>
              O cliente acessa o link, escolhe os produtos e envia o pedido. Simples para ele, prático para você.
            </p>
          </div>
          <div style={{ flex: "1 1 340px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {["Mercadinhos", "Lanchonetes", "Pizzarias", "Padarias", "Açougues", "Adegas", "Distribuidoras", "Lojas de roupa"].map((item, i) => (
              <div key={i} style={{ background: "#fafafa", border: "1px solid #f0f0f0", borderRadius: 10, padding: "12px 16px", fontSize: 14, color: "#444", display: "flex", alignItems: "center", gap: 8 }}>
                <Check size={14} color="#22c55e" strokeWidth={2.5} />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: "80px 24px" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", background: "#0f0f0f", borderRadius: 24, padding: "64px 48px", textAlign: "center" }}>
          <h2 style={{ fontSize: "clamp(28px, 4vw, 42px)", fontWeight: 600, color: "#fff", letterSpacing: "-0.02em", marginBottom: 16, lineHeight: 1.2 }}>
            Pronto para vender online?
          </h2>
          <p style={{ fontSize: 17, color: "#999", marginBottom: 36, lineHeight: 1.6 }}>
            Crie sua loja agora e comece a receber pedidos hoje mesmo. É gratuito.
          </p>
          <Link to="/cadastro" style={{ background: "#22c55e", color: "#fff", padding: "14px 32px", borderRadius: 12, fontSize: 16, fontWeight: 600, textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 8, transition: "background 0.15s" }}>
            Criar minha loja gratuitamente <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: "1px solid #f0f0f0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 24, height: 24, background: "#0f0f0f", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Store size={13} color="#fff" />
            </div>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Catálogo Digital</span>
          </div>
          <div style={{ display: "flex", gap: 24, fontSize: 14, color: "#888" }}>
            <Link to="/cadastro" style={{ color: "#888", textDecoration: "none" }}>Criar loja</Link>
            <Link to="/login" style={{ color: "#888", textDecoration: "none" }}>Entrar</Link>
          </div>
          <p style={{ fontSize: 13, color: "#bbb" }}>© 2026 Catálogo Digital</p>
        </div>
      </footer>

    </div>
  )
}

export default LandingPage
