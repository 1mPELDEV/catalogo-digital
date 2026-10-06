const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const Admin = require("../models/Admin")
const Loja = require("../models/Loja")
const Interesse = require("../models/Interesse")
const { authFormLimiter } = require("../middlewares/ratelimitMiddleware")

const upload = require("../config/multer")

console.log("auth.js: Auth router carregado ")

router.post("/interesse", authFormLimiter, async (req, res) => {
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

router.post("/register", authFormLimiter, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]),
 async (req, res) => {
  let interesse
  try {

    const { nomeLoja, senha, whatsapp, corPrimaria } = req.body
    const email = String(req.body.email || "").trim().toLowerCase()

    if (typeof nomeLoja !== "string" || nomeLoja.trim().length < 2 || nomeLoja.trim().length > 60) {
      return res.status(400).json({ erro: "O nome da loja deve ter entre 2 e 60 caracteres" })
    }
    if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
      return res.status(400).json({ erro: "Informe um e-mail válido" })
    }
    if (typeof senha !== "string" || senha.length < 6 || senha.length > 128) {
      return res.status(400).json({ erro: "A senha deve ter entre 6 e 128 caracteres" })
    }

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
    const slug = nomeLoja.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    if (!slug) {
      interesse.status = "pago"
      await interesse.save()
      return res.status(400).json({ erro: "O nome da loja precisa conter letras ou números" })
    }

    if (corPrimaria && !/^#[\da-f]{6}$/i.test(corPrimaria)) {
      interesse.status = "pago"
      await interesse.save()
      return res.status(400).json({ erro: "Informe uma cor hexadecimal válida" })
    }

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

      nome: nomeLoja.trim(),

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
        id: admin._id,
        lojaId: loja._id,
        role: admin.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d"
      }
    )

    res.status(201).json({ token, role: admin.role, slug: loja.slug })

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
