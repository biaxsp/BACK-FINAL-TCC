/*****************************************************************************************
 * Objetivo --> Controller responsavel pela manipulação dos dados referentes a agendamentos
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const agendamentoDAO = require('../dao/agendamentosDAO.js');
const message = require('../config/config.js');
const WhatsAppService = require('../services/whatsappService.js');

// Instância do serviço de WhatsApp
const whatsappService = new WhatsAppService();

// ====================== POST ======================
const createAgendamento = async function (dadosBody, contentType) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (contentType === 'application/json') {
        if (
            dadosBody.id_cliente == '' || dadosBody.id_cliente == undefined ||
            dadosBody.id_servico == '' || dadosBody.id_servico == undefined ||
            dadosBody.id_profissional == '' || dadosBody.id_profissional == undefined ||
            dadosBody.data_agendamento == '' || dadosBody.data_agendamento == undefined ||
            dadosBody.horario == '' || dadosBody.horario == undefined
        ) {
            status_code = 400;
            mensagem.message = message.ERROR_REQUIRED_FIELDS;
        } else {
            let novoAgendamento = await agendamentoDAO.insertAgendamento(dadosBody);

            if (novoAgendamento) {
                status = true;
                status_code = 201;
                mensagem.message = message.SUCCESS_CREATED_ITEM;
                mensagem.agendamento = novoAgendamento;

                // Enviar WhatsApp após criar agendamento com sucesso
                try {
                    console.log('📱 Iniciando envio de WhatsApp para agendamento:', novoAgendamento.id);
                    
                    // Preparar dados para WhatsApp
                    const dadosWhatsApp = {
                        id: novoAgendamento.id,
                        cliente_nome: novoAgendamento.cliente_nome || 'Cliente',
                        cliente_telefone: novoAgendamento.cliente_telefone || dadosBody.cliente_telefone,
                        data_agendamento: novoAgendamento.data_agendamento,
                        horario: novoAgendamento.horario,
                        servico: novoAgendamento.nome_servico || 'Serviço MyBia',
                        profissional: novoAgendamento.profissional_nome || 'Profissional MyBia',
                        preco: novoAgendamento.preco || '0,00'
                    };

                    // Enviar WhatsApp de forma assíncrona (não bloquear resposta)
                    whatsappService.enviarConfirmacaoAgendamento(dadosWhatsApp)
                        .then(resultado => {
                            if (resultado.success) {
                                console.log('✅ WhatsApp enviado com sucesso para agendamento:', novoAgendamento.id);
                            } else {
                                console.log('⚠️ Falha no envio do WhatsApp:', resultado.message);
                            }
                        })
                        .catch(error => {
                            console.error('❌ Erro crítico no WhatsApp:', error);
                        });

                } catch (error) {
                    console.error('❌ Erro ao processar WhatsApp:', error);
                    // Não falhar o agendamento por causa do WhatsApp
                }
            } else {
                status_code = 500;
                mensagem.message = message.ERROR_INTERNAL_SERVER;
            }
        }
    } else {
        status_code = 415;
        mensagem.message = message.ERROR_INCORRECT_CONTENT_TYPE;
    }

    return {
        status: status,
        status_code: status_code,
        message: mensagem.message,
        agendamento: mensagem.agendamento
    };
}

// ====================== PUT ======================
const updateAgendamento = async function (dadosBody, contentType) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (contentType === 'application/json') {
        if (
            dadosBody.id == '' || dadosBody.id == undefined ||
            dadosBody.id_cliente == '' || dadosBody.id_cliente == undefined ||
            dadosBody.id_servico == '' || dadosBody.id_servico == undefined ||
            dadosBody.id_profissional == '' || dadosBody.id_profissional == undefined ||
            dadosBody.data_agendamento == '' || dadosBody.data_agendamento == undefined ||
            dadosBody.horario == '' || dadosBody.horario == undefined ||
            dadosBody.status == '' || dadosBody.status == undefined
        ) {
            status_code = 400;
            mensagem.message = message.ERROR_REQUIRED_FIELDS;
        } else {
            let resultado = await agendamentoDAO.updateAgendamento(dadosBody);

            if (resultado) {
                status = true;
                status_code = 200;
                mensagem.message = message.SUCCESS_UPDATED_ITEM;
            } else {
                status_code = 500;
                mensagem.message = message.ERROR_INTERNAL_SERVER;
            }
        }
    } else {
        status_code = 415;
        mensagem.message = message.ERROR_INCORRECT_CONTENT_TYPE;
    }

    return {
        status: status,
        status_code: status_code,
        message: mensagem.message
    };
}

// ====================== DELETE ======================
const deleteAgendamento = async function (id) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id == '' || id == undefined || isNaN(id)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let resultado = await agendamentoDAO.deleteAgendamento(id);

        if (resultado) {
            status = true;
            status_code = 200;
            mensagem.message = message.SUCCESS_DELETED_ITEM;
        } else {
            status_code = 500;
            mensagem.message = message.ERROR_INTERNAL_SERVER;
        }
    }

    return {
        status: status,
        status_code: status_code,
        message: mensagem.message
    };
}

// ====================== GET ======================
const getAgendamentos = async function () {
    let status = false;
    let status_code;
    let mensagem = {};

    let dados = await agendamentoDAO.selectAllAgendamentos();

    if (dados) {
        if (dados.length > 0) {
            status = true;
            status_code = 200;
            mensagem = dados;
        } else {
            status_code = 404;
            mensagem.message = message.ERROR_NOT_FOUND;
        }
    } else {
        status_code = 500;
        mensagem.message = message.ERROR_INTERNAL_SERVER;
    }

    return {
        status: status,
        status_code: status_code,
        agendamentos: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

const getAgendamentoById = async function (id) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id == '' || id == undefined || isNaN(id)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let dados = await agendamentoDAO.selectAgendamentoById(id);

        if (dados) {
            if (dados.length > 0) {
                status = true;
                status_code = 200;
                mensagem = dados;
            } else {
                status_code = 404;
                mensagem.message = message.ERROR_NOT_FOUND;
            }
        } else {
            status_code = 500;
            mensagem.message = message.ERROR_INTERNAL_SERVER;
        }
    }

    return {
        status: status,
        status_code: status_code,
        agendamento: mensagem.length ? mensagem[0] : null,
        message: mensagem.message || null
    };
}

const getAgendamentosPorData = async function (data) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (data == '' || data == undefined) {
        status_code = 400;
        mensagem.message = "Data é obrigatória";
    } else {
        let dados = await agendamentoDAO.selectAgendamentosPorData(data);

        if (dados) {
            if (dados.length > 0) {
                status = true;
                status_code = 200;
                mensagem = dados;
            } else {
                status_code = 404;
                mensagem.message = message.ERROR_NOT_FOUND;
            }
        } else {
            status_code = 500;
            mensagem.message = message.ERROR_INTERNAL_SERVER;
        }
    }

    return {
        status: status,
        status_code: status_code,
        agendamentos: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

const getAgendamentosPorStatus = async function (statusAgendamento) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (statusAgendamento == '' || statusAgendamento == undefined) {
        status_code = 400;
        mensagem.message = "Status é obrigatório";
    } else {
        let dados = await agendamentoDAO.selectAgendamentosPorStatus(statusAgendamento);

        if (dados) {
            if (dados.length > 0) {
                status = true;
                status_code = 200;
                mensagem = dados;
            } else {
                status_code = 404;
                mensagem.message = message.ERROR_NOT_FOUND;
            }
        } else {
            status_code = 500;
            mensagem.message = message.ERROR_INTERNAL_SERVER;
        }
    }

    return {
        status: status,
        status_code: status_code,
        agendamentos: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

const getAgendamentosPorProfissional = async function (id_profissional, data) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id_profissional == '' || id_profissional == undefined || isNaN(id_profissional)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let dados = await agendamentoDAO.selectAgendamentosPorProfissional(id_profissional, data);

        if (dados) {
            if (dados.length > 0) {
                status = true;
                status_code = 200;
                mensagem = dados;
            } else {
                status_code = 404;
                mensagem.message = message.ERROR_NOT_FOUND;
            }
        } else {
            status_code = 500;
            mensagem.message = message.ERROR_INTERNAL_SERVER;
        }
    }

    return {
        status: status,
        status_code: status_code,
        agendamentos: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

module.exports = {
    createAgendamento,
    updateAgendamento,
    deleteAgendamento,
    getAgendamentos,
    getAgendamentoById,
    getAgendamentosPorData,
    getAgendamentosPorStatus,
    getAgendamentosPorProfissional
}