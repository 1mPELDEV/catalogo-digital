import { useEffect , useState } from 'react'
// importanto axios 
import axios from "axios"
// importanto toastify
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
// rotas

function Admin() {
const [produtos, setProdutos] = useState([])
const [nome, setNome] = useState('')
const [preco, setPreco] = useState('')
const [editandoId , setEditandoId] = useState(null)
const [loading, setLoading] = useState(false)

const buscarProdutos = async () =>{
  try {
    setLoading(true) 

    const res = await axios.get('http://localhost:8082/produtos')
    setProdutos(res.data)
    return res.data

  } catch (err){
    console.log(err)
    toast.error("Erro ao buscar produto")
  } finally{
    setLoading(false)
  }
}
 
useEffect(() => {
  const carregar = async () => {
    const dados = await buscarProdutos()

    if (dados) {
      toast.info(
        `👋 Bem vindo(a)! Você tem ${dados.length} produtos cadastrados.`,
        { autoClose: 4000 }
      )
    }
  }
  carregar()
}, [])

const criarProduto = () =>{
  if(!nome.trim()){
   toast.warning("O Nome não pode ficar vazio!")
    return
  }

  if(!preco || preco <= 0 ){
   toast.warning("O preço deve ser maior do que 0!")
    return
  }

  axios.post('http://localhost:8082/produtos', { nome, preco: Number(preco)}).then(()=>{
    setNome('')
    setPreco('')
    toast.success("Criado com sucesso!")
    buscarProdutos()
  }).catch((err) =>{
 toast.error("Erro ao criar produto")
console.log(err)
  })
}

const deletarProduto = async (produto) => {
  const confirmar = window.confirm(`Tem certeza que deseja deletar o "${produto.nome}"? `)

  if(!confirmar) return

  try{
    await axios.delete(`http://localhost:8082/produtos/${produto._id}`)

    toast.success("Produto deletado com sucesso!")
    await buscarProdutos()
  } catch (err) {
    toast.error("Erro ao deletar produto")
    console.log(err)
  }

}

const atualizarProduto = ( id => {

    if(!nome.trim()){
   toast.warning("O Nome não pode ficar vazio!")
    return
  }

  if(!preco || preco <= 0 ){
   toast.warning("O preço deve ser maior do que 0!")
    return
  }
  
  axios.put(`http://localhost:8082/produtos/${id}`,{
    nome,
    preco : Number(preco)
  }).then(()=>{
    setNome('')
    setPreco('')
    setEditandoId(null)
    toast.success("Produto atualizado com sucesso!")
    buscarProdutos()
  }).catch((err) => {
    toast.error("Erro ao atualizar produto")
    console.log(err)})
})

  return (
    <>
        <ToastContainer />
        
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
      {loading && <p>🔄 Carregando produtos...</p>}
      
      {!loading && produtos.length === 0 && (
        <p style={{ opacity: 0.6 }}>
          📦 Nenhum produto cadastrado ainda.
        </p>
      )}
      {!loading && produtos.map(produto => (
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

export default Admin