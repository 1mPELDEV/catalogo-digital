import { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModalConfirmacao from '../components/modalConfirmacao'
import { ArrowUpRight, BadgePercent, Boxes, Check, ExternalLink, Home, LayoutGrid, MessageCircle, Package, Plus, Pencil, Share2, Settings, Store, Trash2, Tag, ChevronRight, X, Image } from 'lucide-react'
import { useLoja } from '../hooks/useLoja'
import EditarLoja from '../components/admin/EditarLoja'

const API_URL = import.meta.env.VITE_API_URL

function Admin() {
  const [produtos, setProdutos] = useState([])
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [imagemFile, setImagemFile] = useState(null)
  const [imagemPreview, setImagemPreview] = useState("")
  const [imagemAtual, setImagemAtual] = useState("") // URL já salva no produto (edição)
  const [descricao, setDescricao] = useState('')
  const [editandoId, setEditandoId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState(null)
  const [promocao, setPromocao] = useState(false)
  const [desconto, setDesconto] = useState(0)
  const [categoria, setCategoria] = useState("")
  const [categorias, setCategorias] = useState([])
  const [mostrarForm, setMostrarForm] = useState(false)
  const [mostrarFormCategoria, setMostrarFormCategoria] = useState(false)
  const [nomeCategoria, setNomeCategoria] = useState("")
  const [criandoCategoria, setCriandoCategoria] = useState(false)
  const [abaAtiva, setAbaAtiva] = useState("inicio")

  const fileInputRef = useRef(null)
  const formularioProdutoRef = useRef(null)
  const nomeProdutoRef = useRef(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")
  const loja = useLoja()
  const linkLoja = loja?.slug ? `${window.location.origin}/${loja.slug}` : ""
  const produtosEmPromocao = produtos.filter(produto => produto.promocao?.ativa).length

  useEffect(() => { if (!token) navigate("/") }, [navigate, token])

  useEffect(() => {
    if (!mostrarForm) return
    const frame = requestAnimationFrame(() => {
      formularioProdutoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      nomeProdutoRef.current?.focus({ preventScroll: true })
    })
    return () => cancelAnimationFrame(frame)
  }, [mostrarForm])

  const buscarProdutos = useCallback(async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/produtos`, { headers: { Authorization: `Bearer ${token}` } })
      setProdutos(res.data)
      return res.data
    } catch { toast.error("Erro ao buscar produtos") }
    finally { setLoading(false) }
  }, [token])

  const buscarCategorias = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/categorias`, { headers: { Authorization: `Bearer ${token}` } })
      setCategorias(res.data)
    } catch { toast.error("Erro ao buscar categorias") }
  }, [token])

  const criarCategoria = async () => {
    if (!nomeCategoria.trim()) return toast.warning("Digite o nome da categoria!")
    try {
      setCriandoCategoria(true)
      const res = await axios.post(`${API_URL}/categorias`, { nome: nomeCategoria }, { headers: { Authorization: `Bearer ${token}` } })
      setCategorias(prev => [...prev, res.data])
      setCategoria(res.data.nome)
      setNomeCategoria("")
      setMostrarFormCategoria(false)
      toast.success(`Categoria "${res.data.nome}" criada!`)
    } catch (err) {
      toast.error(err.response?.data?.erro || "Erro ao criar categoria")
    } finally { setCriandoCategoria(false) }
  }

  const deletarCategoria = async (id, nomecat) => {
    try {
      await axios.delete(`${API_URL}/categorias/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      setCategorias(prev => prev.filter(c => c._id !== id))
      if (categoria === nomecat) setCategoria("")
      toast.success("Categoria removida!")
    } catch { toast.error("Erro ao remover categoria") }
  }

  useEffect(() => {
    const carregar = async () => {
      const dados = await buscarProdutos()
      if (dados) toast.info(`👋 Bem vindo(a)! Você tem ${dados.length} produtos cadastrados.`, { autoClose: 4000 })
      await buscarCategorias()
    }
    carregar()
  }, [buscarProdutos, buscarCategorias])

  const limparForm = () => {
    setNome(''); setPreco(''); setDescricao('')
    setCategoria(''); setDesconto(0); setPromocao(false); setEditandoId(null)
    setMostrarForm(false); setMostrarFormCategoria(false); setNomeCategoria("")
    setImagemFile(null); setImagemPreview(""); setImagemAtual("")
  }

  const buildFormData = () => {
    const fd = new FormData()
    fd.append("nome", nome)
    fd.append("preco", preco)
    fd.append("descricao", descricao)
    fd.append("categoria", categoria)
    fd.append("promocao_ativa", promocao)
    fd.append("promocao_desconto", desconto)
    if (imagemFile) fd.append("imagem", imagemFile)
    else if (imagemAtual) fd.append("imagem", imagemAtual)
    return fd
  }

  const criarProduto = () => {
    if (!nome.trim()) return toast.warning("O nome não pode ficar vazio!")
    if (!preco || preco <= 0) return toast.warning("O preço deve ser maior que 0!")
    if (!categoria) return toast.warning("Selecione uma categoria!")
    axios.post(`${API_URL}/produtos`, buildFormData(), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    }).then(() => { limparForm(); toast.success("Produto criado!"); buscarProdutos() })
      .catch(() => toast.error("Erro ao criar produto"))
  }

  const atualizarProduto = (id) => {
    if (!nome.trim()) return toast.warning("O nome não pode ficar vazio!")
    if (!preco || preco <= 0) return toast.warning("O preço deve ser maior que 0!")
    axios.put(`${API_URL}/produtos/${id}`, buildFormData(), {
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" }
    }).then(() => { limparForm(); toast.success("Produto atualizado!"); buscarProdutos() })
      .catch(() => toast.error("Erro ao atualizar produto"))
  }

  const deletarProduto = async () => {
    if (!produtoSelecionado) return
    try {
      await axios.delete(`${API_URL}/produtos/${produtoSelecionado._id}`, { headers: { Authorization: `Bearer ${token}` } })
      toast.success("Produto deletado!")
      setMostrarConfirmacao(false)
      setProdutoSelecionado(null)
      buscarProdutos()
    } catch { toast.error("Erro ao deletar produto") }
  }

  const editarProduto = (produto) => {
    setNome(produto.nome)
    setPreco(produto.preco)
    setDescricao(produto.descricao || '')
    setImagemFile(null)
    setImagemAtual(produto.imagem || '')
    setImagemPreview(produto.imagem || '')
    setEditandoId(produto._id)
    setCategoria(produto.categoria || "")
    setDesconto(produto.promocao?.desconto || 0)
    setPromocao(produto.promocao?.ativa || false)
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFile = (file) => {
    if (!file) return
    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Use uma imagem JPEG, PNG ou WebP.")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("A imagem pode ter no máximo 5 MB.")
      return
    }
    if (imagemPreview.startsWith("blob:")) URL.revokeObjectURL(imagemPreview)
    setImagemFile(file)
    setImagemPreview(URL.createObjectURL(file))
  }

  const compartilharLoja = async () => {
    if (!linkLoja) return
    try {
      await navigator.clipboard.writeText(linkLoja)
      toast.success("Link da loja copiado!")
    } catch {
      toast.error("Não foi possível copiar o link")
    }
  }

  return (
    <>
      <ToastContainer />
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .admin-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e2e2; border-radius: 10px; font-size: 14px; font-family: inherit; color: #0f0f0f; outline: none; transition: border-color 0.15s; background: #fff; }
        .admin-input:focus { border-color: #0f0f0f; }
        .btn-dark { background: #0f0f0f; color: #fff; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: background 0.15s; font-family: inherit; }
        .btn-dark:hover { background: #333; }
        .btn-outline { background: transparent; color: #0f0f0f; padding: 10px 20px; border-radius: 10px; font-size: 14px; font-weight: 500; border: 1.5px solid #e2e2e2; cursor: pointer; display: inline-flex; align-items: center; gap: 8px; transition: all 0.15s; font-family: inherit; }
        .btn-outline:hover { border-color: #aaa; background: #fafafa; }
        .btn-danger { background: transparent; color: #dc2626; padding: 8px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; border: 1.5px solid #fecaca; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: all 0.15s; font-family: inherit; }
        .btn-danger:hover { background: #fef2f2; border-color: #dc2626; }
        .btn-green { background: #16a34a; color: #fff; padding: 8px 16px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; transition: background 0.15s; font-family: inherit; }
        .btn-green:hover { background: #15803d; }
        .btn-ghost { background: transparent; color: #888; padding: 6px 10px; border-radius: 8px; font-size: 13px; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 4px; transition: all 0.15s; font-family: inherit; }
        .btn-ghost:hover { background: #f0f0f0; color: #333; }
        .card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; }
        .produto-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 14px; overflow: hidden; transition: box-shadow 0.15s; }
        .produto-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
        .badge { display: inline-flex; align-items: center; gap: 4px; background: #fef9c3; border: 1px solid #fde047; color: #854d0e; font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: 999px; }
        .categoria-badge { display: inline-flex; align-items: center; gap: 4px; background: #f0f9ff; border: 1px solid #bae6fd; color: #0369a1; font-size: 11px; font-weight: 500; padding: 3px 8px; border-radius: 999px; }
        .cat-chip { display: inline-flex; align-items: center; gap: 6px; background: #f4f4f5; border: 1px solid #e4e4e7; border-radius: 8px; padding: 5px 10px; font-size: 13px; color: #333; }
        .cat-chip button { background: none; border: none; cursor: pointer; color: #aaa; display: flex; padding: 0; transition: color 0.15s; }
        .cat-chip button:hover { color: #dc2626; }
        .dropzone { border: 1.5px dashed #d4d4d4; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: border-color 0.15s, background 0.15s; background: #fafafa; }
        .dropzone:hover { border-color: #aaa; background: #f4f4f4; }
        .dropzone.tem-imagem { padding: 0; border-style: solid; border-color: #e2e2e2; overflow: hidden; }
        .admin-layout { display: grid; grid-template-columns: 220px minmax(0, 1fr); gap: 22px; align-items: start; }
        .admin-sidebar { position: sticky; top: 82px; }
        .admin-nav-link { display: flex; align-items: center; gap: 10px; width: 100%; border: 0; border-radius: 10px; background: transparent; padding: 10px 12px; color: #475569; text-decoration: none; text-align: left; font-size: 13px; font-weight: 500; cursor: pointer; }
        .admin-nav-link:hover, .admin-nav-link.active { background: #edf8f0; color: #166534; }
        @media (max-width: 850px) { .admin-layout { grid-template-columns: minmax(0, 1fr); } .admin-sidebar { position: static; } .admin-sidebar nav { display: flex; overflow-x: auto; gap: 4px; } .admin-sidebar .admin-nav-link { width: auto; white-space: nowrap; } .admin-sidebar-note { display: none; } }
      `}</style>

      <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f7faf8", minHeight: "100vh" }}>
        <div className="admin-layout" style={{ maxWidth: 1380, margin: "0 auto", padding: "28px 24px" }}>
          <aside className="admin-sidebar">
            <div style={{ marginBottom: 10, padding: "8px 12px", fontSize: 11, fontWeight: 700, color: "#94a3b8", letterSpacing: ".12em" }}>MENU DA LOJA</div>
            <nav aria-label="Navegação do painel">
              <button type="button" className={`admin-nav-link ${abaAtiva === "inicio" ? "active" : ""}`} onClick={() => setAbaAtiva("inicio")}><Home size={16} /> Visão geral</button>
              <button type="button" className="admin-nav-link" onClick={() => { setAbaAtiva("inicio"); setTimeout(() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" }), 0) }}><Package size={16} /> Produtos</button>
              <button type="button" className="admin-nav-link" onClick={() => { setAbaAtiva("inicio"); limparForm(); setMostrarForm(true); setMostrarFormCategoria(true); setTimeout(() => document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth" }), 0) }}><LayoutGrid size={16} /> Categorias</button>
              {linkLoja && <a className="admin-nav-link" href={linkLoja} target="_blank" rel="noreferrer"><Store size={16} /> Minha loja <ExternalLink size={13} style={{ marginLeft: "auto" }} /></a>}
              <button type="button" className={`admin-nav-link ${abaAtiva === "loja" ? "active" : ""}`} onClick={() => setAbaAtiva("loja")}><Settings size={16} /> Editar minha loja</button>
            </nav>
            <div className="admin-sidebar-note" style={{ marginTop: 20, border: "1px solid #e5ece7", borderRadius: 16, padding: 15, background: "#fff" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#166534", fontSize: 12, fontWeight: 600 }}><MessageCircle size={15} /> Atendimento pelo WhatsApp</div>
              <p style={{ margin: "8px 0 0", fontSize: 11, lineHeight: 1.6, color: "#64748b" }}>Os pedidos são enviados direto para o WhatsApp configurado na sua loja.</p>
            </div>
          </aside>

          <main>

          {abaAtiva === "loja" ? <EditarLoja key={loja?._id || "loja"} loja={loja} token={token} linkLoja={linkLoja} /> : <>
          {/* HEADER */}
          <div id="visao-geral" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <p style={{ fontSize: 13, fontWeight: 600, color: "#15803d", marginBottom: 8 }}>PAINEL DA LOJA</p>
              <h1 style={{ fontSize: 30, fontWeight: 700, letterSpacing: "-0.035em", color: "#10261b", marginBottom: 5 }}>Olá{loja?.nome ? `, ${loja.nome}` : ""}!</h1>
              <p style={{ fontSize: 14, color: "#64748b" }}>Acompanhe seu catálogo e mantenha sua loja atualizada.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
              {linkLoja && <a href={linkLoja} target="_blank" rel="noreferrer" className="btn-outline" style={{ textDecoration: "none" }}><ExternalLink size={15} /> Ver minha loja</a>}
              <button className="btn-dark" onClick={() => { limparForm(); setMostrarForm(!mostrarForm) }}><Plus size={16} /> Adicionar produto</button>
            </div>
          </div>

          {/* INDICADORES DO CATÁLOGO */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))", gap: 14, marginBottom: 20 }}>
            {[
              { titulo: "Produtos cadastrados", valor: produtos.length, Icone: Package, nota: produtos.length ? "No seu catálogo" : "Adicione o primeiro produto" },
              { titulo: "Categorias", valor: categorias.length, Icone: Boxes, nota: "Organização da vitrine" },
              { titulo: "Em promoção", valor: produtosEmPromocao, Icone: BadgePercent, nota: "Ofertas ativas" },
            ].map(stat => (
              <div key={stat.titulo} style={{ background: "#fff", border: "1px solid #e5ece7", borderRadius: 16, padding: 18, boxShadow: "0 5px 18px rgba(16,38,27,0.03)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 500, color: "#64748b" }}>{stat.titulo}</span>
                  <span style={{ display: "grid", placeItems: "center", width: 34, height: 34, borderRadius: 11, background: "#edf8f0", color: "#15803d" }}><stat.Icone size={17} /></span>
                </div>
                <p style={{ margin: "13px 0 3px", fontSize: 28, lineHeight: 1, fontWeight: 700, letterSpacing: "-0.04em", color: "#10261b" }}>{stat.valor}</p>
                <p style={{ margin: 0, fontSize: 12, color: "#94a3b8" }}>{stat.nota}</p>
              </div>
            ))}
            <div style={{ background: "#edf8f0", border: "1px solid #d4ead9", borderRadius: 16, padding: 18, display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 126 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 9, color: "#166534" }}><Store size={17} /><span style={{ fontSize: 13, fontWeight: 600 }}>Compartilhe sua loja</span></div>
              <button type="button" onClick={compartilharLoja} disabled={!linkLoja} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", border: 0, background: "transparent", padding: "10px 0 0", textAlign: "left", color: "#14532d", fontSize: 13, fontWeight: 600, cursor: linkLoja ? "pointer" : "not-allowed", opacity: linkLoja ? 1 : 0.5 }}><span>{linkLoja ? "Copiar link público" : "Carregando link..."}</span>{linkLoja ? <Share2 size={15} /> : <ArrowUpRight size={15} />}</button>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "flex-start", gap: 10, border: "1px solid #dbeafe", background: "#eff6ff", color: "#1e3a8a", borderRadius: 14, padding: "12px 15px", marginBottom: 26, fontSize: 13, lineHeight: 1.5 }}>
            <Check size={16} style={{ marginTop: 1, flexShrink: 0 }} />
            Os pedidos são enviados diretamente para o WhatsApp da loja.
          </div>

          <div id="produtos" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, gap: 12, flexWrap: "wrap" }}>
            <div><h2 style={{ margin: 0, fontSize: 20, fontWeight: 650, color: "#10261b" }}>Seus produtos</h2><p style={{ margin: "5px 0 0", fontSize: 13, color: "#64748b" }}>{produtos.length} produto{produtos.length !== 1 ? "s" : ""} no catálogo</p></div>
            {categorias.length > 0 && <span style={{ borderRadius: 999, background: "#fff", border: "1px solid #e5ece7", padding: "6px 11px", color: "#64748b", fontSize: 12 }}>{categorias.length} categoria{categorias.length !== 1 ? "s" : ""}</span>}
          </div>

          {/* FORMULÁRIO */}
          {mostrarForm && (
            <div ref={formularioProdutoRef} className="card" style={{ padding: 28, marginBottom: 32, scrollMarginTop: 24 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 24, color: "#0f0f0f" }}>
                {editandoId ? "Editar produto" : "Novo produto"}
              </h2>

              {/* LINHA 1 — nome e preço */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input ref={nomeProdutoRef} className="admin-input" placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} />
                <input className="admin-input" type="number" placeholder="Preço (R$)" value={preco ?? ""} onChange={e => setPreco(e.target.value)} />
              </div>

              {/* DESCRIÇÃO */}
              <input className="admin-input" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} style={{ marginBottom: 16 }} />

              {/* IMAGEM — somente upload */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 8 }}>Imagem do produto</p>

                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  onChange={e => handleFile(e.target.files[0])}
                />
                <div
                  className={`dropzone ${imagemPreview ? "tem-imagem" : ""}`}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={e => e.preventDefault()}
                  onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
                >
                  {imagemPreview ? (
                    <div style={{ position: "relative", width: "100%" }}>
                      <img src={imagemPreview} alt="" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
                      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0)", display: "flex", alignItems: "center", justifyContent: "center", opacity: 0, transition: "all 0.15s" }}
                        onMouseEnter={e => { e.currentTarget.style.background = "rgba(0,0,0,0.4)"; e.currentTarget.style.opacity = 1 }}
                        onMouseLeave={e => { e.currentTarget.style.background = "rgba(0,0,0,0)"; e.currentTarget.style.opacity = 0 }}
                      >
                        <span style={{ color: "#fff", fontSize: 13, fontWeight: 500 }}>Trocar imagem</span>
                      </div>
                    </div>
                  ) : (
                    <>
                      <Image size={28} color="#ccc" />
                      <p style={{ fontSize: 14, color: "#888", margin: 0 }}>Clique ou arraste uma imagem</p>
                      <p style={{ fontSize: 12, color: "#bbb", margin: 0 }}>JPG, PNG, WEBP até 5MB</p>
                    </>
                  )}
                </div>
              </div>

              {/* CATEGORIA */}
              <div style={{ marginBottom: 16 }}>
                <select className="admin-input" value={categoria} onChange={e => setCategoria(e.target.value)} style={{ marginBottom: 8 }}>
                  <option value="">Selecione uma categoria</option>
                  {categorias.map(cat => (
                    <option key={cat._id} value={cat.nome}>{cat.nome}</option>
                  ))}
                </select>

                {categorias.length > 0 && (
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 10 }}>
                    {categorias.map(cat => (
                      <div key={cat._id} className="cat-chip">
                        <Tag size={11} /> {cat.nome}
                        <button onClick={() => deletarCategoria(cat._id, cat.nome)}><X size={12} /></button>
                      </div>
                    ))}
                  </div>
                )}

                {!mostrarFormCategoria ? (
                  <button className="btn-ghost" onClick={() => setMostrarFormCategoria(true)}>
                    <Plus size={13} /> Nova categoria
                  </button>
                ) : (
                  <div style={{ display: "flex", gap: 8, alignItems: "center", marginTop: 4 }}>
                    <input
                      className="admin-input"
                      placeholder="Nome da categoria"
                      value={nomeCategoria}
                      onChange={e => setNomeCategoria(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && criarCategoria()}
                      autoFocus
                      style={{ maxWidth: 220 }}
                    />
                    <button className="btn-green" onClick={criarCategoria} disabled={criandoCategoria}>
                      {criandoCategoria ? "..." : "Criar"}
                    </button>
                    <button className="btn-ghost" onClick={() => { setMostrarFormCategoria(false); setNomeCategoria("") }}>
                      <X size={14} />
                    </button>
                  </div>
                )}
              </div>

              {/* PROMOÇÃO */}
              <label style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 14, color: "#444", marginBottom: 12, cursor: "pointer" }}>
                <input type="checkbox" checked={promocao} onChange={e => setPromocao(e.target.checked)} />
                Produto em promoção 🔥
              </label>

              {promocao && (
                <input
                  className="admin-input"
                  type="number"
                  placeholder="Valor do desconto (R$)"
                  value={desconto ?? ""}
                  onChange={e => setDesconto(Number(e.target.value))}
                  style={{ maxWidth: 240, marginBottom: 16 }}
                />
              )}

              {/* BOTÕES */}
              <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                <button className="btn-dark" onClick={() => editandoId ? atualizarProduto(editandoId) : criarProduto()}>
                  {editandoId ? "Salvar alterações" : "Criar produto"} <ChevronRight size={15} />
                </button>
                <button className="btn-outline" onClick={limparForm}>Cancelar</button>
              </div>
            </div>
          )}

          {/* LISTA */}
          {loading && <div style={{ textAlign: "center", padding: 48, color: "#888", fontSize: 14 }}>Carregando produtos...</div>}

          {!loading && produtos.length === 0 && (
            <div style={{ textAlign: "center", padding: 64, color: "#aaa" }}>
              <Package size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
              <p style={{ fontSize: 15 }}>Nenhum produto cadastrado ainda.</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Clique em "Novo produto" para começar.</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
            {!loading && produtos.map(produto => (
              <div key={produto._id} className="produto-card">
                {produto.imagem ? (
                  <img src={produto.imagem} alt={produto.nome} style={{ width: "100%", height: 160, objectFit: "cover" }} />
                ) : (
                  <div style={{ width: "100%", height: 160, background: "#f4f4f5", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Package size={32} color="#ccc" />
                  </div>
                )}
                <div style={{ padding: 16 }}>
                  <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, marginBottom: 8 }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f0f0f", lineHeight: 1.3 }}>{produto.nome}</h3>
                    {produto.promocao?.ativa && <span className="badge">🔥 Promo</span>}
                  </div>
                  {produto.categoria && (
                    <span className="categoria-badge" style={{ marginBottom: 10, display: "inline-flex" }}>
                      <Tag size={10} /> {produto.categoria}
                    </span>
                  )}
                  <p style={{ fontSize: 18, fontWeight: 600, color: "#0f0f0f", marginBottom: 4 }}>
                    R$ {Number(produto.preco).toFixed(2)}
                  </p>
                  {produto.promocao?.ativa && (
                    <p style={{ fontSize: 12, color: "#dc2626", marginBottom: 12 }}>
                      Desconto: R$ {produto.promocao.desconto}
                    </p>
                  )}
                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button className="btn-outline" style={{ flex: 1, padding: "8px 12px", fontSize: 13, justifyContent: "center" }} onClick={() => editarProduto(produto)}>
                      <Pencil size={13} /> Editar
                    </button>
                    <button className="btn-danger" onClick={() => { setProdutoSelecionado(produto); setMostrarConfirmacao(true) }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          </>}
          </main>
        </div>
      </div>

      <ModalConfirmacao
        aberto={mostrarConfirmacao}
        titulo="Tem certeza?"
        mensagem={`Deseja deletar "${produtoSelecionado?.nome}"?`}
        onConfirmar={deletarProduto}
        onCancelar={() => { setMostrarConfirmacao(false); setProdutoSelecionado(null) }}
      />
    </>
  )
}

export default Admin
