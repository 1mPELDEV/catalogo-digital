const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const Produto = require('../models/Produto')

//CRUD

    //C
router.post('/', async (req,res)=>{
    try{
    const novoProduto = new Produto(req.body)
   await novoProduto.save()
    res.status(201).json(novoProduto)
    } catch(err){
        res.status(500).json({erro : "Erro ao criar produto"})
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
        await Produto.findByIdAndUpdate(req.params.id, req.body)
        res.send("Produto atualizado")
    } catch(err){  
        res.status(500).json({erro : "Erro ao atualizar produto"})
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