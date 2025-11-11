/*****************************************************************************************
 * Objetivo --> Controller responsavel pela manipulação dos dados referentes a profissionais
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

const profissionalDAO = require('../dao/profissionaisDAO.js');
const message = require('../config/config.js');

// ====================== POST ======================
const createProfissional = async function (dadosBody, contentType) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (contentType === 'application/json') {
        if (dadosBody.nome == '' || dadosBody.nome == undefined) {
            status_code = 400;
            mensagem.message = message.ERROR_REQUIRED_FIELDS;
        } else {
            let novoProfissional = await profissionalDAO.insertProfissional(dadosBody);

            if (novoProfissional) {
                status = true;
                status_code = 201;
                mensagem.message = message.SUCCESS_CREATED_ITEM;
                mensagem.profissional = novoProfissional;
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
        profissional: mensagem.profissional
    };
}

// ====================== PUT ======================
const updateProfissional = async function (dadosBody, contentType) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (contentType === 'application/json') {
        if (
            dadosBody.id == '' || dadosBody.id == undefined ||
            dadosBody.nome == '' || dadosBody.nome == undefined
        ) {
            status_code = 400;
            mensagem.message = message.ERROR_REQUIRED_FIELDS;
        } else {
            let resultado = await profissionalDAO.updateProfissional(dadosBody);

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
const deleteProfissional = async function (id) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id == '' || id == undefined || isNaN(id)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let resultado = await profissionalDAO.deleteProfissional(id);

        if (resultado) {
            status = true;
            status_code = 200;
            mensagem.message = message.SUCCESS_DELETED_ITEM;
        } else {
            status_code = 400;
            mensagem.message = "Não é possível excluir um profissional que possui agendamentos associados";
        }
    }

    return {
        status: status,
        status_code: status_code,
        message: mensagem.message
    };
}

// ====================== GET ======================
const getProfissionais = async function () {
    let status = false;
    let status_code;
    let mensagem = {};

    let dados = await profissionalDAO.selectAllProfissionais();

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
        profissionais: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

const getProfissionalById = async function (id) {
    let status = false;
    let status_code;
    let mensagem = {};

    if (id == '' || id == undefined || isNaN(id)) {
        status_code = 400;
        mensagem.message = message.ERROR_INVALID_ID;
    } else {
        let dados = await profissionalDAO.selectProfissionalById(id);

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
        profissional: mensagem.length ? mensagem[0] : null,
        message: mensagem.message || null
    };
}

const getProfissionaisComAgendamentos = async function () {
    let status = false;
    let status_code;
    let mensagem = {};

    let dados = await profissionalDAO.selectProfissionaisComAgendamentos();

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
        profissionais: mensagem.length ? mensagem : null,
        message: mensagem.message || null
    };
}

module.exports = {
    createProfissional,
    updateProfissional,
    deleteProfissional,
    getProfissionais,
    getProfissionalById,
    getProfissionaisComAgendamentos
}