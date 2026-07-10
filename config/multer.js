const multer = require("multer")

const storage = multer.diskStorage({

  destination: function(req, file, cb){
    cb(null, "uploads/")
  },

  filename: function(req, file, cb){

    const nomeArquivo =
      Date.now() + "-" + file.originalname

    cb(null, nomeArquivo)

  }

})


const upload = multer({
  storage
})


module.exports = upload