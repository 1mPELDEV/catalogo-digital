// ==============================
// Footer.jsx
// ==============================

function Footer({ loja }) {

  return (

    <footer className="bg-black text-white py-16 px-6">

      <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-10">

        {/* LOGO / NOME */}

        <div>

          <h2 className="text-3xl font-bold">
            {loja.nome}
          </h2>

          <p className="text-gray-400 mt-4 leading-relaxed">

            {loja.landing?.descricao}

          </p>

        </div>

        {/* LINKS */}

        <div>

          <h3 className="font-semibold text-lg mb-4">
            Navegação
          </h3>

          <div className="flex flex-col gap-3 text-gray-400">

            <a href="#">
              Início
            </a>

            {loja.features?.catalogo && (
              <a href="#produtos">
                Produtos
              </a>
            )}

            <a
              href={`https://wa.me/${loja.contato?.whatsapp}`}
              target="_blank"
            >
              WhatsApp
            </a>

          </div>

        </div>

        {/* CONTATO */}

        <div>

          <h3 className="font-semibold text-lg mb-4">
            Contato
          </h3>

          <p className="text-gray-400">
            WhatsApp:
          </p>

          <a
            href={`https://wa.me/${loja.contato?.whatsapp}`}
            target="_blank"
            className="text-white font-semibold mt-2 inline-block"
          >

            {loja.contato?.whatsapp}

          </a>

        </div>

      </div>

      {/* COPYRIGHT */}

      <div className="border-t border-white/10 mt-12 pt-8 text-center text-gray-500 text-sm">

        © 2026 {loja.nome}. Todos os direitos reservados.

      </div>

    </footer>
  )
}

export default Footer