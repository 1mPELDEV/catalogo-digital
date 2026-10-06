//importações
    //importando dotenv
    
   if (process.env.NODE_ENV !== 'production') {
  require("dotenv").config()
}

    //importando express
const express = require('express')
const app = express()

    // importanto mongoose
const mongoose = require('mongoose')
    mongoose.connect(process.env.MONGODB_URI)
    mongoose.connection.on("connected", () => {
        console.log("MongoDB conectado")
    })
    mongoose.connection.on("error", (err) => {
        console.log("Erro:", err)
    })
    // importando cors
const cors = require('cors')

const allowedOrigins = (process.env.FRONTEND_URL || "")
  .split(",")
  .map(origin => origin.trim())
  .filter(Boolean)

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true)
    if (process.env.NODE_ENV !== "production" && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
      return callback(null, true)
    }
    return callback(null, false)
  }
}))

//Middleweres
app.use(express.json())

// Endpoint simples usado pelo monitor externo para manter o serviço ativo.
app.get("/health", (req, res) => {
    const conectado = mongoose.connection.readyState === 1
    res.status(conectado ? 200 : 503).json({ status: conectado ? "ok" : "unavailable" })
})

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

const categorias = require("./routes/categorias")
app.use("/categorias", categorias)

    //Rota principal
app.get('/',(req,res)=>{
    res.send("Rota principal funcionando")
})

app.use((req, res) => {
  res.status(404).json({ erro: "Rota não encontrada" })
})

app.use((err, req, res, next) => {
  console.error("Erro não tratado na API:", err)
  if (res.headersSent) return next(err)
  const status = Number.isInteger(err.status) && err.status >= 400 && err.status < 500
    ? err.status
    : 500
  res.status(status).json({ erro: status === 500 ? "Erro interno do servidor" : "Requisição inválida" })
})


// configurando porta
const PORT = process.env.PORT || 8082
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
