const formAddTodo = document.querySelector('.form-add-todo')
const todosContainer = document.querySelector('.todos-container')
const inputSearchTodo = document.querySelector('.form-search input')

const paragraph = document.createElement('p')

const removeTodo = event => {
  const clickedElement = event.target
  const trashDataValue = clickedElement.dataset.trash
  const todo = document.querySelector(`[data-todo="${trashDataValue}"]`)

  if(trashDataValue){
    todo.remove()
    changeListColors()
  }
}

const addTodo = event => {
  event.preventDefault()
  const inputValue = event.target.add.value.trim()

  const todoExist = [...todosContainer.children].some(({ outerText }) => outerText === inputValue)
  
  const todoTemplate = `
    <li class="list-group-item d-flex justify-content-between align-items-center" data-todo="${inputValue}">
      <span>${inputValue}</span>
      <i class="far fa-trash-alt" data-trash="${inputValue}"></i>
    </li>`

  if(inputValue.length) {
    !todoExist ? todosContainer.innerHTML += todoTemplate : createAlertMessage(inputValue) 
    event.target.reset()
  }

  changeListColors()
}

const searchTodo = event => {
  const inputValue = event.target.value.trim().toLowerCase()
  const todos = Array.from(todosContainer.children)

  hideTodos(todos, inputValue)
  showTodos(todos, inputValue)
}

const filterTodos = (todos, inputValue, returnMatchedTodos) => todos
  .filter(todo => {
    const matchedTodos = todo.textContent.toLowerCase().includes(inputValue)
    return returnMatchedTodos ? matchedTodos : !matchedTodos
  })

const manipulateClasses = (todos, classToAdd, classToRemove) => {
  todos.forEach(todo => {
    todo.classList.remove(classToRemove)
    todo.classList.add(classToAdd)
  })
}

const hideTodos = (todos, inputValue) => {
  const todoToHide = filterTodos(todos, inputValue, false)
  manipulateClasses(todoToHide, 'd-none', 'd-flex')
}

const showTodos = (todos, inputValue) => {
  const todoToShow = filterTodos(todos, inputValue, true)
  manipulateClasses(todoToShow, 'd-flex', 'd-none')
  createMessageTodoNotFound(todoToShow)
}

const createMessageTodoNotFound = ({ length: quantityOfTodos }) => {
  const messageTodoNotExist = 'Não existe nenhum To-do na lista com essa palavra'
  const liTodo = document.querySelectorAll(`[data-todo="${messageTodoNotExist}"]`)
  
  if(!quantityOfTodos){
    todosContainer.innerHTML += `
      <li class="list-group-item d-flex justify-content-between align-items-center todo-odd" data-todo="${messageTodoNotExist}">
        <span>${messageTodoNotExist}</span>
      </li>`
  } 
  if(quantityOfTodos && liTodo){
    liTodo.forEach( li => li.remove())
  }
}

const createAlertMessage = (todo) => {
  const label = document.querySelector('.msg-error')
  label.insertAdjacentElement('afterend',paragraph )
  
  paragraph.innerHTML= `
    <strong>${todo}</strong> - já existe na lista 
    <button type="button" class="close" >
      <span aria-hidden="true">&times;</span>
    </button>
  `
  paragraph.classList.add('alert', 'alert-primary')
  paragraph.classList.remove('d-none')
  paragraph.setAttribute('role', 'alert')
 
  formAddTodo.addEventListener('click', () => {
    paragraph.classList.add('d-none')
  })
}

const changeListColors = () => {
  const listTodos = [...todosContainer.children]
  listTodos.forEach((todo, index) => {
    const isPair = index % 2 === 0
    if(isPair) {
      todo.classList.add('todo-pair')
      todo.classList.remove('todo-odd')
    } else {
      todo.classList.add('todo-odd')
      todo.classList.remove('todo-pair')
    }
  })
}

formAddTodo.addEventListener('submit', addTodo)
todosContainer.addEventListener('click', removeTodo)
inputSearchTodo.addEventListener('input', searchTodo)