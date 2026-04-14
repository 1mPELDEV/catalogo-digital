import { useEffect, useState, useMemo } from "react"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import ModalConfirmacao from '../components/modalConfirmacao'
import formatarPreco from '../utils/formatarpreco'

function Pedido(){

  const [lista, setLista] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
  //modal
  const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
  const [produtoSelecionado,setProdutoSelecionado] = useState("")
  const [acaoConfirmacao, setAcaoConfirmacao] = useState(null)
  
  const [nomeCliente, setNomeCliente] = useState("")
  const [endereco, setEndereco] = useState("")

  useEffect(()=>{

    const carrinhoSalvo = JSON.parse(localStorage.getItem("lista")) || []

    if(carrinhoSalvo){
      setLista(carrinhoSalvo)
    }

  },[])
// salva os dados do cliente no local storage
  useEffect(() => {
  const nomeSalvo = localStorage.getItem("nomeCliente")
  const enderecoSalvo = localStorage.getItem("endereco")

  if(nomeSalvo) setNomeCliente(nomeSalvo)
  if(enderecoSalvo) setEndereco(enderecoSalvo)
}, [])

useEffect(() => {
  localStorage.setItem("nomeCliente", nomeCliente)
  localStorage.setItem("endereco", endereco)
}, [nomeCliente, endereco])

  const itensAgrupados = useMemo(() => {
  return Object.values(
    lista.reduce((acc, produto) => {
      if(!acc[produto._id]){
        acc[produto._id] = { ...produto, quantidade: 0 }
      }

      acc[produto._id].quantidade++
      
      return acc
    }, {})
  )
}, [lista])

  const total = itensAgrupados.reduce((acc, item) => {
  return acc + item.precoFinal * item.quantidade
}, 0)

  const removeItem = (id) => {
  const novaLista = lista.filter(produto => produto._id !== id)
  setLista(novaLista)
  localStorage.setItem("lista", JSON.stringify(novaLista))
  window.dispatchEvent(new Event("storage"))
  toast.success("Produto removido com sucesso!")
}


const limparCarrinho = () =>{
  setLista([])
  localStorage.removeItem("lista")
  window.dispatchEvent(new Event("storage"))
  setMostrarConfirmacao(false)
}

const aumentar = (produto) => {
  const novaLista = [...lista, produto]
  setLista(novaLista)
  localStorage.setItem("lista", JSON.stringify(novaLista))
  window.dispatchEvent(new Event("storage"))
}

const diminuir = (id) => {
  const index = lista.findIndex(p => p._id === id)
  if(index === -1) return
  const novaLista = [...lista]
  novaLista.splice(index, 1)
  setLista(novaLista)
  localStorage.setItem("lista", JSON.stringify(novaLista))
  window.dispatchEvent(new Event("storage"))
}

  const finalizarPedido = () =>{
    if(lista.length === 0){
      toast.warning("Seu pedido está vazio!")
      return
    }

    if(!nomeCliente.trim()){
      toast.warning("Digite o seu nome!")
      return
    }

    if(!endereco.trim()){
      toast.warning("Digite o seu endereço!")
      return
    }

    let mensagem = "🛒 *Novo Pedido* \n\n"

    mensagem += `👤 Nome: ${nomeCliente}\n`
    mensagem += `📍 Endereço: ${endereco}\n\n`

    itensAgrupados.forEach(item => {
      mensagem += `• ${item.nome} x${item.quantidade} - R$ ${formatarPreco(item.precoFinal* item.quantidade)}\n`
    })

    mensagem += `\n💰 Total: R$ ${formatarPreco(total)}`

    const numero = "5574999105013"

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`

    window.open(url, "_blank")

    setMostrarFormulario(false)
    limparCarrinho()
    toast.success("Pedido enviado!")
  } 

  const styles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000
  },
  modal: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    width: "300px",
    textAlign: "center"
  },
  input: {
    width: "100%",
    padding: "8px",
    marginTop: "10px"
  }
}
 const confirmarAcao = () => {
  if(acaoConfirmacao === "removerItem"){
    removeItem(produtoSelecionado)
  }

  if(acaoConfirmacao === "limparCarrinho"){
    limparCarrinho()
  }

  setMostrarConfirmacao(false)
  setProdutoSelecionado(null)
  setAcaoConfirmacao(null)
}

  return(
    <>
    <ToastContainer />
    <h1>Seu Pedido</h1>
    
    {lista.length === 0 && (
    <p>Nenhum item no pedido ainda</p>
    )}
    
    {itensAgrupados.map(item => (

      <div key={item._id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>

        <h3>{item.nome}</h3>
        <img 
            src={item.imagem || "https://picsum.photos/200"} 
            alt={item.nome}
            style={{width:"120px", height:"120px", objectFit:"cover"}}
            onError={(e) => {
            e.target.src = "https://picsum.photos/200"
          }}/>

        <p>Preço: {formatarPreco(item.precoFinal)}</p>
        <p> Quantidade: 
          <button onClick={() => diminuir(item._id)}>➖</button>
          {item.quantidade}
          <button onClick={() => aumentar(item)}>➕</button>
        </p>        
        <button onClick={()=>{
          setProdutoSelecionado(item._id)
          setAcaoConfirmacao("removerItem")
          setMostrarConfirmacao(true)
          
        }}>Remover item</button>

        <p>Subtotal: R$ {formatarPreco(item.precoFinal * item.quantidade)}</p>

      </div>

    ))}

    <h2>Total do Pedido: R$ {formatarPreco(total)}</h2> 

    <button onClick={() => {
      if(lista.length === 0){
        toast.warning("Nenhum ítem no pedido!")
        return
      }
      setMostrarFormulario(true)
    }}>
      Finalizar Pedido
    </button>
    <button onClick={()=>{
      setMostrarConfirmacao(true)
      setAcaoConfirmacao("limparCarrinho")}}>
        Limpar pedido</button>
      
      {mostrarFormulario && (
    <div style={styles.overlay}>

      <div style={styles.modal}>

        <h2>Quase lá 😄</h2>
        <p>Digite seus dados para finalizar</p>

        <input 
          type="text"
          placeholder="Seu nome"
          value={nomeCliente}
          onChange={(e) => setNomeCliente(e.target.value)}
          style={styles.input}
        />

        <input 
          type="text"
          placeholder="Endereço"
          value={endereco}
          onChange={(e) => setEndereco(e.target.value)}
          style={styles.input}
        />

        <div style={{display:"flex", gap:"10px", marginTop:"10px"}}>

          <button onClick={finalizarPedido}>
            Enviar WhatsApp
          </button>

          <button onClick={() => setMostrarFormulario(false)}>
            Cancelar
          </button>

        </div>

      </div>

    </div>
  )}
        <ModalConfirmacao
      aberto={mostrarConfirmacao}
      titulo="Tem certeza?"
      mensagem={
        acaoConfirmacao === "removerItem"
          ? "Deseja remover este item?"
          : "Deseja limpar todo o pedido?"
      }
      onConfirmar={confirmarAcao}
      onCancelar={() => {
        setMostrarConfirmacao(false)
        setProdutoSelecionado(null)
        setAcaoConfirmacao(null)
  }}
/>
    </>
  )
  
}

export default Pedido