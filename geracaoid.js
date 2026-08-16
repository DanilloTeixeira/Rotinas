const resetIds = () => {
  document.querySelector('#idPrincipal').textContent = '--------';
  document.querySelector('#idPrefixo').textContent = 'C_--------';
};

// Mantém a regra original: 6 letras do sobrenome + 2 letras do nome.
const gerarID = () => {
  const input = document.querySelector('#nomeCompleto');
  const name = input.value.trim().toUpperCase();

  if (!name) {
    resetIds();
    return;
  }

  const cleanName = name.replace(/[^A-Z\s]/g, '').replace(/\s+/g, ' ').trim();
  const parts = cleanName.split(' ');

  if (!cleanName || !parts[0]) {
    resetIds();
    return;
  }

  const firstName = parts[0];
  const lastName = parts.length > 1 ? parts[parts.length - 1] : '';
  let id;

  if (lastName.length >= 6) {
    id = lastName.substring(0, 6) + firstName.substring(0, 2);
  } else {
    id = lastName + firstName.substring(0, 8 - lastName.length);
  }

  id = id.substring(0, 8).padEnd(8, '0');
  document.querySelector('#idPrincipal').textContent = id;
  document.querySelector('#idPrefixo').textContent = `C_${id}`;
};

const copyId = async (targetId, button) => {
  const value = document.querySelector(`#${targetId}`).textContent;
  const originalText = button.textContent;

  try {
    await navigator.clipboard.writeText(value);
    button.textContent = 'Copiado!';
  } catch {
    button.textContent = 'Erro ao copiar';
  }

  setTimeout(() => { button.textContent = originalText; }, 1800);
};

document.addEventListener('DOMContentLoaded', () => {
  document.querySelector('#nomeCompleto').addEventListener('input', gerarID);
  document.querySelectorAll('[data-copy-target]').forEach((button) => {
    button.addEventListener('click', () => copyId(button.dataset.copyTarget, button));
  });
});
