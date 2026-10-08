const express = require('express')
const router = express.Router()
const Loja = require('../models/Loja')
const Admin = require('../models/Admin')
const bcrypt = require('bcrypt')
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

    const admin = await Admin.findById(adminId).select("email")
    res.json({ ...loja.toObject(), email: admin?.email || "" })
  } catch (err) {
    res.status(500).json({ erro: "Erro ao buscar loja" })
  }
})

// GET público — visitante vendo o catálogo por slug
router.get("/:slug", async (req, res) => {
  try {
    const loja = await Loja.findOne({ slug: req.params.slug })
      .select("nome logo banner slug tema contato features")

    if (!loja) {
      return res.status(404).json({ erro: "Loja não encontrada" })
    }

    res.json(loja)
  } catch (err) {
    console.error("Erro ao buscar loja pública:", err)
    res.status(500).json({ erro: "Erro ao buscar loja" })
  }
})

// PUT privado — admin atualizando sua loja
router.put("/", verificaToken, upload.fields([{ name: "logo", maxCount: 1 }, { name: "banner", maxCount: 1 }]), async (req, res) => {
  try {

    const dadosPermitidos = {}

    if (req.body.nome !== undefined) {
      if (typeof req.body.nome !== "string" || req.body.nome.trim().length < 2 || req.body.nome.trim().length > 60) {
        return res.status(400).json({ erro: "O nome da loja deve ter entre 2 e 60 caracteres" })
      }
      dadosPermitidos.nome = req.body.nome.trim()
    }

    let adminAtualizado = null
    const admin = await Admin.findById(req.admin.id)
    if (!admin) return res.status(404).json({ erro: "Administrador não encontrado" })

    if (req.body.email !== undefined) {
      const email = String(req.body.email).trim().toLowerCase()
      if (!/^\S+@\S+\.\S+$/.test(email) || email.length > 254) {
        return res.status(400).json({ erro: "Informe um e-mail válido" })
      }
      const existente = await Admin.findOne({ email, _id: { $ne: admin._id } }).select("_id")
      if (existente) return res.status(409).json({ erro: "Este e-mail já está em uso" })
      admin.email = email
      adminAtualizado = true
    }

    if (req.body.senha !== undefined && String(req.body.senha).length > 0) {
      const senhaAtual = String(req.body.senhaAtual || "")
      if (!(await bcrypt.compare(senhaAtual, admin.senha))) {
        return res.status(400).json({ erro: "A senha atual está incorreta" })
      }
      const novaSenha = String(req.body.senha)
      if (novaSenha.length < 6 || novaSenha.length > 128) {
        return res.status(400).json({ erro: "A nova senha deve ter entre 6 e 128 caracteres" })
      }
      admin.senha = await bcrypt.hash(novaSenha, 10)
      adminAtualizado = true
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
      if (typeof corPrimaria !== "string" || !/^#[\da-f]{6}$/i.test(corPrimaria)) {
        return res.status(400).json({ erro: "Informe uma cor hexadecimal válida" })
      }
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

    if (adminAtualizado) await admin.save()
    res.json({ ...loja.toObject(), email: admin.email })

  } catch (err) {
    console.error(err)

    res.status(500).json({
      erro: "Erro ao atualizar loja"
    })
  }
})

module.exports = router
