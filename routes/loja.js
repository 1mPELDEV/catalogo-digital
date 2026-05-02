const express = require('express')
const router = express.Router()
const Loja = require("../models/Loja")

// GET config da loja
router.get("/", async (req, res) => {
  try {
    const loja = await Loja.findOne()
    console.log(loja)
    res.json(loja)
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar loja" })
  }
})

router.put("/", async (req, res) => {
  try {
    const loja = await Loja.findOneAndUpdate(
      {},
      req.body,
      { new: true, upsert: true }
    )

    res.json(loja)
  } catch (err) {
    res.status(500).json({ erro: "Erro ao atualizar loja" })
  }
})
module.exports = router