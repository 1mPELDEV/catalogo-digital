import axios  from "axios"
import { useState, useEffect } from "react"
import { toast, ToastContainer } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

function Catalogo () {
    const [produtos , setProdutos] = useState([])
    const [lista, setLista] = useState([])

    const list = async () =>{
        try{
            const res = await axios.get('http://localhost:8082/produtos')
            setProdutos(res.data)
        }catch(err){
            console.log("erro" + err)
        }
    }
    useEffect(()=>{
        list()
    }, [])
    
    // Pedido

    const addItem = (produto) =>{
        setLista([...lista, produto])
        toast.success("Produto adicionado ao pedido!")
        console.log(console.log("Carrinho:",[...lista, produto]))
    }

    return (
    <>
        <ToastContainer />
      <h1>Bem vindo a Home</h1>
        {produtos.map( produto =>(
            <div className="card" key={produto._id}>
            <h3>{produto.nome}</h3>
            <p>R${produto.preco}</p>
            <button onClick={() => addItem(produto)}>Adicionar produto</button>
            </div>
        )
    )}
    </>
    )
}

export default Catalogo