import { Navigate } from "react-router-dom"

function RotaProtegida({ permitido, children }) {

  if (!permitido) {
    return <Navigate to="/" replace />
  }

  return children
}

export default RotaProtegida