Backend API - Flerte.AI

Sobre o Projeto
-------------------

Este repositório contém a API backend principal para o projeto Flerte.AI. Desenvolvida em ASP.NET Core 8, esta API é o coração do sistema, responsável por toda a lógica de negócio, autenticação de usuários, persistência de dados e orquestração de chamadas para o microserviço de IA.

Funcionalidades:
----------------

Autenticação Segura: Sistema completo de registro e login com senhas criptografadas (BCrypt) e autenticação via JSON Web Tokens (JWT).

Gerenciamento de Perfil: Endpoints para buscar e atualizar os dados do perfil do usuário.

Preferências da IA: Permite que os usuários salvem e recuperem suas preferências de interação com a IA (estilo, tom, etc.).

Gerenciamento de Conversas: API para criar, listar e buscar o histórico de mensagens de conversas.

Orquestração de IA: Atua como uma ponte (bridge), recebendo as mensagens do usuário, preparando o contexto (histórico + preferências) e consumindo o microserviço externo de IA em Python para gerar respostas.

Suporte a Imagens: Endpoint para upload de imagens que são repassadas ao serviço de IA para análise.

Tecnologias e Arquitetura
---------------------------

Framework: ASP.NET Core 8

Acesso a Dados: Entity Framework Core 8 (Code-First)

Banco de Dados: MySQL

Autenticação: JWT Bearer Tokens

Arquitetura: API RESTful com padrão de Serviços e DTOs (Data Transfer Objects) para separação de responsabilidades.

Guia de Configuração e Execução
------------------------------------
Siga os passos abaixo para configurar e executar o backend em um ambiente de desenvolvimento local.

Pré-requisitos:
--------------------------

.NET 8 SDK

Um servidor MySQL local (ex: [link suspeito removido])

Git

Configuração do Ambiente

Clone o Repositório (caso ainda não tenha feito) e navegue até a pasta do backend:

git clone <URL_DO_REPOSITORIO_GIT>
cd caminho/para/o/projeto/flerte-ai-backend
Configure os Segredos Locais (User Secrets)
Isto é usado para armazenar senhas e chaves fora do código-fonte.

Importante: Substitua SUA_SENHA_DO_MYSQL_AQUI pela senha do seu MySQL local.

dotnet user-secrets init
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=localhost;Port=3306;Database=flerte_ai_db;Uid=root;Pwd=SUA_SENHA_DO_MYSQL_AQUI;"
dotnet user-secrets set "Jwt:Key" "K3yS3cr3t4P4r4M3uH4ck4th0nQu3T3mQu3S3rMuit0L0ng4P4r4Func10n4rC0mHmacSha512"
Restaure as Dependências e Crie o Banco de Dados
Estes comandos baixam as bibliotecas necessárias e criam as tabelas no seu banco MySQL.

dotnet restore
dotnet ef database update
Executando a API
Inicie o servidor:

dotnet run
Verifique a Saída: O terminal indicará que o servidor está rodando:
Now listening on: https://localhost:7099 (a porta pode variar).

Acesse a Documentação (Swagger):
Abra seu navegador e acesse https://localhost:XXXX/swagger (substitua XXXX pela sua porta). Você encontrará uma documentação interativa de todos os endpoints.

Desenvolvedor

Raphael Melo - Desenvolvedor Fullstack (.NET)