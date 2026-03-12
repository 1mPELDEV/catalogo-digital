import { useState } from "react";
import axios  from "axios"
import { useNavigate } from "react-router-dom";



function Login(){
    //useState
    const [email,setEmail] = useState('')
    const [senha,setSenha] = useState('')
    //useNavigate
    const navigate = useNavigate()

    async function fazerLogin(e) { 
        e.preventDefault()

        try{
            const response = await axios.post("http://localhost:8082/admin/login" , {
                email,
                senha
            })

            const token = response.data.token

            localStorage.setItem("token", token)
            window.dispatchEvent(new Event("storage"))
            navigate("/admin")

            alert("Login feito com sucesso!")
        } catch(err) {
            console.log(err.response?.data)
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
            <input type="password"
                   placeholder="senha"
                   value={senha}
                   onChange={(e)=> setSenha(e.target.value)}
            />
            <button type="submit">Login</button>
        </form>
    ) 
}


export default Login