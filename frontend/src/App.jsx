import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Admin from "./pages/admin"
import Home from "./components/landing/ProdutosGrid.jsx"
import Cadastro from "./pages/Cadastro"
import Pedido from "./pages/Pedido"
import Landing from "./pages/Landing"
import RotaProtegida from "./components/RotaProtegida"
import { loja } from "./config/loja"

// components
import Navbar from "./components/navbar"

function App() {
  return (

    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/:slug" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pedido" element={<Pedido />}/>
        <Route path="/cadastro" element={<Cadastro />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App



