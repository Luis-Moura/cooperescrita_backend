# Guia de Trabalho com Git para o Projeto Cooperescrita

## Documentação

1. **Rota da Documentação no swagger**
   ```bash
   localhost:3000/api
   ```

## Configuração do Repositório

1. **Clone o Repositório**:  
   Para começar, clone o repositório do projeto:

   ```bash
   git clone https://github.com/Luis-Moura/cooperescrita_backend.git
   ```

2. **Entre no Diretório do Projeto**:  
   Acesse a pasta do projeto:

   ```bash
   cd cooperescrita_backend
   ```

3. **Verifique se o Repositório Está Configurado**:  
   Certifique-se de que o repositório está conectado ao remoto:
   ```bash
   git remote -v
   ```
   Deve mostrar a URL do repositório `origin`.

## Fluxo de Trabalho Simples

1. **Mude para a Branch `develop`**:  
   Antes de começar a trabalhar, certifique-se de estar na branch `develop`:

   ```bash
   git checkout develop
   ```

2. **Atualize a Branch `develop`**:  
   Sempre traga as últimas mudanças antes de começar a trabalhar:

   ```bash
   git pull origin develop
   ```

3. **Desenvolva e Faça Commits**:  
   Faça suas alterações e adicione-as diretamente na branch `develop`:

   ```bash
   git add .
   git commit -m "Descrição do que você fez"
   ```

4. **Envie Suas Alterações**:  
   Após os commits, envie suas mudanças para o repositório remoto:
   ```bash
   git push origin develop
   ```

## Cuidados Necessários

- **Atualizações Regulares**: Sempre atualize a branch `develop` antes de começar a trabalhar.
- **Mensagens de Commit Claras**: Use mensagens descritivas para facilitar a compreensão das mudanças.
- **Revisão de Código**: Sempre revise as alterações antes de enviar, para evitar bugs.
