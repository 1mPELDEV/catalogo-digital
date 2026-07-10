const jwt = require("jsonwebtoken")

function verificaToken(req, res, next) {

  const authHeader = req.headers.authorization

  if (!authHeader) {
    return res.status(401).json({
      erro: "Token não fornecido"
    })
  }

  const token = authHeader.split(" ")[1]

  if (!token) {
    return res.status(401).json({
      erro: "Token não fornecido"
    })
  }

  try {

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    )

    req.admin = decoded

    next()

  } catch (err) {

    return res.status(401).json({
      erro: "Token inválido ou expirado"
    })

  }
}

module.exports = { verificaToken }