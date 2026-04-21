export const tipos = {
  mercado: {
    carrinho: true,
    entrega: true,
    whatsapp: true
  },
  estudio: {
    carrinho: false,
    entrega: false,
    whatsapp: true
  },
  perfumaria: {
    carrinho: true,
    entrega: true,
    whatsapp: true
  }
}

export const loja = {
  nome: "Minha Loja",
  tipo: "mercado",
  funcionalidades: tipos["mercado"]
}