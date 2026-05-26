const mongoose = require('mongoose')
const LojaSchema = new mongoose.Schema({

  nome: String,

  logo: String,

  banner: String,

 slug: {
    type: String,
    unique: true,
    required: true
  },

  tema: {
    corPrimaria: {
      type: String,
      default: "green"
    }
  },

  contato: {
    whatsapp: String
  },

  features: {

    catalogo: {
      type: Boolean,
      default: true
    },

    pedidoWhatsapp: {
      type: Boolean,
      default: true
    },

    carrinho: {
      type: Boolean,
      default: false
    }

  },

  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Admin",
  }

})

module.exports = mongoose.model('Loja', LojaSchema)