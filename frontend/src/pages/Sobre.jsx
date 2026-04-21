function Sobre () {
return (
  <div className="bg-gray-50">

    {/* HERO */}
    <section className="text-center py-16 px-4 bg-green-600 text-white">
      <h1 className="text-4xl md:text-5xl font-bold mb-4">
        Seu mercado na palma da mão 🛒
      </h1>
      <p className="text-lg md:text-xl mb-6">
        Peça seus produtos com facilidade e receba sem sair de casa
      </p>
      <a
        href="/"
        className="bg-white text-green-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
      >
        Ver produtos
      </a>
    </section>

    {/* BENEFÍCIOS */}
    <section className="max-w-5xl mx-auto py-12 px-4 grid md:grid-cols-3 gap-6">

      <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="font-bold text-lg mb-2">⚡ Rápido</h3>
        <p className="text-gray-600">Pedido feito em poucos cliques</p>
      </div>

      <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="font-bold text-lg mb-2">💰 Econômico</h3>
        <p className="text-gray-600">Os melhores preços da região</p>
      </div>

      <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="font-bold text-lg mb-2">🚚 Entrega fácil</h3>
        <p className="text-gray-600">Receba no conforto da sua casa</p>
      </div>

    </section>

    {/* COMO FUNCIONA */}
    <section className="bg-white py-12 px-4">
      <div className="max-w-4xl mx-auto text-center">

        <h2 className="text-2xl font-bold text-green-700 mb-6">
          Como funciona?
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          <div>
            <p className="text-3xl mb-2">1️⃣</p>
            <p>Escolha seus produtos</p>
          </div>

          <div>
            <p className="text-3xl mb-2">2️⃣</p>
            <p>Adicione ao pedido</p>
          </div>

          <div>
            <p className="text-3xl mb-2">3️⃣</p>
            <p>Finalize pelo WhatsApp</p>
          </div>

        </div>

      </div>
    </section>

    {/* CTA FINAL */}
    <section className="text-center py-16 px-4 bg-green-600 text-white">

      <h2 className="text-3xl font-bold mb-4">
        Pronto para fazer seu pedido?
      </h2>

      <a
        href="/"
        className="bg-white text-green-600 px-6 py-3 rounded font-semibold hover:bg-gray-100"
      >
        Começar agora
      </a>

    </section>

  </div>
)
}

export default Sobre