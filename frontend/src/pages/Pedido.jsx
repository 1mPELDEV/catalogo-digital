import { useEffect, useState } from "react"

function Pedido(){

  const [lista, setLista] = useState([])

  useEffect(()=>{

    const carrinhoSalvo = JSON.parse(localStorage.getItem("lista")) || []

    if(carrinhoSalvo){
      setLista(carrinhoSalvo)
    }

  },[])

  const itensAgrupados = Object.values(
    lista.reduce((acc,produto) =>{
      if(!acc[produto._id]){
        acc[produto._id] = { ...produto, quantidade: 0 }
      }

      acc[produto._id].quantidade++
      
      return acc

    }, {})
  )

  const total = itensAgrupados.reduce((acc, item) => {
  return acc + item.preco * item.quantidade
}, 0)


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

        <p>Quantidade: {item.quantidade}</p>

        <p>Subtotal: R$ {item.preco * item.quantidade}</p>

      </div>

    ))}

    </>
  )

}

export default Pedido