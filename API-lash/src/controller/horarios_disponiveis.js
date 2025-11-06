/*****************************************************************************************
 * Objetivo --> Controller responsavel pela manipulação dos dados referentes a horários disponíveis
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const horarioDAO = require('../dao/HorarioDisponivelDAO.js');
const message = require('../config/config.js');

// ====================== POST ======================
const createHorarioDisponivel = async function (dadosBody, contentType) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (contentType === 'application/json') {
        if (
            dadosBody.dia_semana == '' || dadosBody.dia_semana == undefined ||
            dadosBody.horario_inicio == '' || dadosBody.horario_inicio == undefined ||
            dadosBody.horario_fim == '' || dadosBody.horario_fim == undefined
        ) {
            status_code = 400;
            mensagem.message = message.ERROR_REQUIRED_FIELDS;
        } else {
            let novoHorario = await horarioDAO.insertHorarioDisponivel(dadosBody);

            if (novoHorario) {
                status = true;
                status_code = 201;
                mensagem.message = message.SUCCESS_CREATED_ITEM;
                mensagem.horario = novoHorario;
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
        horario: mensagem.horario
    };
}

// ====================== PUT ======================
const updateHorarioDisponivel = async function (dadosBody, contentType) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (contentType === 'application/json') {
        if (
            dadosBody.id == '' || dadosBody.id == undefined ||
            dadosBody.dia_semana == '' || dadosBody.dia_semana == undefined ||
            dadosBody.horario_inicio == '' || dadosBody.horario_inicio == undefined ||
            dadosBody.horario_fim == '' || dadosBody.horario_fim == undefined ||
            dadosBody.disponivel == '' || dadosBody.disponivel == undefined
        ) {
            status_code = 400;
            mensagem.message = message.ERROR_REQUIRED_FIELDS;
        } else {
            let resultado = await horarioDAO.updateHorarioDisponivel(dadosBody);

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
const deleteHorarioDisponivel = async function (id) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id == '' || id == undefined || isNaN(id)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let resultado = await horarioDAO.deleteHorarioDisponivel(id);

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
const getHorariosDisponiveis = async function () {
    let status = false;
    let status_code;
    let mensagem = {};

    let dados = await horarioDAO.selectAllHorariosDisponiveis();

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
        horarios: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

const getHorarioDisponivelById = async function (id) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id == '' || id == undefined || isNaN(id)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let dados = await horarioDAO.selectHorarioDisponivelById(id);

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
        horario: mensagem.length ? mensagem[0] : null,
        message: mensagem.message || null
    };
}

const getHorariosPorDiaSemana = async function (dia_semana) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (dia_semana == '' || dia_semana == undefined) {
        status_code = 400;
        mensagem.message = "Dia da semana é obrigatório";
    } else {
        let dados = await horarioDAO.selectHorariosPorDiaSemana(dia_semana);

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
        horarios: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

const getHorariosAtivos = async function () {
    let status = false;
    let status_code;
    let mensagem = {};

    let dados = await horarioDAO.selectHorariosAtivos();

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
        horarios: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

module.exports = {
    createHorarioDisponivel,
    updateHorarioDisponivel,
    deleteHorarioDisponivel,
    getHorariosDisponiveis,
    getHorarioDisponivelById,
    getHorariosPorDiaSemana,
    getHorariosAtivos
}