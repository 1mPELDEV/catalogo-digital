import { useState, useEffect } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export function useLoja(slug = null) {
  const [resposta, setResposta] = useState({ chave: "", loja: null })
  const [revisao, setRevisao] = useState(0)
  const token = localStorage.getItem("token")
  const chave = `${slug || "privada"}:${token || "sem-token"}:${revisao}`

  useEffect(() => {
    let ativa = true

    const buscarLoja = async () => {
      try {
        if (slug) {
          const res = await axios.get(`${API_URL}/loja/${slug}`)
          if (ativa) setResposta({ chave, loja: res.data })
          return
        }

        if (!token) {
          return
        }

        const res = await axios.get(`${API_URL}/loja`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })

        if (ativa) setResposta({ chave, loja: res.data })

      } catch (err) {
        console.log("Erro ao buscar loja:", err)
        if (ativa) setResposta({ chave, loja: null })
      }
    }

    buscarLoja()
    const atualizar = () => setRevisao(valor => valor + 1)
    window.addEventListener("store:updated", atualizar)
    window.addEventListener("storage", atualizar)
    return () => {
      ativa = false
      window.removeEventListener("store:updated", atualizar)
      window.removeEventListener("storage", atualizar)
    }

  }, [chave, slug, token])

  return resposta.chave === chave ? resposta.loja : null
}
