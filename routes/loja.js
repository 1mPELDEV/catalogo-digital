const express = require('express')
const router = express.Router()
const Loja = require('../models/Loja')
const Admin = require('../models/Admin')
const { verificaToken } = require('../middlewares/authMiddleware')
const upload = require('../config/multer')

// GET privado — admin logado vendo sua própria loja
router.get("/", verificaToken, async (req, res) => {
  try {
    const adminId = req.admin?.id
    if (!adminId) {
      return res.status(401).json({ erro: "Token sem identificador de administrador" })
    }

    let loja = await Loja.findOne({ adminId })

    // Compatibilidade com lojas antigas que têm o vínculo apenas em Admin.lojaId.
    if (!loja) {
      const admin = await Admin.findById(adminId).select("lojaId")
      if (admin?.lojaId) {
        loja = await Loja.findById(admin.lojaId)
      }
    }

    if (!loja) {
      return res.status(404).json({ erro: "Loja não encontrada para este administrador" })
    }

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
router.put("/", verificaToken, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), async (req, res) => {
  try {

    const dadosPermitidos = {}

    if (req.body.nome !== undefined) {
      dadosPermitidos.nome = req.body.nome
    }

    if (req.files?.logo?.[0]?.path) {
      dadosPermitidos.logo = req.files.logo[0].path
    } else if (req.body.logo !== undefined) {
      dadosPermitidos.logo = req.body.logo
    }

    if (req.files?.banner?.[0]?.path) {
      dadosPermitidos.banner = req.files.banner[0].path
    } else if (req.body.banner !== undefined) {
      dadosPermitidos.banner = req.body.banner
    }

    const corPrimaria = req.body.tema?.corPrimaria ?? req.body.corPrimaria
    if (corPrimaria !== undefined) {
      dadosPermitidos["tema.corPrimaria"] = corPrimaria
    }

    const whatsapp = req.body.contato?.whatsapp ?? req.body.whatsapp
    if (whatsapp !== undefined) {
      dadosPermitidos["contato.whatsapp"] = whatsapp
    }

    let lojaAtual = await Loja.findOne({ adminId: req.admin.id }).select("_id")
    if (!lojaAtual) {
      const admin = await Admin.findById(req.admin.id).select("lojaId")
      if (admin?.lojaId) {
        lojaAtual = { _id: admin.lojaId }
      }
    }

    if (!lojaAtual) {
      return res.status(404).json({ erro: "Loja não encontrada" })
    }

    const loja = await Loja.findOneAndUpdate(
      { _id: lojaAtual._id },
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
