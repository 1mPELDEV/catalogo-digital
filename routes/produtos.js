const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Produto = require('../models/Produto')

//CRUD

    //C
router.post('/', async (req,res)=>{
    try{
        console.log("BODY:" , req.body)

        const novoProduto = new Produto({
            nome: req.body.nome,
            preco: req.body.preco
        })
        await novoProduto.save()

        res.status(201).json(novoProduto)

    }catch(err){
        console.log("ERRO REAL:" , err)

        if(err.name === "ValidationError"){
            const mensagens = Object.values(err.errors).map(e => e.message)
            return res.status(400).json({erros:mensagens})
        }
        res.status(500).json({erro: "Erro interno do servidor"})
    }
})
    //R
router.get('/', async (req, res) => {
    try {
        const produtos = await Produto.find()
        res.json(produtos)
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar produtos" })
    }
})
    //U
router.put('/:id' , async(req,res) =>{
    try{
        const produtoAtualizado = await Produto.findByIdAndUpdate(req.params.id, req.body,{new: true})
        res.json(produtoAtualizado)
    } catch(err){  
        res.status(500).json({erro : "Erro ao atualizar produto" + err})
    }
})
    //D
router.delete('/:id', async(req,res) =>{
    try{
        await Produto.findByIdAndDelete(req.params.id)
        res.send("Produto deletado")
    }catch(err){
        res.status(500).json({erro : "Erro ao deletar produto"})      
    }
})

module.exports = router