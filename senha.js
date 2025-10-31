// ===========================================
// 🔐 GERADOR DE SENHAS
// ===========================================
function atualizarTamanho() {
  const valor = document.getElementById('passwordLength').value;
  document.getElementById('lengthValue').textContent = valor;
}

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

  // Garante pelo menos 1 caractere de cada tipo
  tiposObrigatorios.forEach(tipo => senha.push(tipo[Math.floor(Math.random() * tipo.length)]));

  for (let i = senha.length; i < tamanho; i++) {
    senha.push(caracteresDisponiveis[Math.floor(Math.random() * caracteresDisponiveis.length)]);
  }

  return senha.sort(() => Math.random() - 0.5).join('');
}

function gerarSenha() {
  const tamanho = parseInt(document.getElementById('passwordLength').value);
  const configs = {
    maiusculas: document.getElementById('includeUppercase').checked,
    minusculas: document.getElementById('includeLowercase').checked,
    numeros: document.getElementById('includeNumbers').checked,
    especiais: document.getElementById('includeSpecial').checked
  };

  if (!configs.maiusculas && !configs.minusculas && !configs.numeros && !configs.especiais) {
    return alert('⚠️ Selecione pelo menos um tipo de caractere!');
  }

  const tiposSelecionados = Object.values(configs).filter(Boolean).length;
  if (tamanho < tiposSelecionados) {
    return alert(`⚠️ A senha deve ter no mínimo ${tiposSelecionados} caracteres!`);
  }

  const senha = gerarSenhaAleatoria(tamanho, configs);

  const display = document.getElementById('passwordDisplay');
  display.textContent = senha;
  display.classList.remove('empty');
  document.getElementById('copyBtn').disabled = false;
}

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
  }).catch(() => alert('Erro ao copiar a senha.'));
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

  const todos = maiusculas + minusculas + numeros + especiais;
  let senha = [];

  for (let i = 0; i < tamanhoSenha; i++) {
    senha.push(todos[Math.floor(Math.random() * todos.length)]);
  }

  const senhaFinal = prefixoSelecionado + senha.sort(() => Math.random() - 0.5).join('');
  display.textContent = senhaFinal;
  document.getElementById('copyBtnReference').disabled = false;
}

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
  }).catch(() => alert('Erro ao copiar a senha.'));
}

// Eventos automáticos
document.querySelectorAll('input[name="prefixo"]').forEach(radio =>
  radio.addEventListener('change', gerarSenhaReferencia)
);
