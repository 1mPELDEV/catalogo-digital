// ==============================
// CTA.jsx
// ==============================

function CTA({ loja }) {

  return (

    <section
      className="py-24 px-6"
      style={{
        backgroundColor: loja.tema?.corPrimaria
      }}
    >

      <div className="max-w-4xl mx-auto text-center text-white">

        <span className="uppercase tracking-widest text-sm opacity-80">
          Atendimento rápido
        </span>

        <h2 className="text-4xl md:text-6xl font-bold mt-4 leading-tight">

          Faça seu pedido agora mesmo

        </h2>

        <p className="mt-6 text-lg opacity-90">

          Atendimento rápido e humanizado direto pelo WhatsApp.

        </p>

        <a
          href={`https://wa.me/${loja.contato?.whatsapp}`}
          target="_blank"
          className="inline-block mt-10 bg-white text-black px-10 py-4 rounded-2xl font-bold hover:scale-105 transition"
        >

          {loja.landing?.cta || "Falar no WhatsApp"}

        </a>

      </div>

    </section>
  )
}

export default CTA