import { useEffect, useState } from "react"

function Pedido(){

  const [lista, setLista] = useState([])

  useEffect(()=>{

    const carrinhoSalvo = JSON.parse(localStorage.getItem("lista"))

    if(carrinhoSalvo){
      setLista(carrinhoSalvo)
    }

  },[])

  const quantidade = lista.filter(item => item._id === produto._id).length

  return(
    <>
    <h1>Seu Pedido</h1>
    
    {lista.length === 0 && (
    <p>Nenhum item no pedido ainda</p>
    )}

    {lista.map(item =>(
    <div key={item._id}>
        <h3>{item.nome}</h3>
        <p>R$ {item.preco}</p>
    </div>
    ))}

    </>
  )

}

export default Pedido