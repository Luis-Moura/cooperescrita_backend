# CooperEscrita - Backend

Backend da plataforma CooperEscrita, um sistema colaborativo de correção de redações desenvolvido com apoio da FAPEPI (Fundação de Amparo à Pesquisa do Estado do Piauí).

## Sobre o Projeto

O CooperEscrita é uma plataforma que facilita a correção colaborativa de redações, conectando estudantes e corretores em um ambiente integrado e eficiente.

## Tecnologias

- **NestJS** - Framework Node.js para aplicações server-side escaláveis
- **TypeScript** - Linguagem principal do projeto
- **PostgreSQL** - Banco de dados relacional para persistência
- **TypeORM** - ORM para gerenciamento de banco de dados e migrações
- **Redis** - Cache e gerenciamento de filas de processamento
- **Bull** - Processamento de jobs assíncronos (envio de emails)
- **Passport/JWT** - Autenticação e autorização
- **Swagger** - Documentação automática da API

## Arquitetura

O projeto segue uma **arquitetura modular** seguindo os padrões do NestJS, com separação clara de responsabilidades entre controllers, services e DTOs:

### Módulos Principais

- **Auth**: Autenticação (sign-in/sign-up), recuperação de senha, verificação de email e 2FA
- **Users**: Gerenciamento de contas, perfis e configurações de usuário
- **Redações**: CRUD de redações (rascunhos e definitivas) e comentários
- **Correções**: Sistema completo de correção com comentários, feedbacks, highlights e sugestões
- **Reports**: Sistema de denúncias para redações e correções
- **Dashboard**: Estatísticas e métricas da plataforma
- **Admin**: Painel administrativo para gestão de usuários, redações, correções e reports
- **Emails**: Processamento assíncrono de envio de emails via filas
- **Token**: Gerenciamento de refresh tokens e tokens invalidados

### Padrões e Recursos

- **Controllers/Services/DTOs**: Separação de camadas seguindo padrão NestJS
- **Guards personalizados**: JWT, Local e controle de roles (admin/user)
- **Decorators customizados**: `@Roles()`, `@IsPublic()`, `@RolesMode()`
- **Filas assíncronas**: Bull + Redis para processamento de emails
- **Migrations**: TypeORM para versionamento do banco
- **Documentação**: Swagger com decorators personalizados por endpoint
- **Rate Limiting**: Throttler para proteção contra abuso
- **Agendamento**: Tasks programadas com @nestjs/schedule

## Docker

O projeto possui configuração completa com Docker Compose incluindo PostgreSQL, Redis e PgAdmin para desenvolvimento local.

© 2025 Luis — Todos os direitos reservados.  
O código-fonte deste projeto é disponibilizado apenas para fins de avaliação técnica.  
Não é permitida sua cópia, modificação, uso comercial ou redistribuição.

