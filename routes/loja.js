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
    const loja = await Loja.findOneAndUpdate(
      { adminId: req.adminId },
      req.body,
      { new: true }
    )
    res.json(loja)
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar loja" })
  }
})

module.exports = router