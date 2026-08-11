import { useLocation, Link } from "react-router-dom"
import { useMemo } from "react"
import { useLoja } from "../hooks/useLoja"
import { gerarPaleta } from "../utils/paleta"
import { Store, MessageCircle } from "lucide-react"

const rotasInternas = ["admin", "login", "cadastro", "pedido", "master"]

function Footer() {
  const location = useLocation()
  const slugAtual = location.pathname.split("/")[1] || null

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

  return (
    <footer style={{
      background: paleta.primaria,
      borderTop: `1px solid ${paleta.borda}`,
      fontFamily: "'Inter', -apple-system, sans-serif",
      padding: "32px 24px"
    }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {loja?.logo ? (
              <img src={loja.logo} alt={loja.nome} style={{ width: 28, height: 28, borderRadius: "50%", objectFit: "cover", opacity: 0.9 }} />
            ) : (
              <div style={{ width: 28, height: 28, borderRadius: 8, background: paleta.fundoMedio, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Store size={14} color={paleta.texto} />
              </div>
            )}
            <span style={{ fontSize: 14, fontWeight: 600, color: paleta.texto }}>
              {loja?.nome || "Catálogo Digital"}
            </span>
          </div>

          {slugDaLoja && (
            <div style={{ display: "flex", gap: 20 }}>
              <Link to={`/${slugDaLoja}`} style={{ fontSize: 13, color: paleta.textoSuave, textDecoration: "none" }}>
                Catálogo
              </Link>
              <Link to={`/${slugDaLoja}/pedido`} style={{ fontSize: 13, color: paleta.textoSuave, textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
                <MessageCircle size={12} /> Pedido
              </Link>
            </div>
          )}

        </div>

        <div style={{ borderTop: `1px solid ${paleta.borda}`, marginTop: 24, paddingTop: 20, textAlign: "center" }}>
          <p style={{ fontSize: 12, color: paleta.textoSuave, margin: 0 }}>
            {loja?.nome || "Loja"} © {new Date().getFullYear()} — Todos os direitos reservados.
          </p>
          <p style={{ fontSize: 11, color: paleta.textoSuave, margin: "6px 0 0", opacity: 0.6 }}>
            Powered by Catálogo Digital
          </p>
        </div>

      </div>
    </footer>
  )
}

export default Footer