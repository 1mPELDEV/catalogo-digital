const rateLimit = require("express-rate-limit") 

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50
})

const authFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 10,
  standardHeaders: "draft-8",
  legacyHeaders: false,
  message: { erro: "Muitas tentativas. Aguarde alguns minutos e tente novamente." }
})

module.exports = loginLimiter
module.exports.authFormLimiter = authFormLimiter
