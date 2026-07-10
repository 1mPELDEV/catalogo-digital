const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Admin = require("../models/Admin")
const Loja = require("../models/Loja")

const upload = require("../config/multer")

console.log("auth.js: Auth router carregado ")

router.post("/register", upload.single("logo"), async (req, res) => {
  try {

    const { nomeLoja, email, senha, whatsapp, corPrimaria} = req.body

    // email já existe?
    const existe = await Admin.findOne({ email })

    if (existe) {
      return res.status(400).json({
        erro: "Email já cadastrado"
      })
    }

    // gera slug
    const slug = nomeLoja
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    // slug já existe?
    const slugExiste = await Loja.findOne({ slug })

    if (slugExiste) {
      return res.status(400).json({
        erro: "Nome da loja já está em uso"
      })
    }

    // senha hash
    const hash = await bcrypt.hash(senha, 10)

    // 1️⃣ cria loja
    const loja = await Loja.create({

      nome: nomeLoja,

      slug,

      logo: req.file 
        ? `/uploads/${req.file.filename}`
        : null,

      tema: {
        corPrimaria: corPrimaria || "#22c55e"
      },

      contato: {
        whatsapp: whatsapp || ""
      },

      features: {
        catalogo: true,
        pedidoWhatsapp: true,
        carrinho: true
      }

    })

    console.log("auth.js: LOJA CRIADA:", loja)

    // 2️⃣ cria admin ligado à loja
    const admin = await Admin.create({

      nome: nomeLoja,
      email,
      senha: hash,
      lojaId: loja._id

    })

    // 3️⃣ conecta admin na loja
    loja.adminId = admin._id
    await loja.save()

    // 4️⃣ token
    const token = jwt.sign(
      {
        id: admin._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    )

    res.status(201).json({
      token
    })

  } catch (err) {

    console.log("auth.js: ERRO REGISTER:", err)

    res.status(500).json({
      erro: "Erro no cadastro"
    })
  }
})

console.log("Exportando router:", router)
module.exports = router