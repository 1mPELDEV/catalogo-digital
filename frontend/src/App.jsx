import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Admin from "./pages/admin"
import Home from "./pages/Catalogo"
import Sobre from "./pages/Sobre"
import Pedido from "./pages/Pedido"
import RotaProtegida from "./components/RotaProtegida"
import { loja } from "./config/loja"

// components
import Navbar from "./components/navbar"

function App() {
  return (

    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/pedido" element={<Pedido />}/>
        <Route path="/sobre" element={<Sobre />}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App