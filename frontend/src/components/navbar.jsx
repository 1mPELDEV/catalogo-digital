import { Link, useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import { useLoja } from "../hooks/useLoja"

function Navbar() {
  const [logado, setLogado] = useState(false)
  const [quantidade, setQuantidade] = useState(0)

  const location = useLocation()
  const navigate = useNavigate()

  // pega slug da URL
  const slugAtual =
    location.pathname.split("/")[1] || null

  let exibeslug = function() {
    console.log(slugAtual)
  }
  exibeslug()

  const rotasInternas = [
    "admin",
    "login",
    "cadastro",
    "pedido",
    "master"
  ]

// const isCatalog = slugAtual && !rotasInternas.includes(slugAtual)

  let slugDaLoja =  null 


    if (slugAtual && !rotasInternas.includes(slugAtual)) {
      slugDaLoja = slugAtual
    } else {
      slugDaLoja = localStorage.getItem("slugLoja")
    }


const loja = useLoja(slugDaLoja)

console.log(localStorage.getItem("token"))

  // loja tá vindo null porque slug atual tá sendo "admin" e não o slug da loja, então useLoja não consegue encontrar a loja correta.
  console.log("loja", loja)

  const corPrimaria =
    loja?.tema?.corPrimaria || "#22c55e"

  // carrega infos iniciais
  useEffect(() => {
    const token = localStorage.getItem("token")
    setLogado(!!token)

    const carrinho = JSON.parse(
      localStorage.getItem(`carrinho-${slugDaLoja}`)) || []

      console.log("carrinho", carrinho)

    setQuantidade(carrinho.length)
  }, [])

  // escuta mudanças
  useEffect(() => {
    const atualizar = () => {
      const token =
        localStorage.getItem("token")

      setLogado(!!token)

      const carrinho =
      JSON.parse(
        localStorage.getItem(`carrinho-${slugDaLoja}`)
      ) || []

      setQuantidade(carrinho.length)
    }

    window.addEventListener(
      "storage",
      atualizar
    )

    return () => {
      window.removeEventListener(
        "storage",
        atualizar
      )
    }
  }, [])

  const sair = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("slugLoja")

    setLogado(false)

    navigate("/login")
  }

  return (
    <nav
      className="text-white shadow-md"
      style={{
        backgroundColor: corPrimaria
      }}
    >
      <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">

        {/* Logo + Nome */}
        <div className="flex items-center gap-3">
          {loja?.logo && (
            <img
              src={loja.logo}
              alt={loja.nome}
              className="w-10 h-10 rounded-full object-cover border border-white"
            />
          )}

          <h1 className="text-xl font-bold">
            {loja?.nome || "Seu Catálogo"}
          </h1>
        </div>

        {/* Links */}
        <div className="flex items-center gap-4 text-sm md:text-base">

          {/* catálogo */}
          {slugDaLoja && (
            <>
            <Link
              to={`/${slugDaLoja}`}
              className="hover:opacity-80 transition"
            >
              Catálogo
            </Link>

              <Link
                to={`/${slugDaLoja}/pedido`}
                className="hover:opacity-80 transition"
              >
                Pedido 🛒 ({quantidade})
              </Link>
            </>
            
          )}

          {/* links privados */}
          {logado ? (
            <>
              <Link
                to="/admin"
                className="hover:opacity-80 transition"
              >
                Admin
              </Link>

              <button
                onClick={sair}
                className="bg-red-500 px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                Sair
              </button>
            </>
          ) : 
            <>
            </>
          }
        </div>
      </div>
    </nav>
  )
}

export default Navbar