import { Navigate } from "react-router-dom"

function RotaProtegida({ permitido, rolePermitida, children }) {

  const role = localStorage.getItem("role")

  if (!permitido) {
    return <Navigate to="/" replace />
  }

  if (rolePermitida && role !== rolePermitida) {
    return <Navigate to="/admin" replace />
  }

  return children
}

export default RotaProtegida