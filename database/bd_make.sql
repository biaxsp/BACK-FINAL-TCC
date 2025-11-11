

create database maquiagem_tcc;

use maquiagem_tcc;


-- Tabela de clientes
CREATE TABLE clientes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    telefone VARCHAR(20),
    email VARCHAR(100),
    data_cadastro DATE
);

-- Tabela de serviços
CREATE TABLE servicos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_servico VARCHAR(100) NOT NULL,
    descricao TEXT,
    duracao INT, -- duração em minutos
    preco DECIMAL(10, 2)
);

-- Tabela de profissionais
CREATE TABLE profissionais (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100),
    telefone VARCHAR(20)
);

-- Tabela de agendamentos
CREATE TABLE agendamentos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_servico INT NOT NULL,
    id_profissional INT NOT NULL,
    data_agendamento DATE NOT NULL,
    horario TIME NOT NULL,
    status VARCHAR(20) DEFAULT 'agendado',
    observacoes TEXT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id),
    FOREIGN KEY (id_servico) REFERENCES servicos(id),
    FOREIGN KEY (id_profissional) REFERENCES profissionais(id)
);

-- Tabela de horários disponíveis
CREATE TABLE horarios_disponiveis (
    id INT AUTO_INCREMENT PRIMARY KEY,
    dia_semana VARCHAR(20) NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_fim TIME NOT NULL,
    disponivel BOOLEAN DEFAULT TRUE
);
