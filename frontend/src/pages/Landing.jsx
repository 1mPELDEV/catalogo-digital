import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import axios from "axios"

import Hero from "../components/landing/Hero"
import ProdutosGrid from "../components/landing/ProdutosGrid"

const API_URL = import.meta.env.VITE_API_URL

function Landing() {

  const { slug } = useParams()

  const [loja, setLoja] = useState(null)

    useEffect(()=>{
      const buscarLoja = async () => {
          try { 
                      const res = await axios.get(
              `${API_URL}/loja/${slug}`
            )

            setLoja(res.data)

          } catch(err){
            console.log("Erro ao carrgar loja, erro:" + err)
          }
        }

        buscarLoja()

      }, [slug]) 

      if (!loja) {
        return (
          <div className="min-h-screen flex items-center justify-center">
            Carregando loja...
          </div>
        )
      }

    return (
      <>
        <Hero loja={loja} />
        
        <ProdutosGrid
         slug={slug}
         loja={loja} />

      </>
    )
}

export default Landing