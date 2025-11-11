/*****************************************************************************************
 * Objetivo --> Model responsavel pelo CRUD de dados referente a serviços no BANCO DE DADOS
 * Data --> 06/11/2025
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ================================ INSERT =================================
const insertServico = async function (servico) {
    try {
        let sql = `
            INSERT INTO servicos (
                nome_servico,
                descricao,
                duracao,
                preco
            ) VALUES (
                '${servico.nome_servico}',
                '${servico.descricao || ''}',
                ${servico.duracao || 'NULL'},
                ${servico.preco || 'NULL'}
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            let sqlSelect = `
                SELECT * 
                FROM servicos 
                WHERE nome_servico = '${servico.nome_servico}' 
                ORDER BY id DESC 
                LIMIT 1;
            `;
            let servicoCriado = await prisma.$queryRawUnsafe(sqlSelect);
            
            if (servicoCriado && servicoCriado.length > 0) {
                return {
                    ...servicoCriado[0],
                    id: Number(servicoCriado[0].id)
                };
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
const updateServico = async function (servico) {
    try {
        let sql = `
            UPDATE servicos SET
                nome_servico = '${servico.nome_servico}',
                descricao = '${servico.descricao || ''}',
                duracao = ${servico.duracao || 'NULL'},
                preco = ${servico.preco || 'NULL'}
            WHERE id = ${servico.id};
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
const deleteServico = async function (id) {
    try {
        // Verificar se existem agendamentos usando este serviço
        let sqlCheck = `
            SELECT COUNT(*) as count 
            FROM agendamentos 
            WHERE id_servico = ${id};
        `;
        
        let [{count}] = await prisma.$queryRawUnsafe(sqlCheck);
        
        if (count > 0) {
            return false; // Não pode deletar serviço com agendamentos
        }

        let sql = `
            DELETE FROM servicos 
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
const selectAllServicos = async function () {
    try {
        let sql = `
            SELECT * FROM servicos;
        `;

        let rsServicos = await prisma.$queryRawUnsafe(sql);

        return rsServicos;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectServicoById = async function (id) {
    try {
        let sql = `
            SELECT * FROM servicos WHERE id = ${id};
        `;

        let rsServico = await prisma.$queryRawUnsafe(sql);

        return rsServico;

    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    insertServico,
    updateServico,
    deleteServico,
    selectAllServicos,
    selectServicoById
}