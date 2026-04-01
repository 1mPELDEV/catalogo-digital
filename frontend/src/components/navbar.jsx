import { Link } from "react-router-dom"
import { useState, useEffect } from "react"

function Navbar() {
  const [logado, setLogado] = useState(false)
  const [quantidade, setQuantidade] = useState(0)
  const [open, setOpen] = useState(false)

  const verificarLogin = () => {
    const token = localStorage.getItem("token")
    setLogado(!!token)
  }

  useEffect(() => {
    const atualizarCarrinho = () => {
      const carrinho = JSON.parse(localStorage.getItem("lista")) || []
      setQuantidade(carrinho.length)
    }

    atualizarCarrinho()
    verificarLogin()

    window.addEventListener("storage", atualizarCarrinho)
    window.addEventListener("storage", verificarLogin)

    return () => {
      window.removeEventListener("storage", verificarLogin)
      window.removeEventListener("storage", atualizarCarrinho)
    }
  }, [])

  const sair = () => {
    localStorage.removeItem("token")
    setLogado(false)
  }

  return (
    <nav className="bg-green-200">
      <div className="max-w-6xl mx-auto px-4">

        {/* Topo */}
        <div className="flex justify-between items-center h-14">

          <Link to="/" className="font-bold text-lg">Catálogo</Link>

          {/* Botão mobile */}
          <button
            className="md:hidden text-xl"
            onClick={() => setOpen(!open)}
          >
            ☰
          </button>

          {/* Menu desktop */}
          <div className="hidden md:flex gap-6 items-center">

            <Link to="/">Catálogo</Link>

            {logado && <Link to="/admin">Admin</Link>}

            <Link to="/Pedido">
              🛒 ({quantidade})
            </Link>

            <Link to="/Sobre">Sobre</Link>

            {!logado && <Link to="/login">Login</Link>}
            {logado && (
              <button onClick={sair} className="text-red-600">
                Sair
              </button>
            )}

          </div>
        </div>

        {/* Menu mobile */}
        {open && (
          <div className="flex flex-col gap-4 pb-4 md:hidden">

            <Link to="/" onClick={() => setOpen(false)}>
              Catálogo
            </Link>

            {logado && (
              <Link to="/admin" onClick={() => setOpen(false)}>
                Admin
              </Link>
            )}

            <Link to="/Pedido" onClick={() => setOpen(false)}>Pedido🛒 ({quantidade})</Link>
            <Link to="/Sobre" onClick={() => setOpen(false)}>Sobre</Link>

            {!logado && (
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
            )}

            {logado && (
              <button
                onClick={() => {
                  sair()
                  setOpen(false)
                }}
                className="text-red-600 text-left">Sair</button>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar