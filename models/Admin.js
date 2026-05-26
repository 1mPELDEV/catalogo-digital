const mongoose = require("mongoose")
const Schema = mongoose.Schema

const Admin = new Schema({

  email: {
    type: String,
    required: true,
    unique: true
  },

  senha: {
    type: String,
    required: true
  },

  lojaId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Loja",
    required: true
  }

})

module.exports =
  mongoose.models.Admin ||
  mongoose.model("Admin", Admin)