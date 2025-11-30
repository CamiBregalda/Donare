# 🤝 Sistema de Campanhas Solidárias

Um sistema web voltado à promoção de campanhas solidárias como doações de roupas, alimentos, vacinas e apoio a causas sociais e ambientais. Desenvolvido com o objetivo de conectar pessoas, grupos e organizações para transformar realidades por meio da solidariedade.

## 🌍 Propósito

O projeto tem como foco principal o atendimento à comunidade externa da UTFPR - moradores locais, ongs, instituições, pequenos produtores e empreendedores - por meio de ações extensionistas e colaborativas com impacto social real.

---

## 🚀 Funcionalidades Principais

### 📣 Campanhas Solidárias
- Cadastro e gerenciamento de campanhas (vacinas, arrecadações, doações, etc.)
- Atualizações públicas sobre o progresso das campanhas

### 💬 Engajamento Comunitário
- Aba de comentários nas campanhas
- Aba de postagens das campanhas
- Seguir campanhas específicas para receber atualizações

### 🔔 Notificações
- Notificações no momento de criação da conta
- Notificações sobre atualizações nas campanhas que o usuário segue
- Notificações sobre postagens nas campanhas que o usuário segue
- Notificações sobre comentários adicionados nas campanhas
- Notificações sobre respostas adicionados a comentários

### 🙋‍♀️ Voluntariado
- Cadastro como voluntário para campanhas específicas

---

## 🛠️ Tecnologias Utilizadas

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Java / Spring Boot
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT

---

## 📂 Como rodar o projeto localmente

### 📦 Backend

#### ✅ Requisitos

Antes de rodar o projeto, certifique-se de que os seguintes softwares estão instalados em sua máquina:

- **Java 21**  
  Baixe e instale a JDK:  
  👉 [Oracle JDK 21 - Download](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html)

- **Apache Maven**  
  Gerenciador de dependências e build:  
  👉 [Maven - Download](https://maven.apache.org/download.html)

- **Docker Desktop**  
  Necessário para subir os containers com Docker Compose:  
  👉 [Docker Desktop - Download](https://www.docker.com/products/docker-desktop/)

---

### 📦 Frontend

A tela inicial é o arquivo `login.html`, localizado na raiz do projeto.

##### 🔐 Autenticação

Todas as telas são protegidas. O usuário só poderá acessá-las se possuir uma conta válida e estiver autenticado no sistema.
Ao realizar o login com sucesso, o sistema armazena os dados de sessão necessários para garantir o acesso às demais páginas.

---
#### ▶️ Rodando o Projeto

##### Acesse a pasta root do projeto e execute o comando ``docker compose up --build``
