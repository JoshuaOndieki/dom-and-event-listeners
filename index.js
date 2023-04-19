const crypto = window.crypto || window.msCrypto;

// Use built-in crypto to generate a unique ID
function generateUUID() {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    const uuid = array.join('-');
    return uuid;
}

class DBLocalStorage {
    constructor() {
        console.log('in constructor');
        let todosData = JSON.parse(localStorage.getItem('todos'));

        if (todosData == null) {
            localStorage.setItem('todos', JSON.stringify({}));
        }
    }
  
    getData(key) {
        return JSON.parse(localStorage.getItem(key));
    }

    setData(key, data) {
        localStorage.setItem(key, JSON.stringify(data));
        return true
    }

    deleteData(key, ...keysTo) {
        /* first parameter key is the specific key that's to be deleted
        keysTo is one or multiple keys to reach key
        */
        let obj = this.getData(keysTo[0]);

        for (const key of keysTo.slice(1)) {
            obj = obj[key];
        }
        console.log(obj);

        delete obj[key];

        this.setData(keysTo[0], obj);

        appendTodos(this.getData(keysTo[0]))
        return true
    }
  }


let myDB = new DBLocalStorage();


// Creates and returns an ion-icon node
const createIonIcon = (iconDetails) => {
    const ionicon = document.createElement("ion-icon");

    try {
        Object.keys(iconDetails.attributes).forEach(attribute => {
            ionicon.setAttribute(attribute, iconDetails.attributes[attribute]);
        });
        Object.keys(iconDetails.styles).forEach(mystyle => {
            ionicon.style[mystyle] = iconDetails.styles[mystyle];
        });
    } catch (error) {
        
    }

    return ionicon;
}


function getTodoIndex(todoID) {
    let todosData = myDB.getData('todos');
    for (const index in todosData) {
        if (todosData[index].id == todoID) {
            return index
        }
    }
}

// on click events
// delete
function deleteOnClick(todoID) {
    myDB.deleteData(todoID, 'todos');
}

// un/mark as done
function checkmarkOnClick(todoID) {
    let todosData = myDB.getData('todos');

    todosData[todoID]['isComplete'] = todosData[todoID]['isComplete'] ? false : true;

    myDB.setData('todos', todosData);

    appendTodos(myDB.getData('todos'))
    return true
}

// Create and return a todo Node to be rendered
function createTodoNode(todoData) {
    const todoElement = document.createElement("li");
    todoElement.classList.add("todo");
    todoElement.id = todoData.id;

    const checkComplete = createIonIcon(
        {attributes: {
            name: "checkmark-done-sharp",
            size: "large",alt: "UN/MARK AS DONE"},
        styles: {cursor: "Pointer", color: "gray"}});

    if (todoData.isComplete) {
        checkComplete.style.color = "lime";
        todoElement.style.backgroundColor = "#9effa2";
    }

    checkComplete.addEventListener('click', ()=>checkmarkOnClick(todoData.id));

    const todoDescription = document.createElement("p");
    todoDescription.innerText = todoData.todoDescription;

    const deleteButton = createIonIcon(
        {attributes: {
            name: "remove-circle-outline",
            size: "large",alt: "DELETE"},
        styles: {color: "red",cursor: "Pointer"}});


    deleteButton.addEventListener("mouseover", function () {
        deleteButton.setAttribute("name", "remove-circle");
        deleteButton.style.filter = "drop-shadow(0 0 1rem red)"
    });

    deleteButton.addEventListener("mouseout", function () {
        deleteButton.setAttribute("name", "remove-circle-outline");
        deleteButton.style.filter = "";
    });

    deleteButton.addEventListener('click', ()=>deleteOnClick(todoData.id));

    todoElement.append(checkComplete, todoDescription, deleteButton);

    return todoElement
}


// Rerender todos on the webapp
function appendTodos(todosData) {
    todosElement = document.getElementById("todos");

    if (Object.keys(todosData).length) {
        todosElement.innerHTML = "";
        for (const key in todosData) {
            let todoData = {...{id: key}, ...todosData[key]};
            todosElement.appendChild(createTodoNode(todoData))
        }
    }
    else {
        todosElement.innerHTML = `<p id="no-tasks-text">Your tasks will appear here. Try adding one :)</p>`;
    }
}


function addTodo(todoDescription) {
    let todoID = generateUUID();
    let todoData = {
        todoDescription: todoDescription,
        isComplete: false
    }

    let todosData = myDB.getData('todos');
    todosData[todoID] = todoData;
    myDB.setData('todos', todosData)
}


appendTodos(myDB.getData('todos'));


const addFormElement = document.getElementById("add-form");

// When the add form is submitted, save the new task and rerender all tasks.
addFormElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const formTodoDescription = document.getElementById('form-todo-description');

    if (formTodoDescription.value.trim()) {
        addTodo(formTodoDescription.value);

        appendTodos(myDB.getData('todos'));

        formTodoDescription.value = "";
    }
})