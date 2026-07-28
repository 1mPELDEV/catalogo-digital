const express = require('express');
const router = express.Router();
const Categoria = require('../models/Categoria');
const { verificaToken } = require('../middlewares/authMiddleware')
const Loja = require('../models/Loja');
const Admin = require('../models/Admin');

//create
router.post("/", verificaToken, async (req, res) => {

  try {

    const loja = await Loja.findOne({
      adminId: req.admin.id
    })

    const categoria = await Categoria.create({
      nome: req.body.nome,
      lojaId: loja._id
    })

    res.json(categoria)

  } catch (err) {
    res.status(500).json(err)
  }

})

//read
router.get("/", verificaToken, async (req, res) => {

    try{
        const loja = await Loja.findOne({
            adminId: req.admin.id
        })

        const categorias = await Categoria.find({
            lojaId: loja._id
        })

        res.json(categorias)

    }
    catch(err){
        res.status(500).json(err)
    }

})

router.delete("/:id", verificaToken, async (req, res) => {
  try {

    const admin = await Admin.findById(req.admin.id)

    const categoria = await Categoria.findOneAndDelete({
      _id: req.params.id,
      lojaId: admin.lojaId
    })

    if (!categoria) {
      return res.status(404).json({
        erro: "Categoria não encontrada"
      })
    }

    res.json(categoria)

  } catch (err) {
    res.status(500).json(err)
  }
})

//list Produtosgrid
router.get("/:slug", async (req, res) => {

  try {

    const loja = await Loja.findOne({
      slug: req.params.slug
    })

    const categorias = await Categoria.find({
      lojaId: loja._id
    })

    res.json(categorias)

  } catch (err) {
    res.status(500).json(err)
  }

})

module.exports = router