import { useState, useEffect } from "react"
import axios from "axios"

// slug → uso público (visitante no catálogo)
// sem slug → uso privado (admin logado)
export function useLoja(slug = null) {
  const [loja, setLoja] = useState(null)

  useEffect(() => {
    const buscarLoja = async () => {
      try {
        if (slug) {
          // rota pública — não precisa de token
          const res = await axios.get(`http://localhost:8082/loja/${slug}`)
          setLoja(res.data)
        } else {
          // rota privada — envia o token do admin logado
          const token = localStorage.getItem("token")
          const res = await axios.get("http://localhost:8082/loja", {
            headers: { Authorization: `Bearer ${token}` }
          })
          setLoja(res.data)
        }
      } catch (err) {
        console.log("Erro ao buscar loja:", err)
      }
    }

    buscarLoja()
  }, [slug])

  return loja
}