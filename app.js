const cl = console.log;

const todoForm = document.getElementById('todoForm');
const todoItemControl = document.getElementById('todoItem');
const todoList = document.getElementById('todoList');
const addTodo = document.getElementById('addTodo');
const updateTodo = document.getElementById('updateTodo');


let todoArr = [];

if(localStorage.getItem('todoArr')){
    todoArr = JSON.parse(localStorage.getItem('todoArr'))
}

const generateUuid = () => {
    return (
      String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
   });
};

const onEditBtn = (ele) => {
    let editId = ele.closest('li').id;
    cl(editId);
    localStorage.setItem('editId', editId);

    let editObj = todoArr.find(todo => todo.todoId === editId);
    cl(editObj);

    todoItemControl.value = editObj.todoItem;

    localStorage.setItem('todoArr', JSON.stringify(todoArr));

    addTodo.classList.add('d-none');
    updateTodo.classList.remove('d-none');
}

const onRemoveBtn = (ele) => {
    let getConfirm = confirm(`Are you sure to remove this Todo`);
    cl(getConfirm);

    if(getConfirm){
        let removeId = ele.closest('li').id;

        let getIndex = todoArr.findIndex(todo => todo.todoId === removeId);
        todoArr.splice(getIndex, 1);

        localStorage.setItem('todoArr', JSON.stringify(todoArr));

        ele.closest('li').remove();
    }
}

const createli = (arr) => {
    let result = '';
    arr.forEach(ele => {
        result += `
                    <li id=${ele.todoId} class="list-group-item d-flex justify-content-between">
                        <strong>${ele.todoItem}</strong>
                        <div>
                            <button class="btn btn-sm btn-outline-info" onclick='onEditBtn(this)'>Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick='onRemoveBtn(this)'>Remove</button>
                        </div>
                    </li>
                    `
            todoList.innerHTML = result;

    })
}
createli(todoArr);

const onAddTodo = (eve) => {
    eve.preventDefault();
    let todoObj = {
        todoItem : todoItemControl.value,
        todoId : generateUuid(),
    }
    todoForm.reset();

    todoArr.unshift(todoObj);
    localStorage.setItem('todoArr', JSON.stringify(todoArr));

    let li = document.createElement('li');
    li.id = todoObj.todoId;
    li.className = "list-group-item d-flex justify-content-between";
    li.innerHTML = `<strong>${todoObj.todoItem}</strong>
                        <div>
                            <button class="btn btn-sm btn-outline-info" onclick='onEditBtn(this)'>Edit</button>
                            <button class="btn btn-sm btn-outline-danger" onclick='onRemoveBtn(this)'>Remove</button>
                        </div>`

    todoList.prepend(li);
    // onStactCaller(`New todo added successfully!!!`, `success`);
}

const onUpdateTodo = () => {
    let updateId = localStorage.getItem('editId');
    let updateObj = {
        todoItem : todoItemControl.value,
        todoId : updateId,
    }
    let getIndex = todoArr.findIndex(todo => todo.todoId === updateId);
    cl(getIndex);
    todoArr[getIndex] = updateObj;

    localStorage.setItem('todoArr', JSON.stringify(todoArr));
    todoForm.reset();

    addTodo.classList.remove('d-none');
    updateTodo.classList.add('d-none');

    let li = document.getElementById(updateId);
    li.firstElementChild.innerHTML = updateObj.todoItem;
}

todoForm.addEventListener('submit', onAddTodo);
updateTodo.addEventListener('click', onUpdateTodo);