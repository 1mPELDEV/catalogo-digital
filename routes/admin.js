const express = require('express')
const router = express.Router()
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")
const Produto = require('../models/Produto')

router.post('/login' , async (req,res) => {
    try{
        const {email, senha} = req.body

        const admin = await Admin.findOne({email})

        if(!admin){
            return res.status(401).json({erro : "Credenciais inválidas"})
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




















module.exports = router