const mongoose = require("mongoose")

const AdminSchema = new mongoose.Schema({

  nome: {
    type: String,
    required: true
  },

  email: {
    type: String,
    required: true,
    unique: true
  },

  senha: {
    type: String,
    required: true
  },

  role: {
    type: String,
    enum: ["master", "lojista"],
    default: "lojista"
  },

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: function () {
      return this.role === "lojista"
    }
  }

})

module.exports =
  mongoose.models.Admin ||
  mongoose.model("Admin", AdminSchema)