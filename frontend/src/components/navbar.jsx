import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect, useMemo } from "react"
import { useLoja } from "../hooks/useLoja"
import { gerarPaleta } from "../utils/paleta"
import { ShoppingCart, Store, LogOut, LayoutGrid } from "lucide-react"

function Navbar() {
  const [logado, setLogado] = useState(false)
  const [quantidade, setQuantidade] = useState(0)

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

  const sair = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("slugLoja")
    setLogado(false)
    navigate("/login")
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .nav-link { font-size: 14px; font-weight: 500; text-decoration: none; padding: 6px 10px; border-radius: 8px; transition: background 0.15s; font-family: inherit; display: inline-flex; align-items: center; gap: 6px; }
        .nav-link:hover { background: rgba(128,128,128,0.15); }
        .nav-btn-sair { font-size: 13px; font-weight: 500; padding: 7px 14px; border-radius: 8px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: background 0.15s; background: rgba(220,38,38,0.15); color: #ef4444; }
        .nav-btn-sair:hover { background: rgba(220,38,38,0.25); }
        .carrinho-badge { display: inline-flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 500; text-decoration: none; padding: 6px 12px; border-radius: 8px; transition: background 0.15s; font-family: inherit; position: relative; }
        .carrinho-badge:hover { background: rgba(128,128,128,0.15); }
        .badge-count { position: absolute; top: 2px; right: 2px; width: 16px; height: 16px; border-radius: 50%; font-size: 10px; font-weight: 700; display: flex; align-items: center; justify-content: center; background: #ef4444; color: #fff; }
      `}</style>

      <nav style={{
        background: paleta.primaria,
        borderBottom: `1px solid ${paleta.borda}`,
        position: "sticky",
        top: 0,
        zIndex: 100,
        fontFamily: "'Inter', -apple-system, sans-serif"
      }}>
        <div style={{
          maxWidth: 1100,
          margin: "0 auto",
          padding: "0 24px",
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16
        }}>

          <Link to={slugDaLoja ? `/${slugDaLoja}` : "/"} style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
            {loja?.logo ? (
              <img src={loja.logo} alt={loja.nome} style={{ width: 34, height: 34, borderRadius: "50%", objectFit: "cover", border: `2px solid ${paleta.borda}` }} />
            ) : (
              <div style={{ width: 34, height: 34, borderRadius: 10, background: paleta.fundoMedio, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={17} color={paleta.texto} />
              </div>
            )}
            <span style={{ fontSize: 15, fontWeight: 600, color: paleta.texto, letterSpacing: "-0.01em" }}>
              {loja?.nome || "Catálogo Digital"}
            </span>
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            {slugDaLoja && (
              <>
                <Link to={`/${slugDaLoja}`} className="nav-link" style={{ color: paleta.textoSuave }}>
                  <LayoutGrid size={14} /> Catálogo
                </Link>
                <Link to={`/${slugDaLoja}/pedido`} className="carrinho-badge" style={{ color: paleta.textoSuave }}>
                  <ShoppingCart size={15} />
                  Pedido
                  {quantidade > 0 && (
                    <span className="badge-count">{quantidade > 9 ? "9+" : quantidade}</span>
                  )}
                </Link>
              </>
            )}
            {logado && (
              <>
                <Link to="/admin" className="nav-link" style={{ color: paleta.textoSuave }}>
                  Admin
                </Link>
                <button onClick={sair} className="nav-btn-sair">
                  <LogOut size={13} /> Sair
                </button>
              </>
            )}
          </div>

        </div>
      </nav>
    </>
  )
}

export default Navbar