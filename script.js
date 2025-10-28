// ===========================================
// 📅 DEFINIR DATA ATUAL
// ===========================================
const dataAtualInput = document.getElementById('dataAtual');
const hoje = new Date();
dataAtualInput.valueAsDate = hoje;

// ===========================================
// 📋 FUNÇÃO DE CÓPIA GENÉRICA (QUALQUER ELEMENTO)
// ===========================================
function copiarTexto(elementId, botao) {
    const elemento = document.getElementById(elementId);
    const texto = elemento.textContent;

    if (texto === '--.--.----' || texto === '--------' || texto === 'C_--------') return;

    navigator.clipboard.writeText(texto).then(() => {
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = '✓ Copiado!';
        botao.classList.add('copied');
        setTimeout(() => {
            botao.innerHTML = textoOriginal;
            botao.classList.remove('copied');
        }, 2000);
    }).catch(err => console.error('Erro ao copiar:', err));
}

// ===========================================
// 📆 CALCULAR VALIDADE (data + dias)
// ===========================================
function calcularValidade() {
    const dataAtual = dataAtualInput.value;
    const dias = parseInt(document.getElementById('diasValidade').value);

    if (!dataAtual || isNaN(dias)) {
        document.getElementById('dataValidadeResult').textContent = '--.--.----';
        return;
    }

    const data = new Date(dataAtual + 'T00:00:00');
    data.setDate(data.getDate() + dias);

    const dia = String(data.getDate()).padStart(2, '0');
    const mes = String(data.getMonth() + 1).padStart(2, '0');
    const ano = data.getFullYear();

    document.getElementById('dataValidadeResult').textContent = `${dia}.${mes}.${ano}`;
}

// ===========================================
// 🆔 GERAR ID BASEADO EM NOME
// ===========================================
function gerarID() {
    const nomeCompleto = document.getElementById('nomeCompleto').value.trim().toUpperCase();

    if (!nomeCompleto) {
        document.getElementById('idPrincipal').textContent = '--------';
        document.getElementById('idPrefixo').textContent = 'C_--------';
        return;
    }

    const nomeClean = nomeCompleto.replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ');
    const partes = nomeClean.split(' ');

    if (partes.length === 0 || partes[0] === '') {
        document.getElementById('idPrincipal').textContent = '--------';
        document.getElementById('idPrefixo').textContent = 'C_--------';
        return;
    }

    let nome = partes[0];
    let sobrenome = partes.length > 1 ? partes[partes.length - 1] : '';
    let id = '';

    // Regra principal: 6 letras do sobrenome + 2 do nome
    if (sobrenome.length >= 6) {
        id = sobrenome.substring(0, 6) + nome.substring(0, 2);
    } else {
        id = sobrenome;
        let restante = 8 - sobrenome.length;
        if (nome.length >= restante) {
            id += nome.substring(0, restante);
        } else {
            id += nome;
            id = id.padEnd(8, '0');
        }
    }

    id = id.substring(0, 8).padEnd(8, '0');
    document.getElementById('idPrincipal').textContent = id;
    document.getElementById('idPrefixo').textContent = 'C_' + id;
}

// ===========================================
// ⚙️ EVENTOS DE ENTRADA BÁSICOS
// ===========================================
dataAtualInput.addEventListener('change', calcularValidade);
document.getElementById('diasValidade').addEventListener('input', calcularValidade);
document.getElementById('nomeCompleto').addEventListener('input', gerarID);
calcularValidade(); // Inicializa na carga

// ===========================================
// 🔐 GERADOR DE SENHAS
// ===========================================
function atualizarTamanho() {
    const valor = document.getElementById('passwordLength').value;
    document.getElementById('lengthValue').textContent = valor;
}

// Função para senha totalmente aleatória
function gerarSenhaAleatoria(tamanho, configs) {
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const especiais = '!@#$%&*';
    let senha = [];
    let caracteresDisponiveis = '';
    let tiposObrigatorios = [];

    if (configs.maiusculas) { tiposObrigatorios.push(maiusculas); caracteresDisponiveis += maiusculas; }
    if (configs.minusculas) { tiposObrigatorios.push(minusculas); caracteresDisponiveis += minusculas; }
    if (configs.numeros) { tiposObrigatorios.push(numeros); caracteresDisponiveis += numeros; }
    if (configs.especiais) { tiposObrigatorios.push(especiais); caracteresDisponiveis += especiais; }

    tiposObrigatorios.forEach(tipo => senha.push(tipo[Math.floor(Math.random() * tipo.length)]));

    for (let i = senha.length; i < tamanho; i++) {
        senha.push(caracteresDisponiveis[Math.floor(Math.random() * caracteresDisponiveis.length)]);
    }

    return senha.sort(() => Math.random() - 0.5).join('');
}

// Função para senha baseada em referência
function gerarSenhaBaseadaReferencia(referencia, tamanho, configs) {
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const especiais = '!@#$%&*';
    let hash = Date.now();
    for (let i = 0; i < referencia.length; i++) {
        hash = ((hash << 5) - hash) + referencia.charCodeAt(i);
        hash &= hash;
    }

    let seed = Math.abs(hash);
    let senha = [];
    let caracteresDisponiveis = '';
    let tiposObrigatorios = [];

    if (configs.maiusculas) { tiposObrigatorios.push(maiusculas); caracteresDisponiveis += maiusculas; }
    if (configs.minusculas) { tiposObrigatorios.push(minusculas); caracteresDisponiveis += minusculas; }
    if (configs.numeros) { tiposObrigatorios.push(numeros); caracteresDisponiveis += numeros; }
    if (configs.especiais) { tiposObrigatorios.push(especiais); caracteresDisponiveis += especiais; }

    tiposObrigatorios.forEach(tipo => {
        seed = (seed * 9301 + 49297) % 233280;
        const indice = Math.floor((seed / 233280) * tipo.length);
        senha.push(tipo[indice]);
    });

    for (let i = senha.length; i < tamanho; i++) {
        seed = (seed * 9301 + 49297) % 233280;
        const indice = Math.floor((seed / 233280) * caracteresDisponiveis.length);
        senha.push(caracteresDisponiveis[indice]);
    }

    return senha.sort(() => Math.random() - 0.5).join('');
}

// Gera senha principal
function gerarSenha() {
    const tamanho = parseInt(document.getElementById('passwordLength').value);
    const configs = {
        maiusculas: document.getElementById('includeUppercase').checked,
        minusculas: document.getElementById('includeLowercase').checked,
        numeros: document.getElementById('includeNumbers').checked,
        especiais: document.getElementById('includeSpecial').checked
    };
    const referencia = document.getElementById('referenceInput').value.trim();

    if (!configs.maiusculas && !configs.minusculas && !configs.numeros && !configs.especiais) {
        return alert('⚠️ Selecione pelo menos um tipo de caractere!');
    }

    const tiposSelecionados = Object.values(configs).filter(Boolean).length;
    if (tamanho < tiposSelecionados) {
        return alert(`⚠️ A senha deve ter no mínimo ${tiposSelecionados} caracteres!`);
    }

    const senha = referencia
        ? gerarSenhaBaseadaReferencia(referencia, tamanho, configs)
        : gerarSenhaAleatoria(tamanho, configs);

    const display = document.getElementById('passwordDisplay');
    display.textContent = senha;
    display.classList.remove('empty');
    document.getElementById('copyBtn').disabled = false;
}

// Copiar senha
function copiarSenha() {
    const senha = document.getElementById('passwordDisplay').textContent;
    if (!senha || senha === 'Nenhuma senha gerada ainda') return;

    navigator.clipboard.writeText(senha).then(() => {
        const botao = document.getElementById('copyBtn');
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = '✓ Copiado!';
        botao.classList.add('copied');
        setTimeout(() => {
            botao.innerHTML = textoOriginal;
            botao.classList.remove('copied');
        }, 2000);
    }).catch(err => console.error('Erro ao copiar senha:', err));
}

// ===========================================
// 🔡 SENHA POR REFERÊNCIA + PREFIXO
// ===========================================
function gerarSenhaReferencia() {
    const referencia = document.getElementById('referenceInput').value.trim();
    const prefixoSelecionado = document.querySelector('input[name="prefixo"]:checked').value;
    const display = document.getElementById('passwordReferenceDisplay');

    if (!referencia) {
        display.textContent = 'Digite uma referência para gerar';
        display.classList.add('empty');
        document.getElementById('copyBtnReference').disabled = true;
        return;
    }

    const tamanhoSenha = 12;
    const maiusculas = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const minusculas = 'abcdefghijklmnopqrstuvwxyz';
    const numeros = '0123456789';
    const especiais = '@#$%&*!';
    let hash = Date.now();
    for (let i = 0; i < referencia.length; i++) {
        hash = ((hash << 5) - hash) + referencia.charCodeAt(i);
        hash &= hash;
    }

    let seed = Math.abs(hash);
    let senha = [];

    const todos = maiusculas + minusculas + numeros + especiais;
    [maiusculas, minusculas, numeros, especiais].forEach(tipo => {
        seed = (seed * 9301 + 49297) % 233280;
        senha.push(tipo[Math.floor((seed / 233280) * tipo.length)]);
    });

    for (let i = senha.length; i < tamanhoSenha; i++) {
        seed = (seed * 9301 + 49297) % 233280;
        senha.push(todos[Math.floor((seed / 233280) * todos.length)]);
    }

    const senhaFinal = prefixoSelecionado + senha.sort(() => Math.random() - 0.5).join('');
    display.textContent = senhaFinal;
    display.classList.remove('empty');
    document.getElementById('copyBtnReference').disabled = false;
}

// Copiar senha de referência
function copiarSenhaReferencia() {
    const senha = document.getElementById('passwordReferenceDisplay').textContent;
    if (senha === 'Digite uma referência para gerar') return;

    navigator.clipboard.writeText(senha).then(() => {
        const botao = document.getElementById('copyBtnReference');
        const textoOriginal = botao.innerHTML;
        botao.innerHTML = '✓ Copiado!';
        botao.classList.add('copied');
        setTimeout(() => {
            botao.innerHTML = textoOriginal;
            botao.classList.remove('copied');
        }, 2000);
    }).catch(err => alert('Erro ao copiar a senha.'));
}

// Eventos automáticos
document.querySelectorAll('input[name="prefixo"]').forEach(radio =>
    radio.addEventListener('change', gerarSenhaReferencia)
);

document.getElementById('referenceInput').addEventListener('keypress', e => {
    if (e.key === 'Enter') gerarSenhaReferencia();
});
