import { Link } from "react-router-dom"
import { useState, useEffect } from "react"
import { useLoja } from "../hooks/useLoja"
// import { cores } from "../utils/tema"

function Navbar() {

  const loja = useLoja() // ✅ PRIMEIRO

  const [logado, setLogado] = useState(false)
  const [quantidade, setQuantidade] = useState(0)

  const cor = loja?.tema?.corPrimaria || "#22c55e"
//   const tema = cores[cor] || {
//   bg: "bg-green-500",
//   text: "text-green-600"
// }
    useEffect(() => {
    console.log("LOJA ATUALIZOU:", loja)
  }, [loja])


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
    <nav className={`text-white p-4 shadow-md`} style={{backgroundColor: cor}}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-3">

        <h1 className="text-lg md:text-xl font-bold">
          {loja?.nome || "Carregando..."}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base">

          <Link to="/" className="hover:opacity-80 transition">
            Catálogo
          </Link>

          {logado && (
            <Link to="/admin" className="hover:opacity-80 transition">
              Admin
            </Link>
          )}

          {loja?.funcionalidades?.carrinho && (
            <Link to="/pedido" className="hover:opacity-80 transition">
              Pedido 🛒 ({quantidade})
            </Link>
          )}

          <Link to="/sobre" className="hover:opacity-80 transition">
            Sobre
          </Link>

          {!logado ? (
            <Link to="/login" className={`bg-white px-3 py-1 rounded hover:bg-gray-100 transition`}>
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