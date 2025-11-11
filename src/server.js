/*****************************************************************************************
 * Objetivo --> Arquivo principal do servidor
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const app = require('./app.js');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📡 API disponível em http://localhost:${PORT}`);
});