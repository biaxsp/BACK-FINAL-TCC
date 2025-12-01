#!/usr/bin/env node

/*****************************************************************************************
 * Setup CallMeBot - Script de Configuração Automática
 * Data --> 26/11/2025
 * Autor --> Sistema de Agendamentos MyBia
 ****************************************************************************************/

const fs = require('fs');
const path = require('path');
const readline = require('readline');

console.log('🤖 CallMeBot Setup - MyBia Sistema de Agendamentos');
console.log('==================================================\n');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupCallMeBot() {
    try {
        console.log('📱 PASSO 1: Instruções para obter sua API Key do CallMeBot\n');
        
        console.log('1. Adicione o CallMeBot ao seu WhatsApp:');
        console.log('   📞 Número: +34 644 55 95 35');
        console.log('   👤 Nome: CallMeBot\n');
        
        console.log('2. Envie a seguinte mensagem EXATA:');
        console.log('   💬 "I allow callmebot to send me messages"\n');
        
        console.log('3. Você receberá uma resposta com sua API key\n');
        
        console.log('⚠️  IMPORTANTE: Faça isso AGORA antes de continuar!\n');
        
        await question('Pressione ENTER após adicionar o contato e enviar a mensagem...');
        
        console.log('\n🔧 PASSO 2: Configuração do Sistema\n');
        
        // Obter API Key
        const apiKey = await question('Cole sua API Key do CallMeBot aqui: ');
        
        if (!apiKey || apiKey.trim() === '') {
            console.log('❌ API Key é obrigatória!');
            process.exit(1);
        }
        
        // Obter número da empresa
        const businessPhone = await question('Número do WhatsApp da empresa (ex: 11999999999): ');
        
        if (!businessPhone || businessPhone.length < 10) {
            console.log('❌ Número inválido!');
            process.exit(1);
        }
        
        // Obter nome do negócio
        const businessName = await question('Nome do seu negócio (ex: MyBia Studio): ') || 'MyBia Studio de Beleza';
        
        // Obter endereço
        const businessAddress = await question('Endereço do negócio: ') || 'Rua das Flores, 123 - São Paulo/SP';
        
        // Obter website
        const businessWebsite = await question('Website do negócio (opcional): ') || 'https://mybiastudio.com.br';
        
        console.log('\n💾 PASSO 3: Salvando Configurações...\n');
        
        // Atualizar arquivo .env
        const envPath = path.join(__dirname, '.env');
        let envContent = '';
        
        if (fs.existsSync(envPath)) {
            envContent = fs.readFileSync(envPath, 'utf8');
        }
        
        // Remover configurações antigas do WhatsApp se existirem
        const linesToKeep = envContent.split('\n').filter(line => 
            !line.startsWith('WHATSAPP_') && !line.startsWith('BUSINESS_')
        );
        
        // Adicionar novas configurações
        const newConfig = `
# Configurações WhatsApp CallMeBot
WHATSAPP_API_KEY=${apiKey.trim()}
WHATSAPP_PHONE=55${businessPhone.replace(/\D/g, '')}
WHATSAPP_SERVICE=callmebot

# Configurações do Negócio
BUSINESS_NAME=${businessName}
BUSINESS_ADDRESS=${businessAddress}
BUSINESS_WEBSITE=${businessWebsite}
`;
        
        const finalEnvContent = linesToKeep.join('\n') + newConfig;
        
        fs.writeFileSync(envPath, finalEnvContent);
        
        console.log('✅ Arquivo .env atualizado!');
        
        // Criar arquivo de teste
        const testScript = `
const WhatsAppService = require('./services/whatsappService.js');

async function testarCallMeBot() {
    console.log('🧪 Testando CallMeBot...');
    
    const whatsapp = new WhatsAppService();
    
    // Número de teste (substitua pelo seu)
    const numeroTeste = '${businessPhone}';
    
    console.log('📱 Enviando mensagem de teste para:', numeroTeste);
    
    const resultado = await whatsapp.testarEnvio(numeroTeste);
    
    if (resultado.success) {
        console.log('✅ SUCESSO! Mensagem enviada!');
        console.log('📱 Verifique seu WhatsApp');
    } else {
        console.log('❌ ERRO:', resultado.message);
        console.log('🔧 Verifique sua API Key');
    }
}

testarCallMeBot();
`;
        
        fs.writeFileSync(path.join(__dirname, 'test-callmebot.js'), testScript);
        
        console.log('✅ Script de teste criado: test-callmebot.js\n');
        
        console.log('🎉 CONFIGURAÇÃO CONCLUÍDA!\n');
        
        console.log('📋 Próximos passos:');
        console.log('1. Reinicie o servidor: node src/server.js');
        console.log('2. Teste o sistema: node test-callmebot.js');
        console.log('3. Faça um agendamento real no site\n');
        
        console.log('📱 Suas configurações:');
        console.log(`- API Key: ${apiKey.substring(0, 10)}...`);
        console.log(`- Telefone: +55${businessPhone.replace(/\D/g, '')}`);
        console.log(`- Negócio: ${businessName}\n`);
        
        console.log('💡 Dica: Guarde sua API Key em local seguro!');
        
        rl.close();
        
    } catch (error) {
        console.error('❌ Erro na configuração:', error.message);
        rl.close();
        process.exit(1);
    }
}

// Executar setup
setupCallMeBot();