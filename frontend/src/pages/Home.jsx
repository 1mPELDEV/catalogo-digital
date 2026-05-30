function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-6">

      <h1 className="text-4xl font-bold">
        Crie sua loja online 🚀
      </h1>

      <p className="text-gray-600 mt-3 max-w-lg">
        Monte seu catálogo digital, receba pedidos no WhatsApp
        e personalize sua loja.
      </p>

      <div className="flex gap-3 mt-6">
        <a
          href="/cadastro"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Criar Loja
        </a>

        <a
          href="/login"
          className="border px-4 py-2 rounded"
        >
          Entrar
        </a>
      </div>

    </div>
  )
}

export default Home