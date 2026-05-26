import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Cadastro() {
  const [nomeLoja, setNomeLoja] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const res = await axios.post("http://localhost:8082/auth/register", {
        nomeLoja,
        email,
        senha
      })

      localStorage.setItem("token", res.data.token)

      alert("Conta criada com sucesso!")

      navigate("/admin")
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao cadastrar")
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-full max-w-sm"
      >
        <h2 className="text-xl font-bold mb-4 text-center">
          Cadastrar sua loja 🚀
        </h2>

        <input
          type="text"
          placeholder="Nome da loja"
          value={nomeLoja}
          onChange={(e) => setNomeLoja(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded hover:bg-green-600"
        >
          Criar conta
        </button>
      </form>
    </div>
  )
}

export default Cadastro