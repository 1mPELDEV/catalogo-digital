const express = require('express')
const app = express()

app.get('/',(req,res)=>{
    res.send("Rota principal funcionando")
})

app.listen(8082, () => {
    console.log("Servidor rodando na porta 8082")
})