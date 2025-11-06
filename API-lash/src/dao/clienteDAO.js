/*****************************************************************************************
 * Objetivo --> Model responsavel pelo CRUD de dados referente a clientes no BANCO DE DADOS
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ================================ INSERT =================================
const insertCliente = async function (cliente) {
    try {
        let sql = `
            INSERT INTO clientes (
                nome,
                telefone,
                email,
                data_cadastro
            ) VALUES (
                '${cliente.nome}',
                '${cliente.telefone || ''}',
                '${cliente.email || ''}',
                '${cliente.data_cadastro || new Date().toISOString().split('T')[0]}'
            );
        `;

        let result = await prisma.$executeRawUnsafe(sql);

        if (result) {
            let sqlSelect = `
                SELECT * 
                FROM clientes 
                WHERE email = '${cliente.email}' 
                ORDER BY id DESC 
                LIMIT 1;
            `;
            let clienteCriado = await prisma.$queryRawUnsafe(sqlSelect);
            
            if (clienteCriado && clienteCriado.length > 0) {
                return {
                    ...clienteCriado[0],
                    id: Number(clienteCriado[0].id)
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
const updateCliente = async function (cliente) {
    try {
        let sql = `
            UPDATE clientes SET
                nome = '${cliente.nome}',
                telefone = '${cliente.telefone || ''}',
                email = '${cliente.email || ''}',
                data_cadastro = '${cliente.data_cadastro}'
            WHERE id = ${cliente.id};
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
const deleteCliente = async function (id) {
    try {
        // Verificar se existem agendamentos usando este cliente
        let sqlCheck = `
            SELECT COUNT(*) as count 
            FROM agendamentos 
            WHERE id_cliente = ${id};
        `;
        
        let [{count}] = await prisma.$queryRawUnsafe(sqlCheck);
        
        if (count > 0) {
            return false; // Não pode deletar cliente com agendamentos
        }

        let sql = `
            DELETE FROM clientes 
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
const selectAllClientes = async function () {
    try {
        let sql = `
            SELECT * FROM clientes;
        `;

        let rsClientes = await prisma.$queryRawUnsafe(sql);

        return rsClientes;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectClienteById = async function (id) {
    try {
        let sql = `
            SELECT * FROM clientes WHERE id = ${id};
        `;

        let rsCliente = await prisma.$queryRawUnsafe(sql);

        return rsCliente;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectClientesComAgendamentos = async function () {
    try {
        let sql = `
            SELECT 
                c.id,
                c.nome,
                c.telefone,
                c.email,
                c.data_cadastro,
                COUNT(a.id) as total_agendamentos,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_agendamento', a.id,
                        'data_agendamento', a.data_agendamento,
                        'horario', a.horario,
                        'status', a.status,
                        'servico', s.nome_servico,
                        'profissional', p.nome,
                        'observacoes', a.observacoes
                    )
                ) as agendamentos
            FROM clientes c
            LEFT JOIN agendamentos a ON a.id_cliente = c.id
            LEFT JOIN servicos s ON s.id = a.id_servico
            LEFT JOIN profissionais p ON p.id = a.id_profissional
            GROUP BY c.id, c.nome, c.telefone, c.email, c.data_cadastro;
        `;

        let rsClientes = await prisma.$queryRawUnsafe(sql);

        // Converter a string JSON para objeto e tratar casos sem agendamentos
        rsClientes = rsClientes.map(cliente => {
            if (cliente.agendamentos && cliente.total_agendamentos > 0) {
                cliente.agendamentos = JSON.parse(cliente.agendamentos);
                cliente.agendamentos = cliente.agendamentos.filter(a => a.id_agendamento !== null);
            } else {
                cliente.agendamentos = [];
            }
            return cliente;
        });

        return rsClientes;

    } catch (error) {
        console.error(error);
        return false;
    }
}

const selectClienteComAgendamentosById = async function (id) {
    try {
        let sql = `
            SELECT 
                c.id,
                c.nome,
                c.telefone,
                c.email,
                c.data_cadastro,
                COUNT(a.id) as total_agendamentos,
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id_agendamento', a.id,
                        'data_agendamento', a.data_agendamento,
                        'horario', a.horario,
                        'status', a.status,
                        'servico', s.nome_servico,
                        'profissional', p.nome,
                        'observacoes', a.observacoes
                    )
                ) as agendamentos
            FROM clientes c
            LEFT JOIN agendamentos a ON a.id_cliente = c.id
            LEFT JOIN servicos s ON s.id = a.id_servico
            LEFT JOIN profissionais p ON p.id = a.id_profissional
            WHERE c.id = ${id}
            GROUP BY c.id, c.nome, c.telefone, c.email, c.data_cadastro;
        `;

        let rsCliente = await prisma.$queryRawUnsafe(sql);

        // Converter a string JSON para objeto e tratar casos sem agendamentos
        if (rsCliente.length > 0) {
            if (rsCliente[0].agendamentos && rsCliente[0].total_agendamentos > 0) {
                rsCliente[0].agendamentos = JSON.parse(rsCliente[0].agendamentos);
                rsCliente[0].agendamentos = rsCliente[0].agendamentos.filter(a => a.id_agendamento !== null);
            } else {
                rsCliente[0].agendamentos = [];
            }
        }

        return rsCliente;

    } catch (error) {
        console.error(error);
        return false;
    }
}

module.exports = {
    insertCliente,
    updateCliente,
    deleteCliente,
    selectAllClientes,
    selectClienteById,
    selectClientesComAgendamentos,
    selectClienteComAgendamentosById
}