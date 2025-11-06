// Script para criar a estrutura de pastas e arquivos do projeto
// Execute este script com Node.js: node create-project.js

const fs = require('fs');
const path = require('path');

// Nome do projeto
const projectName = 'backend-agendamentos';

// Função para criar diretórios
function createDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`Criado: ${dirPath}`);
  }
}

// Função para criar arquivos
function createFile(filePath, content) {
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Criado: ${filePath}`);
}

// Criar estrutura de pastas
console.log('🚀 Iniciando criação do projeto...\n');

const basePath = path.join(__dirname, projectName);

// Estrutura de diretórios
const dirs = [
  basePath,
  path.join(basePath, 'src'),
  path.join(basePath, 'src', 'config'),
  path.join(basePath, 'src', 'dao'),
  path.join(basePath, 'src', 'controller'),
  path.join(basePath, 'prisma')
];

dirs.forEach(createDir);

// Conteúdo dos arquivos

// .env
const envContent = `DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
PORT=3000`;

// package.json
const packageJsonContent = `{
  "name": "backend-agendamentos",
  "version": "1.0.0",
  "description": "Sistema de agendamentos com Node.js, Express e Prisma",
  "main": "src/server.js",
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js",
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:studio": "prisma studio"
  },
  "dependencies": {
    "@prisma/client": "^5.7.0",
    "express": "^4.18.2",
    "dotenv": "^16.3.1",
    "cors": "^2.8.5"
  },
  "devDependencies": {
    "prisma": "^5.7.0", 
    "nodemon": "^3.0.2"
  }
}`;

// .gitignore
const gitignoreContent = `node_modules/
.env
dist/
*.log`;

// README.md
const readmeContent = `# Sistema de Agendamentos - Backend API

API REST desenvolvida com Node.js, Express e Prisma para gerenciamento de agendamentos.

## 🚀 Tecnologias

- **Node.js** - Runtime JavaScript
- **Express** - Framework web
- **Prisma** - ORM para banco de dados
- **MySQL** - Banco de dados relacional
- **CORS** - Controle de acesso
- **dotenv** - Gerenciamento de variáveis de ambiente

## 📁 Estrutura do Projeto

\`\`\`
src/
├── config/
│   └── config.js              # Mensagens e constantes
├── dao/
│   ├── ClienteDAO.js          # DAO de Clientes
│   ├── ServicoDAO.js          # DAO de Serviços
│   ├── ProfissionalDAO.js     # DAO de Profissionais
│   ├── AgendamentoDAO.js      # DAO de Agendamentos
│   └── HorarioDisponivelDAO.js # DAO de Horários
├── controller/
│   ├── ClienteController.js
│   ├── ServicoController.js
│   ├── ProfissionalController.js
│   ├── AgendamentoController.js
│   └── HorarioDisponivelController.js
├── app.js                     # Rotas da API
└── server.js                  # Servidor principal
prisma/
└── schema.prisma              # Schema do banco de dados
\`\`\`

## ⚙️ Instalação

1. Clone o repositório

2. Instale as dependências:
\`\`\`bash
npm install
\`\`\`

3. Configure o arquivo \`.env\`:
\`\`\`env
DATABASE_URL="mysql://usuario:senha@localhost:3306/nome_do_banco"
PORT=3000
\`\`\`

4. Execute as migrations do Prisma:
\`\`\`bash
npx prisma generate
npx prisma migrate dev
\`\`\`

5. Inicie o servidor:
\`\`\`bash
npm run dev
\`\`\`

## 📊 Banco de Dados

O sistema utiliza as seguintes tabelas:

- **clientes** - Cadastro de clientes
- **servicos** - Serviços disponíveis
- **profissionais** - Profissionais cadastrados
- **agendamentos** - Agendamentos realizados
- **horarios_disponiveis** - Horários de funcionamento

## 🛣️ Rotas da API

### Clientes
- \`GET /v1/clientes\` - Listar todos os clientes
- \`GET /v1/cliente/:id\` - Buscar cliente por ID
- \`GET /v1/clientes/agendamentos\` - Listar clientes com agendamentos
- \`GET /v1/cliente/:id/agendamentos\` - Buscar cliente com agendamentos
- \`POST /v1/cliente\` - Criar novo cliente
- \`PUT /v1/cliente/:id\` - Atualizar cliente
- \`DELETE /v1/cliente/:id\` - Deletar cliente

### Serviços
- \`GET /v1/servicos\` - Listar todos os serviços
- \`GET /v1/servico/:id\` - Buscar serviço por ID
- \`POST /v1/servico\` - Criar novo serviço
- \`PUT /v1/servico/:id\` - Atualizar serviço
- \`DELETE /v1/servico/:id\` - Deletar serviço

### Profissionais
- \`GET /v1/profissionais\` - Listar todos os profissionais
- \`GET /v1/profissional/:id\` - Buscar profissional por ID
- \`GET /v1/profissionais/agendamentos\` - Listar profissionais com agendamentos
- \`POST /v1/profissional\` - Criar novo profissional
- \`PUT /v1/profissional/:id\` - Atualizar profissional
- \`DELETE /v1/profissional/:id\` - Deletar profissional

### Agendamentos
- \`GET /v1/agendamentos\` - Listar todos os agendamentos
- \`GET /v1/agendamento/:id\` - Buscar agendamento por ID
- \`GET /v1/agendamentos/data/:data\` - Buscar por data
- \`GET /v1/agendamentos/status/:status\` - Buscar por status
- \`GET /v1/agendamentos/profissional/:id\` - Buscar por profissional
- \`POST /v1/agendamento\` - Criar novo agendamento
- \`PUT /v1/agendamento/:id\` - Atualizar agendamento
- \`DELETE /v1/agendamento/:id\` - Deletar agendamento

### Horários Disponíveis
- \`GET /v1/horarios\` - Listar todos os horários
- \`GET /v1/horario/:id\` - Buscar horário por ID
- \`GET /v1/horarios/dia/:dia\` - Buscar por dia da semana
- \`GET /v1/horarios/ativos\` - Buscar horários ativos
- \`POST /v1/horario\` - Criar novo horário
- \`PUT /v1/horario/:id\` - Atualizar horário
- \`DELETE /v1/horario/:id\` - Deletar horário

## 🔒 Regras de Negócio

- Não é possível excluir clientes, serviços ou profissionais que possuem agendamentos associados
- A data de cadastro do cliente é automaticamente preenchida com a data atual se não for informada
- O status padrão de um agendamento é "agendado"
- Horários disponíveis podem ser marcados como disponíveis ou indisponíveis

## 🎯 Status HTTP

- **200** - Sucesso
- **201** - Criado com sucesso
- **400** - Requisição inválida
- **404** - Não encontrado
- **415** - Tipo de conteúdo não suportado
- **500** - Erro interno do servidor

## 👨‍💻 Desenvolvimento

\`\`\`bash
# Rodar em modo desenvolvimento
npm run dev

# Abrir Prisma Studio (interface gráfica do banco)
npm run prisma:studio

# Gerar cliente Prisma
npm run prisma:generate
\`\`\`

## 📄 Licença

Este projeto foi desenvolvido para fins educacionais.
`;

// prisma/schema.prisma
const schemaContent = `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

model Cliente {
  id            Int            @id @default(autoincrement())
  nome          String         @db.VarChar(100)
  telefone      String?        @db.VarChar(20)
  email         String?        @db.VarChar(100)
  dataCadastro  DateTime?      @map("data_cadastro") @db.Date
  agendamentos  Agendamento[]

  @@map("clientes")
}

model Servico {
  id            Int            @id @default(autoincrement())
  nomeServico   String         @map("nome_servico") @db.VarChar(100)
  descricao     String?        @db.Text
  duracao       Int?           // duração em minutos
  preco         Decimal?       @db.Decimal(10, 2)
  agendamentos  Agendamento[]

  @@map("servicos")
}

model Profissional {
  id            Int            @id @default(autoincrement())
  nome          String         @db.VarChar(100)
  especialidade String?        @db.VarChar(100)
  telefone      String?        @db.VarChar(20)
  agendamentos  Agendamento[]

  @@map("profissionais")
}

model Agendamento {
  id              Int          @id @default(autoincrement())
  idCliente       Int          @map("id_cliente")
  idServico       Int          @map("id_servico")
  idProfissional  Int          @map("id_profissional")
  dataAgendamento DateTime     @map("data_agendamento") @db.Date
  horario         DateTime     @db.Time(0)
  status          String?      @default("agendado") @db.VarChar(20)
  observacoes     String?      @db.Text
  
  cliente         Cliente      @relation(fields: [idCliente], references: [id])
  servico         Servico      @relation(fields: [idServico], references: [id])
  profissional    Profissional @relation(fields: [idProfissional], references: [id])

  @@map("agendamentos")
}

model HorarioDisponivel {
  id            Int      @id @default(autoincrement())
  diaSemana     String   @map("dia_semana") @db.VarChar(20)
  horarioInicio DateTime @map("horario_inicio") @db.Time(0)
  horarioFim    DateTime @map("horario_fim") @db.Time(0)
  disponivel    Boolean? @default(true)

  @@map("horarios_disponiveis")
}`;

// src/config/config.js
const configContent = `/*****************************************************************************************
 * Objetivo --> Arquivo de configuração de mensagens e constantes do sistema
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

// Mensagens de ERRO
const ERROR_REQUIRED_FIELDS = { message: 'Campos obrigatórios não foram preenchidos ou não atendem aos critérios necessários.' };
const ERROR_INVALID_ID = { message: 'O ID encaminhado não atende aos critérios necessários.' };
const ERROR_NOT_FOUND = { message: 'Nenhum registro foi encontrado.' };
const ERROR_INTERNAL_SERVER = { message: 'Erro interno no servidor. Não foi possível processar a solicitação.' };
const ERROR_INCORRECT_CONTENT_TYPE = { message: 'O Content-Type da requisição não é suportado pelo servidor. Deve ser application/json.' };
const ERROR_INTERNAL_SERVER_DB = { message: 'Erro interno no servidor ao processar a solicitação no banco de dados.' };

// Mensagens de SUCESSO
const SUCCESS_CREATED_ITEM = { message: 'Item criado com sucesso.' };
const SUCCESS_UPDATED_ITEM = { message: 'Item atualizado com sucesso.' };
const SUCCESS_DELETED_ITEM = { message: 'Item excluído com sucesso.' };

module.exports = {
    ERROR_REQUIRED_FIELDS,
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER,
    ERROR_INCORRECT_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_DB,
    SUCCESS_CREATED_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM
};`;

// src/server.js
const serverContent = `/*****************************************************************************************
 * Objetivo --> Arquivo principal do servidor
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(\`🚀 Servidor rodando na porta \${PORT}\`);
    console.log(\`📡 API disponível em http://localhost:\${PORT}\`);
});`;

// Criar todos os arquivos
console.log('\n📄 Criando arquivos...\n');

createFile(path.join(basePath, '.env'), envContent);
createFile(path.join(basePath, 'package.json'), packageJsonContent);
createFile(path.join(basePath, '.gitignore'), gitignoreContent);
createFile(path.join(basePath, 'README.md'), readmeContent);
createFile(path.join(basePath, 'prisma', 'schema.prisma'), schemaContent);
createFile(path.join(basePath, 'src', 'config', 'config.js'), configContent);
createFile(path.join(basePath, 'src', 'server.js'), serverContent);

// Nota: Os outros arquivos (DAOs, Controllers, app.js) precisam ser copiados manualmente
// ou você pode adicionar o conteúdo deles aqui seguindo o mesmo padrão

console.log('\n✅ Estrutura básica do projeto criada com sucesso!');
console.log(`\n📁 Projeto criado em: ${basePath}`);
console.log('\n⚠️  Próximos passos:');
console.log('1. Copie os arquivos DAO e Controller para as respectivas pastas');
console.log('2. Copie o arquivo app.js para src/');
console.log('3. Execute: cd backend-agendamentos && npm install');
console.log('4. Configure o arquivo .env com suas credenciais do banco');
console.log('5. Execute: npm run prisma:generate && npm run prisma:migrate');
console.log('6. Inicie o servidor: npm run dev\n');