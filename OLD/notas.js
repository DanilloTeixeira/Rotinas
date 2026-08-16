// script.js - Gerencia notas (criar, editar título, editar conteúdo, copiar, excluir, status, search, persistência)

const notesContainer = document.getElementById('notesContainer');
const addNoteBtn = document.getElementById('addNoteBtn');
const searchInput = document.getElementById('searchInput');

const STORAGE_KEY = 'notas_grc_v2';

// carregar notas do localStorage
let notes = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');

// cria nota padrão (texto do seu exemplo)
function makeDefaultContent() {
  return `Hola, espero que te encuentres bien.

El acceso ha sido habilitado.

Por favor, realiza una prueba para confirmar si el acceso está funcionando correctamente.

En caso de encontrar algún error de autorización, es fundamental que reabras este ticket, adjuntando la captura de pantalla del error SU53. (Procedimiento: Cuando ocurra el error de falta de autorización, simplemente escribe /nsu53 en la misma pantalla).`;
}

// cores por status
function statusColor(status) {
  switch ((status || '').toUpperCase()) {
    case 'DELIVERED': return '#2ecc71';
    case 'ON HOLD': return '#f1c40f';
    case 'PENDING': return '#f39c12';
    case 'CANCEL': return '#e74c3c';
    case 'OBSERVAÇÃO': return '#8e44ad';
    case 'WOR IN PROGRESS': return '#0059ffff';
    default: return '#2ecc71';
  }
}

// salvar no storage
function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

// gerar id simples
function newId(){ return Date.now() + Math.floor(Math.random()*1000); }

// escape simples para inserir no input/textarea
function escapeHtml(str=''){
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');
}

// encontra nota por id
function findNote(id){ return notes.find(n=>String(n.id) === String(id)); }
function indexOfNote(id){ return notes.findIndex(n=>String(n.id) === String(id)); }

// renderiza todas as notas (com filtro opcional)
function render(filter = '') {
  notesContainer.innerHTML = '';
  const f = filter.trim().toLowerCase();

  const filtered = notes.filter(n => {
    if (!f) return true;
    return (n.title||'').toLowerCase().includes(f) ||
           (n.content||'').toLowerCase().includes(f) ||
           (n.status||'').toLowerCase().includes(f);
  });

  if (filtered.length === 0) {
    notesContainer.innerHTML = `<div class="no-notes">Nenhuma nota. Clique em "Adicionar Nota" para criar uma.</div>`;
    return;
  }

  for (const note of filtered) {
    const card = document.createElement('div');
    card.className = 'note-card';
    card.dataset.id = note.id;

    card.innerHTML = `
      <div class="note-top">
        <div class="note-status" style="background:${statusColor(note.status)}">
          <select class="status-select" data-action="change-status">
            <option value="DELIVERED">DELIVERED</option>
            <option value="ON HOLD">ON HOLD</option>
            <option value="PENDING">PENDING</option>
            <option value="CANCEL">CANCEL</option>
            <option value="OBSERVAÇÃO">OBSERVAÇÃO</option>
            
          </select>
        </div>
        <div class="note-title-row">
          <input class="title-input" data-action="title-input" value="${escapeHtml(note.title)}" readonly />
          <button data-action="edit-title-btn">Editar</button>
          <button data-action="save-title-btn" style="display:none">Salvar</button>
        </div>
      </div>

      <div class="note-body">
        ${ note.editing
            ? `<textarea class="edit-area" data-action="edit-area">${escapeHtml(note.content)}</textarea>`
            : `<div class="display-text" data-action="display-text">${escapeHtml(note.content)}</div>`
        }
      </div>

      <div class="note-footer">
        <button data-action="copy" class="primary">Copiar</button>
        <button data-action="toggle-edit">${note.editing ? 'Salvar' : 'Editar'}</button>
        <button data-action="delete" class="danger">Excluir</button>
      </div>
    `;

    // ajustar select para seleção atual
    const select = card.querySelector('.status-select');
    if (select) select.value = note.status || 'DELIVERED';

    notesContainer.appendChild(card);
  }
}

// adicionar nova nota
function addNote() {
  const id = newId();
  const newNote = {
    id,
    title: 'GRC finalizada - LAS',
    content: makeDefaultContent(),
    status: 'DELIVERED',
    editing: false
  };
  notes.unshift(newNote);
  save();
  render(searchInput.value);
}

// --- DELEÇÃO ROBUSTA: listener específico para o botão excluir ---
// Usamos delegação mas com busca direta do elemento que tenha data-action="delete".
// Isso evita problemas quando o clique vem de um <span> ou ícone dentro do botão.
notesContainer.addEventListener('click', async (ev) => {
  const deleteBtn = ev.target.closest('[data-action="delete"]');
  if (deleteBtn) {
    const card = deleteBtn.closest('.note-card');
    if (!card) return;
    const id = card.dataset.id;
    if (!id) return;

    // confirmação
    const ok = confirm('Deseja realmente excluir esta nota?');
    if (!ok) return;

    const idx = indexOfNote(id);
    if (idx === -1) {
      // não encontrou — log para debug
      console.warn('Excluir: nota não encontrada com id=', id);
      return;
    }

    notes.splice(idx, 1);
    save();
    render(searchInput.value);
    return;
  }

  // Caso não seja delete, delegamos as outras ações (copiar, editar, salvar título, toggle-edit)
  const btn = ev.target.closest('button');
  if (!btn) return;
  const action = btn.dataset.action;
  const card = btn.closest('.note-card');
  if (!action || !card) return;
  const id = card.dataset.id;

  // COPIAR
  if (action === 'copy') {
    const n = findNote(id);
    if (!n) return;
    try {
      await navigator.clipboard.writeText(n.content);
      alert('Conteúdo copiado!');
    } catch (e) {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = n.content;
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        alert('Conteúdo copiado (fallback)!');
      } catch {
        alert('Não foi possível copiar (bloqueado pelo navegador).');
      }
      document.body.removeChild(ta);
    }
    return;
  }

  // TOGGLE EDIT (Salvar / Entrar em edição)
  if (action === 'toggle-edit') {
    const idx = indexOfNote(id);
    if (idx === -1) return;
    if (notes[idx].editing) {
      // se estava editando, salvar valor do textarea
      const ta = card.querySelector('.edit-area');
      if (ta) notes[idx].content = ta.value;
      notes[idx].editing = false;
      save();
      render(searchInput.value);
    } else {
      notes[idx].editing = true;
      save();
      render(searchInput.value);
      setTimeout(()=>{
        const newCard = document.querySelector(`.note-card[data-id="${id}"]`);
        if (newCard) {
          const ta = newCard.querySelector('.edit-area');
          if (ta) ta.focus();
        }
      },50);
    }
    return;
  }

  // EDIT TITLE / SAVE TITLE
  if (action === 'edit-title-btn') {
    const input = card.querySelector('input.title-input');
    const editBtn = card.querySelector('button[data-action="edit-title-btn"]');
    const saveBtn = card.querySelector('button[data-action="save-title-btn"]');
    if (input && editBtn && saveBtn) {
      input.readOnly = false;
      input.focus();
      editBtn.style.display = 'none';
      saveBtn.style.display = 'inline-block';
    }
    return;
  }

  if (action === 'save-title-btn') {
    const input = card.querySelector('input.title-input');
    if (!input) return;
    const val = input.value.trim() || 'Sem título';
    const idx = indexOfNote(id);
    if (idx > -1) {
      notes[idx].title = val;
      save();
      render(searchInput.value);
    }
    return;
  }
});

// delegar alterações (select status, textarea input) usando event delegation
notesContainer.addEventListener('change', (ev) => {
  const select = ev.target.closest('.status-select');
  if (select) {
    const card = select.closest('.note-card');
    const id = card.dataset.id;
    const idx = indexOfNote(id);
    if (idx > -1) {
      notes[idx].status = select.value;
      save();
      render(searchInput.value);
    }
  }
});

// input while editing (atualiza temporariamente o objeto)
notesContainer.addEventListener('input', (ev) => {
  const ta = ev.target.closest('.edit-area');
  if (!ta) return;
  const card = ta.closest('.note-card');
  const id = card.dataset.id;
  const idx = indexOfNote(id);
  if (idx > -1) {
    notes[idx].content = ta.value;
    // não salvamos a cada tecla para evitar writes constantes
  }
});

// busca
searchInput.addEventListener('input', (e) => {
  render(e.target.value);
});

// adicionar nota
addNoteBtn.addEventListener('click', addNote);

// inicializar (se não houver notas, criar uma de exemplo)
if (notes.length === 0) {
  notes.push({
    id: newId(),
    title: 'GRC finalizada - LAS',
    content: makeDefaultContent(),
    status: 'DELIVERED',
    editing: false
  });
  save();
}


// render inicial
render();

