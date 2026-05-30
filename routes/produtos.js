const express = require('express')
const router = express.Router()

const Produto = require('../models/Produto')
const Loja = require("../models/Loja")

const { verificaToken } =
require('../middlewares/authMiddleware')


// CREATE
router.post('/', verificaToken, async (req, res) => {

  try {

    const novoProduto = new Produto({

      nome: req.body.nome,
      preco: req.body.preco,
      descricao: req.body.descricao,
      categoria: req.body.categoria,
      imagem: req.body.imagem,

      lojaId: req.admin.lojaId,

      promocao: {
        ativa: req.body.promocao?.ativa || false,
        desconto: req.body.promocao?.desconto || 0
      }

    })

    await novoProduto.save()

    res.status(201).json(novoProduto)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      erro: "Erro ao criar produto"
    })

  }

})


// PUBLICO → catálogo
router.get('/:slug', async (req, res) => {

  try {

    const loja = await Loja.findOne({
      slug: req.params.slug
    })

    if (!loja) {
      return res.status(404).json({
        erro: "Loja não encontrada"
      })
    }

    const produtos = await Produto.find({
      lojaId: loja._id
    })

    res.json(produtos)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      erro: "Erro ao buscar produtos"
    })

  }

})


// PRIVADO → admin
router.get('/', verificaToken, async (req, res) => {

  try {

    const produtos = await Produto.find({
      lojaId: req.admin.lojaId
    })

    res.json(produtos)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      erro: "Erro ao buscar produtos"
    })

  }

})


// UPDATE
router.put('/:id', verificaToken, async (req, res) => {

  try {

    const produtoAtualizado =
      await Produto.findOneAndUpdate(

        {
          _id: req.params.id,
          lojaId: req.admin.lojaId
        },

        req.body,

        { new: true }

      )

    res.json(produtoAtualizado)

  } catch (err) {

    console.log(err)

    res.status(500).json({
      erro: "Erro ao atualizar produto"
    })

  }

})


// DELETE
router.delete('/:id', verificaToken, async (req, res) => {

  try {

    await Produto.findOneAndDelete({

      _id: req.params.id,
      lojaId: req.admin.lojaId

    })

    res.json({
      mensagem: "Produto deletado"
    })

  } catch (err) {

    console.log(err)

    res.status(500).json({
      erro: "Erro ao deletar produto"
    })

  }

})

module.exports = router