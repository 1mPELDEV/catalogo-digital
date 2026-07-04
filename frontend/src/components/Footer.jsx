import { useLocation } from "react-router-dom"
import { useLoja } from "../hooks/useLoja"

const rotasInternas = [
  "admin",
  "login",
  "cadastro",
  "pedido",
  "master"
]

function Footer() {

    const location = useLocation()

    const slugAtual =
    location.pathname.split("/")[1] || null

    let slugDaLoja = null

    if (slugAtual && !rotasInternas.includes(slugAtual)) {
      slugDaLoja = slugAtual
    } else {
      slugDaLoja = localStorage.getItem("slugLoja")
    }

    const loja = useLoja(slugDaLoja)

    const corPrimaria =
      loja?.tema?.corPrimaria || "#22c55e"
    

  return (

    <footer className="text-white py-8 px-3" 
            style={{ backgroundColor: corPrimaria }}>

      {/* COPYRIGHT */}

      <div className="border-t border-white/10 mt-6 pt-8 text-center text-white-500 text-sm">

          {loja?.nome || "Loja" } © todos os direitos reservados.

      </div>

    </footer>
  )
}

export default Footer