//importações

    //importando express
const express = require('express')
const app = express()

    // importanto mongoose
const mongoose = require('mongoose')
    mongoose.connect("mongodb://localhost/db-catalogo")
    mongoose.connection.on("connected", () => {
        console.log("MongoDB conectado")
    })
    mongoose.connection.on("error", (err) => {
        console.log("Erro:", err)
    })

//Middleweres
app.use(express.json())

//Rotas
const produtos = require('./routes/produtos')
app.use("/produtos", produtos)
    //Rota principal
app.get('/',(req,res)=>{
    res.send("Rota principal funcionando")
})








//Configurações de servidor
app.listen(8082, () => {
    console.log("Servidor rodando na porta 8082")
})