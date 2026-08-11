function somenteMaster(req, res, next) {
  if (!req.admin) {
    return res.status(401).json({
      message: "Não autenticado"
    })
  }

  if (req.admin.role !== "master") {
    return res.status(403).json({
      message: "Acesso permitido apenas para master"
    })
  }

  next()
}

module.exports = { somenteMaster }