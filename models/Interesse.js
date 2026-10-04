const mongoose = require("mongoose")

const InteresseSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  plano: { type: String, default: "anual" },
  valor: { type: Number, default: 200 },
  status: { type: String, enum: ["pendente", "pago", "cadastrando", "concluido"], default: "pendente" },
  criadoEm: { type: Date, default: Date.now },
  pagoEm: Date,
  concluidoEm: Date
})

module.exports = mongoose.models.Interesse || mongoose.model("Interesse", InteresseSchema)
