/*****************************************************************************************
 * Objetivo --> Serviço responsável pelo envio de mensagens via WhatsApp
 * Data --> 26/11/2025
 * Autor --> Sistema de Agendamentos MyBia
 ****************************************************************************************/

const https = require('https');
const querystring = require('querystring');

class WhatsAppService {
    constructor() {
        // Configurações do CallMeBot
        this.apiKey = process.env.WHATSAPP_API_KEY || 'demo_key';
        this.phoneNumber = process.env.WHATSAPP_PHONE || '5511999999999';
        this.service = process.env.WHATSAPP_SERVICE || 'callmebot';
        
        // Configurações do negócio
        this.businessName = process.env.BUSINESS_NAME || 'MyBia Studio de Beleza';
        this.businessAddress = process.env.BUSINESS_ADDRESS || 'Rua das Flores, 123 - São Paulo/SP';
        this.businessWebsite = process.env.BUSINESS_WEBSITE || 'https://mybiastudio.com.br';
        
        console.log('📱 WhatsApp Service inicializado:');
        console.log('- Serviço:', this.service);
        console.log('- API Key:', this.apiKey.substring(0, 10) + '...');
        console.log('- Telefone empresa:', this.phoneNumber);
        
        // Templates de mensagens
        this.templates = {
            confirmacao: (dados) => `
🎉 *AGENDAMENTO CONFIRMADO - MyBia*

Olá, ${dados.cliente_nome}! ✨

Seu agendamento foi confirmado com sucesso:

📅 *Data:* ${this.formatDate(dados.data_agendamento)}
🕐 *Horário:* ${dados.horario}
💅 *Serviço:* ${dados.servico}
👩‍💼 *Profissional:* ${dados.profissional}
💰 *Valor:* R$ ${dados.preco}

📋 *Número do Agendamento:* #${dados.id}

📍 *Endereço:* 
${this.businessName}
${this.businessAddress}

⚠️ *Importante:*
• Chegue 10 minutos antes
• Evite usar rímel no dia
• Em caso de cancelamento, avise com 24h de antecedência

🔗 Para reagendar: ${this.businessWebsite}

Obrigada por escolher a ${this.businessName}! 💖

_Esta é uma mensagem automática._
            `.trim(),
            
            lembrete: (dados) => `
⏰ *LEMBRETE - MyBia*

Olá, ${dados.cliente_nome}!

Lembramos que você tem um agendamento AMANHÃ:

📅 *Data:* ${this.formatDate(dados.data_agendamento)}
🕐 *Horário:* ${dados.horario}
💅 *Serviço:* ${dados.servico}

📍 *Local:* ${this.businessName}
${this.businessAddress}

Nos vemos em breve! ✨

_Esta é uma mensagem automática._
            `.trim(),
            
            cancelamento: (dados) => `
❌ *AGENDAMENTO CANCELADO - MyBia*

Olá, ${dados.cliente_nome}!

Seu agendamento foi cancelado:

📅 *Data:* ${this.formatDate(dados.data_agendamento)}
🕐 *Horário:* ${dados.horario}
💅 *Serviço:* ${dados.servico}

Para reagendar, acesse: ${this.businessWebsite}

Esperamos você em breve na ${this.businessName}! 💖

_Esta é uma mensagem automática._
            `.trim()
        };
    }

    // Enviar mensagem via CallMeBot (API gratuita para WhatsApp)
    async sendMessageCallMeBot(phoneNumber, message) {
        return new Promise((resolve, reject) => {
            try {
                // Limpeza e formatação do número
                const phone = phoneNumber.replace(/\D/g, ''); // Remove formatação
                let formattedPhone = phone;
                
                // Garantir formato brasileiro correto
                if (!phone.startsWith('55')) {
                    formattedPhone = '55' + phone;
                }
                
                // Validar tamanho (55 + DDD + número = 13 ou 14 dígitos)
                if (formattedPhone.length < 13 || formattedPhone.length > 14) {
                    resolve({
                        success: false,
                        message: 'Número de telefone inválido',
                        error: 'Formato esperado: 5511999999999'
                    });
                    return;
                }
                
                console.log('📱 Enviando WhatsApp CallMeBot para:', formattedPhone);
                console.log('📝 Tamanho da mensagem:', message.length, 'caracteres');
                
                // Preparar parâmetros
                const params = querystring.stringify({
                    phone: formattedPhone,
                    text: message.substring(0, 1000), // Limitar tamanho da mensagem
                    apikey: this.apiKey
                });

                const options = {
                    hostname: 'api.callmebot.com',
                    port: 443,
                    path: '/whatsapp.php?' + params,
                    method: 'GET',
                    headers: {
                        'User-Agent': 'MyBia-WhatsApp-Service/1.0',
                        'Accept': '*/*',
                        'Connection': 'close'
                    }
                };

                const req = https.request(options, (res) => {
                    let data = '';

                    res.on('data', (chunk) => {
                        data += chunk;
                    });

                    res.on('end', () => {
                        console.log('📡 Resposta CallMeBot:', res.statusCode, data);
                        
                        if (res.statusCode === 200) {
                            // CallMeBot retorna diferentes respostas de sucesso
                            if (data.includes('Message queued') || data.includes('success') || data.trim() === '' || data.includes('Message sent')) {
                                console.log('✅ WhatsApp enviado com sucesso para:', formattedPhone);
                                resolve({
                                    success: true,
                                    message: 'Mensagem enviada com sucesso',
                                    response: data || 'Enviado'
                                });
                            } else {
                                console.log('⚠️ Resposta CallMeBot inesperada:', data);
                                resolve({
                                    success: true, // Assumir sucesso se status 200
                                    message: 'Mensagem provavelmente enviada',
                                    response: data
                                });
                            }
                        } else {
                            console.error('❌ Erro CallMeBot:', res.statusCode, data);
                            resolve({
                                success: false,
                                message: 'Erro do servidor CallMeBot',
                                error: data
                            });
                        }
                    });
                });

                req.on('error', (error) => {
                    console.error('❌ Erro na conexão CallMeBot:', error);
                    resolve({
                        success: false,
                        message: 'Erro de conexão com CallMeBot',
                        error: error.message
                    });
                });

                req.setTimeout(15000, () => {
                    console.log('⏱️ Timeout CallMeBot - cancelando requisição');
                    req.destroy();
                    resolve({
                        success: false,
                        message: 'Timeout na requisição (15s)'
                    });
                });

                req.end();
                
            } catch (error) {
                console.error('❌ Erro crítico CallMeBot:', error);
                resolve({
                    success: false,
                    message: 'Erro interno',
                    error: error.message
                });
            }
        });
    }

    // Enviar mensagem via Twilio (alternativa paga mais robusta)
    async sendMessageTwilio(phoneNumber, message) {
        // Implementação com Twilio seria aqui
        // Por enquanto, retorna simulação
        return {
            success: true,
            message: 'Mensagem simulada (Twilio não configurado)',
            response: 'Simulated send'
        };
    }

    // Enviar confirmação de agendamento
    async enviarConfirmacaoAgendamento(dadosAgendamento) {
        try {
            console.log('📱 Enviando confirmação de agendamento via WhatsApp...');
            
            const message = this.templates.confirmacao(dadosAgendamento);
            const phoneNumber = dadosAgendamento.cliente_telefone;
            
            if (!phoneNumber) {
                throw new Error('Número de telefone não fornecido');
            }

            // Tentar enviar via CallMeBot primeiro
            let result = await this.sendMessageCallMeBot(phoneNumber, message);
            
            // Se falhar, tentar via Twilio (se configurado)
            if (!result.success && process.env.TWILIO_ACCOUNT_SID) {
                result = await this.sendMessageTwilio(phoneNumber, message);
            }

            // Salvar log do envio (opcional)
            await this.salvarLogWhatsApp({
                tipo: 'confirmacao',
                telefone: phoneNumber,
                mensagem: message,
                sucesso: result.success,
                resposta: result.response || result.error,
                agendamento_id: dadosAgendamento.id
            });

            return result;

        } catch (error) {
            console.error('❌ Erro ao enviar WhatsApp:', error);
            return {
                success: false,
                message: 'Erro interno ao enviar WhatsApp',
                error: error.message
            };
        }
    }

    // Enviar lembrete de agendamento
    async enviarLembreteAgendamento(dadosAgendamento) {
        try {
            console.log('⏰ Enviando lembrete de agendamento via WhatsApp...');
            
            const message = this.templates.lembrete(dadosAgendamento);
            const phoneNumber = dadosAgendamento.cliente_telefone;
            
            const result = await this.sendMessageCallMeBot(phoneNumber, message);
            
            await this.salvarLogWhatsApp({
                tipo: 'lembrete',
                telefone: phoneNumber,
                mensagem: message,
                sucesso: result.success,
                resposta: result.response || result.error,
                agendamento_id: dadosAgendamento.id
            });

            return result;

        } catch (error) {
            console.error('❌ Erro ao enviar lembrete WhatsApp:', error);
            return {
                success: false,
                message: 'Erro ao enviar lembrete',
                error: error.message
            };
        }
    }

    // Enviar cancelamento de agendamento
    async enviarCancelamentoAgendamento(dadosAgendamento) {
        try {
            console.log('❌ Enviando cancelamento de agendamento via WhatsApp...');
            
            const message = this.templates.cancelamento(dadosAgendamento);
            const phoneNumber = dadosAgendamento.cliente_telefone;
            
            const result = await this.sendMessageCallMeBot(phoneNumber, message);
            
            await this.salvarLogWhatsApp({
                tipo: 'cancelamento',
                telefone: phoneNumber,
                mensagem: message,
                sucesso: result.success,
                resposta: result.response || result.error,
                agendamento_id: dadosAgendamento.id
            });

            return result;

        } catch (error) {
            console.error('❌ Erro ao enviar cancelamento WhatsApp:', error);
            return {
                success: false,
                message: 'Erro ao enviar cancelamento',
                error: error.message
            };
        }
    }

    // Salvar log de envio (opcional - pode ser implementado com banco)
    async salvarLogWhatsApp(dadosLog) {
        try {
            // Aqui você pode salvar no banco de dados se quiser
            console.log('📝 Log WhatsApp:', {
                timestamp: new Date().toISOString(),
                ...dadosLog
            });
            return true;
        } catch (error) {
            console.error('Erro ao salvar log WhatsApp:', error);
            return false;
        }
    }

    // Utilitários
    formatDate(dateString) {
        try {
            const date = new Date(dateString);
            return date.toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        } catch (error) {
            return dateString;
        }
    }

    formatTime(timeString) {
        try {
            return timeString.substring(0, 5); // Remove segundos
        } catch (error) {
            return timeString;
        }
    }

    // Validar número de telefone brasileiro
    isValidBrazilianPhone(phone) {
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && cleanPhone.length <= 11;
    }

    // Testar envio de mensagem
    async testarEnvio(phoneNumber) {
        const message = `🧪 *TESTE - MyBia*\n\nTeste de envio automático de WhatsApp.\n\nSe você recebeu esta mensagem, o sistema está funcionando! ✅\n\n_Mensagem de teste enviada em ${new Date().toLocaleString('pt-BR')}_`;
        
        return await this.sendMessageCallMeBot(phoneNumber, message);
    }
}

module.exports = WhatsAppService;