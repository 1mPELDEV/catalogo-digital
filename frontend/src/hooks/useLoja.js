import { useState, useEffect } from "react"
import axios from "axios"

export function useLoja() {
  const [loja, setLoja] = useState(null)

  useEffect(() => {
    const buscarLoja = async () => {
      try {
        const res = await axios.get("http://localhost:8082/loja")
        setLoja(res.data) // 🔥 ESSENCIAL
      } catch (err) {
        console.log("Erro ao buscar loja:", err)
      }
    }

    buscarLoja()
  }, [])

  return loja
}