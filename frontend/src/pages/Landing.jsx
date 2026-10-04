import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import axios from "axios"
import { ArrowLeft, Store } from "lucide-react"
import Hero from "../components/landing/Hero"
import ProdutosGrid from "../components/landing/ProdutosGrid"

const API_URL = import.meta.env.VITE_API_URL

function Landing() {
  const { slug } = useParams()
  const [resposta, setResposta] = useState({ slug: null, tentativa: -1, loja: null, erro: "" })
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let ativo = true
    axios.get(`${API_URL}/loja/${slug}`)
      .then(({ data }) => {
        if (ativo) setResposta({ slug, tentativa, loja: data, erro: "" })
      })
      .catch(err => {
        if (!ativo) return
        const erro = err.response?.status === 404
          ? "Não encontramos uma loja com esse endereço."
          : "Não foi possível carregar a loja. Verifique sua conexão e tente novamente."
        setResposta({ slug, tentativa, loja: null, erro })
      })

    return () => { ativo = false }
  }, [slug, tentativa])

  const carregando = resposta.slug !== slug || resposta.tentativa !== tentativa
  const loja = carregando ? null : resposta.loja
  const erro = carregando ? "" : resposta.erro

  if (carregando) {
    return <main role="status" className="flex min-h-[55vh] items-center justify-center bg-[#f8faf9] px-4"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm"><span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />Abrindo o catálogo...</div></main>
  }

  if (erro || !loja) {
    return <main className="flex min-h-[55vh] items-center justify-center bg-[#f8faf9] px-4 py-12"><section className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800"><Store size={22} /></span><h1 className="mt-4 text-xl font-semibold text-slate-950">Loja indisponível</h1><p role="alert" className="mt-2 text-sm leading-6 text-slate-600">{erro || "Não encontramos os dados desta loja."}</p><div className="mt-6 flex justify-center gap-3"><button onClick={() => setTentativa(valor => valor + 1)} className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">Tentar novamente</button><Link to="/" className="inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 no-underline transition hover:bg-slate-50"><ArrowLeft size={15} /> Início</Link></div></section></main>
  }

  return <><Hero loja={loja} /><ProdutosGrid slug={slug} loja={loja} /></>
}

export default Landing
