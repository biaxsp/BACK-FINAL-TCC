/*****************************************************************************************
 * Objetivo --> Arquivo de configuração de mensagens e constantes do sistema
 * Data --> 06/11/2024
 * Autor --> Sistema de Agendamentos
 ****************************************************************************************/

// Mensagens de ERRO
const ERROR_REQUIRED_FIELDS = { message: 'Campos obrigatórios não foram preenchidos ou não atendem aos critérios necessários.' };
const ERROR_INVALID_ID = { message: 'O ID encaminhado não atende aos critérios necessários.' };
const ERROR_NOT_FOUND = { message: 'Nenhum registro foi encontrado.' };
const ERROR_INTERNAL_SERVER = { message: 'Erro interno no servidor. Não foi possível processar a solicitação.' };
const ERROR_INCORRECT_CONTENT_TYPE = { message: 'O Content-Type da requisição não é suportado pelo servidor. Deve ser application/json.' };
const ERROR_INTERNAL_SERVER_DB = { message: 'Erro interno no servidor ao processar a solicitação no banco de dados.' };

// Mensagens de SUCESSO
const SUCCESS_CREATED_ITEM = { message: 'Item criado com sucesso.' };
const SUCCESS_UPDATED_ITEM = { message: 'Item atualizado com sucesso.' };
const SUCCESS_DELETED_ITEM = { message: 'Item excluído com sucesso.' };

module.exports = {
    ERROR_REQUIRED_FIELDS,
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_INTERNAL_SERVER,
    ERROR_INCORRECT_CONTENT_TYPE,
    ERROR_INTERNAL_SERVER_DB,
    SUCCESS_CREATED_ITEM,
    SUCCESS_UPDATED_ITEM,
    SUCCESS_DELETED_ITEM
};