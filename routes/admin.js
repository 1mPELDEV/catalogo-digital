const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Admin  = require('../models/admin')

router.post('/login' , async (req,res) => {
    try{
        const {email, senha} = req.body

        const admin = await Admin.findOne({email})

        if(!admin){
            return res.status(401).json({erro : "Credenciais inválidas"})
        }

        const senhaCorreta = await bcrypt.compare(senha, admin.senha)

        if(!senhaCorreta){
            return res.status(401).json({erro : "Senha incorreta"})
        }

        const token = jwt.sign(
            {id: admin._id},
            "SEGREDO_SUPER_FORTE",
            {expiresIn: '1d'}
        )
        res.json({token})
    } catch (erro) {
        res.status(500).json({erro :"Erro no servidor"})
    }
})

module.exports = router
