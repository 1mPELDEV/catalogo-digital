function Beneficios() {

  const itens = [
    {
      titulo: "Atendimento rápido",
      descricao: "Suporte rápido e humanizado."
    },
    {
      titulo: "Qualidade garantida",
      descricao: "Produtos e serviços selecionados."
    },
    {
      titulo: "Facilidade no pedido",
      descricao: "Tudo direto pelo WhatsApp."
    }
  ]

  return (

    <section className="py-20 px-6 bg-white">

      <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">

        {itens.map((item, index) => (

          <div
            key={index}
            className="p-6 rounded-2xl shadow-sm border"
          >

            <h3 className="text-xl font-bold mb-2">
              {item.titulo}
            </h3>

            <p className="text-gray-600">
              {item.descricao}
            </p>

          </div>

        ))}

      </div>

    </section>
  )
}

export default Beneficios