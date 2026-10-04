import { useState } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import { ArrowRight, Check, Clock3, Store } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function Interesse() {
  const [email, setEmail] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)
  const [erro, setErro] = useState("")

  const enviar = async (event) => {
    event.preventDefault()
    setEnviando(true)
    setErro("")
    try {
      await axios.post(`${API_URL}/auth/interesse`, { email })
      setEnviado(true)
    } catch (error) {
      setErro(error.response?.data?.erro || "Não foi possível enviar agora. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  return (
    <main className="min-h-[75vh] bg-[#f8faf9] px-4 py-12 sm:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-900/5 md:grid-cols-[1.1fr_.9fr]">
        <section className="p-7 sm:p-10">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-800 no-underline"><span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white"><Store size={18} /></span>Catálogo Digital</Link>
          <p className="mt-10 text-xs font-bold uppercase tracking-[.16em] text-green-800">Plano anual</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Sua loja pronta para vender pelo WhatsApp.</h1>
          <p className="mt-4 max-w-lg text-sm leading-6 text-slate-600">Tenha seu catálogo digital por 12 meses, com uma página própria para apresentar produtos e receber pedidos.</p>

          <div className="mt-7 flex items-end gap-2"><span className="text-5xl font-bold tracking-tight text-slate-950">R$ 200</span><span className="pb-1 text-sm text-slate-500">por 12 meses</span></div>
          <p className="mt-1 text-sm text-slate-500">Equivale a R$ 16,67 por mês.</p>
          <ul className="mt-7 grid gap-3 text-sm text-slate-700">
            {["Link próprio para sua loja", "Produtos, categorias e promoções", "Carrinho com pedido enviado pelo WhatsApp", "Personalização com logo, banner e cores", "Acesso ao painel de gerenciamento"].map(item => <li key={item} className="flex items-start gap-2.5"><Check size={17} className="mt-0.5 shrink-0 text-green-700" />{item}</li>)}
          </ul>
        </section>

        <section className="flex flex-col justify-center bg-[#10261b] p-7 text-white sm:p-10">
          {enviado ? <div role="status"><span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-green-400/15 text-green-300"><Check size={24} /></span><h2 className="mt-5 text-2xl font-bold">Interesse registrado</h2><p className="mt-3 text-sm leading-6 text-slate-300">Anotamos <strong className="text-white">{email}</strong>. A equipe verá seu contato no painel e poderá combinar o pagamento manualmente. Depois da confirmação, você poderá criar sua conta usando esse mesmo e-mail.</p><p className="mt-5 flex items-center gap-2 text-xs text-slate-400"><Clock3 size={15} /> O cadastro é liberado após a confirmação do pagamento.</p></div> : <>
            <p className="text-xs font-bold uppercase tracking-[.16em] text-green-300">Comece por aqui</p>
            <h2 className="mt-3 text-2xl font-bold">Deixe seu e-mail para demonstrar interesse.</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">O pagamento é combinado manualmente. Não será cobrado nada ao enviar este formulário.</p>
            <form onSubmit={enviar} className="mt-7 grid gap-3">
              <label htmlFor="email-interesse" className="text-sm font-medium text-slate-200">Seu melhor e-mail</label>
              <input id="email-interesse" type="email" autoComplete="email" required maxLength={254} value={email} onChange={event => setEmail(event.target.value)} placeholder="voce@exemplo.com" className="w-full rounded-xl border border-white/15 bg-white px-4 py-3 text-sm text-slate-950 outline-none focus:ring-2 focus:ring-green-400" />
              {erro && <p role="alert" className="text-sm text-red-300">{erro}</p>}
              <button type="submit" disabled={enviando} className="mt-1 inline-flex items-center justify-center gap-2 rounded-xl bg-green-400 px-5 py-3.5 text-sm font-bold text-green-950 transition hover:bg-green-300 disabled:opacity-60">{enviando ? "Enviando..." : "Quero saber como pagar"} {!enviando && <ArrowRight size={17} />}</button>
            </form>
            <p className="mt-5 text-xs leading-5 text-slate-400">Após a confirmação manual, o cadastro será liberado para este e-mail. O plano começa a contar quando a conta for criada.</p>
          </>}
        </section>
      </div>
      <p className="mx-auto mt-6 max-w-5xl text-center text-xs text-slate-500">Já tem conta? <Link to="/login" className="font-semibold text-green-800">Entrar</Link></p>
    </main>
  )
}

export default Interesse
