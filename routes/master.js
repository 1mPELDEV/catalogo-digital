const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")

const Loja = require("../models/Loja")
const Admin = require("../models/Admin")
const Interesse = require("../models/Interesse")

const { verificaToken } = require("../middlewares/authMiddleware")
const { somenteMaster } = require("../middlewares/masterMiddleware")

router.use(verificaToken, somenteMaster)

router.get("/interesses", async (req, res) => {
  try {
    const interesses = await Interesse.find().sort({ criadoEm: -1 }).lean()
    res.json(interesses)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao buscar interessados" })
  }
})

router.patch("/interesses/:id/confirmar", async (req, res) => {
  try {
    const interesse = await Interesse.findOneAndUpdate(
      { _id: req.params.id, status: "pendente" },
      { $set: { status: "pago", pagoEm: new Date() } },
      { new: true }
    )
    if (!interesse) return res.status(404).json({ erro: "Interesse não encontrado ou já processado" })
    res.json(interesse)
  } catch (err) {
    console.error(err)
    res.status(500).json({ erro: "Erro ao confirmar pagamento" })
  }
})


// listar lojas
router.get("/lojas",  async (req, res) => {
  try {

    const lojas = await Loja.find()

    res.json(lojas)

  } catch (err) {
    console.log(err)

    res.status(500).json({
      erro: "Erro ao buscar lojas"
    })
  }
})

// criar loja + admin
router.post("/lojas", async (req, res) => {

  try {

    const {
      nomeLoja,
      email,
      senha,
      features
    } = req.body

    // slug automático
    const slug = nomeLoja
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")

    // verifica email
    const adminExiste =
      await Admin.findOne({ email })

    if (adminExiste) {
      return res.status(400).json({
        erro: "Email já cadastrado"
      })
    }

    // verifica slug
    const lojaExiste =
      await Loja.findOne({ slug })

    if (lojaExiste) {
      return res.status(400).json({
        erro: "Loja já existe"
      })
    }

    const hash =
      await bcrypt.hash(senha, 10)

    // cria loja
    const loja =
      await Loja.create({
        nome: nomeLoja,
        slug,
        features,
        tema: {
          corPrimaria: "#22c55e"
        },
        contato: {
          whatsapp: ""
        }
      })

    // cria admin
    const admin =
      await Admin.create({
        nome: nomeLoja,
        email,
        senha: hash,
        lojaId: loja._id
      })

    // vincula admin à loja
    loja.adminId = admin._id

    await loja.save()

    res.json({
      ok: true
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      erro: "Erro ao criar loja"
    })
  }
})

// deletar loja
router.delete ( "/lojas/:id", async (req, res) => {

    try {

      const loja =
        await Loja.findById(
          req.params.id
        )

      if (!loja) {
        return res.status(404).json({
          erro: "Loja não encontrada"
        })
      }

      await Admin.deleteOne({
        lojaId: loja._id
      })

      await Loja.findByIdAndDelete(
        loja._id
      )

      res.json({
        ok: true
      })

    } catch (err) {

      console.log(err)

      res.status(500).json({
        erro: "Erro ao deletar loja"
      })
    }
  }
)

module.exports = router
