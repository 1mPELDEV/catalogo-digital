import { useEffect , useState} from 'react'
import { useNavigate } from 'react-router-dom'
// importanto axios 
import axios from "axios"
// importanto toastify
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
//importanto modal
import ModalConfirmacao from '../components/modalConfirmacao'
// rotas

function Admin() {
const [produtos, setProdutos] = useState([])
const [nome, setNome] = useState('')
const [preco, setPreco] = useState('')
const [imagem, setImagem] = useState('')
const [descricao, setDescricao] = useState('')
const [editandoId , setEditandoId] = useState(null)
const [loading, setLoading] = useState(false)
const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false)
const [produtoSelecionado, setProdutoSelecionado] = useState(null)
const [promocao, setPromocao] = useState(false)
const [desconto, setDesconto] = useState(0)
const [categoria, setCategoria] = useState("")

const navigate = useNavigate()
const token = localStorage.getItem("token")

 // verifica o token
  useEffect(() => {
    const token = localStorage.getItem("token")
    if(!token){
      navigate("/") 
    }
  }, [])
// READ
  const buscarProdutos = async () =>{
    try {
      setLoading(true) 

      const res = await axios.get('http://localhost:8082/produtos', {
        headers : {Authorization : `Bearer ${token}`}
      })
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
    if(!categoria){
    toast.warning("Selecione uma categoria!")
    return
    }
//CREATE
    axios.post('http://localhost:8082/produtos', {
      nome,
      preco: Number(preco),
      descricao,
      categoria,
      imagem,
      promocao :{
        ativa: promocao,
        desconto: desconto
      }
      },
      {headers : {Authorization: `Bearer ${token}`}}).then(()=>{
      setNome('')
      setDescricao('')
      setImagem('')
      setPreco('')
      setCategoria('')
      setDesconto(0)
      setPromocao(false)
      toast.success("Criado com sucesso!")
      buscarProdutos()
    }).catch((err) =>{
  toast.error("Erro ao criar produto")
  console.log(err)
    })
  }
//DELETE
  const deletarProduto = async () => {

    if(!produtoSelecionado) return

    try{
      await axios.delete(`http://localhost:8082/produtos/${produtoSelecionado._id}`, {
          headers: { Authorization: `Bearer ${token}` }
      })

      toast.success("Produto deletado com sucesso!")
      setMostrarConfirmacao(false)
      setProdutoSelecionado(null)
      buscarProdutos()

    } catch (err) {
      toast.error("Erro ao deletar produto")
      console.log(err)
    }

  }
// UPDATE
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
      preco : Number(preco),
      descricao,
      categoria,
      imagem,
      promocao :{
        ativa: promocao,
        desconto: desconto
      }
    },{ headers: { Authorization: `Bearer ${token}` }}
     ).then(()=>{
      setNome('')
      setPreco('')
      setDescricao('')
      setCategoria('')
      setImagem('')
      setEditandoId(null)
      setPromocao(false)
      setDesconto(0)
      toast.success("Produto atualizado com sucesso!")
      buscarProdutos()
    }).catch((err) => {
      toast.error("Erro ao atualizar produto")
      console.log(err)})
  })
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
  }
}

return (
  <>
    <ToastContainer />

    <div className="max-w-5xl mx-auto p-4">

      {/* TÍTULO */}
      <h1 className="text-3xl font-bold mb-4 text-center">
        Painel Admin
      </h1>

      <hr className="mb-6"/>

      {/* FORM */}
      <div className="bg-white shadow rounded-lg p-4 mb-8">

        <h2 className="text-xl font-semibold mb-4">
          Cadastrar Produto
        </h2>

        <div className="grid md:grid-cols-2 gap-4">

          <input
            type="text"
            placeholder="Nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="p-2 border rounded"
          />

          <input
            type="number"
            placeholder="Preço"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
            className="p-2 border rounded"
          />

          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="p-2 border rounded"
          >
            <option value="">Selecione uma categoria</option>
            <option value="Bebidas">Bebidas</option>
            <option value="Alimentos">Alimentos</option>
            <option value="Limpeza">Limpeza</option>
          </select>

          <input
            type="text"
            placeholder="URL da imagem"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
            className="p-2 border rounded"
          />

        </div>

        <input
          type="text"
          placeholder="Descrição"
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          className="p-2 border rounded w-full mt-4"
        />

        {/* PREVIEW */}
        {imagem && (
          <img
            src={imagem}
            className="w-24 h-24 object-cover mt-4 rounded"
          />
        )}

        {/* PROMO */}
        <label className="flex items-center gap-2 mt-4">
          <input
            type="checkbox"
            checked={promocao}
            onChange={(e) => setPromocao(e.target.checked)}
          />
          Produto em promoção 🔥
        </label>

        {promocao && (
          <input
            type="number"
            placeholder="Desconto (R$)"
            value={desconto}
            onChange={(e) => setDesconto(Number(e.target.value))}
            className="p-2 border rounded w-full mt-2"
          />
        )}

        {/* BOTÃO */}
        <button
          onClick={() => {
            if (editandoId) {
              atualizarProduto(editandoId)
            } else {
              criarProduto()
            }
          }}
          className="mt-4 w-full bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] text-white p-2 rounded"
        >
          {editandoId ? "Atualizar Produto" : "Criar Produto"}
        </button>

      </div>

      {/* LISTA */}
      <h2 className="text-xl font-semibold mb-4">
        Lista de Produtos Cadastrados 
      </h2>

      {loading && <p>🔄 Carregando produtos...</p>}

      {!loading && produtos.length === 0 && (
        <p className="text-gray-500">
          📦 Nenhum produto cadastrado ainda.
        </p>
      )}

      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">

        {!loading && produtos.map(produto => (

          <div key={produto._id} className="bg-white rounded shadow p-4">

            <img src={produto.imagem} alt="" /> 

            <h3 className="font-semibold">
              {produto.nome}
            </h3>

            <p className="text-gray-600">
              R$ {produto.preco}
            </p>

            {produto.promocao?.ativa && (
              <p className="text-red-500 text-sm mt-1">
                🔥 Promoção: R$ {produto.promocao.desconto}
              </p>
            )}

            <div className="flex gap-2 mt-4">

              <button
                onClick={() => {
                  setProdutoSelecionado(produto)
                  setMostrarConfirmacao(true)
                }}
                className="flex-1 bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                Deletar
              </button>

              <button
                onClick={() => {
                  setNome(produto.nome)
                  setPreco(produto.preco)
                  setDescricao(produto.descricao)
                  setImagem(produto.imagem)
                  setEditandoId(produto._id)
                  setCategoria(produto.categoria || "")
                  setDesconto(produto.promocao?.desconto || 0)
                  setPromocao(produto.promocao?.ativa || false)
                }}
                className="flex-1 bg-gray-200 p-2 rounded hover:bg-gray-300"
              >
                Editar
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>

    <ModalConfirmacao
      aberto={mostrarConfirmacao}
      titulo="Tem certeza?"
      mensagem={`Deseja deletar o produto ${produtoSelecionado?.nome}?`}
      onConfirmar={deletarProduto}
      onCancelar={() => {
        setMostrarConfirmacao(false)
        setProdutoSelecionado(null)
      }}
    />
  </>
)
}

export default Admin