import { Link } from "react-router-dom"
import { useState , useEffect } from "react"



function Navbar() {

  const [logado, setLogado] = useState(false)

  const verificarLogin = () =>{
  const token = localStorage.getItem("token")
  setLogado(!!token)
  }

  useEffect(() => {
    verificarLogin()

    window.addEventListener("storage", verificarLogin)

    return() =>{
      window.removeEventListener("storage", verificarLogin)
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
      <Link to="/Pedido">Pedido</Link>
      <Link to="/Sobre">Sobre</Link>
      {!logado && <Link to="/login">Login</Link>}
      {logado && <button onClick={sair}>Sair</button>}
    </nav>
  )
}

export default Navbar