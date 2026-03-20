import { useEffect, useState, useMemo } from "react"

function Pedido(){

  const [lista, setLista] = useState([])

  useEffect(()=>{

    const carrinhoSalvo = JSON.parse(localStorage.getItem("lista")) || []

    if(carrinhoSalvo){
      setLista(carrinhoSalvo)
    }

  },[])
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
    <button onClick={()=>{limparCarrinho()}}>Limpar pedido</button>
        

    </>
  )

}

export default Pedido