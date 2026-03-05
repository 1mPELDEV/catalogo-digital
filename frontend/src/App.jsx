import { BrowserRouter, Routes, Route } from "react-router-dom"

import Login from "./pages/login"
import Catalogo from "./pages/catalogo"
import Admin from "./pages/admin"

function Home(){
  return <h1>Home</h1>
}

function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App