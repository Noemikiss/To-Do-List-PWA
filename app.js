console.log("JS is running!");

let lists = {
    "Default": []
};

let currentList = "Default";

const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const addTaskButton = document.getElementById("addTask");
addTaskButton.addEventListener("click", addTask);

// add task function
function addTask() {
    let task = taskInput.value;
    if (task !== "") {
        lists[currentList].push({
            text: task,
            completed: false
        });
        taskInput.value = "";
        saveData();
        showTasks();
    }
}

// add task with enter
taskInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// show tasks
function showTasks() {
    taskList.innerHTML = "";
    currentListTitle.textContent = currentList;

    let currentTasks = lists[currentList];

    for (let i = 0; i < currentTasks.length; i++) {

        let item = document.createElement("li");

        let text = document.createElement("span");
        text.textContent = currentTasks[i].text;
        text.className = "task-text";

        let completeBtn = document.createElement("button");
        completeBtn.innerHTML = "&#10003;";
        completeBtn.className = "complete-btn";

        let deleteBtn = document.createElement("button");
        deleteBtn.innerHTML = "&#10007";
        deleteBtn.className = "delete-btn";

        let editBtn = document.createElement("button");
        editBtn.innerHTML = "&#9998;";
        editBtn.className = "edit-btn";

        // COMPLETE
        completeBtn.addEventListener("click", function() {
            currentTasks[i].completed = !currentTasks[i].completed;
            saveData();
            showTasks();
        });

        // DELETE
        deleteBtn.addEventListener("click", function() {
            currentTasks.splice(i, 1);
            saveData();
            showTasks();
        });

        // EDIT
        editBtn.addEventListener("click", function() {
            openModal("Edit task", currentTasks[i].text).then((newText) => {
                if (newText !== null && newText.trim() !== "") {
                    currentTasks[i].text = newText.trim();
                    saveData();
                    showTasks();
                }
            });
        });

        // COMPLETED STYLE
        if (currentTasks[i].completed) {
            item.classList.add("completed");
        }

        // ACTION BUTTONS WRAPPER
        let actions = document.createElement("div");
        actions.className = "actions";

        actions.appendChild(editBtn);
        actions.appendChild(completeBtn);
        actions.appendChild(deleteBtn);

        item.appendChild(text);
        item.appendChild(actions);

        taskList.appendChild(item);
    }
} // ✅ THIS WAS MISSING BEFORE

// ADD LIST
const addListButton = document.getElementById("addList");

addListButton.addEventListener("click", function() {
    openModal("Enter list name").then((listName) => {
        if (listName !== null && listName.trim() !== "") {
            lists[listName] = [];
            currentList = listName;
            updateDropdown();
            saveData();
            showTasks();
        }
    });
});

// DROPDOWN
const listSelector = document.getElementById("listSelector");

function updateDropdown() {
    listSelector.innerHTML = "";
    for (let list in lists) {
        let option = document.createElement("option");
        option.textContent = list;
        option.value = list;
        listSelector.appendChild(option);
    }
    listSelector.value = currentList;
}

listSelector.addEventListener("change", function() {
    currentList = listSelector.value;
    saveData();
    showTasks();
});

// TITLE
const currentListTitle = document.getElementById("currentListTitle");

// REMOVE LIST
const removeListButton = document.getElementById("removeList");

removeListButton.addEventListener("click", removeList);

function removeList() {
    if (Object.keys(lists).length === 1) {
        alert("You need at least one list!");
        return;
    }

    confirmModal(`Delete list "${currentList}"?`).then((confirmed) => {
        if (!confirmed) return;

        delete lists[currentList];
        currentList = Object.keys(lists)[0];
        updateDropdown();
        saveData();
        showTasks();
    });
}

// SAVE
function saveData() {
    localStorage.setItem("todoLists", JSON.stringify(lists));
    localStorage.setItem("currentList", currentList);
}

// LOAD
function loadData() {
    let savedLists = localStorage.getItem("todoLists");
    let savedCurrentList = localStorage.getItem("currentList");

    if (savedLists) {
        lists = JSON.parse(savedLists);
    }

    if (savedCurrentList) {
        currentList = savedCurrentList;
    }
}

// MODAL INPUT
function openModal(title, defaultValue = "") {
    return new Promise((resolve) => {
        const overlay = document.getElementById("modalOverlay");
        const input = document.getElementById("modalInput");
        const titleEl = document.getElementById("modalTitle");
        const confirmBtn = document.getElementById("modalConfirm");
        const cancelBtn = document.getElementById("modalCancel");

        titleEl.textContent = title;
        input.value = defaultValue;
        input.style.display = "block";

        overlay.classList.remove("hidden");
        input.focus();

        function cleanup() {
            overlay.classList.add("hidden");
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
        }

        confirmBtn.onclick = () => {
            cleanup();
            resolve(input.value);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(null);
        };
    });
}

// MODAL CONFIRM
function confirmModal(message) {
    return new Promise((resolve) => {
        const overlay = document.getElementById("modalOverlay");
        const input = document.getElementById("modalInput");
        const titleEl = document.getElementById("modalTitle");
        const confirmBtn = document.getElementById("modalConfirm");
        const cancelBtn = document.getElementById("modalCancel");

        titleEl.textContent = message;
        input.style.display = "none";

        overlay.classList.remove("hidden");

        function cleanup() {
            overlay.classList.add("hidden");
            input.style.display = "block";
            confirmBtn.onclick = null;
            cancelBtn.onclick = null;
        }

        confirmBtn.onclick = () => {
            cleanup();
            resolve(true);
        };

        cancelBtn.onclick = () => {
            cleanup();
            resolve(false);
        };
    });
}

// INIT
if (!lists || Object.keys(lists).length === 0) {
    lists = { "Default": [] };
    currentList = "Default";
}

loadData();
updateDropdown();
showTasks();