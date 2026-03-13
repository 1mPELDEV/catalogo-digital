import { Link } from "react-router-dom"
import { useState , useEffect } from "react"



function Navbar() {

  const [logado, setLogado] = useState(false)
  const [quantidade , setQuantidade] = useState(0)

  const verificarLogin = () =>{
  const token = localStorage.getItem("token")
  setLogado(!!token)
  }

  useEffect(() => {
    const atualizarCarrinho = () =>{
      const carrinho = JSON.parse(localStorage.getItem('lista')) || []
      setQuantidade(carrinho.length)     
    }

    atualizarCarrinho()

    window.addEventListener("storage", atualizarCarrinho)

    verificarLogin()
    
    window.addEventListener("storage", verificarLogin)

    return() =>{
      window.removeEventListener("storage", verificarLogin)
      window.removeEventListener("storage", atualizarCarrinho)
    }
}, [])

  const sair = ()=>{
    localStorage.removeItem("token")
    setLogado(false)
  }

  return (
    <nav style={{display:"flex", gap:"20px", padding:"10px"}}>
      <Link to="/">Catalogo</Link>
      {logado && <Link to="/admin">Admin</Link>}
      <Link to="/Pedido">Pedido 🛒 ({quantidade})</Link>
      <Link to="/Sobre">Sobre</Link>
      {!logado && <Link to="/login">Login</Link>}
      {logado && <button onClick={sair}>Sair</button>}
    </nav>
  )
}

export default Navbar