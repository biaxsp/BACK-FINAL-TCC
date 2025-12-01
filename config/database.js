/*****************************************************************************************
 * Objetivo --> Arquivo de configuração e validação de conexão com banco de dados
 * Data --> 25/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const { PrismaClient } = require('@prisma/client');

// Configuração do Prisma com logs
const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty'
});

// Função para testar conexão com o banco
const testConnection = async () => {
    try {
        await prisma.$connect();
        console.log('✅ Conexão com banco de dados estabelecida com sucesso');
        return true;
    } catch (error) {
        console.error('❌ Erro ao conectar com banco de dados:', error.message);
        return false;
    }
};

// Função para fechar conexão
const closeConnection = async () => {
    try {
        await prisma.$disconnect();
        console.log('🔌 Conexão com banco de dados fechada');
    } catch (error) {
        console.error('Erro ao fechar conexão:', error.message);
    }
};

// Graceful shutdown
process.on('beforeExit', async () => {
    await closeConnection();
});

process.on('SIGINT', async () => {
    await closeConnection();
    process.exit(0);
});

process.on('SIGTERM', async () => {
    await closeConnection();
    process.exit(0);
});

module.exports = {
    prisma,
    testConnection,
    closeConnection
};