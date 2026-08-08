import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from "axios"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModalConfirmacao from '../components/modalConfirmacao'
import { Package, Plus, Pencil, Trash2, Tag, ChevronRight, X, Upload, Link as LinkIcon, Image } from 'lucide-react'

const API_URL = import.meta.env.VITE_API_URL

function Admin() {
  const [produtos, setProdutos] = useState([])
  const [nome, setNome] = useState('')
  const [preco, setPreco] = useState('')
  const [imagem, setImagem] = useState('')
  const [imagemFile, setImagemFile] = useState(null)
  const [imagemPreview, setImagemPreview] = useState("")
  const [modoImagem, setModoImagem] = useState("url") // "url" | "file"
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

  const fileInputRef = useRef(null)
  const navigate = useNavigate()
  const token = localStorage.getItem("token")

  useEffect(() => { if (!token) navigate("/") }, [])

  const buscarProdutos = async () => {
    try {
      setLoading(true)
      const res = await axios.get(`${API_URL}/produtos`, { headers: { Authorization: `Bearer ${token}` } })
      setProdutos(res.data)
      return res.data
    } catch { toast.error("Erro ao buscar produtos") }
    finally { setLoading(false) }
  }

  const buscarCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/categorias`, { headers: { Authorization: `Bearer ${token}` } })
      setCategorias(res.data)
    } catch { toast.error("Erro ao buscar categorias") }
  }

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
  }, [])

  const limparForm = () => {
    setNome(''); setPreco(''); setDescricao(''); setImagem('')
    setCategoria(''); setDesconto(0); setPromocao(false); setEditandoId(null)
    setMostrarForm(false); setMostrarFormCategoria(false); setNomeCategoria("")
    setImagemFile(null); setImagemPreview(""); setModoImagem("url")
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
    else if (imagem) fd.append("imagem", imagem)
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
    setImagem(produto.imagem || '')
    setImagemPreview(produto.imagem || '')
    setModoImagem(produto.imagem ? "url" : "url")
    setEditandoId(produto._id)
    setCategoria(produto.categoria || "")
    setDesconto(produto.promocao?.desconto || 0)
    setPromocao(produto.promocao?.ativa || false)
    setMostrarForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleFile = (file) => {
    if (!file) return
    setImagemFile(file)
    setImagemPreview(URL.createObjectURL(file))
    setImagem("")
  }

  const preview = imagemPreview || imagem

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
        .modo-tab { padding: 7px 14px; border-radius: 8px; font-size: 13px; font-weight: 500; border: none; cursor: pointer; display: inline-flex; align-items: center; gap: 6px; font-family: inherit; transition: all 0.15s; }
        .modo-tab.ativo { background: #0f0f0f; color: #fff; }
        .modo-tab.inativo { background: transparent; color: #888; }
        .modo-tab.inativo:hover { background: #f0f0f0; color: #333; }
        .dropzone { border: 1.5px dashed #d4d4d4; border-radius: 12px; padding: 28px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; cursor: pointer; transition: border-color 0.15s, background 0.15s; background: #fafafa; }
        .dropzone:hover { border-color: #aaa; background: #f4f4f4; }
        .dropzone.tem-imagem { padding: 0; border-style: solid; border-color: #e2e2e2; overflow: hidden; }
      `}</style>

      <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f8f8f8", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

          {/* HEADER */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "#0f0f0f", marginBottom: 4 }}>Produtos</h1>
              <p style={{ fontSize: 14, color: "#888" }}>{produtos.length} produto{produtos.length !== 1 ? "s" : ""} cadastrado{produtos.length !== 1 ? "s" : ""}</p>
            </div>
            <button className="btn-dark" onClick={() => { limparForm(); setMostrarForm(!mostrarForm) }}>
              <Plus size={16} /> Novo produto
            </button>
          </div>

          {/* FORMULÁRIO */}
          {mostrarForm && (
            <div className="card" style={{ padding: 28, marginBottom: 32 }}>
              <h2 style={{ fontSize: 17, fontWeight: 600, marginBottom: 24, color: "#0f0f0f" }}>
                {editandoId ? "Editar produto" : "Novo produto"}
              </h2>

              {/* LINHA 1 — nome e preço */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
                <input className="admin-input" placeholder="Nome do produto" value={nome} onChange={e => setNome(e.target.value)} />
                <input className="admin-input" type="number" placeholder="Preço (R$)" value={preco ?? ""} onChange={e => setPreco(e.target.value)} />
              </div>

              {/* DESCRIÇÃO */}
              <input className="admin-input" placeholder="Descrição" value={descricao} onChange={e => setDescricao(e.target.value)} style={{ marginBottom: 16 }} />

              {/* IMAGEM */}
              <div style={{ marginBottom: 16 }}>
                <p style={{ fontSize: 13, fontWeight: 500, color: "#555", marginBottom: 8 }}>Imagem do produto</p>

                {/* TABS URL / ARQUIVO */}
                <div style={{ display: "flex", gap: 4, marginBottom: 12, background: "#f4f4f5", padding: 4, borderRadius: 10, width: "fit-content" }}>
                  <button
                    className={`modo-tab ${modoImagem === "url" ? "ativo" : "inativo"}`}
                    onClick={() => { setModoImagem("url"); setImagemFile(null); setImagemPreview("") }}
                  >
                    <LinkIcon size={13} /> URL
                  </button>
                  <button
                    className={`modo-tab ${modoImagem === "file" ? "ativo" : "inativo"}`}
                    onClick={() => { setModoImagem("file"); setImagem("") }}
                  >
                    <Upload size={13} /> Upload
                  </button>
                </div>

                {modoImagem === "url" ? (
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <input
                      className="admin-input"
                      placeholder="https://exemplo.com/imagem.jpg"
                      value={imagem}
                      onChange={e => { setImagem(e.target.value); setImagemPreview("") }}
                    />
                    {imagem && (
                      <img src={imagem} alt="" style={{ width: 48, height: 48, objectFit: "cover", borderRadius: 8, border: "1px solid #f0f0f0", flexShrink: 0 }} />
                    )}
                  </div>
                ) : (
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      ref={fileInputRef}
                      style={{ display: "none" }}
                      onChange={e => handleFile(e.target.files[0])}
                    />
                    <div
                      className={`dropzone ${preview ? "tem-imagem" : ""}`}
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={e => e.preventDefault()}
                      onDrop={e => { e.preventDefault(); handleFile(e.dataTransfer.files[0]) }}
                    >
                      {preview ? (
                        <div style={{ position: "relative", width: "100%" }}>
                          <img src={preview} alt="" style={{ width: "100%", height: 180, objectFit: "cover", display: "block" }} />
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
                )}
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
