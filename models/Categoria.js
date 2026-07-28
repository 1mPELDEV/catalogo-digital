const mongoose = require("mongoose")

const CategoriaSchema = new mongoose.Schema({

  nome: {
    type: String,
    required: true,
    trim: true
  },

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  }

}, {
  timestamps: true
})

CategoriaSchema.index(
  { lojaId: 1, nome: 1 },
  { unique: true }
)

module.exports = mongoose.model("Categoria", CategoriaSchema)