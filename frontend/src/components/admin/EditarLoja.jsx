import { useState } from "react"
import axios from "axios"
import { ImagePlus, Save, Store } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function EditarLoja({ loja, token, linkLoja }) {
  const [nome, setNome] = useState(loja?.nome || "")
  const [whatsapp, setWhatsapp] = useState(loja?.contato?.whatsapp || "")
  const [corPrimaria, setCorPrimaria] = useState(loja?.tema?.corPrimaria || "#16a34a")
  const [logo, setLogo] = useState(null)
  const [banner, setBanner] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")
  const [bannerPreview, setBannerPreview] = useState("")
  const [salvando, setSalvando] = useState(false)
  const [mensagem, setMensagem] = useState("")

  const escolherImagem = (arquivo, setArquivo, setPreview) => {
    if (!arquivo) return
    if (!arquivo.type.startsWith("image/")) {
      setMensagem("Selecione um arquivo de imagem.")
      return
    }
    if (arquivo.size > 5 * 1024 * 1024) {
      setMensagem("A imagem deve ter no máximo 5 MB.")
      return
    }
    setMensagem("")
    setArquivo(arquivo)
    setPreview(URL.createObjectURL(arquivo))
  }

  const salvar = async (event) => {
    event.preventDefault()
    const numero = whatsapp.replace(/\D/g, "")
    if (!nome.trim()) return setMensagem("Informe o nome da loja.")
    if (numero.length < 10 || numero.length > 13) return setMensagem("Confira o número do WhatsApp.")

    const numeroCompleto = numero.startsWith("55") ? numero : `55${numero}`
    const dados = new FormData()
    dados.append("nome", nome.trim())
    dados.append("whatsapp", numeroCompleto)
    dados.append("corPrimaria", corPrimaria)
    if (logo) dados.append("logo", logo)
    if (banner) dados.append("banner", banner)

    try {
      setSalvando(true)
      setMensagem("")
      await axios.put(`${API_URL}/loja`, dados, {
        headers: { Authorization: `Bearer ${token}` }
      })
      window.dispatchEvent(new Event("store:updated"))
      setLogo(null)
      setBanner(null)
      setLogoPreview("")
      setBannerPreview("")
      setMensagem("Alterações salvas com sucesso.")
    } catch (error) {
      setMensagem(error.response?.data?.erro || "Não foi possível salvar as alterações.")
    } finally {
      setSalvando(false)
    }
  }

  const campo = { display: "grid", gap: 7, color: "#334155", fontSize: 13, fontWeight: 600 }
  const imagemBox = (titulo, arquivo, preview, urlAtual, atualizar, atualizarPreview) => (
    <label style={{ ...campo, cursor: "pointer" }}>
      {titulo}
      <div style={{ position: "relative", height: titulo === "Banner da loja" ? 190 : 150, border: "1px dashed #cbd5e1", borderRadius: 12, overflow: "hidden", background: "#f8fafc", display: "grid", placeItems: "center" }}>
        {(preview || urlAtual) ? (
          <img src={preview || urlAtual} alt={`Prévia: ${titulo}`} style={{ width: "100%", height: "100%", objectFit: titulo === "Banner da loja" ? "cover" : "contain" }} />
        ) : <span style={{ color: "#94a3b8", display: "grid", justifyItems: "center", gap: 8 }}><ImagePlus size={24} />Adicionar imagem</span>}
        <input type="file" accept="image/jpeg,image/png,image/webp" style={{ position: "absolute", inset: 0, opacity: 0, cursor: "pointer" }} onChange={e => escolherImagem(e.target.files[0], atualizar, atualizarPreview)} />
      </div>
      <span style={{ color: "#94a3b8", fontSize: 11, fontWeight: 400 }}>JPG, PNG ou WEBP · até 5 MB</span>
    </label>
  )

  return (
    <section style={{ maxWidth: 900 }}>
      <header style={{ marginBottom: 22 }}>
        <p style={{ margin: "0 0 7px", color: "#15803d", fontSize: 12, fontWeight: 700, letterSpacing: ".1em" }}>PERSONALIZAÇÃO</p>
        <h1 style={{ margin: "0 0 6px", color: "#10261b", fontSize: 28 }}>Editar minha loja</h1>
        <p style={{ margin: 0, color: "#64748b", fontSize: 14 }}>Atualize a identidade visual e os dados de contato do seu catálogo.</p>
      </header>

      <form onSubmit={salvar} style={{ display: "grid", gap: 18 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {imagemBox("Logo da loja", logo, logoPreview, loja?.logo, setLogo, setLogoPreview)}
          {imagemBox("Banner da loja", banner, bannerPreview, loja?.banner, setBanner, setBannerPreview)}
        </div>

        <div style={{ background: "#fff", border: "1px solid #e5ece7", borderRadius: 16, padding: 22, display: "grid", gap: 17 }}>
          <label style={campo} htmlFor="nome-loja">Nome da loja
            <input id="nome-loja" className="admin-input" value={nome} onChange={e => setNome(e.target.value)} minLength={2} maxLength={60} required placeholder="Ex.: Minha Loja" />
          </label>
          <label style={campo}>WhatsApp para receber pedidos
            <input className="admin-input" type="tel" inputMode="tel" value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="(11) 99999-9999" />
          </label>
          <label style={{ ...campo, gridTemplateColumns: "1fr auto", alignItems: "center" }}>Cor principal da loja
            <input aria-label="Cor principal" type="color" value={corPrimaria} onChange={e => setCorPrimaria(e.target.value)} style={{ width: 48, height: 38, padding: 2, border: "1px solid #e2e8f0", borderRadius: 8, background: "#fff", cursor: "pointer" }} />
          </label>
        </div>

        {mensagem && <p role="status" style={{ margin: 0, padding: "12px 14px", borderRadius: 10, background: mensagem.includes("sucesso") ? "#edf8f0" : "#fff7ed", color: mensagem.includes("sucesso") ? "#166534" : "#9a3412", fontSize: 13 }}>{mensagem}</p>}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
          <button className="btn-dark" type="submit" disabled={salvando}><Save size={15} />{salvando ? "Salvando..." : "Salvar alterações"}</button>
          {linkLoja && <a href={linkLoja} target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}><Store size={15} /> Ver loja pública</a>}
        </div>
      </form>
    </section>
  )
}

export default EditarLoja
