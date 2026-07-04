import { useState, useEffect } from "react"
import axios from "axios"

export function useLoja(slug = null) {

  const [loja, setLoja] = useState(null)

  useEffect(() => {

    const buscarLoja = async () => {

      try {

        // 🔥 rota pública
        if (slug) {

          const res = await axios.get(
            `http://localhost:8082/loja/${slug}`
          )

          setLoja(res.data)
          return
        }

        // 🔥 rota privada (admin)
        const token =
          localStorage.getItem("token")

        // não logado → não busca nada
        if (!token) {
          setLoja(null)
          return
        }

        const res = await axios.get(
          "http://localhost:8082/loja",
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        )

        setLoja(res.data)

      } catch (err) {
        console.log(
          "Erro ao buscar loja:",
          err
        )
        setLoja(null)
      }
    }

    buscarLoja()

  }, [slug])

  return loja
}