/*****************************************************************************************
 * Objetivo --> Script para popular o banco de dados com dados iniciais
 * Data --> 25/11/2024
 * Autor --> Sistema de Agendamentos MyBia
 ****************************************************************************************/

const { prisma } = require('./config/database.js');

async function populateDatabase() {
    try {
        console.log('🔄 Iniciando população do banco de dados...');

        // ================================ SERVIÇOS ================================
        console.log('📋 Criando serviços...');
        const services = [
            {
                nomeServico: 'Extensão de Cílios Volume Russo',
                descricao: 'Técnica de extensão que aplica múltiplos fios sintéticos (um "leque" ou "fã") em cada cílio natural, criando um efeito mais volumoso e dramático',
                duracao: 90,
                preco: 280.00
            },
            {
                nomeServico: 'Extensão de Cílios Fio a Fio',
                descricao: 'Extensão de cílios em que um fio sintético é colado individualmente em cada cílio natural para alongá-los e dar volume, resultando em um visual mais natural e definido',
                duracao: 90,
                preco: 230.00
            },
            {
                nomeServico: 'Extensão de Cílios Volume Brasileiro',
                descricao: 'Técnica de extensão de cílios que utiliza fios sintéticos em formato de leque mais aberto e mais fino para criar um efeito volumoso e cheio, mas com aparência mais natural',
                duracao: 90,
                preco: 260.00
            },
            {
                nomeServico: 'Extensão de Cílios Volume Molhado',
                descricao: 'Técnica de extensão de cílios que simula o efeito de cílios aglutinados como se estivessem molhados',
                duracao: 90,
                preco: 310.00
            },
            {
                nomeServico: 'Extensão de Cílios Volume Híbrido',
                descricao: 'Técnica de extensão de cílios que combina o método fio a fio clássico com o volume russo',
                duracao: 90,
                preco: 280.00
            },
            {
                nomeServico: 'Extensão de Cílios Volume Egípcio',
                descricao: 'Técnica de extensão de cílios que usa fios pré-fabricados em formato de "V" para criar um look volumoso e dramático',
                duracao: 90,
                preco: 280.00
            },
            {
                nomeServico: 'Extensão de Cílios Volume 4D',
                descricao: 'Técnica de volume com 4 dimensões para efeito dramático e impactante',
                duracao: 90,
                preco: 260.00
            }
        ];

        for (const service of services) {
            try {
                const created = await prisma.servico.create({
                    data: service
                });
                console.log(`✅ Serviço criado: ${created.nomeServico}`);
            } catch (error) {
                if (error.code === 'P2002') {
                    console.log(`⚠️  Serviço ${service.nomeServico} já existe`);
                } else {
                    console.error(`❌ Erro ao criar serviço ${service.nomeServico}:`, error.message);
                }
            }
        }

        // ================================ PROFISSIONAIS ================================
        console.log('👩‍💼 Criando profissionais...');
        const professionals = [
            {
                nome: 'Ana Paula Souza',
                especialidade: 'Extensionista de Cílios Senior',
                telefone: '(11) 99999-0001'
            },
            {
                nome: 'Carla Regina Santos',
                especialidade: 'Especialista em Volume Russo',
                telefone: '(11) 99999-0002'
            },
            {
                nome: 'Fernanda Lima',
                especialidade: 'Técnica em Volume Brasileiro',
                telefone: '(11) 99999-0003'
            }
        ];

        for (const professional of professionals) {
            try {
                const created = await prisma.profissional.create({
                    data: professional
                });
                console.log(`✅ Profissional criado: ${created.nome}`);
            } catch (error) {
                if (error.code === 'P2002') {
                    console.log(`⚠️  Profissional ${professional.nome} já existe`);
                } else {
                    console.error(`❌ Erro ao criar profissional ${professional.nome}:`, error.message);
                }
            }
        }

        // ================================ HORÁRIOS DISPONÍVEIS ================================
        console.log('⏰ Criando horários disponíveis...');
        const schedules = [
            // Segunda-feira
            { diaSemana: 'segunda', horarioInicio: '09:00:00', horarioFim: '10:30:00', disponivel: true },
            { diaSemana: 'segunda', horarioInicio: '10:45:00', horarioFim: '12:15:00', disponivel: true },
            { diaSemana: 'segunda', horarioInicio: '13:30:00', horarioFim: '15:00:00', disponivel: true },
            { diaSemana: 'segunda', horarioInicio: '15:15:00', horarioFim: '16:45:00', disponivel: true },
            { diaSemana: 'segunda', horarioInicio: '17:00:00', horarioFim: '18:30:00', disponivel: true },
            
            // Terça-feira
            { diaSemana: 'terca', horarioInicio: '09:00:00', horarioFim: '10:30:00', disponivel: true },
            { diaSemana: 'terca', horarioInicio: '10:45:00', horarioFim: '12:15:00', disponivel: true },
            { diaSemana: 'terca', horarioInicio: '13:15:00', horarioFim: '14:45:00', disponivel: true },
            { diaSemana: 'terca', horarioInicio: '15:30:00', horarioFim: '17:00:00', disponivel: true },
            { diaSemana: 'terca', horarioInicio: '17:15:00', horarioFim: '18:45:00', disponivel: true },
            
            // Quarta-feira
            { diaSemana: 'quarta', horarioInicio: '09:00:00', horarioFim: '10:30:00', disponivel: true },
            { diaSemana: 'quarta', horarioInicio: '10:45:00', horarioFim: '12:15:00', disponivel: true },
            { diaSemana: 'quarta', horarioInicio: '13:30:00', horarioFim: '15:00:00', disponivel: true },
            { diaSemana: 'quarta', horarioInicio: '15:15:00', horarioFim: '16:45:00', disponivel: true },
            { diaSemana: 'quarta', horarioInicio: '17:00:00', horarioFim: '18:30:00', disponivel: true },
            
            // Quinta-feira
            { diaSemana: 'quinta', horarioInicio: '09:00:00', horarioFim: '10:30:00', disponivel: true },
            { diaSemana: 'quinta', horarioInicio: '10:45:00', horarioFim: '12:15:00', disponivel: true },
            { diaSemana: 'quinta', horarioInicio: '13:15:00', horarioFim: '14:45:00', disponivel: true },
            { diaSemana: 'quinta', horarioInicio: '15:30:00', horarioFim: '17:00:00', disponivel: true },
            { diaSemana: 'quinta', horarioInicio: '17:15:00', horarioFim: '18:45:00', disponivel: true },
            
            // Sexta-feira
            { diaSemana: 'sexta', horarioInicio: '09:00:00', horarioFim: '10:30:00', disponivel: true },
            { diaSemana: 'sexta', horarioInicio: '10:45:00', horarioFim: '12:15:00', disponivel: true },
            { diaSemana: 'sexta', horarioInicio: '13:30:00', horarioFim: '15:00:00', disponivel: true },
            { diaSemana: 'sexta', horarioInicio: '15:15:00', horarioFim: '16:45:00', disponivel: true },
            { diaSemana: 'sexta', horarioInicio: '17:00:00', horarioFim: '18:30:00', disponivel: true },
            
            // Sábado
            { diaSemana: 'sabado', horarioInicio: '08:00:00', horarioFim: '09:30:00', disponivel: true },
            { diaSemana: 'sabado', horarioInicio: '09:45:00', horarioFim: '11:15:00', disponivel: true },
            { diaSemana: 'sabado', horarioInicio: '11:30:00', horarioFim: '13:00:00', disponivel: true },
            { diaSemana: 'sabado', horarioInicio: '14:00:00', horarioFim: '15:30:00', disponivel: true },
            { diaSemana: 'sabado', horarioInicio: '15:45:00', horarioFim: '17:15:00', disponivel: true }
        ];

        for (const schedule of schedules) {
            try {
                const created = await prisma.horarioDisponivel.create({
                    data: schedule
                });
                console.log(`✅ Horário criado: ${created.diaSemana} ${created.horarioInicio}`);
            } catch (error) {
                if (error.code === 'P2002') {
                    console.log(`⚠️  Horário ${schedule.diaSemana} ${schedule.horarioInicio} já existe`);
                } else {
                    console.error(`❌ Erro ao criar horário:`, error.message);
                }
            }
        }

        // ================================ CLIENTES DE EXEMPLO ================================
        console.log('👥 Criando clientes de exemplo...');
        const clients = [
            {
                nome: 'Maria Silva Santos',
                telefone: '(11) 99999-1001',
                email: 'maria.santos@email.com',
                dataCadastro: new Date()
            },
            {
                nome: 'Ana Carolina Oliveira',
                telefone: '(11) 99999-1002',
                email: 'ana.oliveira@email.com',
                dataCadastro: new Date()
            },
            {
                nome: 'Fernanda Costa Lima',
                telefone: '(11) 99999-1003',
                email: 'fernanda.lima@email.com',
                dataCadastro: new Date()
            }
        ];

        for (const client of clients) {
            try {
                const created = await prisma.cliente.create({
                    data: client
                });
                console.log(`✅ Cliente criado: ${created.nome}`);
            } catch (error) {
                if (error.code === 'P2002') {
                    console.log(`⚠️  Cliente ${client.nome} já existe`);
                } else {
                    console.error(`❌ Erro ao criar cliente ${client.nome}:`, error.message);
                }
            }
        }

        console.log('✅ População do banco de dados concluída com sucesso!');

    } catch (error) {
        console.error('❌ Erro durante a população do banco:', error);
    } finally {
        await prisma.$disconnect();
    }
}

// Executar se o arquivo for chamado diretamente
if (require.main === module) {
    populateDatabase()
        .then(() => {
            console.log('🎉 Processo finalizado!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('💥 Erro fatal:', error);
            process.exit(1);
        });
}

module.exports = { populateDatabase };