import { MessageCircle, MapPin } from "lucide-react"

function Hero({ loja }) {

  const corPrimaria = loja?.tema?.corPrimaria || "#22c55e"

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;900&display=swap');
        .hero-btn { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 600; border: none; cursor: pointer; font-family: inherit; transition: opacity 0.15s, transform 0.15s; color: #fff; }
        .hero-btn:hover { opacity: 0.9; transform: translateY(-1px); }
        .hero-btn-outline { display: inline-flex; align-items: center; gap: 8px; padding: 12px 24px; border-radius: 12px; font-size: 15px; font-weight: 500; cursor: pointer; font-family: inherit; transition: all 0.15s; background: rgba(255,255,255,0.15); color: #fff; border: 1.5px solid rgba(255,255,255,0.3); backdrop-filter: blur(8px); text-decoration: none; }
        .hero-btn-outline:hover { background: rgba(255,255,255,0.25); }
      `}</style>

      <section style={{ position: "relative", minHeight: 380, display: "flex", alignItems: "flex-end", overflow: "hidden", fontFamily: "'Inter', -apple-system, sans-serif" }}>

        {/* FUNDO — banner com blur e overlay */}
        {loja?.banner ? (
          <div style={{
            position: "absolute", inset: 0,
            backgroundImage: `url(${loja.banner})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            filter: "blur(2px) brightness(0.45)",
            transform: "scale(1.05)"
          }} />
        ) : (
          <div style={{ position: "absolute", inset: 0, background: "#0f0f0f" }} />
        )}

        {/* GRADIENTE BOTTOM para transição suave */}
        <div style={{
          position: "absolute", inset: 0,
          background: "linear-gradient(to bottom, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.6) 100%)"
        }} />

        {/* CONTEÚDO */}
        <div style={{ position: "relative", zIndex: 10, width: "100%", maxWidth: 1100, margin: "0 auto", padding: "48px 24px 40px", display: "flex", alignItems: "flex-end", gap: 28, flexWrap: "wrap" }}>

          {/* LOGO */}
          {loja?.logo && (
            <div style={{ flexShrink: 0 }}>
              <img
                src={loja.logo}
                alt={loja.nome}
                style={{
                  width: 96, height: 96,
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "3px solid rgba(255,255,255,0.9)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.3)"
                }}
              />
            </div>
          )}

          {/* TEXTO */}
          <div style={{ flex: 1, minWidth: 0 }}>

            <h1 style={{
              fontSize: "clamp(28px, 5vw, 48px)",
              fontWeight: 900,
              color: "#fff",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              marginBottom: 8,
              textShadow: "0 2px 12px rgba(0,0,0,0.3)"
            }}>
              {loja?.nome}
            </h1>

            {loja?.contato?.whatsapp && (
              <div style={{ display: "flex", alignItems: "center", gap: 6, color: "rgba(255,255,255,0.7)", fontSize: 13, marginBottom: 20 }}>
                <MapPin size={13} />
                <span>Peça agora pelo WhatsApp</span>
              </div>
            )}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {loja?.contato?.whatsapp && (
                <a
                  href={`https://wa.me/${loja.contato.whatsapp}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hero-btn"
                  style={{ backgroundColor: "#25d366" }}
                >
                  <MessageCircle size={17} />
                  Pedir no WhatsApp
                </a>
              )}
            </div>

          </div>

        </div>

        {/* BARRA DE COR DA LOJA no rodapé */}
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0,
          height: 4,
          background: corPrimaria
        }} />

      </section>
    </>
  )
}

export default Hero
