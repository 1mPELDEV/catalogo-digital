const jwt = require("jsonwebtoken")

const verificaToken = (req,res,next) =>{
    const authHeader = req.header.authorization;

    if(!authHeader) {
        return res.status(401).json({erro : "Token não fornecido"})
    }

    const token = authHeader.split(" ")[1];

    try{
        const decoded = jwt.verify(token, "SEGREDO_SUPER_FORTE");
        req.adminId = decoded.id
        next()
    }catch (err) {
         return res.status(401).json({ erro: "Token inválido" })
    }
}

module.expors = verificaToken