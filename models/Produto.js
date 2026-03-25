const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Produtos = new Schema ({
        nome:{
            type: String,
            required :[true, "O nome é obrigatorio"],
            trim: true
        },
        preco:{
            type: Number,
            required: [true, "O preço é obrigatório"],
            min: [0, "O preço deve ser maior que 0"]
        },
        descricao:{
            type: String,
            required : false
        },
        imagem: {
        type: String,
        trim: true,
        default: "https://picsum.photos/200"
        },
        data:{
            type: Date,
            default: Date.now
        }
        
})

module.exports = mongoose.model("produtos", Produtos)