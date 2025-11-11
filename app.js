/*****************************************************************************************
 * Objetivo --> Arquivo responsável pelas configurações de rotas da API
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 * 
 * 
 * 
 * 
 *  * 
 * Observação:
 *      ****** PARA CONFIGURAR E INSTALAR A API, PRECISAMOS DAS SEGUINTE BIBLIOTECA ********
 *                      express                  npm install express --save
 *                      cors                     npm install cors --save
 *                      body-parser              npm install body-parser --save
 * 
 *      ****** PARA CONFIGURAR E INSTALAR O ACESSO AO BANCO DE DADOS, PRECISAMOS: ********
 *                      prisma                 npm install prisma --save ( Conexão com o BD )
 *                      prisma/client          npm install @prisma/client --save ( Executa scripts no BD )
 *    
 *      ******* Após a instalação do prisma e do primsa client, devemos:
 *                  npx prisma init ( ! INICIALIAR O PRISMA NO PROJETO !)
 * 
 *      ******* Para realizar o sincronismo do prisma com o BD, devemos executar o seguinte comando:
 *                  npx prisma migrate dev
 * 
 * 
 * ************************
 * 
 * POST E PUT PRECISAM DO BodyParserJson para funcionar
 **
 ****************************************************************************************/

const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// Configuração do CORS
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    app.use(cors());
    next();
});

// Configuração do body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Importando os Controllers
const clienteController = require('./controller/controllerClientes.js');
const servicoController = require('./controller/controllerServiço.js');
const profissionalController = require('./controller/controllerProfissional.js');
const agendamentoController = require('./controller/controllerAgendamento.js');
const horarioController = require('./controller/controllerHorarios.js');

/************************************************************************************************
 * ROTAS DE CLIENTES
 ************************************************************************************************/

// GET - Listar todos os clientes
app.get('/v1/clientes', cors(), async (req, res) => {
    let dados = await clienteController.getClientes();
    res.status(dados.status_code).json(dados);
});

// GET - Buscar cliente por ID
app.get('/v1/cliente/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await clienteController.getClienteById(id);
    res.status(dados.status_code).json(dados);
});

// GET - Listar clientes com agendamentos
app.get('/v1/clientes/agendamentos', cors(), async (req, res) => {
    let dados = await clienteController.getClientesComAgendamentos();
    res.status(dados.status_code).json(dados);
});

// GET - Buscar cliente com agendamentos por ID
app.get('/v1/cliente/:id/agendamentos', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await clienteController.getClienteComAgendamentosById(id);
    res.status(dados.status_code).json(dados);
});

// POST - Criar novo cliente
app.post('/v1/cliente', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let dados = await clienteController.createCliente(req.body, contentType);
    res.status(dados.status_code).json(dados);
});

// PUT - Atualizar cliente
app.put('/v1/cliente/:id', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let id = req.params.id;
    let dadosBody = req.body;
    dadosBody.id = id;
    let dados = await clienteController.updateCliente(dadosBody, contentType);
    res.status(dados.status_code).json(dados);
});

// DELETE - Deletar cliente
app.delete('/v1/cliente/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await clienteController.deleteCliente(id);
    res.status(dados.status_code).json(dados);
});

/************************************************************************************************
 * ROTAS DE SERVIÇOS
 ************************************************************************************************/

// GET - Listar todos os serviços
app.get('/v1/servicos', cors(), async (req, res) => {
    let dados = await servicoController.getServicos();
    res.status(dados.status_code).json(dados);
});

// GET - Buscar serviço por ID
app.get('/v1/servico/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await servicoController.getServicoById(id);
    res.status(dados.status_code).json(dados);
});

// POST - Criar novo serviço
app.post('/v1/servico', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let dados = await servicoController.createServico(req.body, contentType);
    res.status(dados.status_code).json(dados);
});

// PUT - Atualizar serviço
app.put('/v1/servico/:id', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let id = req.params.id;
    let dadosBody = req.body;
    dadosBody.id = id;
    let dados = await servicoController.updateServico(dadosBody, contentType);
    res.status(dados.status_code).json(dados);
});

// DELETE - Deletar serviço
app.delete('/v1/servico/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await servicoController.deleteServico(id);
    res.status(dados.status_code).json(dados);
});

/************************************************************************************************
 * ROTAS DE PROFISSIONAIS
 ************************************************************************************************/

// GET - Listar todos os profissionais
app.get('/v1/profissionais', cors(), async (req, res) => {
    let dados = await profissionalController.getProfissionais();
    res.status(dados.status_code).json(dados);
});

// GET - Buscar profissional por ID
app.get('/v1/profissional/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await profissionalController.getProfissionalById(id);
    res.status(dados.status_code).json(dados);
});

// GET - Listar profissionais com agendamentos
app.get('/v1/profissionais/agendamentos', cors(), async (req, res) => {
    let dados = await profissionalController.getProfissionaisComAgendamentos();
    res.status(dados.status_code).json(dados);
});

// POST - Criar novo profissional
app.post('/v1/profissional', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let dados = await profissionalController.createProfissional(req.body, contentType);
    res.status(dados.status_code).json(dados);
});

// PUT - Atualizar profissional
app.put('/v1/profissional/:id', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let id = req.params.id;
    let dadosBody = req.body;
    dadosBody.id = id;
    let dados = await profissionalController.updateProfissional(dadosBody, contentType);
    res.status(dados.status_code).json(dados);
});

// DELETE - Deletar profissional
app.delete('/v1/profissional/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await profissionalController.deleteProfissional(id);
    res.status(dados.status_code).json(dados);
});

/************************************************************************************************
 * ROTAS DE AGENDAMENTOS
 ************************************************************************************************/

// GET - Listar todos os agendamentos
app.get('/v1/agendamentos', cors(), async (req, res) => {
    let dados = await agendamentoController.getAgendamentos();
    res.status(dados.status_code).json(dados);
});

// GET - Buscar agendamento por ID
app.get('/v1/agendamento/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await agendamentoController.getAgendamentoById(id);
    res.status(dados.status_code).json(dados);
});

// GET - Buscar agendamentos por data
app.get('/v1/agendamentos/data/:data', cors(), async (req, res) => {
    let data = req.params.data;
    let dados = await agendamentoController.getAgendamentosPorData(data);
    res.status(dados.status_code).json(dados);
});

// GET - Buscar agendamentos por status
app.get('/v1/agendamentos/status/:status', cors(), async (req, res) => {
    let status = req.params.status;
    let dados = await agendamentoController.getAgendamentosPorStatus(status);
    res.status(dados.status_code).json(dados);
});

// GET - Buscar agendamentos por profissional
app.get('/v1/agendamentos/profissional/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let data = req.query.data; // Query param opcional
    let dados = await agendamentoController.getAgendamentosPorProfissional(id, data);
    res.status(dados.status_code).json(dados);
});

// POST - Criar novo agendamento
app.post('/v1/agendamento', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let dados = await agendamentoController.createAgendamento(req.body, contentType);
    res.status(dados.status_code).json(dados);
});

// PUT - Atualizar agendamento
app.put('/v1/agendamento/:id', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let id = req.params.id;
    let dadosBody = req.body;
    dadosBody.id = id;
    let dados = await agendamentoController.updateAgendamento(dadosBody, contentType);
    res.status(dados.status_code).json(dados);
});

// DELETE - Deletar agendamento
app.delete('/v1/agendamento/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await agendamentoController.deleteAgendamento(id);
    res.status(dados.status_code).json(dados);
});

/************************************************************************************************
 * ROTAS DE HORÁRIOS DISPONÍVEIS
 ************************************************************************************************/

// GET - Listar todos os horários disponíveis
app.get('/v1/horarios', cors(), async (req, res) => {
    let dados = await horarioController.getHorariosDisponiveis();
    res.status(dados.status_code).json(dados);
});

// GET - Buscar horário por ID
app.get('/v1/horario/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await horarioController.getHorarioDisponivelById(id);
    res.status(dados.status_code).json(dados);
});

// GET - Buscar horários por dia da semana
app.get('/v1/horarios/dia/:dia', cors(), async (req, res) => {
    let dia = req.params.dia;
    let dados = await horarioController.getHorariosPorDiaSemana(dia);
    res.status(dados.status_code).json(dados);
});

// GET - Buscar horários ativos
app.get('/v1/horarios/ativos', cors(), async (req, res) => {
    let dados = await horarioController.getHorariosAtivos();
    res.status(dados.status_code).json(dados);
});

// POST - Criar novo horário disponível
app.post('/v1/horario', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let dados = await horarioController.createHorarioDisponivel(req.body, contentType);
    res.status(dados.status_code).json(dados);
});

// PUT - Atualizar horário disponível
app.put('/v1/horario/:id', cors(), async (req, res) => {
    let contentType = req.headers['content-type'];
    let id = req.params.id;
    let dadosBody = req.body;
    dadosBody.id = id;
    let dados = await horarioController.updateHorarioDisponivel(dadosBody, contentType);
    res.status(dados.status_code).json(dados);
});

// DELETE - Deletar horário disponível
app.delete('/v1/horario/:id', cors(), async (req, res) => {
    let id = req.params.id;
    let dados = await horarioController.deleteHorarioDisponivel(id);
    res.status(dados.status_code).json(dados);
});

module.exports = app;