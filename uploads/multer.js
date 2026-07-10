const multer = require("multer")

const storage = multer.diskStorage({

  destination: function(req,file,cb){
    cb(null,"uploads/")
  },

  filename:function(req,file,cb){

    const nome =
      Date.now() + "-" + file.originalname

    cb(null,nome)

  }

})


const upload = multer({
  storage
})


module.exports = upload