const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Admin = require("../models/Admin")
const Loja = require("../models/Loja")
const Interesse = require("../models/Interesse")

const upload = require("../config/multer")

console.log("auth.js: Auth router carregado ")

router.post("/interesse", async (req, res) => {
  try {
    const email = String(req.body.email || "").trim().toLowerCase()
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      return res.status(400).json({ erro: "Informe um e-mail válido" })
    }
    await Interesse.updateOne(
      { email },
      { $setOnInsert: { email, plano: "anual", valor: 200, status: "pendente" } },
      { upsert: true }
    )
    res.status(201).json({ ok: true, mensagem: "Interesse registrado" })
  } catch (err) {
    console.error("Erro ao registrar interesse:", err)
    res.status(500).json({ erro: "Não foi possível registrar seu interesse" })
  }
})

router.post("/register", upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]),
 async (req, res) => {
  let interesse
  try {

    const { nomeLoja, senha, whatsapp, corPrimaria } = req.body
    const email = String(req.body.email || "").trim().toLowerCase()

    interesse = await Interesse.findOneAndUpdate(
      { email: String(email || "").trim().toLowerCase(), status: "pago" },
      { $set: { status: "cadastrando" } },
      { new: true }
    )
    if (!interesse) {
      return res.status(403).json({ erro: "Este e-mail ainda não tem um pagamento confirmado. Envie seu interesse e aguarde a confirmação." })
    }

    // email já existe?
    const existe = await Admin.findOne({ email })

    if (existe) {
      interesse.status = "pago"
      await interesse.save()
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
      interesse.status = "pago"
      await interesse.save()
      return res.status(400).json({
        erro: "Nome da loja já está em uso"
      })
    }

    // senha hash
    const hash = await bcrypt.hash(senha, 10)
    const planoInicio = new Date()
    const planoExpiraEm = new Date(planoInicio)
    planoExpiraEm.setFullYear(planoExpiraEm.getFullYear() + 1)

    // 1️⃣ cria loja
    const loja = await Loja.create({

      nome: nomeLoja,

      slug,

    logo: req.files?.logo?.[0]?.path || null,

    banner: req.files?.banner?.[0]?.path || null,

      tema: {
        corPrimaria: corPrimaria || "#0b7030"
      },

      contato: {
        whatsapp: whatsapp || ""
      },

      planoInicio,
      planoExpiraEm,

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

    interesse.status = "concluido"
    interesse.concluidoEm = new Date()
    await interesse.save()

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

    if (interesse?.status === "cadastrando") {
      interesse.status = "pago"
      await interesse.save().catch(() => {})
    }

    console.log("auth.js: ERRO REGISTER:", err)

    res.status(500).json({
      erro: "Erro no cadastro"
    })
  }
})

module.exports = router
