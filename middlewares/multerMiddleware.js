const multer = require("multer")
const upload = require("../config/multer")

const uploadImagem = (req, res, next) => {
  upload.single("imagem")(req, res, (err) => {

    if (err instanceof multer.MulterError) {
      if (err.code === "LIMIT_FILE_SIZE") {
        return res.status(413).json({
          erro: "A imagem não pode ter mais de 5 MB"
        })
      }

      return res.status(400).json({
        erro: "Erro no upload da imagem"
      })
    }

    if (err) {
      return res.status(400).json({
        erro: err.message
      })
    }

    next()
  })
}

module.exports = { uploadImagem }