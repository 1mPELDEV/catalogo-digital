const express = require('express')
const router = express.Router()

const Produto = require('../models/Produto')
const Loja = require("../models/Loja")

const { verificaToken } =
require('../middlewares/authMiddleware')

const upload = require('../config/multer')


// CREATE
router.post('/', verificaToken, upload.single('imagem'), async (req, res) => {
  try {
    if (!req.body.nome || !req.body.preco) {
      return res.status(400).json({ erro: "Nome e preço são obrigatórios" })
    }

    const novoProduto = new Produto({
      nome: req.body.nome,
      preco: req.body.preco,
      descricao: req.body.descricao,
      categoria: req.body.categoria,
      imagem: req.file ? req.file.path : req.body.imagem,
      lojaId: req.admin.lojaId,
      promocao: {
        ativa: req.body.promocao_ativa === "true" || req.body.promocao?.ativa || false,
        desconto: Number(req.body.promocao_desconto || req.body.promocao?.desconto || 0)
      }
    })

    await novoProduto.save()
    res.status(201).json(novoProduto)
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: "Erro ao criar produto" })
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
router.put('/:id', verificaToken, upload.single('imagem'), async (req, res) => {
  try {
    const dados = {
      nome: req.body.nome,
      preco: req.body.preco,
      descricao: req.body.descricao,
      categoria: req.body.categoria,
      promocao: {
        ativa: req.body.promocao_ativa === "true" || false,
        desconto: Number(req.body.promocao_desconto || 0)
      }
    }

    if (req.file) {
      dados.imagem = req.file.path
    } else if (req.body.imagem) {
      dados.imagem = req.body.imagem
    }

    const produtoAtualizado = await Produto.findOneAndUpdate(
      { _id: req.params.id, lojaId: req.admin.lojaId },
      dados,
      { new: true }
    )

    if (!produtoAtualizado) {
      return res.status(404).json({ erro: "Produto não encontrado" })
    }

    res.json(produtoAtualizado)
  } catch (err) {
    console.log(err)
    res.status(500).json({ erro: "Erro ao atualizar produto" })
  }
})


// DELETE
router.delete('/:id', verificaToken, async (req, res) => {

  try {

      const deletado =
      await Produto.findOneAndDelete({
        _id: req.params.id,
        lojaId: req.admin.lojaId
      })

      if (!deletado) {
        return res.status(404).json({
          erro: "Produto não encontrado"
        })
      }

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