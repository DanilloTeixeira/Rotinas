const random = (max) => {
  const values = new Uint32Array(1);
  crypto.getRandomValues(values);
  return values[0] % max;
};

const shuffle = (items) => {
  for (let index = items.length - 1; index > 0; index -= 1) {
    const otherIndex = random(index + 1);
    [items[index], items[otherIndex]] = [items[otherIndex], items[index]];
  }
  return items;
};

const copyText = async (value) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textArea = document.createElement('textarea');
  textArea.value = value;
  document.body.append(textArea);
  textArea.select();
  document.execCommand('copy');
  textArea.remove();
};

const setDisplay = (display, button, password) => {
  display.textContent = password;
  display.classList.remove('empty');
  button.disabled = false;
};

const copyPassword = async (display, button) => {
  if (display.classList.contains('empty')) return;
  const originalText = button.textContent;

  try {
    await copyText(display.textContent);
    button.textContent = 'Copiado!';
  } catch {
    button.textContent = 'Não foi possível copiar';
  }

  setTimeout(() => { button.textContent = originalText; }, 1800);
};

document.addEventListener('DOMContentLoaded', () => {
  const elements = {
    length: document.querySelector('#passwordLength'),
    lengthValue: document.querySelector('#lengthValue'),
    uppercase: document.querySelector('#includeUppercase'),
    lowercase: document.querySelector('#includeLowercase'),
    numbers: document.querySelector('#includeNumbers'),
    special: document.querySelector('#includeSpecial'),
    display: document.querySelector('#passwordDisplay'),
    copy: document.querySelector('#copyBtn'),
    reference: document.querySelector('#referenceInput'),
    referenceDisplay: document.querySelector('#passwordReferenceDisplay'),
    referenceCopy: document.querySelector('#copyBtnReference'),
  };

  const updateLength = () => { elements.lengthValue.textContent = elements.length.value; };

  const generateRandomPassword = () => {
    const options = [
      [elements.uppercase.checked, 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'],
      [elements.lowercase.checked, 'abcdefghijklmnopqrstuvwxyz'],
      [elements.numbers.checked, '0123456789'],
      [elements.special.checked, '!@#$%&*'],
    ].filter(([enabled]) => enabled).map(([, characters]) => characters);

    if (!options.length) {
      alert('Selecione pelo menos um tipo de caractere.');
      return;
    }

    const length = Number(elements.length.value);
    const password = options.map((characters) => characters[random(characters.length)]);
    const allCharacters = options.join('');
    while (password.length < length) password.push(allCharacters[random(allCharacters.length)]);

    setDisplay(elements.display, elements.copy, shuffle(password).join(''));
  };

  const generateReferencePassword = () => {
    const reference = elements.reference.value.trim();
    if (!reference) {
      elements.referenceDisplay.textContent = 'Digite uma referência para gerar';
      elements.referenceDisplay.classList.add('empty');
      elements.referenceCopy.disabled = true;
      return;
    }

    const prefix = document.querySelector('input[name="prefixo"]:checked').value;
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    const suffix = Array.from({ length: 12 }, () => characters[random(characters.length)]).join('');
    setDisplay(elements.referenceDisplay, elements.referenceCopy, `${prefix}_${reference}_${suffix}`);
  };

  elements.length.addEventListener('input', updateLength);
  document.querySelector('#generateBtn').addEventListener('click', generateRandomPassword);
  elements.copy.addEventListener('click', () => copyPassword(elements.display, elements.copy));
  document.querySelector('#generateReferenceBtn').addEventListener('click', generateReferencePassword);
  elements.referenceCopy.addEventListener('click', () => copyPassword(elements.referenceDisplay, elements.referenceCopy));
  elements.reference.addEventListener('input', generateReferencePassword);
  document.querySelectorAll('input[name="prefixo"]').forEach((radio) => radio.addEventListener('change', generateReferencePassword));
  updateLength();
});
