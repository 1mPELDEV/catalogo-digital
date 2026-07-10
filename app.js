//importações
    //importando dotenv
    require("dotenv").config()

    //importando express
const express = require('express')
const app = express()

    // importanto mongoose
const mongoose = require('mongoose')
    mongoose.connect("mongodb://127.0.0.1:27017/db-catalogo")
    mongoose.connection.on("connected", () => {
        console.log("MongoDB conectado")
    })
    mongoose.connection.on("error", (err) => {
        console.log("Erro:", err)
    })
    // importando cors
const cors = require('cors')
app.use(cors({
  origin: "http://localhost:5173"
}))


//Middleweres
app.use(express.json())

// Rota para servir arquivos estáticos da pasta "uploads"
app.use(
 "/uploads",
 express.static("uploads")
)

//Rotas
const masterRoutes =
require("./routes/master")
app.use("/master", masterRoutes)

const produtos = require('./routes/produtos')
app.use("/produtos", produtos)

const admin = require('./routes/admin')
app.use("/admin", admin)

const loja = require("./routes/loja")
app.use("/loja", loja)

const auth = require("./routes/auth")
 app.use("/auth" , auth)

    //Rota principal
app.get('/',(req,res)=>{
    res.send("Rota principal funcionando")
})



//Configurações de servidor
app.listen(8082, () => {
    console.log("Servidor rodando na porta 8082")
})