import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { ArrowLeft, ArrowRight, Check, CheckCircle2, Copy, ExternalLink, LayoutGrid, MessageCircle, Package, Store } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL
const ENDPOINT_LOJA = `${API_URL}/loja`

function formatarTelefone(valor) {
  const d = valor.replace(/\D/g, "").slice(0, 11)
  if (d.length <= 2) return d ? `(${d}` : ""
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function numeroValido(digitos) {
  return (digitos.length === 10 || digitos.length === 11) &&
    /^[1-9][0-9]/.test(digitos) &&
    (digitos.length !== 11 || digitos[2] === "9")
}

const passos = [
  { titulo: "Cadastre seus produtos", texto: "Inclua fotos, preços e categorias.", Icone: Package },
  { titulo: "Compartilhe sua loja", texto: "Envie seu link pelo WhatsApp ou redes sociais.", Icone: LayoutGrid },
  { titulo: "Receba pedidos", texto: "Seu cliente envia o pedido direto pelo WhatsApp.", Icone: MessageCircle },
]

function Welcome() {
  const [loja, setLoja] = useState(null)
  const [whatsapp, setWhatsapp] = useState("")
  const [carregando, setCarregando] = useState(true)
  const [salvando, setSalvando] = useState(false)
  const [copiado, setCopiado] = useState(false)
  const [erro, setErro] = useState("")
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const digitos = whatsapp.replace(/\D/g, "")
  const valido = numeroValido(digitos)
  const linkLoja = loja ? `${window.location.origin}/${loja.slug}` : ""

  useEffect(() => {
    let ativo = true
    if (!token) {
      navigate("/login", { replace: true })
      return () => { ativo = false }
    }

    axios.get(ENDPOINT_LOJA, { headers: { Authorization: `Bearer ${token}` } })
      .then(({ data }) => {
        if (!ativo) return
        if (!data || typeof data !== "object" || !data.slug) {
          setErro("Não encontramos os dados da sua loja. Tente novamente.")
          return
        }
        setLoja(data)
        const numeroSalvo = String(data.contato?.whatsapp || "").replace(/\D/g, "")
        const numeroSemDdi = numeroSalvo.startsWith("55") ? numeroSalvo.slice(2) : numeroSalvo
        setWhatsapp(numeroSemDdi ? formatarTelefone(numeroSemDdi) : "")
        localStorage.setItem("slugLoja", data.slug)
        window.dispatchEvent(new Event("storage"))
      })
      .catch(err => {
        if (!ativo) return
        if (err.response?.status === 401) {
          localStorage.removeItem("token")
          navigate("/login", { replace: true })
          return
        }
        setErro(err.response?.data?.erro || "Não foi possível carregar sua loja. Tente novamente.")
      })
      .finally(() => { if (ativo) setCarregando(false) })

    return () => { ativo = false }
  }, [navigate, token])

  const copiarLink = async () => {
    try {
      await navigator.clipboard.writeText(linkLoja)
      setCopiado(true)
      window.setTimeout(() => setCopiado(false), 2200)
    } catch {
      setErro("Não foi possível copiar automaticamente. Selecione o link e copie manualmente.")
    }
  }

  const salvarWhatsapp = async (e) => {
    e.preventDefault()
    if (!valido || salvando || !loja) return
    setErro("")
    setSalvando(true)
    try {
      const res = await axios.put(ENDPOINT_LOJA,
        { contato: { whatsapp: `55${digitos}` } },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      const lojaAtualizada = res.data || loja
      setLoja(lojaAtualizada)
      localStorage.setItem("slugLoja", lojaAtualizada.slug)
      window.dispatchEvent(new Event("storage"))
      navigate("/admin")
    } catch (err) {
      setErro(err.response?.data?.erro || "Não foi possível salvar o WhatsApp. Tente novamente.")
    } finally {
      setSalvando(false)
    }
  }

  if (carregando) {
    return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-4"><div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-sm font-medium text-slate-600 shadow-sm"><span className="h-4 w-4 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />Preparando sua loja...</div></main>
  }

  if (!loja) {
    return <main className="flex min-h-[70vh] items-center justify-center bg-[#f7faf8] px-4"><div className="max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm"><div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 text-red-600"><Store size={22} /></div><h1 className="mt-4 text-xl font-semibold text-slate-900">Não carregamos sua loja</h1><p role="alert" className="mt-2 text-sm leading-6 text-red-700">{erro || "Confira sua conexão e tente novamente."}</p><div className="mt-6 flex justify-center gap-3"><button onClick={() => window.location.reload()} className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800">Tentar novamente</button><button onClick={() => navigate("/login")} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50">Voltar ao login</button></div></div></main>
  }

  return (
    <main className="min-h-[78vh] bg-[#f7faf8] px-4 py-8 sm:px-6 sm:py-12">
      <div className="mx-auto max-w-5xl">
        <Link to="/" className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-slate-500 no-underline transition hover:text-slate-900"><ArrowLeft size={16} /> Início</Link>
        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-42px_rgba(15,23,42,.24)] lg:grid-cols-[.9fr_1.1fr]">
          <section className="relative overflow-hidden bg-[#10261b] p-7 text-white sm:p-10">
            <div className="absolute -right-28 -top-28 h-72 w-72 rounded-full bg-green-500/15 blur-3xl" />
            <div className="relative z-10 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10"><Store size={19} /></span><span className="text-sm font-semibold">Catálogo Digital</span></div>
            <div className="relative z-10 mt-12">
              <span className="inline-flex items-center gap-2 rounded-full bg-green-500/15 px-3 py-1.5 text-xs font-semibold text-green-200"><CheckCircle2 size={14} /> Conta criada</span>
              <h1 className="mt-5 text-3xl font-semibold leading-tight tracking-tight sm:text-4xl">Sua loja está quase pronta.</h1>
              <p className="mt-4 text-sm leading-6 text-slate-300">Configure o WhatsApp para que os pedidos dos clientes cheguem direto até você.</p>
            </div>
            <ol className="relative z-10 mt-10 space-y-5">
              {passos.map((passo, index) => (
                <li key={passo.titulo} className="flex gap-3.5">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${index === 0 ? "bg-green-500 text-white" : "bg-white/10 text-slate-300"}`}>{index === 0 ? <Check size={17} /> : <passo.Icone size={17} />}</span>
                  <span><span className="block text-sm font-semibold">{passo.titulo}</span><span className="mt-1 block text-xs leading-5 text-slate-400">{passo.texto}</span></span>
                </li>
              ))}
            </ol>
          </section>

          <section className="p-6 sm:p-10 lg:p-12">
            <div className="flex items-center gap-3">
              {loja.logo ? <img src={loja.logo} alt="" className="h-12 w-12 rounded-2xl object-cover" /> : <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800"><Store size={22} /></span>}
              <div className="min-w-0"><p className="truncate font-semibold text-slate-900">{loja.nome}</p><p className="text-xs text-slate-500">Sua loja online</p></div>
              <span className="ml-auto rounded-full bg-green-50 px-2.5 py-1 text-xs font-semibold text-green-800">Etapa 2 de 2</span>
            </div>

            <div className="mt-7 h-1.5 overflow-hidden rounded-full bg-slate-100" role="progressbar" aria-label="Progresso da configuração da loja" aria-valuemin="0" aria-valuemax="100" aria-valuenow="60"><div className="h-full w-[60%] rounded-full bg-green-600" /></div>
            <h2 className="mt-8 text-2xl font-semibold tracking-tight text-slate-950">Configure seu WhatsApp</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">É para este número que seus clientes vão enviar os pedidos.</p>

            <form onSubmit={salvarWhatsapp} className="mt-6">
              <label htmlFor="whatsapp" className="mb-2 block text-sm font-medium text-slate-700">WhatsApp da loja</label>
              <div className="flex overflow-hidden rounded-xl border border-slate-200 transition focus-within:border-green-600 focus-within:ring-4 focus-within:ring-green-600/10">
                <span className="flex items-center border-r border-slate-200 bg-slate-50 px-3 text-sm font-medium text-slate-500">+55</span>
                <input id="whatsapp" type="tel" inputMode="tel" autoComplete="tel" placeholder="(11) 91234-5678" value={whatsapp} onChange={e => setWhatsapp(formatarTelefone(e.target.value))} className="min-w-0 flex-1 px-4 py-3 text-sm text-slate-900 outline-none placeholder:text-slate-400" required />
              </div>
              <button type="button" onClick={() => window.open(`https://wa.me/55${digitos}`, "_blank", "noopener,noreferrer")} disabled={!valido} className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-green-800 hover:text-green-950 disabled:cursor-not-allowed disabled:text-slate-400"><ExternalLink size={13} /> Testar este número</button>

              <div className="mt-7">
                <label className="mb-2 block text-sm font-medium text-slate-700">Link público da sua loja</label>
                <div className="flex gap-2 rounded-xl bg-slate-50 p-2">
                  <input value={linkLoja} readOnly onFocus={e => e.target.select()} className="min-w-0 flex-1 bg-transparent px-2 text-sm text-slate-600 outline-none" aria-label="Link público da loja" />
                  <button type="button" onClick={copiarLink} className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">{copiado ? <Check size={15} className="text-green-700" /> : <Copy size={15} />}{copiado ? "Copiado" : "Copiar"}</button>
                </div>
              </div>

              {erro && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-3.5 py-3 text-sm text-red-700">{erro}</p>}
              <button type="submit" disabled={!valido || salvando} className="mt-7 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-green-800/15 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">{salvando ? "Salvando..." : "Ir para o painel"}{!salvando && <ArrowRight size={17} />}</button>
              <p className="mt-3 text-center text-xs leading-5 text-slate-500">Você poderá alterar esse número nas configurações da loja.</p>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Welcome
