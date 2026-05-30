const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

const Admin = require("./Admin")
const Loja = require("./Loja") // 👈 importa a loja

mongoose.connect("mongodb://localhost/db-catalogo")

const criar = async () => {
  const hash = await bcrypt.hash("123456", 10)

  // 🔥 cria a loja primeiro
  const loja = await Loja.create({
    nome: "farmacia da maria",
    slug:"farmacia-maria",
    tema: { corPrimaria: "#f32222" },
    contato: { whatsapp: "5574999999999" },
    features: { catalogo:false, carrinho: true, pedidoWhatsapp: true },
  })

  // 🔥 cria admin ligado à loja
  await Admin.create({
    email: "farmaciamaria@email.com",
    senha: hash,
    lojaId: loja._id
  })

  console.log("admin + loja criados com sucesso")
  process.exit()
}

criar()