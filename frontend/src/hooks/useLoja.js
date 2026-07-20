import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export function useLoja(slug = null) {

  const [loja, setLoja] = useState(null)

  useEffect(() => {

    const buscarLoja = async () => {

      try {

        if (slug) {
          const res = await axios.get(`${API_URL}/loja/${slug}`)
          setLoja(res.data)
          return
        }

        const token = localStorage.getItem("token")

        if (!token) {
          setLoja(null)
          return
        }

        const res = await axios.get(`${API_URL}/loja`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        setLoja(res.data)

      } catch (err) {
        console.log("Erro ao buscar loja:", err)
        setLoja(null)
      }
    }

    buscarLoja()

  }, [slug])

  return loja
}