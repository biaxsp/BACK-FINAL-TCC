/*****************************************************************************************
 * Objetivo --> Arquivo principal do servidor
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const app = require('../app.js');
const { testConnection } = require('../config/database.js');
require('dotenv').config();

const PORT = process.env.PORT || 8080;

// Função para inicializar o servidor
const startServer = async () => {
    try {
        // Testar conexão com banco de dados
        const dbConnected = await testConnection();
        
        if (!dbConnected) {
            console.error('❌ Não foi possível conectar ao banco de dados. Verifique a configuração.');
            process.exit(1);
        }

        // Iniciar servidor
        app.listen(PORT, () => {
            console.log(`🚀 Servidor rodando na porta ${PORT}`);
            console.log(`📡 API disponível em http://localhost:${PORT}`);
            console.log(`📊 Documentação disponível em http://localhost:${PORT}/v1`);
        });

    } catch (error) {
        console.error('❌ Erro ao inicializar servidor:', error.message);
        process.exit(1);
    }
};

// Inicializar servidor
startServer();