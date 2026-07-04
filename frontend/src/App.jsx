import {
  BrowserRouter,
  Routes,
  Route,
  useLocation
} from "react-router-dom"

import Login from "./pages/login"
import Admin from "./pages/admin"
import Cadastro from "./pages/Cadastro"
import Pedido from "./pages/Pedido"
import Landing from "./pages/Landing"
import Master from "./pages/Master"
import Home from "./pages/Home"
import Footer from "./components/Footer"

import Navbar from "./components/navbar"

function Layout() {

  const location = useLocation()

  // páginas sem navbar
  const ocultarNavbar = [
    "/"
  ]

  const mostrarNavbar =
    !ocultarNavbar.includes(
      location.pathname
    )

  return (
    <>
      {mostrarNavbar && <Navbar />}

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/:slug"
          element={<Landing />}
        />

        <Route
          path="/:slug/pedido"
          element={<Pedido />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/cadastro"
          element={<Cadastro />}
        />

        <Route
          path="/admin"
          element={<Admin />}
        />

        <Route
          path="/master"
          element={<Master />}
        />

      </Routes>

      <Footer />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  )
}

export default App