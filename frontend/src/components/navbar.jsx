import { Link, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import { useLoja } from "../hooks/useLoja"

function Navbar() {

  const [logado, setLogado] = useState(false)
  const [quantidade, setQuantidade] = useState(0)

  const location = useLocation()
  const slug = location.pathname.split("/")[1] || null

  const rotasInternas = ["admin", "login", "cadastro", "pedido"]
  const slugDaLoja = rotasInternas.includes(slug) ? null : slug

  const loja = useLoja(slugDaLoja)

  const corPrimaria = loja?.tema?.corPrimaria || "#22c55e"

  useEffect(() => {
    const atualizarCarrinho = () => {
      const carrinho = JSON.parse(localStorage.getItem("lista")) || []
      setQuantidade(carrinho.length)
    }

    const verificarLogin = () => {
      const token = localStorage.getItem("token")
      setLogado(!!token)
    }

    atualizarCarrinho()
    verificarLogin()

    window.addEventListener("storage", atualizarCarrinho)
    window.addEventListener("storage", verificarLogin)

    return () => {
      window.removeEventListener("storage", atualizarCarrinho)
      window.removeEventListener("storage", verificarLogin)
    }
  }, [])

  const sair = () => {
    localStorage.removeItem("token")
    setLogado(false)
  }

  return (
    <nav className="text-white p-4 shadow-md" style={{ backgroundColor: corPrimaria }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <div className="flex items-center gap-3">
          {loja?.logo && (
            <img src={loja.logo} alt={loja.nome} className="w-8 h-8 object-cover rounded-full" />
          )}
          <h1 className="text-lg md:text-xl font-bold">
            {loja?.nome || ""}
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">

          {slugDaLoja && (
            <Link to={`/${slugDaLoja}`} className="hover:opacity-80 transition">
              Catálogo
            </Link>
          )}

          {logado && (
            <Link to="/admin" className="hover:opacity-80 transition">
              Admin
            </Link>
          )}

          <Link to="/pedido" className="hover:opacity-80 transition">
            Pedido 🛒 ({quantidade})
          </Link>

          {!logado ? (
            <Link to="/login" className="bg-white px-3 py-1 rounded hover:bg-gray-100 transition" style={{ color: corPrimaria }}>
              Login
            </Link>
          ) : (
            <button
              onClick={sair}
              className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition"
            >
              Sair
            </button>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar