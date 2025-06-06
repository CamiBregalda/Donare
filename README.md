# 🤝 Sistema de Campanhas Solidárias

Um sistema web voltado à promoção de campanhas solidárias como doações de roupas, alimentos, vacinas e apoio a causas sociais e ambientais. Desenvolvido com o objetivo de conectar pessoas, grupos e organizações para transformar realidades por meio da solidariedade.

## 🌍 Propósito

O projeto tem como foco principal o atendimento à comunidade externa da UTFPR - moradores locais, ongs, instituições, pequenos produtores e empreendedores - por meio de ações extensionistas e colaborativas com impacto social real.

---

## 🚀 Funcionalidades Principais

### 📣 Campanhas Solidárias
- Cadastro e gerenciamento de campanhas (vacinas, arrecadações, doações, etc.)
- Atualizações públicas sobre o progresso das campanhas
- Compartilhamento via redes sociais e QR Code

### 💬 Engajamento Comunitário
- Aba de comentários nas campanhas
- Curtidas e reações nas postagens
- Seguir campanhas específicas para receber atualizações

### 🔔 Notificações
- Receber alertas sobre novas campanhas por área de interesse
- Notificações sobre campanhas que o usuário segue

### 🙋‍♀️ Voluntariado
- Cadastro como voluntário para campanhas específicas
- Confirmação de presença via QR Code no dia do evento
- Geração de certificados de participação

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

#### ▶️ Rodando o Backend

Siga os passos abaixo para iniciar o backend da aplicação:

```bash
# Acesse a pasta do backend
cd backend

# Suba os containers necessários (ex: banco de dados, etc.)
docker compose up -d

# Execute o projeto com Maven
mvn spring-boot:run
