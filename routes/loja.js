const express = require('express')
const router = express.Router()
const Loja = require('../models/Loja')
const { verificaToken } = require('../middlewares/authMiddleware')

// GET privado — admin logado vendo sua própria loja
router.get("/", verificaToken, async (req, res) => {
  try {
    const loja = await Loja.findOne({ adminId: req.adminId })
    res.json(loja)
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar loja" })
  }
})

// GET público — visitante vendo o catálogo por slug
router.get("/:slug", async (req, res) => {
  try {
    console.log("Buscando slug:", req.params.slug)
    const loja = await Loja.findOne({ slug: req.params.slug })
    console.log("Loja encontrada:", loja)

    if (!loja) {
      return res.status(404).json({ erro: "Loja não encontrada" })
    }

    res.json(loja)
  } catch (err) {
    console.log("ERRO:", err.message)
    res.status(500).json({ erro: "Erro ao buscar loja" })
  }
})

// PUT privado — admin atualizando sua loja
router.put("/", verificaToken, async (req, res) => {
  try {

    const dadosPermitidos = {}

    if (req.body.nome !== undefined) {
      dadosPermitidos.nome = req.body.nome
    }

    if (req.body.logo !== undefined) {
      dadosPermitidos.logo = req.body.logo
    }

    if (req.body.banner !== undefined) {
      dadosPermitidos.banner = req.body.banner
    }

    if (req.body.tema?.corPrimaria !== undefined) {
      dadosPermitidos["tema.corPrimaria"] = req.body.tema.corPrimaria
    }

    if (req.body.contato?.whatsapp !== undefined) {
      dadosPermitidos["contato.whatsapp"] = req.body.contato.whatsapp
    }

    const loja = await Loja.findOneAndUpdate(
      { adminId: req.adminId },
      { $set: dadosPermitidos },
      {
        new: true,
        runValidators: true
      }
    )

    if (!loja) {
      return res.status(404).json({
        erro: "Loja não encontrada"
      })
    }

    res.json(loja)

  } catch (err) {
    console.error(err)

    res.status(500).json({
      erro: "Erro ao atualizar loja"
    })
  }
})

module.exports = router