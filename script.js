const taskSub = document.getElementById('newTask');
const taskInput = document.getElementById('newInput');
let todos = JSON.parse(localStorage.getItem('todo-list')) || [];
const taskBox = document.querySelector('.task-box');
const filters = document.querySelectorAll(".filter span");
const clearTask = document.querySelector(".clear-btn");
const numberDisplay = document.getElementById("number");
const progressBar = document.getElementById("prograss");

let editId;
let isEditTask = false;

filters.forEach(btn => {
    btn.addEventListener("click", () => {
        document.querySelector("span.active").classList.remove("active");
        btn.classList.add("active");
        showtodo(btn.id);
    });
});

function showtodo(filter) {
    let li = "";
    todos.forEach((todo, id) => {
        let isCompleted = todo.status === "completed" ? "checked" : "";
        if (filter === todo.status || filter === "all") {
            li += `<li class="task">
                <label for="task-${id}">
                    <input type="checkbox" id="${id}" onclick="updateStatus(this)" ${isCompleted}>
                    <p class="${isCompleted}">${todo.name}</p>
                </label>
                <div class="setting">
                    <i onclick="showMenu(this)" class="fa-solid fa-ellipsis"></i>
                    <ul class="task-menu">
                        <li onclick="editTask(${id}, '${todo.name}')"><i class="fa-solid fa-pen"></i>Edit</li>
                        <li onclick="deleteTask(${id})"><i class="fa-solid fa-trash-can"></i>Delete</li>
                    </ul>
                </div>
            </li>`;
        }
    });
    taskBox.innerHTML = li || "<p class='empty'>No tasks available</p>";
    updateStats();
}

function updateStats() {
    const completedTasks = todos.filter(todo => todo.status === "completed").length;
    numberDisplay.textContent = `${completedTasks} / ${todos.length}`;
    progressBar.style.width = todos.length ? `${(completedTasks / todos.length) * 100}%` : '0%';

    if (completedTasks === todos.length && todos.length > 0) {
        blaskconfetti();
    }
}

showtodo("all");

function showMenu(selectTask) {
    const taskMenu = selectTask.parentElement.lastElementChild;
    taskMenu.classList.toggle("show");
    document.addEventListener("click", (e) => {
        if (e.target !== selectTask && !selectTask.contains(e.target)) {
            taskMenu.classList.remove("show");
        }
    }, { once: true });
}

function editTask(taskId, taskName) {
    editId = taskId;
    isEditTask = true;
    taskInput.value = taskName;
    taskInput.focus();
}

function deleteTask(deleteId) {
    todos.splice(deleteId, 1);
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showtodo("all");
}

clearTask.addEventListener("click", () => {
    todos = [];
    localStorage.setItem("todo-list", JSON.stringify(todos));
    showtodo("all");
});

function updateStatus(selectTask) {
    const taskName = selectTask.parentElement.lastElementChild;
    if (selectTask.checked) {
        taskName.classList.add("checked");
        todos[selectTask.id].status = "completed";
    } else {
        taskName.classList.remove("checked");
        todos[selectTask.id].status = "pending";
    }
    localStorage.setItem("todo-list", JSON.stringify(todos));
    updateStats();
}

taskSub.addEventListener("click", function (e) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
        if (!isEditTask) {
            let taskInfo = { name: text, status: "pending" };
            todos.push(taskInfo);
        } else {
            isEditTask = false;
            todos[editId].name = text;
        }
        taskInput.value = "";
        localStorage.setItem("todo-list", JSON.stringify(todos));
        showtodo("all");
    }
});

const blaskconfetti = () =>{
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
}