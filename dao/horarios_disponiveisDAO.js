/*****************************************************************************************
 * Objetivo --> Model responsavel pelo CRUD de dados referente a horários disponíveis no BANCO DE DADOS
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ================================ INSERT =================================
const insertHorarioDisponivel = async function (horario) {
    try {
        let sql = `
            INSERT INTO horarios_disponiveis (
                dia_semana,
                horario_inicio,
                horario_fim,
                disponivel
            ) VALUES (
                '${horario.dia_semana}',
                '${horario.horario_inicio}',
                '${horario.horario_fim}',
                ${horario.disponivel !== undefined ? horario.disponivel : true}
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            let sqlSelect = `
                SELECT * 
                FROM horarios_disponiveis 
                WHERE dia_semana = '${horario.dia_semana}' 
                  AND horario_inicio = '${horario.horario_inicio}'
                ORDER BY id DESC 
                LIMIT 1;
            `;
            let horarioCriado = await prisma.$queryRawUnsafe(sqlSelect);
            
            if (horarioCriado && horarioCriado.length > 0) {
                return {
                    ...horarioCriado[0],
                    id: Number(horarioCriado[0].id)
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
const updateHorarioDisponivel = async function (horario) {
    try {
        let sql = `
            UPDATE horarios_disponiveis SET
                dia_semana = '${horario.dia_semana}',
                horario_inicio = '${horario.horario_inicio}',
                horario_fim = '${horario.horario_fim}',
                disponivel = ${horario.disponivel}
            WHERE id = ${horario.id};
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
const deleteHorarioDisponivel = async function (id) {
    try {
        let sql = `
            DELETE FROM horarios_disponiveis 
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
const selectAllHorariosDisponiveis = async function () {
    try {
        let sql = `
            SELECT * FROM horarios_disponiveis
            ORDER BY 
                FIELD(dia_semana, 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'),
                horario_inicio;
        `;

        let rsHorarios = await prisma.$queryRawUnsafe(sql);

        return rsHorarios;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectHorarioDisponivelById = async function (id) {
    try {
        let sql = `
            SELECT * FROM horarios_disponiveis WHERE id = ${id};
        `;

        let rsHorario = await prisma.$queryRawUnsafe(sql);

        return rsHorario;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectHorariosPorDiaSemana = async function (dia_semana) {
    try {
        let sql = `
            SELECT * FROM horarios_disponiveis 
            WHERE dia_semana = '${dia_semana}'
            ORDER BY horario_inicio;
        `;

        let rsHorarios = await prisma.$queryRawUnsafe(sql);

        return rsHorarios;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectHorariosAtivos = async function () {
    try {
        let sql = `
            SELECT * FROM horarios_disponiveis 
            WHERE disponivel = true
            ORDER BY 
                FIELD(dia_semana, 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'),
                horario_inicio;
        `;

        let rsHorarios = await prisma.$queryRawUnsafe(sql);

        return rsHorarios;

    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    insertHorarioDisponivel,
    updateHorarioDisponivel,
    deleteHorarioDisponivel,
    selectAllHorariosDisponiveis,
    selectHorarioDisponivelById,
    selectHorariosPorDiaSemana,
    selectHorariosAtivos
}
