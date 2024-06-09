document.getElementById('todo-form').addEventListener('submit', function (e) {
  e.preventDefault();
  const todoInput = document.getElementById('todo-input');
  const dateInput = document.getElementById('date-input');
  const todoText = todoInput.value.trim();
  const [day, month, year] = dateInput.value.split('/'); // Dividir a string da data em dia, mês e ano
  const todoDate = new Date(`${year}-${month}-${day}`); // Formatar a data como YYYY-MM-DD
  const formattedDate = todoDate.toLocaleDateString('pt-BR');


  if (todoText !== '' && formattedDate !== 'Invalid Date') {
    addTodoItem(todoText, formattedDate);
    todoInput.value = '';
    dateInput.value = '';
  }
});

function addTodoItem(todoText, todoDate, completed = false) {
  const todoList = document.getElementById('todo-list');
  const todoItem = document.createElement('li');
  todoItem.className = 'todo-item';
  todoItem.innerHTML = `
            <span class="todo-text">
                <input type="checkbox" class="complete-checkbox" ${completed ? 'checked' : ''}>
                <span class="text ${completed ? 'completed' : ''}">${todoText}</span>
                <span class="todo-date">${todoDate}</span>
            </span>
            <button class="edit-button">Editar</button>
            <button class="delete-button">Excluir</button>
        `;
  todoList.appendChild(todoItem);

  const completeCheckbox = todoItem.querySelector('.complete-checkbox');
  completeCheckbox.addEventListener('change', function () {
    const textElement = todoItem.querySelector('.text');
    if (completeCheckbox.checked) {
      textElement.classList.add('completed');
    } else {
      textElement.classList.remove('completed');
    }
    saveTodos();
  });

  const editButton = todoItem.querySelector('.edit-button');
  editButton.addEventListener('click', function () {
    const textElement = todoItem.querySelector('.text');
    const dateElement = todoItem.querySelector('.todo-date');
    const newText = prompt('Edite a tarefa:', textElement.textContent);
    const newDate = prompt('Edite a data:', dateElement.textContent);
    if (newText !== null && newText.trim() !== '') {
      textElement.textContent = newText.trim();
    }
    if (newDate !== null && newDate.trim() !== '') {
      dateElement.textContent = newDate.trim();
    }
    saveTodos();
  });

  const deleteButton = todoItem.querySelector('.delete-button');
  deleteButton.addEventListener('click', function () {
    todoItem.remove();
    saveTodos();
  });

  saveTodos();
}

function saveTodos() {
  const todos = [];
  document.querySelectorAll('.todo-item').forEach(todoItem => {
    const text = todoItem.querySelector('.text').textContent;
    const date = todoItem.querySelector('.todo-date').textContent;
    const completed = todoItem.querySelector('.complete-checkbox').checked;
    todos.push({ text, date, completed });
  });
  localStorage.setItem('todos', JSON.stringify(todos));
}

function loadTodos() {
  const todos = JSON.parse(localStorage.getItem('todos')) || [];
  todos.forEach(todo => {
    addTodoItem(todo.text, todo.date, todo.completed);
  });
}

loadTodos();

