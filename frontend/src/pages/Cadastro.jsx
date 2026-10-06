import { useEffect, useState } from "react"
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import { ArrowRight, Check, ImagePlus, Palette, Store, Upload } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function Cadastro() {
  const [nomeLoja, setNomeLoja] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [corPrimaria, setCorPrimaria] = useState("#0b7030")
  const [logo, setLogo] = useState(null)
  const [banner, setBanner] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [bannerPreview, setBannerPreview] = useState("")
  const [enviando, setEnviando] = useState(false)
  const [erro, setErro] = useState("")
  const navigate = useNavigate()

  useEffect(() => {
    return () => {
      if (logoPreview) URL.revokeObjectURL(logoPreview)
      if (bannerPreview) URL.revokeObjectURL(bannerPreview)
    }
  }, [logoPreview, bannerPreview])

  const selecionarImagem = (arquivo, tipo) => {
    if (!arquivo) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(arquivo.type)) {
      setErro("Use uma imagem JPEG, PNG ou WebP.")
      return
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setErro("Cada imagem pode ter no máximo 5 MB.")
      return
    }
    setErro("")
    const url = URL.createObjectURL(arquivo)
    if (tipo === "logo") {
      setLogo(arquivo)
      setLogoPreview(url)
    } else {
      setBanner(arquivo)
      setBannerPreview(url)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (enviando) return

    setErro("")
    setEnviando(true)
    const formData = new FormData()
    formData.append("nomeLoja", nomeLoja.trim())
    formData.append("email", email.trim())
    formData.append("senha", senha)
    formData.append("whatsapp", whatsapp.replace(/\D/g, ""))
    formData.append("corPrimaria", corPrimaria)
    if (logo) formData.append("logo", logo)
    if (banner) formData.append("banner", banner)

    try {
      const res = await axios.post(`${API_URL}/auth/register`, formData)
      localStorage.setItem("token", res.data.token)
      localStorage.setItem("role", "lojista")
      localStorage.setItem("slugLoja", res.data.slug || "")
      window.dispatchEvent(new Event("storage"))
      navigate("/welcome")
    } catch (err) {
      setErro(err.response?.data?.erro || "Não foi possível criar sua loja. Tente novamente.")
    } finally {
      setEnviando(false)
    }
  }

  const campo = "w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-600 focus:ring-4 focus:ring-green-600/10"
  const label = "mb-1.5 block text-sm font-medium text-slate-700"

  return (
    <main className="min-h-screen bg-[#f7faf8] px-4 py-10 sm:px-6 lg:py-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 text-slate-900 no-underline">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-green-700 text-white"><Store size={18} /></span>
            <span className="font-semibold tracking-tight">Catálogo Digital</span>
          </Link>
          <p className="text-sm text-slate-500">Já tem uma conta? <Link className="font-semibold text-green-800 hover:underline" to="/login">Entrar</Link></p>
        </div>

        <div className="grid overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_24px_80px_-42px_rgba(15,23,42,.25)] lg:grid-cols-[1.1fr_.9fr]">
          <section className="p-6 sm:p-10 lg:p-12">
            <div className="mb-8">
              <span className="mb-4 inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-800"><Check size={14} /> Cadastro após confirmação do pagamento</span>
              <h1 className="text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Crie sua loja online</h1>
              <p className="mt-3 max-w-lg text-sm leading-6 text-slate-600 sm:text-base">Personalize seu catálogo e compartilhe seus produtos com os clientes pelo WhatsApp.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className={label} htmlFor="nomeLoja">Nome da loja</label>
                <input id="nomeLoja" className={campo} placeholder="Ex.: Mercado da Praça" value={nomeLoja} onChange={e => setNomeLoja(e.target.value)} required maxLength={60} />
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="email">E-mail</label>
                  <input id="email" className={campo} type="email" autoComplete="email" placeholder="voce@exemplo.com" value={email} onChange={e => setEmail(e.target.value)} required />
                </div>
                <div>
                  <label className={label} htmlFor="senha">Senha</label>
                  <input id="senha" className={campo} type="password" autoComplete="new-password" placeholder="Crie uma senha" value={senha} onChange={e => setSenha(e.target.value)} required minLength={6} />
                </div>
              </div>

              <div>
                <label className={label} htmlFor="whatsapp">WhatsApp <span className="font-normal text-slate-400">(opcional)</span></label>
                <input id="whatsapp" className={campo} type="tel" inputMode="tel" placeholder="(11) 91234-5678" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                <p className="mt-1.5 text-xs text-slate-500">Você também pode configurar esse número no próximo passo.</p>
              </div>

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className={label} htmlFor="corPrimaria">Cor da loja</label>
                  <div className="flex items-center gap-3 rounded-xl border border-slate-200 p-2.5">
                    <input id="corPrimaria" aria-label="Escolher cor principal" type="color" value={corPrimaria} onChange={e => setCorPrimaria(e.target.value)} className="h-9 w-11 cursor-pointer rounded-lg border-0 bg-transparent p-0" />
                    <span className="text-sm text-slate-600">Personalize sua identidade</span>
                    <Palette className="ml-auto text-slate-400" size={17} />
                  </div>
                </div>
                <div>
                  <label className={label} htmlFor="logo">Logo <span className="font-normal text-slate-400">(opcional)</span></label>
                  <label htmlFor="logo" className="flex h-[58px] cursor-pointer items-center gap-3 rounded-xl border border-dashed border-slate-300 px-3 text-sm text-slate-600 transition hover:border-green-600 hover:bg-green-50/50">
                    {logoPreview ? <img src={logoPreview} alt="Prévia da logo" className="h-9 w-9 rounded-lg object-cover" /> : <ImagePlus size={19} className="text-slate-400" />}
                    <span className="truncate">{logo?.name || "Enviar logo"}</span>
                    <input id="logo" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e => selecionarImagem(e.target.files?.[0], "logo")} />
                  </label>
                </div>
              </div>

              <div>
                <label className={label} htmlFor="banner">Banner <span className="font-normal text-slate-400">(opcional)</span></label>
                <label htmlFor="banner" className="flex h-16 cursor-pointer items-center gap-3 overflow-hidden rounded-xl border border-dashed border-slate-300 px-4 text-sm text-slate-600 transition hover:border-green-600 hover:bg-green-50/50">
                  {bannerPreview ? <img src={bannerPreview} alt="Prévia do banner" className="h-11 w-16 rounded-lg object-cover" /> : <Upload size={18} className="text-slate-400" />}
                  <span className="truncate">{banner?.name || "Escolher imagem para o banner"}</span>
                  <input id="banner" type="file" accept="image/jpeg,image/png,image/webp" className="sr-only" onChange={e => selecionarImagem(e.target.files?.[0], "banner")} />
                </label>
              </div>

              {erro && <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}

              <button type="submit" disabled={enviando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-5 py-3.5 font-semibold text-white shadow-lg shadow-green-800/15 transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-60">
                {enviando ? "Criando sua loja..." : "Criar minha loja"} {!enviando && <ArrowRight size={18} />}
              </button>
              <p className="text-center text-xs leading-5 text-slate-500">Este e-mail precisa ter um pagamento confirmado. <Link to="/interesse" className="font-semibold text-green-800">Ver plano anual</Link></p>
            </form>
          </section>

          <aside className="relative mt-4 flex min-h-[580px] flex-col justify-between overflow-hidden bg-[#10261b] p-6 text-white sm:p-10 lg:mt-0 lg:min-h-full">
            <div className="absolute -right-24 -top-24 h-80 w-80 rounded-full bg-green-500/15 blur-3xl" />
            <div className="relative z-10">
              <p className="text-sm font-medium text-green-300">Sua loja, do seu jeito</p>
              <h2 className="mt-3 max-w-sm text-3xl font-semibold leading-tight">Uma vitrine profissional pronta para compartilhar.</h2>
              <p className="mt-4 max-w-sm text-sm leading-6 text-slate-300">Veja sua identidade ganhar forma enquanto você preenche os dados.</p>
            </div>

            <div className="relative z-10 mx-auto w-full max-w-sm rounded-[2rem] border-[8px] border-slate-900 bg-white p-3 text-slate-900 shadow-2xl shadow-black/30">
              <div className="mb-3 flex items-center gap-3 px-1">
                {logoPreview ? <img src={logoPreview} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="flex h-11 w-11 items-center justify-center rounded-full bg-green-50 text-green-800"><Store size={20} /></div>}
                <div className="min-w-0"><p className="truncate text-sm font-semibold">{nomeLoja || "Nome da sua loja"}</p><p className="text-xs text-slate-500">Catálogo online</p></div>
              </div>
              <div className="h-32 overflow-hidden rounded-2xl bg-slate-100">
                {bannerPreview ? <img src={bannerPreview} alt="" className="h-full w-full object-cover" /> : <div className="flex h-full items-center justify-center text-slate-300"><ImagePlus size={28} /></div>}
              </div>
              <div className="mt-3 flex items-center justify-between"><div><p className="text-xs font-medium text-slate-500">Destaque da loja</p><p className="mt-1 text-sm font-semibold">Seus produtos em evidência</p></div><span className="flex h-9 w-9 items-center justify-center rounded-xl text-white" style={{ backgroundColor: corPrimaria }}><ArrowRight size={16} /></span></div>
              <div className="mt-3 grid grid-cols-2 gap-2">{["Produto exemplo", "Novidades"].map((item, i) => <div key={item} className="rounded-xl bg-slate-50 p-2.5"><div className={`mb-2 h-14 rounded-lg ${i ? "bg-amber-50" : "bg-green-50"}`} /><p className="text-[10px] font-medium">{item}</p><p className="mt-1 text-[10px] font-semibold" style={{ color: corPrimaria }}>A partir de R$ 9,90</p></div>)}</div>
            </div>

            <div className="relative z-10 flex items-center gap-2 text-xs text-slate-300"><Check size={15} className="text-green-300" /> Simples de configurar, fácil de compartilhar.</div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default Cadastro
