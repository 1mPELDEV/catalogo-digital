const mongoose = require("mongoose")

const ProdutoSchema = new mongoose.Schema({

  nome: {
    type: String,
    required: true
  },

  preco: {
    type: Number,
    required: true
  },

  descricao: String,

  categoria: String,

  imagem: String,

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  },

  promocao: {
    ativa: {
      type: Boolean,
      default: false
    },

    desconto: {
      type: Number,
      default: 0
    }
  }

})

module.exports =
mongoose.model("Produto", ProdutoSchema)