import { useEffect, useState, useMemo } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModalConfirmacao from '../components/modalConfirmacao'
import formatarPreco from '../utils/formatarpreco'
import { gerarPaleta } from '../utils/paleta'
import { useParams } from "react-router-dom"
import { useLoja } from "../hooks/useLoja"
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, X, ShoppingCart } from "lucide-react"

function Pedido() {
  const { slug } = useParams()
  const chaveLocalStorage = `carrinho-${slug}`
  const chaveNome = `nomeCliente-${slug}`
  const chaveEndereco = `endereco-${slug}`

  const [lista, setLista] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState("")
  const [acaoConfirmacao, setAcaoConfirmacao] = useState(null)
  const [nomeCliente, setNomeCliente] = useState("")
  const [endereco, setEndereco] = useState("")

  const loja = useLoja(slug)

  const paleta = useMemo(
    () => gerarPaleta(loja?.tema?.corPrimaria),
    [loja?.tema?.corPrimaria]
  )

  useEffect(() => {
    const carrinhoSalvo = JSON.parse(localStorage.getItem(chaveLocalStorage)) || []
    setLista(carrinhoSalvo)
  }, [slug])

  useEffect(() => {
    setNomeCliente(localStorage.getItem(chaveNome) || "")
    setEndereco(localStorage.getItem(chaveEndereco) || "")
  }, [slug])

  useEffect(() => {
    localStorage.setItem(chaveNome, nomeCliente)
    localStorage.setItem(chaveEndereco, endereco)
  }, [nomeCliente, endereco])

  const itensAgrupados = useMemo(() => {
    return Object.values(
      lista.reduce((acc, produto) => {
        if (!acc[produto._id]) acc[produto._id] = { ...produto, quantidade: 0 }
        acc[produto._id].quantidade++
        return acc
      }, {})
    )
  }, [lista])

  const total = itensAgrupados.reduce((acc, item) => acc + item.precoFinal * item.quantidade, 0)

  const removeItem = (id) => {
    const novaLista = lista.filter(p => p._id !== id)
    setLista(novaLista)
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
    toast.success("Produto removido!")
  }

  const limparCarrinho = () => {
    setLista([])
    localStorage.removeItem(chaveLocalStorage)
    window.dispatchEvent(new Event("storage"))
    setMostrarConfirmacao(false)
  }

  const aumentar = (produto) => {
    const novaLista = [...lista, produto]
    setLista(novaLista)
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
  }

  const diminuir = (id) => {
    const index = lista.findIndex(p => p._id === id)
    if (index === -1) return
    const novaLista = [...lista]
    novaLista.splice(index, 1)
    setLista(novaLista)
    localStorage.setItem(chaveLocalStorage, JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
  }

  const finalizarPedido = () => {
    if (lista.length === 0) return toast.warning("Seu pedido está vazio!")
    if (!nomeCliente.trim()) return toast.warning("Digite o seu nome!")
    if (!endereco.trim()) return toast.warning("Digite o seu endereço!")

    const numero = loja?.contato?.whatsapp
    if (!numero) return toast.error("Esta loja ainda não configurou o WhatsApp!")

    let mensagem = "🛒 *Novo Pedido* \n\n"
    mensagem += `👤 Nome: ${nomeCliente}\n`
    mensagem += `📍 Endereço: ${endereco}\n\n`
    itensAgrupados.forEach(item => {
      mensagem += `• ${item.nome} x${item.quantidade} - R$ ${formatarPreco(item.precoFinal * item.quantidade)}\n`
    })
    mensagem += `\n💰 Total: R$ ${formatarPreco(total)}`

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank")
    setMostrarFormulario(false)
    limparCarrinho()
    toast.success("Pedido enviado!")
  }

  const confirmarAcao = () => {
    if (acaoConfirmacao === "removerItem") removeItem(produtoSelecionado)
    if (acaoConfirmacao === "limparCarrinho") limparCarrinho()
    setMostrarConfirmacao(false)
    setProdutoSelecionado(null)
    setAcaoConfirmacao(null)
  }

  return (
    <>
      <ToastContainer />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
        * { box-sizing: border-box; }
        .pedido-input { width: 100%; padding: 10px 14px; border: 1.5px solid #e2e2e2; border-radius: 10px; font-size: 14px; font-family: inherit; color: #0f0f0f; outline: none; transition: border-color 0.15s; background: #fff; }
        .pedido-input:focus { border-color: #0f0f0f; }
        .btn-qty { width: 28px; height: 28px; border-radius: 8px; border: 1.5px solid #e2e2e2; background: #fff; cursor: pointer; display: flex; align-items: center; justify-content: center; transition: all 0.15s; }
        .btn-qty:hover { border-color: #aaa; background: #fafafa; }
      `}</style>

      <div style={{ fontFamily: "'Inter', -apple-system, sans-serif", background: "#f8f8f8", minHeight: "100vh" }}>
        <div style={{ maxWidth: 700, margin: "0 auto", padding: "32px 24px" }}>

          {/* HEADER */}
          <div style={{ marginBottom: 28 }}>
            <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: "-0.02em", color: "#0f0f0f", marginBottom: 4 }}>
              Seu Pedido
            </h1>
            <p style={{ fontSize: 14, color: "#888" }}>
              {itensAgrupados.length} {itensAgrupados.length === 1 ? "item" : "itens"} no carrinho
            </p>
          </div>

          {/* CARRINHO VAZIO */}
          {lista.length === 0 && (
            <div style={{ textAlign: "center", padding: "64px 0", color: "#aaa" }}>
              <ShoppingCart size={40} style={{ marginBottom: 12, opacity: 0.3 }} />
              <p style={{ fontSize: 15 }}>Nenhum item no pedido ainda.</p>
              <p style={{ fontSize: 13, marginTop: 4 }}>Volte ao catálogo e adicione produtos.</p>
            </div>
          )}

          {/* LISTA DE ITENS */}
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 24 }}>
            {itensAgrupados.map(item => (
              <div key={item._id} style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 16, display: "flex", gap: 14, alignItems: "center" }}>

                <img
                  src={item.imagem || "https://picsum.photos/200"}
                  alt={item.nome}
                  style={{ width: 72, height: 72, objectFit: "cover", borderRadius: 10, flexShrink: 0 }}
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 600, color: "#0f0f0f", marginBottom: 4 }}>{item.nome}</h3>
                  <p style={{ fontSize: 13, color: "#888", marginBottom: 10 }}>{formatarPreco(item.precoFinal)} / un.</p>

                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <button className="btn-qty" onClick={() => diminuir(item._id)}>
                      <Minus size={12} />
                    </button>
                    <span style={{ fontSize: 15, fontWeight: 600, minWidth: 20, textAlign: "center" }}>{item.quantidade}</span>
                    <button className="btn-qty" onClick={() => aumentar(item)}>
                      <Plus size={12} />
                    </button>
                    <span style={{ fontSize: 14, fontWeight: 600, color: paleta.primaria, marginLeft: 8 }}>
                      {formatarPreco(item.precoFinal * item.quantidade)}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => { setProdutoSelecionado(item._id); setAcaoConfirmacao("removerItem"); setMostrarConfirmacao(true) }}
                  style={{ background: "none", border: "none", cursor: "pointer", color: "#dc2626", padding: 6, borderRadius: 8, transition: "background 0.15s", flexShrink: 0 }}
                  onMouseEnter={e => e.currentTarget.style.background = "#fef2f2"}
                  onMouseLeave={e => e.currentTarget.style.background = "none"}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>

          {/* TOTAL + BOTÕES */}
          {lista.length > 0 && (
            <div style={{ background: "#fff", border: "1px solid #f0f0f0", borderRadius: 14, padding: 20 }}>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <span style={{ fontSize: 15, color: "#666" }}>Total</span>
                <span style={{ fontSize: 22, fontWeight: 700, color: "#0f0f0f", letterSpacing: "-0.02em" }}>
                  {formatarPreco(total)}
                </span>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                <button
                  onClick={() => setMostrarFormulario(true)}
                  style={{ width: "100%", padding: "13px", borderRadius: 10, background: paleta.primaria, color: paleta.texto, border: "none", fontSize: 15, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", transition: "opacity 0.15s" }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 0.88}
                  onMouseLeave={e => e.currentTarget.style.opacity = 1}
                >
                  <MessageCircle size={17} /> Enviar via WhatsApp
                </button>

                <button
                  onClick={() => { setAcaoConfirmacao("limparCarrinho"); setMostrarConfirmacao(true) }}
                  style={{ width: "100%", padding: "11px", borderRadius: 10, background: "transparent", color: "#dc2626", border: "1.5px solid #fecaca", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.borderColor = "#dc2626" }}
                  onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "#fecaca" }}
                >
                  <Trash2 size={14} /> Limpar pedido
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MODAL FINALIZAR */}
      {mostrarFormulario && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 50, padding: 24 }}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 28, width: "100%", maxWidth: 440, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f0f0f", marginBottom: 2 }}>Quase lá! 😄</h2>
                <p style={{ fontSize: 13, color: "#888" }}>Preencha seus dados para finalizar</p>
              </div>
              <button onClick={() => setMostrarFormulario(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            <input
              className="pedido-input"
              type="text"
              placeholder="Seu nome"
              value={nomeCliente}
              onChange={e => setNomeCliente(e.target.value)}
              style={{ marginBottom: 10 }}
            />

            <input
              className="pedido-input"
              type="text"
              placeholder="Seu endereço"
              value={endereco}
              onChange={e => setEndereco(e.target.value)}
              style={{ marginBottom: 20 }}
            />

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={finalizarPedido}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#25d366", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
              >
                <MessageCircle size={16} /> Enviar WhatsApp
              </button>
              <button
                onClick={() => setMostrarFormulario(false)}
                style={{ padding: "12px 18px", borderRadius: 10, background: "#f4f4f5", color: "#555", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", fontFamily: "inherit" }}
              >
                Cancelar
              </button>
            </div>

          </div>
        </div>
      )}

      <ModalConfirmacao
        aberto={mostrarConfirmacao}
        titulo="Tem certeza?"
        mensagem={acaoConfirmacao === "removerItem" ? "Deseja remover este item?" : "Deseja limpar todo o pedido?"}
        onConfirmar={confirmarAcao}
        onCancelar={() => { setMostrarConfirmacao(false); setProdutoSelecionado(null); setAcaoConfirmacao(null) }}
      />
    </>
  )
}

export default Pedido
