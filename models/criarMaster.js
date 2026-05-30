const mongoose = require("mongoose")
const bcrypt = require("bcrypt")
const Admin = require("../models/Admin")

mongoose.connect("mongodb://localhost/db-catalogo")

async function criarMaster() {

  const hash =
    await bcrypt.hash("99433324", 10)

  await Admin.create({
    nome: "Pedro",
    email: "master@email.com",
    senha: hash,
    role: "master"
  })

  console.log("MASTER criado")
  process.exit()
}

criarMaster()