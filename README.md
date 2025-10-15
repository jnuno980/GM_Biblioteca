# 📚 Biblioteca GM - Sistema de Gestão

Sistema completo de gestão de biblioteca desenvolvido em **React**.

## 🚀 Tecnologias

- **React 18** - Framework JavaScript
- **React Router DOM** - Roteamento
- **React Query** - Gestão de estado e cache
- **Tailwind CSS** - Estilização
- **Axios** - Cliente HTTP
- **Lucide React** - Ícones
- **React Hot Toast** - Notificações

## 📁 Estrutura do Projeto

```
GM_biblioteca/
├── public/                    # Arquivos públicos
│   ├── index.html            # Template HTML
│   ├── _redirects            # Redirects para SPA
│   └── _headers              # Headers de segurança
├── src/                      # Código fonte React
│   ├── components/           # Componentes reutilizáveis
│   │   ├── Layout/          # Layout principal
│   │   └── HomePage.js      # Página inicial
│   ├── pages/               # Páginas da aplicação
│   │   ├── Dashboard.js     # Dashboard
│   │   ├── Livros.js        # Gestão de livros
│   │   ├── Utentes.js       # Gestão de utentes
│   │   ├── Requisicoes.js   # Sistema de requisições
│   │   └── ...              # Outras páginas
│   ├── services/            # Serviços da API
│   │   └── api.js           # Configuração da API
│   ├── App.js               # Componente principal
│   ├── index.js             # Ponto de entrada
│   └── index.css            # Estilos globais
├── backend/                 # API Node.js (se necessário)
├── package.json             # Dependências e scripts
├── tailwind.config.js       # Configuração do Tailwind
├── start-react-app.bat      # Script para executar localmente
└── README.md                # Este arquivo
```

## 🛠️ Instalação e Execução

### Pré-requisitos
- Node.js 18+
- npm 8+

### Execução Local
```bash
# Instalar dependências
npm install

# Executar em desenvolvimento
npm start
# ou
start-react-app.bat
```

### Build para Produção
```bash
# Fazer build
npm run build

# Verificar build
npm run build:analyze
```

## 🌐 Deploy

### Build para Produção
```bash
# Fazer build
npm run build

# O build será criado na pasta build/
```

## 📱 Funcionalidades

### 🏠 Dashboard
- Estatísticas em tempo real
- Cartões informativos
- Devolução rápida de livros
- Atividade recente

### 📚 Gestão de Livros
- CRUD completo
- Associação com autores, editoras e géneros
- Busca e filtros

### 📖 Gestão de Exemplares
- Criação de exemplares
- Controle de disponibilidade
- Estados de conservação

### 👥 Gestão de Utentes
- Registo de utilizadores
- Dados pessoais completos
- Validação de códigos postais

### 📋 Sistema de Requisições
- Criação de empréstimos
- Registro de devoluções
- Histórico completo

### 🏢 Catálogo
- **Editoras** - Gestão completa
- **Autores** - Registo com países
- **Géneros** - Categorização
- **Códigos Postais** - Base de dados

## ⚙️ Configuração

### Variáveis de Ambiente
Crie um arquivo `.env.local`:
```env
REACT_APP_API_URL=http://localhost:3001/api
REACT_APP_ENV=development
```

### API Backend
O frontend espera que o backend esteja rodando na porta 3001. Certifique-se de que:
- O backend está executando
- As rotas da API estão configuradas
- O CORS está habilitado

## 🎨 Design System

### Cores
- **Primary:** #8B0000 (Vermelho escuro)
- **Primary Dark:** #700000
- **Primary Darker:** #5b0000

### Componentes
- Botões com variantes
- Formulários consistentes
- Tabelas responsivas
- Cartões informativos
- Notificações toast

## 📊 Performance

### Otimizações
- ✅ Build sem sourcemaps
- ✅ Cache de assets estáticos
- ✅ Lazy loading de componentes
- ✅ React Query para cache
- ✅ Build otimizado para produção

## 🔐 Segurança

### Headers Implementados
- X-Frame-Options: DENY
- X-XSS-Protection: 1; mode=block
- X-Content-Type-Options: nosniff
- Referrer-Policy: strict-origin-when-cross-origin

## 📝 Scripts Disponíveis

```bash
npm start          # Executar em desenvolvimento
npm run build      # Build para produção
npm test           # Executar testes
npm run eject      # Ejectar configuração
npm run build      # Build para produção
npm run clean      # Limpar arquivos de build
```

## 🐛 Troubleshooting

### Problemas Comuns

#### Build Falha
```bash
# Verificar Node.js
node --version  # Deve ser 18+

# Limpar cache
npm run clean
npm install
```

#### Erro de CORS
- Verificar `REACT_APP_API_URL`
- Configurar CORS no backend

#### Página 404 em Rotas
- Verificar `_redirects` no public/
- Deve ter: `/*    /index.html   200`

## 🚀 Deploy Rápido

### Para Deploy
1. **Execute o build:** `npm run build`
2. **Faça upload da pasta build/ para seu servidor**
3. **Configure as variáveis de ambiente no servidor**

### Para Outros Serviços
- **Vercel:** Deploy automático via Git
- **GitHub Pages:** `npm run deploy`
- **Heroku:** Configure buildpacks

## 📞 Suporte

### Documentação
- [Migração React](REACT_MIGRATION.md)

### Comandos Úteis
```bash
# Verificar build
npm run build

# Limpar cache
npm run clean
```

## 🎯 Status do Projeto

**✅ PROJETO COMPLETO E PRONTO PARA PRODUÇÃO!**

- ✅ Interface React moderna
- ✅ Todas as funcionalidades implementadas
- ✅ Responsivo para mobile
- ✅ Otimizado para produção
- ✅ Build otimizado para produção

## 📄 Licença

MIT License - Veja o arquivo LICENSE para detalhes.

---

**🎉 Sua biblioteca está pronta para produção!** 🌍