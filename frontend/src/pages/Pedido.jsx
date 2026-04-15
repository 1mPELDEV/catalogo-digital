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

  <div key={item._id} className="bg-white rounded-lg shadow p-4 flex gap-4 items-center">
    <img 
      src={item.imagem || "https://picsum.photos/200"} 
      alt={item.nome}
      className="w-20 h-20 object-cover rounded"
    />
    <div className="flex-1">
      <h3 className="font-semibold">{item.nome}</h3>
      <p className="text-sm text-gray-500">
        {formatarPreco(item.precoFinal)}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <button onClick={() => diminuir(item._id)} className="px-2 bg-gray-200 rounded">➖</button>
        <span>{item.quantidade}</span>
        <button onClick={() => aumentar(item)} className="px-2 bg-gray-200 rounded">➕</button>
      </div>
      <p className="mt-2 font-bold text-green-600">
        {formatarPreco(item.precoFinal * item.quantidade)}
      </p>
    </div>
    <button 
      onClick={()=>{
        setProdutoSelecionado(item._id)
        setAcaoConfirmacao("removerItem")
        setMostrarConfirmacao(true)
      }}
      className="text-red-500 hover:underline"
    >
      Remover
    </button>
  </div>
  ))}

  <div className="max-w-3xl mx-auto mt-6 space-y-3">
    <h2 className="text-xl font-bold">Total: {formatarPreco(total)}</h2>
    <button
      onClick={() => {
        if(lista.length === 0){
          toast.warning("Nenhum ítem no pedido!")
          return
        }
        setMostrarFormulario(true)
      }}
      className="w-full bg-green-600 text-white p-3 rounded hover:bg-green-700"
    >
      Finalizar Pedido
    </button>
    <button
      onClick={()=>{
        setMostrarConfirmacao(true)
        setAcaoConfirmacao("limparCarrinho")
      }}
      className="w-full bg-red-500 text-white p-3 rounded hover:bg-red-600"
    >
      Limpar Pedido
    </button>
</div>
      
{mostrarFormulario && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

  <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg animate-[modalPop_0.35s_cubic-bezier(0.22,1,0.36,1)]">

      <h2 className="text-xl font-bold mb-2">Quase lá 😄</h2>
      <p className="text-gray-600 mb-4">Digite seus dados para finalizar</p>

      <input 
        type="text"
        placeholder="Seu nome"
        value={nomeCliente}
        onChange={(e) => setNomeCliente(e.target.value)}
        className="w-full p-2 border rounded mb-3"
      />

      <input 
        type="text"
        placeholder="Endereço"
        value={endereco}
        onChange={(e) => setEndereco(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />

      <div className="flex gap-2">

        <button 
          onClick={finalizarPedido}
          className="flex-1 bg-green-600 text-white p-2 rounded hover:bg-green-700"
        >
          Enviar WhatsApp
        </button>

        <button 
          onClick={() => setMostrarFormulario(false)}
          className="flex-1 bg-gray-300 p-2 rounded hover:bg-gray-400"
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