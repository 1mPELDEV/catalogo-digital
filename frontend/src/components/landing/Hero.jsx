function Hero({ loja }) {

  return (
    <section
      className="h-[420px] bg-cover bg-center relative"
      style={{
        backgroundImage: `url(${loja.banner})`
      }}
    >

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 max-w-6xl mx-auto h-full flex flex-col justify-center px-4">

        <img
          src={loja.logo}
          className="w-24 h-24 rounded-full border-4 border-white mb-4"
        />

        <h1 className="text-5xl font-black text-white">
          {loja.nome}
        </h1>

        <a
          href={`https://wa.me/${loja.contato?.whatsapp}`}
          className="mt-6 bg-[var(--color-primary)] text-white px-6 py-3 rounded-xl w-fit"
        >
          Pedir no WhatsApp
        </a>

      </div>

    </section>
  )
}

export default Hero