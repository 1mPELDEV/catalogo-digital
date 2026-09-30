import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo, useRef } from "react"
import { useLoja } from "../hooks/useLoja"
import { gerarPaleta } from "../utils/paleta"
import { ShoppingCart, Store, LogOut, LayoutGrid, Menu, X, Shield } from "lucide-react"

function Navbar() {
  const [logado, setLogado] = useState(false)
  const [quantidade, setQuantidade] = useState(0)
  const [menuAberto, setMenuAberto] = useState(false)
  const menuRef = useRef(null)

  const location = useLocation()
  const navigate = useNavigate()

  const slugAtual = location.pathname.split("/")[1] || null
  const rotasInternas = ["admin", "login", "cadastro", "pedido", "master"]

  let slugDaLoja = null
  if (slugAtual && !rotasInternas.includes(slugAtual)) {
    slugDaLoja = slugAtual
  } else {
    slugDaLoja = localStorage.getItem("slugLoja")
  }

  const loja = useLoja(slugDaLoja)

  const paleta = useMemo(
    () => gerarPaleta(loja?.tema?.corPrimaria),
    [loja?.tema?.corPrimaria]
  )

  useEffect(() => {
    const token = localStorage.getItem("token")
    setLogado(!!token)
    const carrinho = JSON.parse(localStorage.getItem(`carrinho-${slugDaLoja}`)) || []
    setQuantidade(carrinho.length)
  }, [])

  useEffect(() => {
    const atualizar = () => {
      setLogado(!!localStorage.getItem("token"))
      const carrinho = JSON.parse(localStorage.getItem(`carrinho-${slugDaLoja}`)) || []
      setQuantidade(carrinho.length)
    }
    window.addEventListener("storage", atualizar)
    return () => window.removeEventListener("storage", atualizar)
  }, [slugDaLoja])

  // Fecha o menu ao trocar de rota
  useEffect(() => {
    setMenuAberto(false)
  }, [location.pathname])

  // Fecha o menu ao clicar fora
  useEffect(() => {
    if (!menuAberto) return
    const fora = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuAberto(false)
      }
    }
    document.addEventListener("mousedown", fora)
    document.addEventListener("touchstart", fora)
    return () => {
      document.removeEventListener("mousedown", fora)
      document.removeEventListener("touchstart", fora)
    }
  }, [menuAberto])

  const sair = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("slugLoja")
    setLogado(false)
    setMenuAberto(false)
    navigate("/login")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .nav-inner { max-width: 1100px; margin: 0 auto; padding: 0 24px; height: 60px; display: flex; align-items: center; justify-content: space-between; gap: 16px; }
        .nav-brand { display: flex; align-items: center; gap: 10px; text-decoration: none; min-width: 0; }
        .nav-brand-nome { font-size: 15px; font-weight: 600; letter-spacing: -0.01em; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; min-width: 0; }
        .nav-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .nav-link { font-size: 14px; font-weight: 500; text-decoration: none; padding: 6px 10px; border-radius: 8px; transition: background 0.15s; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
        .nav-link:hover { background: rgba(128,128,128,0.15); }
        .nav-btn-sair { font-size: 13px; font-weight: 500; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: background 0.15s; background: rgba(220,38,38,0.15); color: #ef4444; }
        .nav-btn-sair:hover { background: rgba(220,38,38,0.25); }
        .carrinho-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; text-decoration: none; padding: 6px 12px; border-radius: 8px; transition: background 0.15s; font-family: inherit; position: relative; }
        .carrinho-badge:hover { background: rgba(128,128,128,0.15); }
        .badge-count { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; background: #ef4444; color: #fff; }

        .nav-menu-wrap { position: relative; display: none; }
        .nav-menu-btn { display: inline-flex; align-items: center; justify-content: center; width: 36px; height: 36px; border-radius: 8px; border: none; cursor: pointer; background: transparent; transition: background 0.15s; }
        .nav-menu-btn:hover { background: rgba(128,128,128,0.15); }
        .nav-dropdown { position: absolute; top: calc(100% + 10px); right: 0; min-width: 180px; border-radius: 12px; padding: 6px; display: flex; flex-direction: column; gap: 2px; box-shadow: 0 10px 30px rgba(0,0,0,0.25); z-index: 200; }
        .nav-dropdown .nav-link { padding: 10px 12px; width: 100%; box-sizing: border-box; }
        .nav-dropdown .nav-btn-sair { width: 100%; box-sizing: border-box; padding: 10px 12px; justify-content: flex-start; font-size: 14px; }

        @media (max-width: 640px) {
          .nav-inner { padding: 0 16px; gap: 8px; }
          .nav-brand-nome { max-width: 140px; }
          .desktop-only { display: none !important; }
          .nav-menu-wrap { display: block; }
          .carrinho-badge, .nav-actions > .nav-link { padding: 6px 8px; }
        }

        @media (max-width: 400px) {
          .nav-label { display: none; }
          .nav-brand-nome { max-width: 110px; }
        }
      `}</style>

      <nav style={{
        background: paleta.primaria,
        borderBottom: `1px solid ${paleta.borda}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Inter', -apple-system, sans-serif",
        width: "100%",
        boxSizing: "border-box"
      }}>
        <div className="nav-inner">

          <Link to={slugDaLoja ? `/${slugDaLoja}` : "/"} className="nav-brand">
            {loja?.logo ? (
              <img src={loja.logo} alt={loja.nome} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: `2px solid ${paleta.borda}`, flexShrink: 0 }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: 10, background: paleta.fundoMedio, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Store size={17} color={paleta.texto} />
              </div>
            )}
            <span className="nav-brand-nome" style={{ color: paleta.texto }}>
              {loja?.nome || "Catálogo Digital"}
            </span>
          </Link>

          <div className="nav-actions">
            {slugDaLoja && (
              <>
                <Link to={`/${slugDaLoja}`} className="nav-link" style={{ color: paleta.textoSuave }}>
                  <LayoutGrid size={14} /> <span className="nav-label">Catálogo</span>
                </Link>
                <Link to={`/${slugDaLoja}/pedido`} className="carrinho-badge" style={{ color: paleta.textoSuave }}>
                  <ShoppingCart size={15} />
                  <span className="nav-label">Pedido</span>
                  {quantidade > 0 && (
                    <span className="badge-count">{quantidade > 9 ? "9+" : quantidade}</span>
                  )}
                </Link>
              </>
            )}

            {logado && (
              <>
                {/* Desktop: Admin e Sair inline */}
                <Link to="/admin" className="nav-link desktop-only" style={{ color: paleta.textoSuave }}>
                  Admin
                </Link>
                <button onClick={sair} className="nav-btn-sair desktop-only">
                  <LogOut size={13} /> Sair
                </button>

                {/* Mobile: botão de menu com dropdown */}
                <div className="nav-menu-wrap" ref={menuRef}>
                  <button
                    className="nav-menu-btn"
                    onClick={() => setMenuAberto((v) => !v)}
                    aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
                    aria-expanded={menuAberto}
                    style={{ color: paleta.texto }}
                  >
                    {menuAberto ? <X size={20} /> : <Menu size={20} />}
                  </button>

                  {menuAberto && (
                    <div
                      className="nav-dropdown"
                      style={{
                        background: paleta.primaria,
                        border: `1px solid ${paleta.borda}`
                      }}
                    >
                      <Link to="/admin" className="nav-link" style={{ color: paleta.texto }}>
                        <Shield size={14} /> Admin
                      </Link>
                      <button onClick={sair} className="nav-btn-sair">
                        <LogOut size={14} /> Sair
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar