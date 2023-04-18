const todos = [
      { id: 1, title: "wash dishes", is_complete: false },
      { id: 2, title: "wash clothes", is_complete: false },
      { id: 3, title: "cook lunch", is_complete: false }]


const todos_container = document.querySelector(".todos");


// creating a single todo
const createTodo = (todo) => {
      //creating a div
      const todo_container = document.createElement("div");
      //adding a class to the new dic
      todo_container.classList.add("todo");

      const todo_span = document.createElement("span");
      todo_span.innerText = todo.title;

      const check_complete = document.createElement("input");
      //setting attributes
      check_complete.setAttribute("type", "checkbox");

      const delete_btn = document.createElement("button");
      delete_btn.id = todo.id;
      delete_btn.innerHTML = '<i class="fas fa-trash-alt"></i>'
      //appending all elements to a todo container
      todo_container.append(todo_span, check_complete, delete_btn)

      return todo_container
}

// function to append all todos
const appendTodos = (todos) => {
      todos.map((todo) => {
            todos_container.appendChild(createTodo(todo))
      })
}

//initial load of all the todos
appendTodos(todos)


const submit_btn = document.getElementById("btn");
const input_ele = document.getElementById("todo-input")


//submit new todo handler
const handleSubmit = () => {

      if (input_ele.value.trim() !== "") {
            const new_todo = { id: new Date().toISOString(), title: input_ele.value, is_complete: false }
            //adding the todo as the first element
            todos.unshift(new_todo)
            todos_container.innerHTML = ""
            input_ele.value = ""

            //updating the ui to include  the new todo
            appendTodos(todos)
      }
}


//listening for a click event from the button submit
submit_btn.addEventListener("click", handleSubmit)




//deleting a todo   -- the best way is to delete it from the array and then update the ui/document
todos_container.addEventListener("click", function (e) {
      const item = e.target;

      if (item.matches("span")) {
            todos_container.removeChild(item.parentNode)
      }
})







// const delete_todo = new CustomEvent("delete_todo", {detail:{message: "You are about to delete an item!"}})

// const delete_btn = document.getElementById(1);

// delete_btn.addEventListener("click", ()=>{
//       delete_btn.dispatchEvent(delete_todo)
// })


// delete_btn.addEventListener("delete_todo", (e)=>{alert(e.detail.message)})


// const body = document.querySelector("body");

// body.addEventListener("click", function propagation(e){
//       console.log("detected at body level")
// })


// const list_item = document.querySelector("li");

// list_item.addEventListener("click", function itemdetect(e){
//       e.stopPropagation()
//       console.log(e)
// })


