# 🚀 TaskFlow — Sistema de Gestão de Tarefas com Pipeline DevOps

![CI Status](https://github.com/018galera/taskflow-devops/actions/workflows/ci.yml/badge.svg)
![Vercel](https://img.shields.io/badge/Vercel-Deploy-black?logo=vercel)
![Render](https://img.shields.io/badge/Render-Deploy-46E3B7?logo=render)
![Node.js](https://img.shields.io/badge/Node.js-20-green?logo=node.js)
![React](https://img.shields.io/badge/React-18-blue?logo=react)

O **TaskFlow** é um sistema web MVP (Minimum Viable Product) desenvolvido para a atividade prática de DevOps. O projeto aplica conceitos modernos de Integração Contínua (CI), Entrega Contínua (CD), Infraestrutura como Código (IaC) e Monitoramento de aplicações.

---

## 📋 Sumário
1. [Links do Projeto](#-links-do-projeto)
2. [Arquitetura e Tecnologias](#-arquitetura-e-tecnologias)
3. [Funcionalidades do Sistema](#-funcionalidades-do-sistema)
4. [Pipeline DevOps (CI/CD)](#-pipeline-devops-cicd)
5. [Infraestrutura como Código](#-infraestrutura-como-código)
6. [Monitoramento](#-monitoramento)
7. [Como Executar o Projeto Localmente](#-como-executar-o-projeto-localmente)
8. [Equipe](#-equipe)

---

## 🔗 Links do Projeto

*   **🌐 Aplicação em Produção (Frontend):** [Acessar o TaskFlow](https://taskflow-devops-git-main-galera5.vercel.app/)
*   **⚙️ API Backend (Produção):** [Acessar a API](https://taskflow-backend-tejo.onrender.com)
*   **📊 Monitoramento:** UptimeRobot (Monitorando Front e Back a cada 5 minutos)

---

## 🛠️ Arquitetura e Tecnologias

O projeto adota uma arquitetura cliente-servidor desacoplada:

*   **Frontend:** React.js, Vite, Recharts (Gráficos), CSS Modules.
*   **Backend:** Node.js, Express.js.
*   **Banco de Dados:** SQLite (ambiente local) / Volátil (ambiente Render).
*   **Hospedagem:** Vercel (Frontend) e Render (Backend).

---

## ✨ Funcionalidades do Sistema

Para demonstrar a viabilidade do projeto, o MVP conta com:
*   **Dashboard Analítico:** Gráficos dinâmicos que mudam de cor com o tema do usuário.
*   **Gestão de Tarefas (CRUD):** Criação, edição e exclusão de atividades.
*   **Sistema de Prioridades:** Classificação em Alta, Média e Baixa.
*   **Subtarefas (Checklist):** Divisão de grandes tarefas em etapas menores.
*   **Kanban com Drag & Drop:** Organização visual das tarefas pendentes e concluídas.
*   **Upload de Imagem:** Suporte a imagens Base64 nos cards.
*   **Customização de Tema:** O usuário pode escolher a cor principal do sistema.

---

## 🔄 Pipeline DevOps (CI/CD)

O grande foco deste projeto é a automação. O fluxo de trabalho funciona da seguinte forma:

1.  **Desenvolvimento Local:** O desenvolvedor faz alterações e realiza um `git push` para a branch `main`.
2.  **Integração Contínua (CI):** O **GitHub Actions** é acionado automaticamente. Ele:
    *   Executa os testes unitários do Backend (Jest).
    *   Executa o Build de produção do Frontend (Vite).
    *   Se algum teste falhar, o pipeline fica vermelho e bloqueia o deploy.
3.  **Entrega Contínua (CD):** Se o CI passar (check verde), as plataformas de nuvem são notificadas:
    *   A **Vercel** faz o deploy automático do Frontend.
    *   O **Render** faz o deploy automático do Backend.
4.  **Keep-Alive (Gratuito):** Como o Render no plano Free "dorme" após 15 minutos de inatividade, foi implementada uma lógica nativa no `server.js` que faz um auto-ping a cada 14 minutos, mantendo o backend sempre online.

---

## 🐳 Infraestrutura como Código (IaC)

O projeto inclui um arquivo `docker-compose.yml` na raiz, permitindo que qualquer desenvolvedor suba o ambiente completo (Backend + Banco de Dados) com um único comando, garantindo que o ambiente de desenvolvimento seja idêntico em qualquer máquina.

---

## 📡 Monitoramento

Para garantir a confiabilidade e o "feedback rápido em caso de falhas", utilizamos o **UptimeRobot**:
*   Ele realiza requisições HTTP a cada 5 minutos no Frontend e na rota `/health` do Backend.
*   Caso o site fique indisponível, o administrador recebe um alerta por e-mail imediatamente.

---

## 💻 Como Executar o Projeto Localmente

### Pré-requisitos
*   Node.js (v20 ou superior)
*   Git

### Passo a Passo

1. Clone o repositório:
```bash
git clone https://github.com/018galera/taskflow-devops.git
cd taskflow-devops




### Inicie o Backend (Terminal 1):

cd backend
npm install
npm start

(O servidor rodará em http://localhost:3001)


###
Inicie o Frontend (Terminal 2):

cd frontend
npm install
npm run dev

(Acesse o sistema em http://localhost:5173)

###( Equipe )
Guilherme Galera Yaralian
Henrique silva Prete
Professor Alisson Kuhn