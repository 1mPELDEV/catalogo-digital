import { useEffect, useState, useMemo } from "react"

function Pedido(){

  const [lista, setLista] = useState([])
  const [mostrarFormulario, setMostrarFormulario] = useState(false)
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
  return acc + item.preco * item.quantidade
}, 0)

  const removeItem = (id) => {
  const novaLista = lista.filter(produto => produto._id !== id)
  setLista(novaLista)
  localStorage.setItem("lista", JSON.stringify(novaLista))
  window.dispatchEvent(new Event("storage"))
}

const limparCarrinho = () =>{
  setLista([])
  localStorage.removeItem("lista")
  window.dispatchEvent(new Event("storage"))
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
      alert("Seu carrinho está vazio!")
      return
    }

    if(!nomeCliente.trim()){
      alert("Digite seu nome!")
      return
    }

    if(!endereco.trim()){
      alert("Digite seu endereço!")
      return
    }

    let mensagem = "🛒 *Novo Pedido* \n\n"

    mensagem += `👤 Nome: ${nomeCliente}\n`
    mensagem += `📍 Endereço: ${endereco}\n\n`

    itensAgrupados.forEach(item => {
      mensagem += `• ${item.nome} x${item.quantidade} - R$ ${item.preco * item.quantidade}\n`
    })

    mensagem += `\n💰 Total: R$ ${total}`

    const numero = "5574999798620"

    const url = `https://wa.me/${numero}?text=${encodeURIComponent(mensagem)}`

    window.open(url, "_blank")

    setMostrarFormulario(false)
    limparCarrinho()
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

  return(
    <>
    <h1>Seu Pedido</h1>
    
    {lista.length === 0 && (
    <p>Nenhum item no pedido ainda</p>
    )}
    
    {itensAgrupados.map(item => (

      <div key={item._id} style={{border:"1px solid #ccc", margin:"10px", padding:"10px"}}>

        <h3>{item.nome}</h3>

        <p>Preço: R$ {item.preco}</p>
        <p> Quantidade: 
          <button onClick={() => diminuir(item._id)}>➖</button>
          {item.quantidade}
          <button onClick={() => aumentar(item)}>➕</button>
        </p>        
        <button onClick={()=>{removeItem(item._id)}}>Remover item</button>

        <p>Subtotal: R$ {item.preco * item.quantidade}</p>

      </div>

    ))}

    <h2>Total do Pedido: R$ {total}</h2> 

    <button onClick={() => {
      if(lista.length === 0){
        alert("Seu carrinho está vazio!")
        return
      }
      setMostrarFormulario(true)
    }}>
      Finalizar Pedido
    </button>
    <button onClick={()=>{limparCarrinho()}}>Limpar pedido</button>
      
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

    </>
  )
  
}

export default Pedido