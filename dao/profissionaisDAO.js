/*****************************************************************************************
 * Objetivo --> Model responsavel pelo CRUD de dados referente a profissionais no BANCO DE DADOS
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const { prisma } = require('../config/database.js');

// ================================ INSERT =================================
const insertProfissional = async function (profissional) {
    try {
        let sql = `
            INSERT INTO profissionais (
                nome,
                especialidade,
                telefone
            ) VALUES (
                '${profissional.nome}',
                '${profissional.especialidade || ''}',
                '${profissional.telefone || ''}'
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            let sqlSelect = `
                SELECT * 
                FROM profissionais 
                WHERE nome = '${profissional.nome}' 
                ORDER BY id DESC 
                LIMIT 1;
            `;
            let profissionalCriado = await prisma.$queryRawUnsafe(sqlSelect);
            
            if (profissionalCriado && profissionalCriado.length > 0) {
                return {
                    ...profissionalCriado[0],
                    id: Number(profissionalCriado[0].id)
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
const updateProfissional = async function (profissional) {
    try {
        let sql = `
            UPDATE profissionais SET
                nome = '${profissional.nome}',
                especialidade = '${profissional.especialidade || ''}',
                telefone = '${profissional.telefone || ''}'
            WHERE id = ${profissional.id};
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
const deleteProfissional = async function (id) {
    try {
        // Verificar se existem agendamentos usando este profissional
        let sqlCheck = `
            SELECT COUNT(*) as count 
            FROM agendamentos 
            WHERE id_profissional = ${id};
        `;
        
        let [{count}] = await prisma.$queryRawUnsafe(sqlCheck);
        
        if (count > 0) {
            return false; // Não pode deletar profissional com agendamentos
        }

        let sql = `
            DELETE FROM profissionais 
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
const selectAllProfissionais = async function () {
    try {
        let sql = `
            SELECT * FROM profissionais;
        `;

        let rsProfissionais = await prisma.$queryRawUnsafe(sql);

        return rsProfissionais;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectProfissionalById = async function (id) {
    try {
        let sql = `
            SELECT * FROM profissionais WHERE id = ${id};
        `;

        let rsProfissional = await prisma.$queryRawUnsafe(sql);

        return rsProfissional;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectProfissionaisComAgendamentos = async function () {
    try {
        let sql = `
            SELECT 
                p.id,
                p.nome,
                p.especialidade,
                p.telefone,
                COUNT(a.id) as total_agendamentos,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_agendamento', a.id,
                        'data_agendamento', a.data_agendamento,
                        'horario', a.horario,
                        'status', a.status,
                        'cliente', c.nome,
                        'servico', s.nome_servico
                    )
                ) as agendamentos
            FROM profissionais p
            LEFT JOIN agendamentos a ON a.id_profissional = p.id
            LEFT JOIN clientes c ON c.id = a.id_cliente
            LEFT JOIN servicos s ON s.id = a.id_servico
            GROUP BY p.id, p.nome, p.especialidade, p.telefone;
        `;

        let rsProfissionais = await prisma.$queryRawUnsafe(sql);

        // Converter a string JSON para objeto e tratar casos sem agendamentos
        rsProfissionais = rsProfissionais.map(profissional => {
            if (profissional.agendamentos && profissional.total_agendamentos > 0) {
                profissional.agendamentos = JSON.parse(profissional.agendamentos);
                profissional.agendamentos = profissional.agendamentos.filter(a => a.id_agendamento !== null);
            } else {
                profissional.agendamentos = [];
            }
            return profissional;
        });

        return rsProfissionais;

    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    insertProfissional,
    updateProfissional,
    deleteProfissional,
    selectAllProfissionais,
    selectProfissionalById,
    selectProfissionaisComAgendamentos
}