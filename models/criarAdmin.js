const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Admin = require("./Admin")
const Loja = require("./Loja") // 👈 importa a loja

mongoose.connect("mongodb://localhost/db-catalogo")

const criar = async () => {
  const hash = await bcrypt.hash("123456", 10)

  // 🔥 cria a loja primeiro
  const loja = await Loja.create({
    nome: "Mercadinho do João",
    tipo: "mercado",
    tema: { corPrimaria: "#22c55e" },
    contato: { whatsapp: "5574999999999" },
    funcionalidades: { carrinho: true },
    landing: {
      titulo: "Ofertas do dia 🛒",
      descricao: "Os melhores preços da cidade",
      cta: "Comprar agora",
      acao: "carrinho"
    }
  })

  // 🔥 cria admin ligado à loja
  await Admin.create({
    email: "admin@email.com",
    senha: hash,
    lojaId: loja._id
  })

  console.log("admin + loja criados com sucesso")
  process.exit()
}

criar()