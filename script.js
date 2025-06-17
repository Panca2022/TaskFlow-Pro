const taskInput = document.getElementById("taskInput");
const descInput = document.getElementById("descInput");
const dueDate = document.getElementById("dueDate");
const category = document.getElementById("category");
const taskList = document.getElementById("taskList");
const progress = document.getElementById("progress");
const searchInput = document.getElementById("searchInput");

// Add a new task
function addTask() {
  const task = taskInput.value.trim();
  const desc = descInput.value.trim();
  const date = dueDate.value;
  const cat = category.value;

  if (!task) return;

  const li = document.createElement("li");
  li.innerHTML = `
    <strong>${task}</strong><br>
    <small>${desc ? desc + " | " : ""}${date ? date + " | " : ""}${cat}</small>
    <br>
    <button onclick="removeTask(this)">❌ Remove</button>
  `;

  taskList.appendChild(li);

  taskInput.value = "";
  descInput.value = "";
  dueDate.value = "";
  category.value = "General";

  updateProgress();
}

// Remove a task
function removeTask(button) {
  const li = button.parentElement;
  li.remove();
  updateProgress();
}

// Update progress bar
function updateProgress() {
  const total = taskList.children.length;
  const percent = total > 0 ? Math.min(100, total * 10) : 0;
  progress.style.width = percent + "%";
}

// Clear all tasks
function clearAll() {
  taskList.innerHTML = "";
  updateProgress();
}

// Theme toggle
function toggleTheme() {
  document.body.classList.toggle("light-mode");
}

// Filter tasks
function filterTasks() {
  const term = searchInput.value.toLowerCase();
  const items = taskList.querySelectorAll("li");

  items.forEach(item => {
    item.style.display = item.textContent.toLowerCase().includes(term) ? "block" : "none";
  });
}

// Export tasks
function exportTasks() {
  const tasks = Array.from(taskList.children).map(li => li.innerText).join("\n\n");
  const blob = new Blob([tasks], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "TaskFlow_Export.txt";
  a.click();
}

// Import tasks
function importTasks(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    const lines = e.target.result.split("\n").filter(l => l.trim() !== "");
    for (let i = 0; i < lines.length; i += 3) {
      const title = lines[i] || "";
      const small = lines[i + 1] || "";
      const li = document.createElement("li");
      li.innerHTML = `
        <strong>${title}</strong><br>
        <small>${small}</small><br>
        <button onclick="removeTask(this)">❌ Remove</button>
      `;
      taskList.appendChild(li);
    }
    updateProgress();
  };
  reader.readAsText(file);
}
