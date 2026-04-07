import axios from "axios"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import formatarPreco from "../utils/formatarpreco"

function Catalogo () {

  const [produtos , setProdutos] = useState([])
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState("")

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
    window.dispatchEvent(new Event("storage"))
  }

  const produtosFiltrados = produtos.filter((produto) =>
  produto.nome.toLowerCase().includes(busca.toLowerCase())
  )

  return (
  <>
    <ToastContainer />

    <input
    type="text"
    placeholder="Buscar produto..."
    className="w-full max-w-md mx-auto block p-2 border rounded md:mt-8"
    value={busca}
    onChange={(e)=>{setBusca(e.target.value)}}
    />
    <div className="text-center py-8">
        <h1 className="text-2xl md:text-4xl font-bold">Ofertas da Semana 🔥</h1>
        <p className="text-gray-600 mt-2">Os melhores produtos com o melhor preço</p>
    </div>

    {produtosFiltrados.length === 0 ? (
      <p className="text-center text-gray-500 mt-6">Nenhum item bate com a busca 😕</p>)
      : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">

      {produtosFiltrados.map(produto => {

      const quantidade = lista.filter(item => item._id === produto._id).length

      return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col" key={produto._id}>
            <img 
              src={produto.imagem || "https://picsum.photos/200"} 
              alt={produto.nome}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
              e.target.src = "https://picsum.photos/200"
           }}/>
            <h3 className="text-lg font-semibold mt-2" >{produto.nome}</h3>
            <small className="text-gray-500" >{produto.descricao}</small>
            <p className="text-green-600 font-bold mt-2">{formatarPreco(produto.preco)}</p>
            <button className="mt-3 bg-green-500 text-white py-2 rounded hover:bg-green-600 transition" 
              onClick={() => addItem(produto)}>
              Adicionar produto
            </button>
            {quantidade > 0 && (
              <small className="mt-1 text-gray-600">🛒 {quantidade} no pedido</small>
            )}
          </div>
        )
      })}
    </div>
  )}


  </>
  )
}

export default Catalogo