import { useState } from "react";
import axios, { formToJSON } from "axios"

function login(){
    const [email,setEmail] = useState('')
    const [senha,setSenha] = useState('')

    async function fazerLogin(e) { 
        e.preventDefault()

        try{
            const response = await axios.post("http://localhost/8082/login" , {
                email,
                senha
            })

            const token = response.data.token

            localStorage.setItem("token", token)

            alert("Login feito com sucesso!")
        } catch(err) {
            alert("Erro no login")
        }
    }
    return(
        <form onSubmit={fazerLogin}>
            <input type="email"
                   placeholder="email"
                   value={email}
                   onChange={(e)=> setEmail(e.target.value)}
            />
            <input type="senha"
                   placeholder="senha"
                   value={senha}
                   onChange={(e)=> setSenha(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    ) 
}


export default login