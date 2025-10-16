# Configuração do Supabase

Este projeto agora suporta tanto MySQL quanto Supabase como base de dados.

## Configuração do Supabase

### 1. Variáveis de Ambiente

Atualize o arquivo `backend/config.env` com as suas credenciais do Supabase:

```env
# Supabase Configuration
SUPABASE_URL=https://mnvlywpbifenjlegkzom.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Database Type
DATABASE_TYPE=supabase
```

### 2. Frontend (Opcional)

Se quiser usar o Supabase diretamente no frontend, crie um arquivo `.env.local` na raiz do projeto:

```env
REACT_APP_SUPABASE_URL=https://mnvlywpbifenjlegkzom.supabase.co
REACT_APP_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
REACT_APP_DATABASE_TYPE=supabase
```

### 3. Estrutura da Base de Dados

O projeto espera as seguintes tabelas no Supabase:

- `livro` - Livros
- `autor` - Autores
- `editora` - Editoras
- `genero` - Géneros
- `utente` - Utentes
- `codigo_postal` - Códigos postais
- `livro_exemplar` - Exemplares de livros
- `requisicao` - Requisições

### 4. Testar a Ligação

Execute o teste de ligação:

```bash
cd backend
node test-supabase.js
```

### 5. Executar o Servidor

```bash
cd backend
npm start
```

## Comandos Disponíveis

### Backend
- `npm start` - Inicia o servidor
- `npm run dev` - Inicia o servidor em modo desenvolvimento
- `node test-supabase.js` - Testa a ligação com o Supabase

### Frontend
- `npm start` - Inicia a aplicação React
- `npm run build` - Constrói a aplicação para produção

## Alternar entre MySQL e Supabase

Para alternar entre as bases de dados, altere a variável `DATABASE_TYPE` no arquivo `backend/config.env`:

- `DATABASE_TYPE=mysql` - Usa MySQL (padrão)
- `DATABASE_TYPE=supabase` - Usa Supabase

## Troubleshooting

### Erro de ligação
- Verifique se as credenciais do Supabase estão corretas
- Certifique-se de que o projeto Supabase está ativo
- Verifique se a service_role key tem as permissões necessárias

### Tabelas não encontradas
- Certifique-se de que as tabelas existem no Supabase
- Verifique se os nomes das tabelas estão corretos
- Execute o schema SQL no Supabase se necessário

### Erro de permissões
- Verifique se a service_role key tem acesso às tabelas
- Configure as Row Level Security (RLS) se necessário
