import { useEffect, useState } from "react"
import axios from "axios"
import { toast } from "react-toastify"

function ConfigLoja() {
  const [nome, setNome] = useState("")
  const [cor, setCor] = useState("green")
  const [whatsapp, setWhatsapp] = useState("")
  const [titulo, setTitulo] = useState("")
  const [descricao, setDescricao] = useState("")
  const [cta, setCta] = useState("")
  const [template, setTemplate] = useState("loja-pedido")

  const token = localStorage.getItem("token")

  // 🔥 carregar dados da loja
  useEffect(() => {
    axios.get("http://localhost:8082/loja", {
    })
      .then(res => {
        const loja = res.data

        setNome(loja.nome || "")
        setCor(loja.tema?.corPrimaria || "green")
        setWhatsapp(loja.contato?.whatsapp || "")
        setTitulo(loja.landing?.titulo || "")
        setDescricao(loja.landing?.descricao || "")
        setCta(loja.landing?.cta || "")
        setTemplate(loja.template || "loja-pedido")
      })
      .catch(() => {
        toast.error("Erro ao carregar dados da loja")
      })
  }, [])

  // 🔥 salvar alterações
  const salvar = () => {
    if(!token){
    toast.error("Você precisa estar logado")
     return
    }

    axios.put("http://localhost:8082/loja",
      {
        nome,
        template,
        tema: { corPrimaria: cor },
        contato: { whatsapp },
        landing: {
          titulo,
          descricao,
          cta
        }
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    )
      .then(() => {
        toast.success("Configurações salvas!")
        window.location.reload()
      })
      .catch(() => {
        toast.error("Erro ao salvar")
      })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">

      <h2 className="text-2xl font-bold mb-6">
        ⚙️ Configurações da Loja
      </h2>

      {/* GRID */}
      <div className="grid md:grid-cols-2 gap-4">

        {/* NOME */}
        <input
          type="text"
          placeholder="Nome da loja"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="p-2 border rounded"
        />

        <select
          value={cor}
          onChange={(e) => setCor(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="green">Verde</option>
          <option value="blue">Azul</option>
          <option value="red">Vermelho</option>
          <option value="purple">Roxo</option>
        </select>

        {/* WHATS */}
        <input
          type="text"
          placeholder="WhatsApp (ex: 55999999999)"
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value)}
          className="p-2 border rounded"
        />

      </div>

      {/* LANDING */}
      <div className="mt-6">

        <h3 className="text-lg font-semibold mb-4">
          🛒 Landing Page
        </h3>
         <h2> template:</h2>
         <select
          value={template}
          onChange={(e) => setTemplate(e.target.value)}
          className="p-2 border rounded"
        >

          <option value="loja-pedido">
            Loja + Pedido
          </option>

          <option value="servico">
            Serviço
          </option>

          <option value="institucional">
            Institucional
          </option>

        </select>

        <div className="grid gap-4">

          <input
            type="text"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            className="p-2 border rounded"
          />

          <input
            type="text"
            placeholder="Texto do botão (CTA)"
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="p-2 border rounded"
          />

        </div>
      </div>

      {/* BOTÃO */}
      <button
        onClick={salvar}
        className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded font-semibold transition"
      >
        💾 Salvar Configurações
      </button>

    </div>
  )
}

export default ConfigLoja