import axios from "axios"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import formatarPreco from "../../utils/formatarpreco"
import { ShoppingCart, MessageCircle, Search, Tag, Star } from "lucide-react"

const API_URL = import.meta.env.VITE_API_URL

function ProdutosGrid({ slug, loja }) {

  const chaveLocalStorage = `carrinho-${slug}`

  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")

  const corPrimaria = loja?.tema?.corPrimaria || "#22c55e"

  const list = async () => {
    try {
      const res = await axios.get(`${API_URL}/produtos/${slug}`)
      setProdutos(res.data)
    } catch (err) {
      console.log("erro " + err)
    }
  }

  const buscarCategorias = async () => {
    try {
      const res = await axios.get(`${API_URL}/categorias/${slug}`)
      setCategorias(res.data)
    } catch (err) {
      console.log("erro categorias:", err)
    }
  }

  useEffect(() => {
    list()
    buscarCategorias()
    const pedidoSalvo = JSON.parse(localStorage.getItem(chaveLocalStorage)) || []
    setLista(pedidoSalvo)
  }, [slug])

  const addItem = (produto) => {
    const precoFinal = produto.promocao?.ativa
      ? produto.preco - produto.promocao.desconto
      : produto.preco

    const produtoComPreco = { ...produto, precoFinal }
    const novaLista = [...lista, produtoComPreco]

    setLista(novaLista)
    toast.success("Produto adicionado ao pedido!")
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
  }

  const abrirWhatsApp = (produto) => {
    const numero = loja?.contato?.whatsapp
    if (!numero) {
      toast.error("Esta loja ainda não configurou o WhatsApp!")
      return
    }
    const mensagem = `Olá! Tenho interesse no produto:\n\n🛒 ${produto.nome}\n💰 ${formatarPreco(produto.preco)}\n\nPode me dar mais informações?`
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank")
  }

  const produtosFiltrados = produtos
    .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter(p => categoriaSelecionada ? p.categoria === categoriaSelecionada : true)

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    return (b.promocao?.ativa ? 1 : 0) - (a.promocao?.ativa ? 1 : 0)
  })

  return (
    <>
      <ToastContainer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        .grid-input { padding: 10px 14px; border: 1.5px solid #e2e2e2; border-radius: 10px; font-size: 14px; font-family: inherit; color: #0f0f0f; outline: none; transition: border-color 0.15s; background: #fff; width: 100%; }
        .grid-input:focus { border-color: #0f0f0f; }
        .cat-btn { padding: 7px 16px; border-radius: 999px; font-size: 13px; font-weight: 500; cursor: pointer; border: 1.5px solid #e2e2e2; background: #fff; color: #555; font-family: inherit; transition: all 0.15s; white-space: nowrap; }
        .cat-btn:hover { border-color: #aaa; }
        .cat-btn.ativo { color: #fff; border-color: transparent; }
        .produto-card { background: #fff; border: 1px solid #f0f0f0; border-radius: 16px; overflow: hidden; transition: box-shadow 0.2s, transform 0.2s; display: flex; flex-direction: column; }
        .produto-card:hover { box-shadow: 0 8px 32px rgba(0,0,0,0.08); transform: translateY(-2px); }
        .promo-badge { position: absolute; top: 10px; left: 10px; background: #dc2626; color: #fff; font-size: 11px; font-weight: 600; padding: 4px 10px; border-radius: 999px; display: flex; align-items: center; gap: 4px; }
        .btn-add { width: 100%; padding: 11px; border-radius: 10px; font-size: 14px; font-weight: 500; border: none; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; font-family: inherit; transition: opacity 0.15s; color: #fff; }
        .btn-add:hover { opacity: 0.88; }
        .quantidade-badge { display: flex; align-items: center; gap: 4px; font-size: 12px; color: #666; margin-top: 6px; justify-content: center; }
      `}</style>

      <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f8f8f8", minHeight: "60vh" }}>

        {/* BUSCA */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 0" }}>
          <div style={{ position: "relative", maxWidth: 480 }}>
            <Search size={16} color="#aaa" style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)" }} />
            <input
              className="grid-input"
              placeholder="Buscar produto..."
              value={busca}
              onChange={e => setBusca(e.target.value)}
              style={{ paddingLeft: 40 }}
            />
          </div>

          {/* FILTRO DE CATEGORIAS */}
          {categorias.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 14, flexWrap: "wrap" }}>
              <button
                className={`cat-btn ${categoriaSelecionada === "" ? "ativo" : ""}`}
                style={categoriaSelecionada === "" ? { backgroundColor: corPrimaria } : {}}
                onClick={() => setCategoriaSelecionada("")}
              >
                Todos
              </button>
              {categorias.map(cat => (
                <button
                  key={cat._id}
                  className={`cat-btn ${categoriaSelecionada === cat.nome ? "ativo" : ""}`}
                  style={categoriaSelecionada === cat.nome ? { backgroundColor: corPrimaria } : {}}
                  onClick={() => setCategoriaSelecionada(cat.nome)}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* GRID DE PRODUTOS */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>

          {produtosOrdenados.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#aaa" }}>
              <Search size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15 }}>Nenhum produto encontrado.</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {produtosOrdenados.map(produto => {
              const quantidade = loja?.features?.carrinho
                ? lista.filter(item => item._id === produto._id).length
                : 0

              const precoFinal = produto.promocao?.ativa
                ? produto.preco - produto.promocao.desconto
                : produto.preco

              return (
                <div key={produto._id} className="produto-card">

                  <div style={{ position: "relative" }}>
                    <img
                      src={produto.imagem || "https://picsum.photos/200"}
                      alt={produto.nome}
                      style={{ width: "100%", height: 180, objectFit: "cover" }}
                      onError={e => e.target.src = "https://picsum.photos/200"}
                    />
                    {produto.promocao?.ativa && (
                      <span className="promo-badge">
                        <Star size={10} fill="#fff" /> Promoção
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>

                    {produto.categoria && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, color: "#888", marginBottom: 6 }}>
                        <Tag size={10} /> {produto.categoria}
                      </div>
                    )}

                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f0f0f", marginBottom: 4, lineHeight: 1.3 }}>
                      {produto.nome}
                    </h3>

                    {produto.descricao && (
                      <p style={{ fontSize: 12, color: "#999", marginBottom: 8, lineHeight: 1.4 }}>
                        {produto.descricao}
                      </p>
                    )}

                    <div style={{ marginBottom: 12, marginTop: "auto" }}>
                      {produto.promocao?.ativa ? (
                        <>
                          <p style={{ fontSize: 12, color: "#bbb", textDecoration: "line-through" }}>
                            {formatarPreco(produto.preco)}
                          </p>
                          <p style={{ fontSize: 18, fontWeight: 600, color: corPrimaria }}>
                            {formatarPreco(precoFinal)}
                          </p>
                        </>
                      ) : (
                        <p style={{ fontSize: 18, fontWeight: 600, color: corPrimaria }}>
                          {formatarPreco(produto.preco)}
                        </p>
                      )}
                    </div>

                    {loja?.features?.carrinho ? (
                      <button
                        className="btn-add"
                        style={{ backgroundColor: corPrimaria }}
                        onClick={() => addItem(produto)}
                      >
                        <ShoppingCart size={15} /> Adicionar
                      </button>
                    ) : (
                      <button
                        className="btn-add"
                        style={{ backgroundColor: "#25d366" }}
                        onClick={() => abrirWhatsApp(produto)}
                      >
                        <MessageCircle size={15} /> Falar no WhatsApp
                      </button>
                    )}

                    {loja?.features?.carrinho && quantidade > 0 && (
                      <div className="quantidade-badge">
                        <ShoppingCart size={11} /> {quantidade} no pedido
                      </div>
                    )}

                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}

export default ProdutosGrid
