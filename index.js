const crypto = window.crypto || window.msCrypto;

// Use built-in crypto to generate a unique ID
function generateUUID() {
    const array = new Uint32Array(4);
    crypto.getRandomValues(array);
    const uuid = array.join('-');
    return uuid;
}

// Our data
const todosData = [
    { id: 1, description: "wash dishes", is_complete: false },
    { id: 2, description: "wash clothes", is_complete: true },
    { id: 3, description: "cook lunch", is_complete: false }
]


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
    for (const index in todosData) {
        if (todosData[index].id == todoID) {
            return index
        }
    }
}

// on click events
// delete
function deleteOnClick(todoID) {
    const index = getTodoIndex(todoID);
    if (index) {
        todosData.splice(index,1);
        appendTodos(todosData);
        return true
    }
}

// un/mark as done
function checkmarkOnClick(todoID) {
    const index = getTodoIndex(todoID);
    if (index) {
        // console.log(todosData[index]["is_complete"]);
        todosData[index]["is_complete"] = todosData[index]["is_complete"] ? false : true;
        appendTodos(todosData);
        return true
    }
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

    if (todoData.is_complete) {
        checkComplete.style.color = "lime";
        todoElement.style.backgroundColor = "azure";
    }

    checkComplete.addEventListener('click', ()=>checkmarkOnClick(todoData.id));

    const todoDescription = document.createElement("p");
    todoDescription.innerText = todoData.description;

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
    todosElement.innerHTML = "";

    if (todosData.length) {
        todosData.map((todoData) => {
            todosElement.appendChild(createTodoNode(todoData))
        })
    }
    else {
        todosElement.innerHTML = `<p id="no-tasks-text">Your tasks will appear here. Try adding one :)</p>`;
    }
}


// Add todo to the todosData array
function addTodo(todoDescription) {
    todosData.unshift({
        id: generateUUID(),
        description: todoDescription,
        is_complete: false
    })
}

appendTodos(todosData);



const addFormElement = document.getElementById("add-form");

// When the add form is submitted, save the new task and rerender all tasks.
addFormElement.addEventListener('submit', (event) => {
    event.preventDefault();

    const formTodoDescription = document.getElementById('form-todo-description');

    if (formTodoDescription.value.trim()) {
        addTodo(formTodoDescription.value);

        appendTodos(todosData);

        formTodoDescription.value = "";
    }
})