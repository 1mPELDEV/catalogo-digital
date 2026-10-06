import { useEffect, useState } from "react"
import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

function Master() {

  const [nomeLoja, setNomeLoja] =
    useState("")

  const [email, setEmail] =
    useState("")

  const [senha, setSenha] =
    useState("")

  const [lojas, setLojas] =
    useState([])
  const [interesses, setInteresses] = useState([])
  const token = localStorage.getItem("token")
  const headers = { Authorization: `Bearer ${token}` }

  const [features, setFeatures] =
    useState({
      catalogo: true,
      carrinho: true,
      pedidoWhatsapp: true
    })

  const toggleFeature = (nome) => {
    setFeatures(prev => ({
      ...prev,
      [nome]: !prev[nome]
    }))
  }

  async function buscarLojas() {
    try {
      const res = await axios.get(
        `${API_URL}/master/lojas`, { headers }
      )

      setLojas(res.data)

    } catch (err) {
      console.log(err)
    }
  }

  async function buscarInteresses() {
    try {
      const res = await axios.get(`${API_URL}/master/interesses`, { headers })
      setInteresses(res.data)
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    let ativo = true
    const cabecalhos = { Authorization: `Bearer ${token}` }
    axios.get(`${API_URL}/master/lojas`, { headers: cabecalhos })
      .then(res => { if (ativo) setLojas(res.data) })
      .catch(err => console.error("Erro ao carregar lojas:", err))
    axios.get(`${API_URL}/master/interesses`, { headers: cabecalhos })
      .then(res => { if (ativo) setInteresses(res.data) })
      .catch(err => console.error("Erro ao carregar interessados:", err))
    return () => { ativo = false }
  }, [token])

  async function confirmarPagamento(id) {
    try {
      await axios.patch(`${API_URL}/master/interesses/${id}/confirmar`, {}, { headers })
      buscarInteresses()
      alert("Pagamento confirmado. O interessado já pode criar a conta com este e-mail.")
    } catch (err) {
      alert(err.response?.data?.erro || "Erro ao confirmar pagamento")
    }
  }

  async function criarLoja(e) {
    e.preventDefault()

    try {

      await axios.post(
        `${API_URL}/master/lojas`,
        {
          nomeLoja,
          email,
          senha,
          features
        }, { headers }
      )

      alert("Loja criada 🚀")

      setNomeLoja("")
      setEmail("")
      setSenha("")

      setFeatures({
        catalogo: true,
        carrinho: true,
        pedidoWhatsapp: true
      })

      buscarLojas()

    } catch (err) {
      alert(
        err.response?.data?.erro ||
        "Erro ao criar loja"
      )
    }
  }

  async function deletarLoja(id) {

    const confirmar =
      confirm("Excluir loja?")

    if (!confirmar) return

    try {

      await axios.delete(
        `${API_URL}/master/lojas/${id}`, { headers }
      )

      buscarLojas()

    } catch (err) {
      console.log(err)
      alert("Erro ao excluir")
    }
  }

  function copiarLink(slug) {

    const url =
      `http://localhost:5173/${slug}`

    navigator.clipboard.writeText(url)

    alert("Link copiado!")
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <h1 className="text-3xl font-bold mb-6">
        Painel Master 👑
      </h1>

      <section className="mb-6 rounded-xl bg-white p-6 shadow">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div><h2 className="text-xl font-bold">Interesses no plano anual</h2><p className="mt-1 text-sm text-gray-500">R$ 200 por 12 meses · confirme manualmente após receber o pagamento.</p></div>
          <span className="rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-800">{interesses.filter(item => item.status === "pendente").length} pendentes</span>
        </div>
        {interesses.length === 0 ? <p className="text-sm text-gray-500">Nenhum interessado por enquanto.</p> : <div className="space-y-3">{interesses.map(item => <div key={item._id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg border p-4"><div><p className="font-semibold">{item.email}</p><p className="mt-1 text-xs text-gray-500">{new Date(item.criadoEm).toLocaleString("pt-BR")} · {item.status === "pendente" ? "Aguardando pagamento" : item.status === "pago" ? "Pago · cadastro liberado" : item.status === "concluido" ? "Conta criada" : "Cadastro em andamento"}</p></div>{item.status === "pendente" && <button type="button" onClick={() => confirmarPagamento(item._id)} className="rounded-lg bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800">Confirmar pagamento</button>}</div>)}</div>}
      </section>

      <div className="grid md:grid-cols-3 gap-6">

        {/* formulário */}
        <div className="bg-white rounded-xl shadow p-6">

          <h2 className="text-xl font-bold mb-4">
            Nova Loja
          </h2>

          <form
            onSubmit={criarLoja}
            className="space-y-4"
          >

            <input
              type="text"
              placeholder="Nome da loja"
              value={nomeLoja}
              onChange={(e) =>
                setNomeLoja(e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />

            <input
              type="password"
              placeholder="Senha inicial"
              value={senha}
              onChange={(e) =>
                setSenha(e.target.value)
              }
              className="w-full border p-2 rounded"
              required
            />

            <div className="border rounded p-4">

              <h3 className="font-bold mb-3">
                Features
              </h3>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={features.catalogo}
                  onChange={() =>
                    toggleFeature(
                      "catalogo"
                    )
                  }
                />
                Catálogo
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={features.carrinho}
                  onChange={() =>
                    toggleFeature(
                      "carrinho"
                    )
                  }
                />
                Carrinho
              </label>

              <label className="flex gap-2">
                <input
                  type="checkbox"
                  checked={
                    features.pedidoWhatsapp
                  }
                  onChange={() =>
                    toggleFeature(
                      "pedidoWhatsapp"
                    )
                  }
                />
                Pedido WhatsApp
              </label>

            </div>

            <button
              className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
            >
              Criar Loja
            </button>

          </form>
        </div>

        {/* dashboard */}
        <div className="md:col-span-2 bg-white rounded-xl shadow p-6">

          <div className="flex justify-between items-center mb-5">

            <h2 className="text-xl font-bold">
              Lojas Cadastradas
            </h2>

            <span className="text-gray-500">
              {lojas.length} lojas
            </span>

          </div>

          <div className="space-y-4">

            {lojas.map(loja => (
              <div
                key={loja._id}
                className="border rounded-lg p-4 flex justify-between items-center"
              >

                <div>

                  <h3 className="font-bold text-lg">
                    {loja.nome}
                  </h3>

                  <p className="text-sm text-gray-500">
                    /{loja.slug}
                  </p>

                  <div className="flex gap-2 mt-2 flex-wrap">

                    {loja.features
                      ?.catalogo && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs">
                        catálogo
                      </span>
                    )}

                    {loja.features
                      ?.carrinho && (
                      <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs">
                        carrinho
                      </span>
                    )}

                    {loja.features
                      ?.pedidoWhatsapp && (
                      <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded text-xs">
                        whatsapp
                      </span>
                    )}

                  </div>

                </div>

                <div className="flex gap-2">

                  <button
                    onClick={() =>
                      copiarLink(loja.slug)
                    }
                    className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-2 rounded"
                  >
                    Link
                  </button>

                  <button
                    onClick={() =>
                      deletarLoja(loja._id)
                    }
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded"
                  >
                    Excluir
                  </button>

                </div>

              </div>
            ))}

          </div>

        </div>
      </div>
    </div>
  )
}

export default Master
