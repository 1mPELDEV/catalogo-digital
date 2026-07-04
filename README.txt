📦 Catálogo Digital SaaS

Sistema web para criação e gerenciamento de catálogos digitais voltado para pequenos comerciantes. Cada lojista possui seu próprio painel administrativo, catálogo personalizado e página pública para divulgação de produtos, permitindo que clientes montem pedidos e os enviem diretamente pelo WhatsApp.

🚀 Objetivo

O projeto surgiu para resolver um problema comum entre pequenos comércios que desejam vender pela internet sem precisar investir em um e-commerce completo.

Com o sistema, o comerciante pode criar um catálogo online de forma simples, divulgar um link personalizado para seus clientes e receber pedidos diretamente pelo WhatsApp.

✨ Funcionalidades
👤 Área do Cliente
Visualização do catálogo da loja
Organização dos produtos por categorias
Carrinho de compras
Alteração de quantidade dos produtos
Finalização do pedido via WhatsApp
Interface responsiva
🏪 Área do Lojista
Login protegido com JWT
Cadastro de produtos
Edição de produtos
Exclusão de produtos
Promoções com desconto
Configuração da própria loja
Gerenciamento exclusivo dos produtos da sua loja
👑 Área Master
Cadastro de novos lojistas
Criação automática da loja
Geração automática do administrador da loja
Definição das funcionalidades disponíveis para cada loja
Dashboard para gerenciamento dos lojistas
🔒 Arquitetura Multi-Tenant

O sistema foi desenvolvido seguindo o conceito de multi-tenant, onde cada lojista possui seus próprios dados completamente separados.

Cada loja possui:

produtos próprios;
configurações próprias;
tema personalizado;
catálogo público independente;
administrador exclusivo.

Todas as operações são protegidas por autenticação utilizando JWT e isolamento por lojaId.

🛠 Tecnologias Utilizadas
Front-end
React
React Router DOM
Axios
Tailwind CSS
React Toastify
Back-end
Node.js
Express
JWT (JSON Web Token)
Bcrypt
Mongoose
Banco de Dados
MongoDB
📁 Estrutura do Sistema
Cliente
      │
      ▼
/slug-da-loja
      │
      ▼
Catálogo Público
      │
      ▼
Carrinho
      │
      ▼
Pedido via WhatsApp


Lojista
      │
      ▼
Login
      │
      ▼
Painel Administrativo
      │
      ▼
Gerenciamento de Produtos


Master
      │
      ▼
Dashboard
      │
      ▼
Cadastro e gerenciamento de lojas
💡 Problema que o projeto resolve

Muitos pequenos comerciantes ainda recebem pedidos manualmente pelo WhatsApp, utilizando listas de produtos enviadas em mensagens ou imagens.

Esse processo torna o atendimento lento, aumenta a chance de erros e dificulta a atualização do catálogo.

O sistema resolve esse problema oferecendo:

catálogo online;
gerenciamento simplificado dos produtos;
pedidos organizados;
personalização por loja;
implantação rápida sem necessidade de um e-commerce completo.
🎯 Próximas funcionalidades
Upload de imagens
Dashboard com estatísticas
Controle de pedidos
Cupons de desconto
Busca de produtos
Controle de estoque
Pagamentos online
Domínio personalizado por loja
Deploy em produção
📚 Objetivos do Projeto

Este projeto foi desenvolvido com foco em aprendizado e evolução profissional, aplicando conceitos como:

Arquitetura Full Stack
APIs REST
Autenticação JWT
Multi-tenancy
React Hooks
Gerenciamento de estado
CRUD completo
Integração Front-end e Back-end
Organização de código
Boas práticas de desenvolvimento