import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, LockKeyhole, Store } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function Login() {
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) return
    navigate(localStorage.getItem("role") === "master" ? "/master" : "/admin", { replace: true })
  }, [navigate])

  const entrar = async (e) => {
    e.preventDefault()
    if (enviando) return
    setErro("")
    setEnviando(true)
    try {
      const { data } = await axios.post(`${API_URL}/admin/login`, { email: email.trim(), senha })
      localStorage.setItem("token", data.token)
      localStorage.setItem("slugLoja", data.slug || "")
      localStorage.setItem("role", data.role || "lojista")
      window.dispatchEvent(new Event("storage"))
      navigate(data.role === "master" ? "/master" : "/admin", { replace: true })
    } catch (err) {
      setErro(err.response?.data?.erro || "Não foi possível entrar. Confira sua conexão e tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="grid min-h-[78vh] bg-[#f7faf8] lg:grid-cols-2">
      <section className="flex items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          <Link to="/" className="mb-10 inline-flex items-center gap-2.5 text-slate-900 no-underline"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white"><Store size={18} /></span><span className="font-semibold tracking-tight">Catálogo Digital</span></Link>
          <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-green-50 text-green-800"><LockKeyhole size={21} /></span>
          <h1 className="text-3xl font-bold tracking-tight text-slate-950">Bem-vindo de volta</h1>
          <p className="mt-2 text-sm leading-6 text-slate-600">Entre para gerenciar produtos e atualizar sua loja.</p>

          <form onSubmit={entrar} className="mt-8 space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div><label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">E-mail</label><input id="email" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10" type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div><label htmlFor="senha" className="mb-1.5 block text-sm font-medium text-slate-700">Senha</label><input id="senha" className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10" type="password" autoComplete="current-password" placeholder="Sua senha" value={senha} onChange={e => setSenha(e.target.value)} required /></div>
            {erro && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
            <button type="submit" disabled={enviando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">{enviando ? "Entrando..." : "Entrar na minha loja"}{!enviando && <ArrowRight size={17} />}</button>
            <p className="text-center text-sm text-slate-500">Ainda não tem uma loja? <Link to="/cadastro" className="font-semibold text-green-800 no-underline hover:underline">Criar loja grátis</Link></p>
          </form>
        </div>
      </section>

      <aside className="relative hidden overflow-hidden bg-[#10261b] p-12 text-white lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -right-32 top-10 h-96 w-96 rounded-full bg-green-500/15 blur-3xl" />
        <div className="relative z-10 max-w-md"><span className="text-sm font-semibold text-green-300">Sua loja na palma da mão</span><h2 className="mt-4 text-4xl font-bold leading-tight tracking-tight">Um catálogo fácil de manter. Simples de compartilhar.</h2><p className="mt-4 text-sm leading-6 text-slate-300">Atualize seus produtos e continue atendendo seus clientes pelo WhatsApp.</p></div>
        <div className="relative z-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur"><div className="flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/15 text-green-300"><Store size={19} /></span><div><p className="text-sm font-semibold">Tudo em um só lugar</p><p className="mt-1 text-xs text-slate-400">Produtos, categorias e identidade visual.</p></div></div></div>
      </aside>
    </main>
  )
}

export default Login
