const mongoose = require("mongoose")

const LojaSchema = new mongoose.Schema({
  nome: String,
  tipo: String, // "mercado", "estudio", etc

  tema: {
    corPrimaria: String
  },

  contato: {
    whatsapp: String
  },

  funcionalidades: {
    carrinho: Boolean
  },

  landing: {
    titulo: String,
    descricao: String,
    cta: String,
    acao: String // "whatsapp" | "carrinho"
  }
})

module.exports = mongoose.model("lojas", LojaSchema)