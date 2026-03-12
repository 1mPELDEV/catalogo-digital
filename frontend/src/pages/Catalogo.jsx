import axios from "axios"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Catalogo () {

  const [produtos , setProdutos] = useState([])
  const [lista, setLista] = useState([])

  const list = async () =>{
    try{
      const res = await axios.get("http://localhost:8082/produtos")
      setProdutos(res.data)
    }catch(err){
      console.log("erro " + err)
    }
  }

  useEffect(()=>{
    list()
    const pedidoSalvo = JSON.parse(localStorage.getItem("lista"))

    if(pedidoSalvo){
    setLista(pedidoSalvo)
  }

  }, [])

  const addItem = (produto) =>{

    const novaLista = [...lista, produto]
    setLista(novaLista)
    toast.success("Produto adicionado ao pedido!")
    console.log("Carrinho:", novaLista)
    localStorage.setItem("lista", JSON.stringify(novaLista))
  }

  return (
  <>
    <ToastContainer />

    <h1>Bem vindo a Home</h1>
    {produtos.map(produto => {
      const quantidade = lista.filter(item => item._id === produto._id).length

      return (
        <div className="card" key={produto._id}>
          <h3>{produto.nome}</h3>
          <p>R$ {produto.preco}</p>
          <button onClick={() => addItem(produto)}>
            Adicionar produto
          </button>
          {quantidade > 0 && (
            <small>🛒 {quantidade} no pedido</small>
          )}
        </div>
      )
    })}

  </>
  )
}

export default Catalogo