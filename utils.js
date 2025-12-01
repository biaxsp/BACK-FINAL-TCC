// Função para converter a duração em formato "1h 30 min" para minutos
const parseDuracao = (duracao) => {
    // Se duracao é undefined, null ou vazio, retorna null
    if (!duracao || duracao === '') {
        return null;
    }

    // Se já é um número, retorna ele mesmo (assumindo que já está em minutos)
    if (typeof duracao === 'number') {
        return duracao;
    }

    // Se não é string, tenta converter para string
    if (typeof duracao !== 'string') {
        duracao = String(duracao);
    }

    const regex = /(\d+)\s*h\s*(\d+)\s*min/;
    const match = duracao.match(regex);

    if (match) {
        const horas = parseInt(match[1]);
        const minutos = parseInt(match[2]);
        return horas * 60 + minutos;  // Retorna o total em minutos
    }

    if (duracao.includes("h")) {
        return parseInt(duracao.replace("h", "").trim()) * 60;  // Converte horas para minutos
    }
    if (duracao.includes("min")) {
        return parseInt(duracao.replace("min", "").trim());  // Retorna minutos
    }

    // Se é um número em formato string, retorna como número
    const numeroSimples = parseInt(duracao);
    if (!isNaN(numeroSimples)) {
        return numeroSimples;
    }

    return null;  // Se não conseguir identificar o formato, retorna null
};

// Função para converter o preço de string para número (com vírgula para ponto)
const parsePreco = (preco) => {
    // Se preco é undefined, null ou vazio, retorna null
    if (!preco || preco === '') {
        return null;
    }

    // Se já é um número, retorna ele mesmo
    if (typeof preco === 'number') {
        return preco;
    }

    // Se não é string, tenta converter para string
    if (typeof preco !== 'string') {
        preco = String(preco);
    }

    // Remove espaços e substitui vírgula por ponto
    const precoLimpo = preco.trim().replace(",", ".");
    const numeroConvertido = parseFloat(precoLimpo);
    
    // Se a conversão falhou, retorna null
    if (isNaN(numeroConvertido)) {
        return null;
    }
    
    return numeroConvertido;
};

module.exports = { parseDuracao, parsePreco };
