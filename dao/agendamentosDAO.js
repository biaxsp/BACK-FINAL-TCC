/*****************************************************************************************
 * Objetivo --> Model responsavel pelo CRUD de dados referente a agendamentos no BANCO DE DADOS
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const { prisma } = require('../config/database.js');

// Função helper para formatar horários em agendamentos
const formatarAgendamentos = (agendamentos) => {
    if (!agendamentos) return agendamentos;
    
    if (Array.isArray(agendamentos)) {
        return agendamentos.map(agendamento => formatarAgendamento(agendamento));
    } else {
        return formatarAgendamento(agendamentos);
    }
};

const formatarAgendamento = (agendamento) => {
    if (!agendamento) return agendamento;
    
    return {
        ...agendamento,
        id: Number(agendamento.id),
        horario: agendamento.horario instanceof Date ? 
            agendamento.horario.toTimeString().split(' ')[0] : 
            agendamento.horario,
        data_agendamento: agendamento.data_agendamento instanceof Date ?
            agendamento.data_agendamento.toISOString().split('T')[0] :
            agendamento.data_agendamento
    };
};

// ================================ INSERT =================================
const insertAgendamento = async function (agendamento) {
    try {
        let sql = `
            INSERT INTO agendamentos (
                id_cliente,
                id_servico,
                id_profissional,
                data_agendamento,
                horario,
                status,
                observacoes
            ) VALUES (
                ${agendamento.id_cliente},
                ${agendamento.id_servico},
                ${agendamento.id_profissional},
                '${agendamento.data_agendamento}',
                '${agendamento.horario}',
                '${agendamento.status || 'agendado'}',
                '${agendamento.observacoes || ''}'
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            let sqlSelect = `
                SELECT a.*, 
                       c.nome as cliente_nome,
                       c.telefone as cliente_telefone,
                       c.email as cliente_email,
                       s.nome_servico,
                       s.preco,
                       p.nome as profissional_nome
                FROM agendamentos a
                JOIN clientes c ON c.id = a.id_cliente
                JOIN servicos s ON s.id = a.id_servico
                JOIN profissionais p ON p.id = a.id_profissional
                WHERE a.id_cliente = ${agendamento.id_cliente}
                  AND a.data_agendamento = '${agendamento.data_agendamento}'
                  AND a.horario = '${agendamento.horario}'
                ORDER BY a.id DESC 
                LIMIT 1;
            `;
            let agendamentoCriado = await prisma.$queryRawUnsafe(sqlSelect);
            
            if (agendamentoCriado && agendamentoCriado.length > 0) {
                return formatarAgendamento(agendamentoCriado[0]);
            }
            return false;
        } else {
            return false;
        }

    } catch (error) {
        console.error(error);
        return false;
    }
}

// ================================ UPDATE =================================
const updateAgendamento = async function (agendamento) {
    try {
        let sql = `
            UPDATE agendamentos SET
                id_cliente = ${agendamento.id_cliente},
                id_servico = ${agendamento.id_servico},
                id_profissional = ${agendamento.id_profissional},
                data_agendamento = '${agendamento.data_agendamento}',
                horario = '${agendamento.horario}',
                status = '${agendamento.status}',
                observacoes = '${agendamento.observacoes || ''}'
            WHERE id = ${agendamento.id};
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error(error);
        return false;
    }
}

// ================================ DELETE =================================
const deleteAgendamento = async function (id) {
    try {
        let sql = `
            DELETE FROM agendamentos 
            WHERE id = ${id};
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            return true;
        } else {
            return false;
        }

    } catch (error) {
        console.error(error);
        return false;
    }
}

// ================================ SELECT =================================
const selectAllAgendamentos = async function () {
    try {
        let sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                c.telefone as cliente_telefone,
                s.nome_servico,
                s.preco,
                s.duracao,
                p.nome as profissional_nome,
                p.especialidade
            FROM agendamentos a
            JOIN clientes c ON c.id = a.id_cliente
            JOIN servicos s ON s.id = a.id_servico
            JOIN profissionais p ON p.id = a.id_profissional
            ORDER BY a.data_agendamento DESC, a.horario DESC;
        `;

        let rsAgendamentos = await prisma.$queryRawUnsafe(sql);

        return rsAgendamentos;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectAgendamentoById = async function (id) {
    try {
        let sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                c.telefone as cliente_telefone,
                c.email as cliente_email,
                s.nome_servico,
                s.preco,
                s.duracao,
                s.descricao as servico_descricao,
                p.nome as profissional_nome,
                p.especialidade,
                p.telefone as profissional_telefone
            FROM agendamentos a
            JOIN clientes c ON c.id = a.id_cliente
            JOIN servicos s ON s.id = a.id_servico
            JOIN profissionais p ON p.id = a.id_profissional
            WHERE a.id = ${id};
        `;

        let rsAgendamento = await prisma.$queryRawUnsafe(sql);

        return formatarAgendamentos(rsAgendamento);

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectAgendamentosPorData = async function (data) {
    try {
        let sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                s.nome_servico,
                p.nome as profissional_nome
            FROM agendamentos a
            JOIN clientes c ON c.id = a.id_cliente
            JOIN servicos s ON s.id = a.id_servico
            JOIN profissionais p ON p.id = a.id_profissional
            WHERE a.data_agendamento = '${data}'
            ORDER BY a.horario;
        `;

        let rsAgendamentos = await prisma.$queryRawUnsafe(sql);

        return rsAgendamentos;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectAgendamentosPorStatus = async function (status) {
    try {
        let sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                s.nome_servico,
                p.nome as profissional_nome
            FROM agendamentos a
            JOIN clientes c ON c.id = a.id_cliente
            JOIN servicos s ON s.id = a.id_servico
            JOIN profissionais p ON p.id = a.id_profissional
            WHERE a.status = '${status}'
            ORDER BY a.data_agendamento DESC, a.horario DESC;
        `;

        let rsAgendamentos = await prisma.$queryRawUnsafe(sql);

        return rsAgendamentos;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectAgendamentosPorProfissional = async function (id_profissional, data) {
    try {
        let sql = `
            SELECT 
                a.*,
                c.nome as cliente_nome,
                s.nome_servico
            FROM agendamentos a
            JOIN clientes c ON c.id = a.id_cliente
            JOIN servicos s ON s.id = a.id_servico
            WHERE a.id_profissional = ${id_profissional}
            ${data ? `AND a.data_agendamento = '${data}'` : ''}
            ORDER BY a.data_agendamento DESC, a.horario DESC;
        `;

        let rsAgendamentos = await prisma.$queryRawUnsafe(sql);

        return rsAgendamentos;

    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    insertAgendamento,
    updateAgendamento,
    deleteAgendamento,
    selectAllAgendamentos,
    selectAgendamentoById,
    selectAgendamentosPorData,
    selectAgendamentosPorStatus,
    selectAgendamentosPorProfissional
}
