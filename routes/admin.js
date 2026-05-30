const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Admin = require('../models/Admin')
const Loja = require("../models/Loja")

router.post('/login', async (req, res) => {

  try {

    const { email, senha } = req.body

    const admin = await Admin.findOne({ email })

    if (!admin) {
      return res.status(401).json({
        erro: "Credenciais inválidas"
      })
    }

    const senhaCorreta = await bcrypt.compare(
      senha,
      admin.senha
    )

    if (!senhaCorreta) {
      return res.status(401).json({
        erro: "Senha incorreta"
      })
    }

    // busca loja apenas se existir lojaId
    let loja = null

    if (admin.lojaId) {
      loja = await Loja.findById(admin.lojaId)
    }

    const token = jwt.sign(
      {
        id: admin._id,
        lojaId: admin.lojaId,
        role: admin.role
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    )

    res.json({
      token,
      role: admin.role,
      slug: loja?.slug || null,
      loja: loja?.nome || null
    })

  } catch (erro) {
    console.log(erro)

    res.status(500).json({
      erro: "Erro no servidor"
    })
  }
})

module.exports = router