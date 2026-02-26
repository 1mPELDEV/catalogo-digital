import { useEffect , useState } from 'react'
import axios from "axios"

function App() {
  const [produtos, setProdutos] = useState([])

  useEffect(() =>{
    axios.get('http://localhost:8082/produtos').then(
      res => setProdutos(res.data)
    ).catch(err => console.log(err))
  } , [])

  return (
    <>
      <h1>Catálogo Digital</h1>
      {produtos.map(produto => (
        <div key={produto._id}>
          <h3>{produto.nome}</h3>
          <p>R$ {produto.preco}</p>

        </div>
      ))}
    </>
  )
}

export default App
