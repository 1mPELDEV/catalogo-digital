const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Produtos = new Schema ({
        nome:{
            type: String,
            required : true
        },
        preco:{
            type: String,
            required: true
        },
        descricao:{
            type: String,
            required : false
        },
        imagem :{
            type: String,
            required: false
        },
        data:{
            type: Date,
            default: Date.now()
        }
        
})

module.exports = mongoose.model("produtos", Produtos)