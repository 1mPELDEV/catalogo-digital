import axios from "axios"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import formatarPreco from "../utils/formatarpreco"

function Catalogo () {

  const [produtos , setProdutos] = useState([])
  const [lista, setLista] = useState([])
  const [busca, setBusca] = useState("")
  const [categoriaSelecionada, setCategoriaSelecionada] = useState("")

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

  const addItem = (produto) => {

    const precoFinal = produto.promocao?.ativa
      ? produto.preco - produto.promocao.desconto
      : produto.preco

    const produtoComPreco = {
      ...produto,
      precoFinal
    }
    console.log(produtoComPreco)
    const novaLista = [...lista, produtoComPreco]

    setLista(novaLista)
    toast.success("Produto adicionado ao pedido!")
    localStorage.setItem("lista", JSON.stringify(novaLista))
    window.dispatchEvent(new Event("storage"))
  }

  const produtosFiltrados = produtos
  .filter(produto =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  )
  .filter(produto =>
    categoriaSelecionada
      ? produto.categoria === categoriaSelecionada
      : true
  )

  const produtosOrdenados = [...produtosFiltrados].sort((a, b) => {
  const aPromo = a.promocao?.ativa ? 1 : 0
  const bPromo = b.promocao?.ativa ? 1 : 0

  return bPromo - aPromo
})

  return (
  <>
    <ToastContainer />
<div className="max-w-4xl mx-auto px-4 mt-6">
  <p className="text-sm text-gray-600 mb-2">🔎 Busque ou filtre produtos</p>
  <div className="flex flex-col md:flex-row gap-3">
    <input
      type="text"
      placeholder="Buscar produto..."
      value={busca}
      onChange={(e) => setBusca(e.target.value)}
      className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
    />
    <select
      value={categoriaSelecionada}
      onChange={(e) => setCategoriaSelecionada(e.target.value)}
      className="p-2 border rounded md:w-56 focus:outline-none focus:ring-2 focus:ring-green-400"
    >
      <option value="">Todas</option>
      <option value="Bebidas">Bebidas</option>
      <option value="Alimentos">Alimentos</option>
      <option value="Limpeza">Limpeza</option>
    </select>
  </div>
</div>

    <div className="text-center py-8">
        <h1 className="text-2xl md:text-4xl font-bold">Ofertas da Semana 🔥</h1>
        <p className="text-gray-600 mt-2">Os melhores produtos com o melhor preço</p>
    </div>

    {produtosFiltrados.length === 0 ? (
      <p className="text-center text-gray-500 mt-6">Nenhum item bate com a busca 😕</p>)
      : (<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">

      {produtosOrdenados.map(produto => {

      const quantidade = lista.filter(item => item._id === produto._id).length

      return (
        <div className="bg-white rounded-lg shadow p-4 flex flex-col relative" key={produto._id}>
          {produto.promocao?.ativa && (
          <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded"> Promoção 🔥</span>
          )}
            <img 
              src={produto.imagem || "https://picsum.photos/200"} 
              alt={produto.nome}
              className="w-full h-48 object-cover rounded"
              onError={(e) => {
              e.target.src = "https://picsum.photos/200"
           }}/>
            <h3 className="text-lg font-semibold mt-2" >{produto.nome}</h3>
            <small className="text-gray-500" >{produto.descricao}</small>
          {produto.promocao?.ativa ? (
            <>
              <p className="text-gray-400 line-through">{formatarPreco(produto.preco)}</p>
              <p className="text-green-600 font-bold">{formatarPreco(produto.preco - produto.promocao.desconto)}</p>
            </> ) : (
              <p className="text-green-600 font-bold">{formatarPreco(produto.preco)}</p>
          )}
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