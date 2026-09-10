const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")
const cloudinary = require("cloudinary").v2
const path = require("path")

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "zipadao-logos",
    allowed_formats: ["jpg", "jpeg", "png", "webp"],
    transformation: [{ width: 800, height: 800, crop: "fill", gravity: "auto" }]
  }
})

  const fileFilter = (req, file, cb) => {
    console.log("UPLOAD RECEBIDO:", 
      file.originalname,
      "MIME type:",
      file.mimetype
    )

    const tiposPermitidos = {
      "image/jpeg": [".jpg", ".jpeg"],
      "image/png": [".png"],
      "image/webp": [".webp"]
    }

    const extensao = path.extname(file.originalname).toLowerCase()
    const extensoesPermitidas = tiposPermitidos[file.mimetype]

    if (
      extensoesPermitidas &&
      extensoesPermitidas.includes(extensao)
    ) {
      cb(null, true)
    } else {
      console.log("UPLOAD REJEITADO")
      cb(new Error("Formato de imagem não permitido"))
    }
  }

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter
})

module.exports = upload