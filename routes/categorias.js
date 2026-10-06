const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { verificaToken } = require('../middlewares/authMiddleware')
const Loja = require('../models/Loja');

//create
router.post("/", verificaToken, async (req, res) => {

  try {

    const nome = typeof req.body.nome === "string" ? req.body.nome.trim() : ""
    if (nome.length < 1 || nome.length > 40) {
      return res.status(400).json({ erro: "O nome da categoria deve ter entre 1 e 40 caracteres" })
    }
    const lojaId = req.admin.lojaId
    if (!lojaId) return res.status(404).json({ erro: "Loja não encontrada" })

    const categoria = await Categoria.create({
      nome,
      lojaId
    })

    res.json(categoria)

  } catch (err) {
    if (err.code === 11000) return res.status(409).json({ erro: "Essa categoria já existe" })
    console.error("Erro ao criar categoria:", err)
    res.status(500).json({ erro: "Não foi possível criar a categoria" })
  }

})

//read
router.get("/", verificaToken, async (req, res) => {

    try{
        if (!req.admin.lojaId) return res.status(404).json({ erro: "Loja não encontrada" })
        const categorias = await Categoria.find({ lojaId: req.admin.lojaId }).sort({ nome: 1 })

        res.json(categorias)

    }
    catch(err){
        console.error("Erro ao buscar categorias:", err)
        res.status(500).json({ erro: "Não foi possível buscar as categorias" })
    }

})

router.delete("/:id", verificaToken, async (req, res) => {
  try {

    if (!req.admin.lojaId) return res.status(404).json({ erro: "Loja não encontrada" })

    const categoria = await Categoria.findOneAndDelete({
      _id: req.params.id,
      lojaId: req.admin.lojaId
    })

    if (!categoria) {
      return res.status(404).json({
        erro: "Categoria não encontrada"
      })
    }

    res.json(categoria)

  } catch (err) {
    console.error("Erro ao excluir categoria:", err)
    res.status(500).json({ erro: "Não foi possível excluir a categoria" })
  }
})

//list Produtosgrid
router.get("/:slug", async (req, res) => {

  try {

    const loja = await Loja.findOne({
      slug: req.params.slug
    })

    if (!loja) return res.status(404).json({ erro: "Loja não encontrada" })

    const categorias = await Categoria.find({
      lojaId: loja._id
    }).select("-lojaId -__v")

    res.json(categorias)

  } catch (err) {
    console.error("Erro ao buscar categorias públicas:", err)
    res.status(500).json({ erro: "Não foi possível buscar as categorias" })
  }

})

module.exports = router
