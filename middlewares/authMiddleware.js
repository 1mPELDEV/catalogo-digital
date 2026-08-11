
const jwt = require("jsonwebtoken")

function verificaToken(req, res, next) {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não fornecido"
    })
  }

  const [tipo, token] = authHeader.split(" ")

  if (tipo !== "Bearer" || !token) {
    return res.status(401).json({
      erro: "Formato de token inválido"
    })
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    // Informações do usuário autenticado
    req.admin = decoded

    next()

  } catch (err) {

    return res.status(401).json({
      erro: "Token inválido ou expirado"
    })

  }
}

module.exports = { verificaToken }

