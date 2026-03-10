
const mongoose = require("mongoose")
const bcrypt = require("bcrypt")

mongoose.connect("mongodb://localhost/db-catalogo")

const criar = async () =>{
    const hash = await bcrypt.hash("123456" , 10);

    await Admin.create({
        email: "admin@email.com",
        senha: hash,
    });

    console.log("admin criado com sucesso")
    process.exit()


}

criar()