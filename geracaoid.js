// ===========================================
// 🆔 GERAR ID BASEADO EM NOME
// ===========================================
function gerarID() {
  const nomeCompleto = document.getElementById('nomeCompleto').value.trim().toUpperCase();

  // Se o campo estiver vazio
  if (!nomeCompleto) {
    document.getElementById('idPrincipal').textContent = '--------';
    document.getElementById('idPrefixo').textContent = 'C_--------';
    return;
  }

  // Limpar caracteres especiais e múltiplos espaços
  const nomeClean = nomeCompleto.replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ');
  const partes = nomeClean.split(' ');

  if (partes.length === 0 || partes[0] === '') {
    document.getElementById('idPrincipal').textContent = '--------';
    document.getElementById('idPrefixo').textContent = 'C_--------';
    return;
  }

  const nome = partes[0];
  const sobrenome = partes.length > 1 ? partes[partes.length - 1] : '';
  let id = '';

  // Regra principal: 6 letras do sobrenome + 2 do nome
  if (sobrenome.length >= 6) {
    id = sobrenome.substring(0, 6) + nome.substring(0, 2);
  } else {
    id = sobrenome;
    const restante = 8 - sobrenome.length;
    id += nome.substring(0, restante);
  }

  id = id.substring(0, 8).padEnd(8, '0');

  document.getElementById('idPrincipal').textContent = id;
  document.getElementById('idPrefixo').textContent = 'C_' + id;
}

// ===========================================
// 📋 COPIAR TEXTO
// ===========================================
function copiarTexto(elementId) {
  const texto = document.getElementById(elementId).textContent;
  navigator.clipboard.writeText(texto).then(() => {
    alert(`✅ Copiado: ${texto}`);
  });
}
