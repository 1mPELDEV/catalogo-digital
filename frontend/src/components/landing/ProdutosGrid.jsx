import axios from "axios"
import { Link } from "react-router-dom"
import { useState, useEffect, useMemo, useCallback } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import formatarPreco from "../../utils/formatarpreco"
import { gerarPaleta } from "../../utils/paleta"
import { ShoppingCart, MessageCircle, Search, Tag, Star, X } from "lucide-react"
import imgFallback from "../../assets/produto-sem-imagem.png"

const API_URL = import.meta.env.VITE_API_URL

const calcularPrecoFinal = (produto) =>
  produto.promocao?.ativa
    ? produto.preco - produto.promocao.desconto
    : produto.preco

function ProdutosGrid({ slug, loja }) {

  const chaveLocalStorage = `carrinho-${slug}`

  const [produtos, setProdutos] = useState([])
  const [categorias, setCategorias] = useState([])
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")
  const [produtoDetalhe, setProdutoDetalhe] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [erro, setErro] = useState("")

  const paleta = useMemo(
    () => gerarPaleta(loja?.tema?.corPrimaria),
    [loja?.tema?.corPrimaria]
  )

  const list = useCallback(async () => {
    try {
      setCarregando(true)
      setErro("")
      const res = await axios.get(`${API_URL}/produtos/${slug}`)
      setProdutos(res.data)
    } catch (err) {
      console.error("Erro ao carregar produtos:", err)
      setErro("Não foi possível carregar os produtos. Verifique sua conexão e tente novamente.")
    } finally {
      setCarregando(false)
    }
  }, [slug])

  const buscarCategorias = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/categorias/${slug}`)
      setCategorias(res.data)
    } catch (err) {
      console.log("erro categorias:", err)
    }
  }, [slug])

  useEffect(() => {
    list()
    buscarCategorias()
    const pedidoSalvo = JSON.parse(localStorage.getItem(chaveLocalStorage)) || []
    setLista(pedidoSalvo)
  }, [slug, list, buscarCategorias, chaveLocalStorage])

  const addItem = (produto) => {
    const produtoComPreco = { ...produto, precoFinal: calcularPrecoFinal(produto) }

    const novaLista = [...lista, produtoComPreco]

    setLista(novaLista)
    toast.success("Produto adicionado ao pedido!")
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
  }

  const diminuir = (id) => {
    const index = lista.findIndex(item => item._id === id)

    if (index === -1) return

    const novaLista = [...lista]
    novaLista.splice(index, 1)

    setLista(novaLista)
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
  }

  const abrirWhatsApp = (produto) => {

    const numero = loja?.contato?.whatsapp?.replace(/\D/g, "")
    if (!numero) {
      toast.error("Esta loja ainda não configurou o WhatsApp!")
      return
    }
    const mensagem = `Olá! Tenho interesse no produto:\n\n🛒 ${produto.nome}\n💰 ${formatarPreco(calcularPrecoFinal(produto))}\n\nPode me dar mais informações?`
    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank")
  }

  const produtosFiltrados = produtos
    .filter(p => p.nome.toLowerCase().includes(busca.toLowerCase()))
    .filter(p => categoriaSelecionada ? p.categoria === categoriaSelecionada : true)

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
    return (b.promocao?.ativa ? 1 : 0) - (a.promocao?.ativa ? 1 : 0)
  })

  const total = lista.reduce((acc, item) => acc + (item.precoFinal ?? item.preco), 0)

  const barraVisivel = loja?.features?.carrinho && lista.length > 0

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
      `}</style>

      <div
        style={{
          fontFamily: "'Inter', -apple-system, sans-serif",
          background: "#f8f8f8",
          minHeight: "60vh",
          // Reserva espaço para a barra fixa não cobrir os últimos produtos
          paddingBottom: barraVisivel ? 100 : 0,
        }}
      >

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

          {categorias.length > 0 && (
            <div style={{ display: "flex", gap: 8, marginTop: 14, overflowX: "auto", flexWrap: "nowrap", paddingBottom: 4, WebkitOverflowScrolling: "touch" }}>
              <button
                className={`cat-btn ${categoriaSelecionada === "" ? "ativo" : ""}`}
                style={categoriaSelecionada === "" ? { backgroundColor: paleta.primaria } : {}}
                onClick={() => setCategoriaSelecionada("")}
              >
                Todos
              </button>
              {categorias.map(cat => (
                <button
                  key={cat._id}
                  className={`cat-btn ${categoriaSelecionada === cat.nome ? "ativo" : ""}`}
                  style={categoriaSelecionada === cat.nome ? { backgroundColor: paleta.primaria } : {}}
                  onClick={() => setCategoriaSelecionada(cat.nome)}
                >
                  {cat.nome}
                </button>
              ))}
            </div>
          )}
        </div>

        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px" }}>

        {carregando && (
          <div role="status" style={{ textAlign: "center", padding: "56px 0", color: "#64748b" }}>
            <span className="mx-auto mb-3 block h-6 w-6 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
            <p style={{ fontSize: 14 }}>Carregando produtos...</p>
          </div>
        )}

        {!carregando && erro && (
          <div role="alert" className="mx-auto max-w-md rounded-2xl border border-red-100 bg-white p-6 text-center shadow-sm">
            <p className="text-sm text-red-700">{erro}</p>
            <button type="button" onClick={list} className="mt-4 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-800">Tentar novamente</button>
          </div>
        )}

        {!carregando && !erro && produtosOrdenados.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#aaa" }}>
              <Search size={36} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15 }}>Nenhum produto encontrado.</p>
            </div>
          )}

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
            {!carregando && !erro && produtosOrdenados.map(produto => {
              const quantidade = loja?.features?.carrinho
                ? lista.filter(item => item._id === produto._id).length
                : 0

              const precoFinal = calcularPrecoFinal(produto)

              return (
                <div key={produto._id} className="produto-card">

                  <div style={{ position: "relative" }}>
                    <img
                      src={produto.imagem || imgFallback}
                      alt={produto.nome}
                      onClick={() => setProdutoDetalhe(produto)}
                      onKeyDown={e => e.key === "Enter" && setProdutoDetalhe(produto)}
                      tabIndex={0}
                      role="button"
                      aria-label={`Ver detalhes de ${produto.nome}`}
                      style={{ width: "100%", height: 180, objectFit: "cover", cursor: "pointer" }}
                      onError={e => {
                        e.target.onerror = null
                        e.target.src = imgFallback
                      }}
                    />
                    {produto.promocao?.ativa && (
                      <span className="promo-badge">
                        <Star size={10} fill="#fff" /> Promoção
                      </span>
                    )}
                  </div>

                  <div style={{ padding: 14, flex: 1, display: "flex", flexDirection: "column" }}>

                    {produto.categoria && (
                      <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, marginBottom: 6, color: paleta.maisEscura }}>
                        <Tag size={10} /> {produto.categoria}
                      </div>
                    )}

                    <button type="button" onClick={() => setProdutoDetalhe(produto)} style={{ display: "block", border: 0, padding: 0, background: "transparent", textAlign: "left", cursor: "pointer", fontFamily: "inherit" }}>
                    <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f0f0f", marginBottom: 4, lineHeight: 1.3 }}>
                      {produto.nome}
                    </h3>
                    </button>

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
                          <p style={{ fontSize: 18, fontWeight: 600, color: paleta.primaria }}>
                            {formatarPreco(precoFinal)}
                          </p>
                        </>
                      ) : (
                        <p style={{ fontSize: 18, fontWeight: 600, color: paleta.primaria }}>
                          {formatarPreco(produto.preco)}
                        </p>
                      )}
                    </div>

                    {loja?.features?.carrinho ? (
                      quantidade === 0 ? (
                        <button
                          className="btn-add"
                          style={{ backgroundColor: paleta.primaria }}
                          onClick={() => addItem(produto)}
                        >
                          <ShoppingCart size={15} /> Adicionar
                        </button>
                      ) : (
                        <div className="flex items-center justify-between gap-2">

                          <button
                            onClick={() => diminuir(produto._id)}
                            aria-label={`Remover uma unidade de ${produto.nome}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-100"
                          >
                            −
                          </button>

                          <div className="flex flex-1 items-center justify-center gap-2">
                            <ShoppingCart size={15} />
                            <span className="text-sm font-semibold">
                              {quantidade}
                            </span>
                          </div>

                          <button
                            onClick={() => addItem(produto)}
                            aria-label={`Adicionar mais uma unidade de ${produto.nome}`}
                            className="flex h-10 w-10 items-center justify-center rounded-xl text-white transition-opacity hover:opacity-90"
                            style={{ backgroundColor: paleta.primaria }}
                          >
                            +
                          </button>

                        </div>
                      )
                    ) : (
                      <button
                        className="btn-add"
                        style={{ backgroundColor: "#25d366" }}
                        onClick={() => abrirWhatsApp(produto)}
                      >
                        <MessageCircle size={15} /> Falar no WhatsApp
                      </button>
                    )}

                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Barra fixa do carrinho */}
        {barraVisivel && (
          <div className="fixed bottom-4 left-1/2 z-50 flex w-[calc(100%-2rem)] max-w-md -translate-x-1/2 items-center justify-between gap-4 rounded-2xl bg-white p-4 shadow-2xl ring-1 ring-black/5">

            <div className="flex items-center gap-3">
              <div
                className="flex h-10 w-10 items-center justify-center rounded-full text-white"
                style={{ backgroundColor: paleta.primaria }}
              >
                <ShoppingCart size={18} />
              </div>

              <div>
                <p className="text-sm font-semibold text-gray-900">
                  {lista.length} {lista.length === 1 ? "item" : "itens"}
                </p>

                <p className="text-xs text-gray-500">
                  {formatarPreco(total)}
                </p>
              </div>
            </div>

            <Link
              to={`/${slug}/pedido`}
              className="rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
              style={{ backgroundColor: paleta.primaria }}
            >
              Ver pedido
            </Link>

          </div>
        )}

        {produtoDetalhe && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/55 p-4" onClick={() => setProdutoDetalhe(null)}>
            <section role="dialog" aria-modal="true" aria-labelledby="produto-detalhe-titulo" className="max-h-[90vh] w-full max-w-lg overflow-auto rounded-3xl bg-white shadow-2xl" onClick={e => e.stopPropagation()}>
              <div className="relative">
                <img src={produtoDetalhe.imagem || imgFallback} alt={produtoDetalhe.nome} className="h-56 w-full object-cover sm:h-64" onError={e => { e.currentTarget.onerror = null; e.currentTarget.src = imgFallback }} />
                <button type="button" onClick={() => setProdutoDetalhe(null)} aria-label="Fechar detalhes" className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-slate-700 shadow transition hover:bg-white"><X size={18} /></button>
                {produtoDetalhe.promocao?.ativa && <span className="absolute bottom-3 left-3 rounded-full bg-red-600 px-3 py-1 text-xs font-semibold text-white">Em promoção</span>}
              </div>
              <div className="p-5 sm:p-6">
                {produtoDetalhe.categoria && <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-green-800"><Tag size={13} />{produtoDetalhe.categoria}</p>}
                <h2 id="produto-detalhe-titulo" className="text-xl font-bold text-slate-950">{produtoDetalhe.nome}</h2>
                {produtoDetalhe.descricao && <p className="mt-2 text-sm leading-6 text-slate-600">{produtoDetalhe.descricao}</p>}
                <div className="mt-5 flex items-end gap-2">{produtoDetalhe.promocao?.ativa && <span className="text-sm text-slate-400 line-through">{formatarPreco(produtoDetalhe.preco)}</span>}<span className="text-2xl font-bold" style={{ color: paleta.primaria }}>{formatarPreco(calcularPrecoFinal(produtoDetalhe))}</span></div>
                {loja?.features?.carrinho ? <button type="button" onClick={() => { addItem(produtoDetalhe); setProdutoDetalhe(null) }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-white transition hover:opacity-90" style={{ backgroundColor: paleta.primaria }}><ShoppingCart size={16} />Adicionar ao pedido</button> : <button type="button" onClick={() => { abrirWhatsApp(produtoDetalhe); setProdutoDetalhe(null) }} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-green-700 px-4 py-3 text-sm font-semibold text-white transition hover:bg-green-800"><MessageCircle size={16} />Perguntar no WhatsApp</button>}
              </div>
            </section>
          </div>
        )}
      </div>
    </>
  )
}

export default ProdutosGrid
