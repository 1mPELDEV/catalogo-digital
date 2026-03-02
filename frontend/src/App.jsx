import { useEffect , useState } from 'react'
import axios from "axios"

function App() {
const [produtos, setProdutos] = useState([])
const [nome, setNome] = useState('')
const [preco, setPreco] = useState('')
const [editandoId , setEditandoId] = useState(null)

const buscarProdutos = () =>{
  axios.get('http://localhost:8082/produtos').then(
  res => setProdutos(res.data)
).catch(err => console.log(err))
}
 
useEffect(()=>{
  buscarProdutos()
}, [])

const criarProduto = () =>{
  if(!nome.trim()){
    alert("Nome do produto obrigatório!")
    return
  }

  if(!preco || preco <= 0 ){
    alert("O preço deve ser maior que 0")
    return
  }

  axios.post('http://localhost:8082/produtos', { nome, preco: Number(preco)}).then(()=>{
    setNome('')
    setPreco('')
    buscarProdutos()
  }).catch(err => console.log(err))
}

const deletarProduto = ( produto => {
  console.log(`produto ${produto} deletado!`)
  
  axios.delete(`http://localhost:8082/produtos/${produto._id}`).then(()=>{
  buscarProdutos()
  }).catch(err =>{ console.log(err)})
})

const atualizarProduto = ( id => {

    if(!nome.trim()){
    alert("Nome do produto obrigatório!")
    return
  }

  if(!preco || preco <= 0 ){
    alert("O preço deve ser maior que 0")
    return
  }
  
  axios.put(`http://localhost:8082/produtos/${id}`,{
    nome,
    preco : Number(preco)
  }).then(()=>{
    setNome('')
    setPreco('')
    setEditandoId(null)
    buscarProdutos()
  }).catch(err => console.log(err))
})

  return (
    <>
      <h1>Catálogo Digital</h1>
      <hr/>
      <h2>Cadastrar Produto</h2>
      <input type="text" placeholder='Nome' value={nome} onChange={(e) => setNome(e.target.value)} />
      <input type="number" placeholder='Preço' value={preco} onChange={(e) => setPreco(e.target.value)}/>
      <button onClick={()=>{
        if(editandoId){
          atualizarProduto(editandoId) 
        }else{
          criarProduto()
        }
      }}>{ editandoId ? "Atualizar Produto" : "Criar Produto"}</button>
      {nome}
      {preco}

      <h2>Lista de Produtos</h2>

      {produtos.map(produto => (
        <div className='card' key={produto._id}>
          <h3>{produto.nome}</h3>
          <p>R$ {produto.preco}</p>
          <button onClick={() => {deletarProduto(produto)}}>Deletar</button>
          <button onClick={() =>{
            setNome(produto.nome)
            setPreco(produto.preco)
            setEditandoId(produto._id)
          }}>Editar</button>
        </div>
      ))}
    </>
  )
}

export default App
