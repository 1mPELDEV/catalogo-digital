import { useState } from "react"
import axios from "axios"
import { useNavigate } from "react-router-dom"

function Cadastro() {
  const [nomeLoja, setNomeLoja] = useState("")
  const [email, setEmail] = useState("")
  const [senha, setSenha] = useState("")
  const [whatsapp, setWhatsapp] = useState("")
  const [corPrimaria, setCorPrimaria] = useState("#22c55e")

  const [logo, setLogo] = useState(null)
  const [logoPreview, setLogoPreview] = useState("")

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {

      const formData = new FormData()

      formData.append("nomeLoja", nomeLoja)
      formData.append("email", email)
      formData.append("senha", senha)
      formData.append("whatsapp", whatsapp)
      formData.append("corPrimaria", corPrimaria)

      if(logo){
        formData.append("logo", logo)
      }


      const res = await axios.post(
        "http://localhost:8082/auth/register",
        formData,
        {
          headers:{
            "Content-Type":"multipart/form-data"
          }
        }
      )


      localStorage.setItem(
        "token",
        res.data.token
      )

      alert("Loja criada com sucesso!")

      navigate("/admin")


    } catch(err){

      alert(
        err.response?.data?.erro ||
        "Erro ao cadastrar"
      )

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

        <input
          type="text"
          placeholder="Whatsapp"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="w-full mb-4 p-2 border rounded"
        />

          <label className="block mb-2 font-medium">
            Cor principal da loja
          </label>

          <input
            type="color"
            value={corPrimaria}
            onChange={(e) => setCorPrimaria(e.target.value)}
            className="w-16 h-10 cursor-pointer border rounded"
          />

          <p className="text-sm mt-2 text-gray-600">
            Cor escolhida: {corPrimaria}
          </p>
        
        <input type="file"
         accept="image/*"
         onChange={(e) => {
           setLogo(e.target.files[0])
           setLogoPreview(URL.createObjectURL(e.target.files[0]))
         }}
          className="mb-4"
        />

        {logoPreview && (
          <img
            src={logoPreview}
            alt="Preview"
            className="w-full h-auto mb-4"
          />
        )}

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