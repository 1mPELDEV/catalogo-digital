import { useEffect, useState, useMemo } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModalConfirmacao from '../components/modalConfirmacao'
import formatarPreco from '../utils/formatarpreco'
import { gerarPaleta } from '../utils/paleta'
import { useParams } from "react-router-dom"
import { useLoja } from "../hooks/useLoja"
import { ShoppingBag, Trash2, Plus, Minus, MessageCircle, X, ShoppingCart, MapPin, ArrowLeft, Check } from "lucide-react"

function lerCarrinho(chave) {
  try {
    const valorSalvo = JSON.parse(localStorage.getItem(chave) || "[]")
    return Array.isArray(valorSalvo) ? valorSalvo : []
  } catch {
    localStorage.removeItem(chave)
    return []
  }
}

function Pedido() {
  const { slug } = useParams()
  return <PedidoConteudo key={slug} slug={slug} />
}

function PedidoConteudo({ slug }) {
  const chaveLocalStorage = `carrinho-${slug}`
  const chaveNome = `nomeCliente-${slug}`
  const chaveEndereco = `endereco-${slug}`

  const [lista, setLista] = useState(() => lerCarrinho(chaveLocalStorage))
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [produtoSelecionado, setProdutoSelecionado] = useState("")
  const [acaoConfirmacao, setAcaoConfirmacao] = useState(null)
  const [nomeCliente, setNomeCliente] = useState(() => localStorage.getItem(chaveNome) || "")
  const [telefone, setTelefone] = useState("")
  const [cep, setCep] = useState("")
  const [rua, setRua] = useState("")
  const [numeroEndereco, setNumeroEndereco] = useState("")
  const [complemento, setComplemento] = useState("")
  const [bairro, setBairro] = useState("")
  const [cidade, setCidade] = useState("")
  const [uf, setUf] = useState("")
  const [modalidade, setModalidade] = useState("")
  const [pagamento, setPagamento] = useState("")
  const [etapaResumo, setEtapaResumo] = useState(false)
  const [consultandoCep, setConsultandoCep] = useState(false)

  const loja = useLoja(slug)

  const paleta = useMemo(
    () => gerarPaleta(loja?.tema?.corPrimaria),
    [loja?.tema?.corPrimaria]
  )

  const checkout = loja?.checkout || { pagamentos: ["Pix", "Dinheiro"] }
  const opcoesEntrega = ["Entrega", "Retirada"]
  const pagamentosDisponiveis = checkout.pagamentos?.length ? checkout.pagamentos : ["Pix", "Dinheiro"]

  useEffect(() => { localStorage.setItem(chaveNome, nomeCliente) }, [chaveNome, nomeCliente])

  useEffect(() => {
    if (modalidade === "Entrega" && cep.replace(/\D/g, "").length === 8) {
      let ativa = true
      setConsultandoCep(true)
      fetch(`https://viacep.com.br/ws/${cep.replace(/\D/g, "")}/json/`)
        .then(res => res.json())
        .then(dados => {
          if (!ativa) return
          if (dados.erro) return toast.warning("CEP não encontrado. Confira o número ou preencha o endereço manualmente.")
          setRua(dados.logradouro || "")
          setBairro(dados.bairro || "")
          setCidade(dados.localidade || "")
          setUf(dados.uf || "")
        })
        .catch(() => { if (ativa) toast.error("Não foi possível consultar o CEP. Preencha o endereço manualmente.") })
        .finally(() => { if (ativa) setConsultandoCep(false) })
      return () => { ativa = false }
    }
  }, [cep, modalidade])

  const itensAgrupados = useMemo(() => {
    return Object.values(
      lista.reduce((acc, produto) => {
        if (!acc[produto._id]) acc[produto._id] = { ...produto, quantidade: 0 }
        acc[produto._id].quantidade++
        return acc
      }, {})
    )
  }, [lista])

  const total = itensAgrupados.reduce((acc, item) => acc + (item.precoFinal ?? item.preco) * item.quantidade, 0)

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
    if (!telefone.trim()) return toast.warning("Informe um telefone para contato.")
    if (!modalidade) return toast.warning("Escolha entrega ou retirada.")
    if (modalidade === "Entrega" && (!rua.trim() || !numeroEndereco.trim() || !cidade.trim())) return toast.warning("Complete o endereço de entrega.")
    if (!pagamento) return toast.warning("Escolha uma forma de pagamento.")
    if (!etapaResumo) { setEtapaResumo(true); return }

    const numero = loja?.contato?.whatsapp
    if (!numero) return toast.error("Esta loja ainda não configurou o WhatsApp!")

    const enderecoCompleto = [rua, numeroEndereco, complemento, bairro, [cidade, uf].filter(Boolean).join(" - "), cep && `CEP ${cep}`].filter(Boolean).join(", ")
    let mensagem = `Olá, ${loja?.nome || "tudo bem"}! Gostaria de fazer um pedido.\n\n`
    mensagem += `*DADOS DO CLIENTE*\nNome: ${nomeCliente.trim()}\nTelefone: ${telefone.trim()}\n`
    mensagem += `*${modalidade.toUpperCase()}*${modalidade === "Entrega" ? `\nEndereço: ${enderecoCompleto}` : ""}\n`
    mensagem += `Pagamento: ${pagamento}\n\n*ITENS DO PEDIDO*\n`
    itensAgrupados.forEach(item => {
      mensagem += `• ${item.nome} x${item.quantidade} - ${formatarPreco((item.precoFinal ?? item.preco) * item.quantidade)}\n`
    })
    mensagem += `\n*Total: ${formatarPreco(total)}*\n\nAguardo a confirmação. Obrigado(a)!`

    window.open(`https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`, "_blank")
    setMostrarFormulario(false)
    limparCarrinho()
    toast.success("Pedido preparado. Conclua o envio na conversa do WhatsApp.")
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
          <div style={{ background: "#fff", borderRadius: 20, padding: 26, width: "100%", maxWidth: 520, maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 600, color: "#0f0f0f", marginBottom: 2 }}>{etapaResumo ? "Revise seu pedido" : "Dados para o pedido"}</h2>
                <p style={{ fontSize: 13, color: "#888" }}>{etapaResumo ? "Confira tudo antes de enviar pelo WhatsApp." : "Preencha seus dados para a loja confirmar o pedido."}</p>
              </div>
              <button type="button" aria-label="Fechar formulário do pedido" onClick={() => setMostrarFormulario(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#aaa", padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {etapaResumo ? <div style={{ display: "grid", gap: 14, marginBottom: 20 }}>
              <section style={{ background: "#f8faf9", borderRadius: 12, padding: 15, fontSize: 13, lineHeight: 1.8, color: "#475569" }}><strong style={{ color: "#10261b" }}>Cliente</strong><br />{nomeCliente} · {telefone}<br /><strong style={{ color: "#10261b" }}>{modalidade}</strong>{modalidade === "Entrega" && <><br />{[rua, numeroEndereco, complemento, bairro, [cidade, uf].filter(Boolean).join(" - "), cep && `CEP ${cep}`].filter(Boolean).join(", ")}</>}<br /><strong style={{ color: "#10261b" }}>Pagamento:</strong> {pagamento}</section>
              <section style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 15 }}><strong style={{ fontSize: 13, color: "#10261b" }}>Itens</strong>{itensAgrupados.map(item => <div key={item._id} style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 8, fontSize: 13, color: "#475569" }}><span>{item.quantidade}× {item.nome}</span><span>{formatarPreco((item.precoFinal ?? item.preco) * item.quantidade)}</span></div>)}<div style={{ borderTop: "1px solid #e2e8f0", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", fontWeight: 700 }}><span>Total</span><span>{formatarPreco(total)}</span></div></section>
            </div> : <div style={{ display: "grid", gap: 12, marginBottom: 20 }}>
              <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Nome completo<input className="pedido-input" autoComplete="name" placeholder="Ex.: Maria da Silva" value={nomeCliente} onChange={e => setNomeCliente(e.target.value)} /></label>
              <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Telefone / WhatsApp<input className="pedido-input" autoComplete="tel" type="tel" inputMode="tel" placeholder="(11) 99999-9999" value={telefone} onChange={e => setTelefone(e.target.value)} /></label>
              {opcoesEntrega.length > 0 && <fieldset style={{ border: 0, padding: 0, margin: 0 }}><legend style={{ marginBottom: 7, fontSize: 12, color: "#475569", fontWeight: 600 }}>Como prefere receber?</legend><div style={{ display: "flex", gap: 8 }}>{opcoesEntrega.map(opcao => <button key={opcao} type="button" onClick={() => setModalidade(opcao)} style={{ flex: 1, padding: 10, borderRadius: 10, border: `1px solid ${modalidade === opcao ? paleta.primaria : "#e2e8f0"}`, background: modalidade === opcao ? paleta.fundo : "white", color: "#334155", cursor: "pointer", fontWeight: 600 }}>{opcao}</button>)}</div></fieldset>}
              {modalidade === "Entrega" && <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 10 }}>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>CEP<div style={{ position: "relative" }}><input className="pedido-input" autoComplete="postal-code" inputMode="numeric" placeholder="00000-000" maxLength={9} value={cep} onChange={e => setCep(e.target.value.replace(/[^\d-]/g, "").slice(0, 9))} />{consultandoCep && <span style={{ position: "absolute", right: 10, top: 12, fontSize: 10 }}>Buscando…</span>}</div></label>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Rua / avenida<input className="pedido-input" autoComplete="address-line1" placeholder="Rua" value={rua} onChange={e => setRua(e.target.value)} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Número<input className="pedido-input" placeholder="Nº" value={numeroEndereco} onChange={e => setNumeroEndereco(e.target.value)} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Complemento (opcional)<input className="pedido-input" placeholder="Apto, bloco…" value={complemento} onChange={e => setComplemento(e.target.value)} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Bairro<input className="pedido-input" autoComplete="address-level3" placeholder="Bairro" value={bairro} onChange={e => setBairro(e.target.value)} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Cidade<input className="pedido-input" autoComplete="address-level2" placeholder="Cidade" value={cidade} onChange={e => setCidade(e.target.value)} /></label>
                <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>UF<input className="pedido-input" autoComplete="address-level1" placeholder="UF" maxLength={2} value={uf} onChange={e => setUf(e.target.value.toUpperCase())} /></label>
                <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", gap: 6, color: "#64748b", fontSize: 11 }}><MapPin size={13} />Digite o CEP para preencher o endereço automaticamente.</div>
              </div>}
              <label style={{ display: "grid", gap: 6, fontSize: 12, color: "#475569", fontWeight: 600 }}>Forma de pagamento<select className="pedido-input" value={pagamento} onChange={e => setPagamento(e.target.value)}><option value="">Selecione uma opção</option>{pagamentosDisponiveis.map(opcao => <option key={opcao} value={opcao}>{opcao}</option>)}</select></label>
            </div>}

            <div style={{ display: "flex", gap: 10 }}>
              <button
                onClick={finalizarPedido}
                style={{ flex: 1, padding: "12px", borderRadius: 10, background: "#25d366", color: "#fff", border: "none", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, fontFamily: "inherit" }}
              >
                {etapaResumo ? <><MessageCircle size={16} /> Confirmar e abrir WhatsApp</> : <>Continuar <Check size={16} /></>}
              </button>
              {etapaResumo && <button type="button" onClick={() => setEtapaResumo(false)} style={{ padding: "12px 14px", borderRadius: 10, background: "#f4f4f5", color: "#555", border: "none", fontSize: 14, fontWeight: 500, cursor: "pointer", display: "flex", alignItems: "center", gap: 5 }}><ArrowLeft size={14} />Editar</button>}
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
